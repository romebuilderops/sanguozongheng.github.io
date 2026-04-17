import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useNavigate, useLocation } from 'react-router-dom';
import { Boot } from '../game/scenes/Boot';
import { MainGame } from '../game/scenes/MainGame';
import { EventBus } from '../game/EventBus';
import { useGameStore } from '../store';
import { useCombatStore } from '../store/combatStore';
import { GENERALS, LEADERS } from '../game/constants';
import { Shield, Heart, Zap, PlayCircle, Settings, Swords, Star } from 'lucide-react';
import clsx from 'clsx';

export default function Combat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { levelId } = location.state || { levelId: '1-1' };
  const initialized = useRef(false);
  
  const { leaderId, leaderLevel, currentGenerals, generals, completeLevel } = useGameStore();
  const combatState = useCombatStore();
  
  const leader = LEADERS[leaderId];
  const g1 = currentGenerals[0] && generals[currentGenerals[0]] ? GENERALS[generals[currentGenerals[0]].generalId] : null;
  const g2 = currentGenerals[1] && generals[currentGenerals[1]] ? GENERALS[generals[currentGenerals[1]].generalId] : null;

  // 初始化战斗数据
  useEffect(() => {
    const levelInfo = useGameStore.getState().levels[levelId];
    const isBoss = levelInfo?.type === 'BOSS';
    
    const { leaderId, leaderLevel, currentGenerals, generals } = useGameStore.getState();
    const leaderData = LEADERS[leaderId];
    const gen1Data = currentGenerals[0] && generals[currentGenerals[0]] ? GENERALS[generals[currentGenerals[0]].generalId] : null;
    const gen2Data = currentGenerals[1] && generals[currentGenerals[1]] ? GENERALS[generals[currentGenerals[1]].generalId] : null;

    // 从levelId中提取关卡索引
    const levelParts = levelId.split('_');
    const levelIndex = parseInt(levelParts[2]) || 1;

    // 难度递增逻辑
    let baseHp = 1500;
    let baseDmg = 60;
    let hpIncrement = 300;
    let dmgIncrement = 15;
    
    // 计算敌人属性
    let enemyHp = baseHp + (levelIndex - 1) * hpIncrement;
    let enemyDmg = baseDmg + (levelIndex - 1) * dmgIncrement;
    let enemyName = `黄巾步兵 ${levelIndex}`;
    
    // 精英关调整
    if (levelIndex === 5) {
      enemyHp = enemyHp * 1.5;
      enemyDmg = enemyDmg * 1.3;
      enemyName = '魔张宝（精英）';
    }
    
    // BOSS关调整（第10关或levelInfo.type为BOSS）
    if (isBoss || levelIndex === 10) {
      enemyHp = enemyHp * 2;
      enemyDmg = enemyDmg * 1.5;
      enemyName = '魔张角（BOSS）';
    }
    
    useCombatStore.getState().initCombat({
      playerMaxHp: Math.floor(leaderData.baseHp * (1 + (leaderLevel - 1) * 0.1)),
      playerHp: Math.floor(leaderData.baseHp * (1 + (leaderLevel - 1) * 0.1)),
      enemyName: enemyName,
      enemyMaxHp: enemyHp,
      enemyHp: enemyHp,
      enemyNextDmg: enemyDmg,
      general1: gen1Data ? gen1Data.id : null,
      general1MaxEnergy: gen1Data ? gen1Data.skillCost : 0,
      general2: gen2Data ? gen2Data.id : null,
      general2MaxEnergy: gen2Data ? gen2Data.skillCost : 0,
    });
  }, [levelId]);

  // Phaser 实例
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: 600,
      height: 800,
      transparent: true,
      scene: [Boot, MainGame],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    });

    return () => {
      game.destroy(true);
      initialized.current = false;
    };
  }, []);

  // 监听 Phaser 事件
  useEffect(() => {
    const onGemsMatched = ({ typeCount, combo }: { typeCount: Record<number, number>, combo: number }) => {
      const state = useCombatStore.getState();
      if (state.isGameOver) return;
      
      const { leaderLevel, leaderId, currentGenerals, generals } = useGameStore.getState();
      const leaderData = LEADERS[leaderId];
      const gen1Data = currentGenerals[0] && generals[currentGenerals[0]] ? GENERALS[generals[currentGenerals[0]].generalId] : null;
      const gen2Data = currentGenerals[1] && generals[currentGenerals[1]] ? GENERALS[generals[currentGenerals[1]].generalId] : null;

      const baseAtk = leaderData.baseAttack * (1 + (leaderLevel - 1) * 0.1) + 
        (gen1Data ? gen1Data.baseAttack : 0) * 0.3 + 
        (gen2Data ? gen2Data.baseAttack : 0) * 0.3;

      let totalDmg = 0;
      let totalHeal = 0;
      let totalEnergy = 0;
      
      // 0=red, 1=green, 2=yellow, 3=blue, 4=purple, 5=orange
      for (const [t, count] of Object.entries(typeCount)) {
        const c = Number(count);
        const ratio = c === 3 ? 1.0 : (c === 4 ? 1.5 : (c === 5 ? 2.0 : 2.5));
        const dmg = baseAtk * ratio * (1 + (combo - 1) * 0.05);

        if (t === '0') totalDmg += dmg;
        if (t === '1') totalHeal += dmg * 0.5;
        if (t === '2') totalEnergy += c * 2;
        if (t === '3') state.addShield();
        if (t === '4') totalDmg += dmg * 1.2; // 简化谋略增伤
        // 5=orange 掉落资源，暂时不处理
        
        state.addGeneralEnergy(c, c); // 每个消除 +1 到将领
      }

      if (totalDmg > 0) state.setEnemyHp(state.enemyHp - totalDmg);
      if (totalHeal > 0) state.setPlayerHp(state.playerHp + totalHeal);
      if (totalEnergy > 0) state.addEnergy(totalEnergy, state.playerMaxEnergy);
    };

    const onHealPlayer = ({ percentage }: { percentage: number }) => {
      const state = useCombatStore.getState();
      if (state.isGameOver) return;
      
      const healAmount = state.playerMaxHp * (percentage / 100);
      state.setPlayerHp(state.playerHp + healAmount);
    };

    const onEnemyAttack = ({ damage, energyLoss, energyReduction }: { damage: number, energyLoss?: number, energyReduction?: number }) => {
      const state = useCombatStore.getState();
      if (state.isGameOver) return;
      
      // 处理伤害
      let dmg = damage;
      if (state.playerShields > 0) {
        dmg = dmg * 0.9; // 1层护盾减伤 10%
        useCombatStore.setState({ playerShields: state.playerShields - 1 });
      }
      state.setPlayerHp(state.playerHp - dmg);
      
      // 处理能量损失
      if (energyLoss) {
        useCombatStore.setState({ playerEnergy: Math.max(0, state.playerEnergy - energyLoss) });
      }
      
      // 处理能量减少效果
      if (energyReduction) {
        // 这里可以添加能量减少的逻辑
      }
    };

    const onEnemyHeal = ({ percentage }: { percentage: number }) => {
      const state = useCombatStore.getState();
      if (state.isGameOver) return;
      
      const healAmount = state.enemyMaxHp * (percentage / 100);
      state.setEnemyHp(state.enemyHp + healAmount);
    };

    const onAddBuff = ({ buff, stacks }: { buff: string, stacks: number }) => {
      // 处理敌人获得的 buff
      console.log(`Enemy gained ${stacks} stacks of ${buff}`);
    };

    const onEnemyTurn = () => {
      const state = useCombatStore.getState();
      if (state.isGameOver) return;
      
      // 增加回合计数
      state.incrementTurn();
      
      // 敌人技能触发逻辑
      if (state.enemyName === '魔张宝（精英）') {
        const hpPercentage = state.enemyHp / state.enemyMaxHp;
        
        // 普通攻击逻辑
        if (hpPercentage > 0.6 || state.turnCount % 2 === 0) {
          // 普通攻击
          let dmg = state.enemyNextDmg;
          if (state.playerShields > 0) {
            dmg = dmg * 0.9; // 1层护盾减伤 10%
            useCombatStore.setState({ playerShields: state.playerShields - 1 });
          }
          state.setPlayerHp(state.playerHp - dmg);
        }
        
        // 妖术技能触发
        if ((hpPercentage > 0.6 && state.turnCount % 4 === 0) ||
            (hpPercentage <= 0.6 && hpPercentage > 0.4 && state.turnCount % 3 === 0) ||
            (hpPercentage <= 0.4 && state.turnCount % 2 === 0)) {
          EventBus.emit('cast-skill', '魔·妖术');
        }
        
        // 地公将军技能触发
        if (hpPercentage <= 0.4 && Math.random() < 0.5) {
          EventBus.emit('cast-skill', '魔·地公将军');
        }
      } else if (state.enemyName === '魔张角（BOSS）') {
        const hpPercentage = state.enemyHp / state.enemyMaxHp;
        
        // 普通攻击逻辑
        if (hpPercentage > 0.7 || state.turnCount % 2 === 0) {
          // 普通攻击
          let dmg = state.enemyNextDmg;
          if (state.playerShields > 0) {
            dmg = dmg * 0.9; // 1层护盾减伤 10%
            useCombatStore.setState({ playerShields: state.playerShields - 1 });
          }
          state.setPlayerHp(state.playerHp - dmg);
        }
        
        // 妖术技能触发
        if ((hpPercentage > 0.5 && state.turnCount % 3 === 0) ||
            (hpPercentage <= 0.5 && state.turnCount % 2 === 0)) {
          EventBus.emit('cast-skill', '魔·妖术');
        }
        
        // 天公将军技能触发
        if (hpPercentage <= 0.5 && state.turnCount % 2 === 0) {
          EventBus.emit('cast-skill', '魔·天公将军');
        }
        
        // 黄天当立技能触发
        if (hpPercentage <= 0.2) {
          EventBus.emit('cast-skill', '魔·黄天当立');
        }
      } else {
        // 普通敌人的普通攻击
        let dmg = state.enemyNextDmg;
        if (state.playerShields > 0) {
          dmg = dmg * 0.9; // 1层护盾减伤 10%
          useCombatStore.setState({ playerShields: state.playerShields - 1 });
        }
        state.setPlayerHp(state.playerHp - dmg);
      }
    };

    EventBus.on('gems-matched', onGemsMatched);
    EventBus.on('enemy-turn', onEnemyTurn);
    EventBus.on('heal-player', onHealPlayer);
    EventBus.on('enemy-attack', onEnemyAttack);
    EventBus.on('enemy-heal', onEnemyHeal);
    EventBus.on('add-buff', onAddBuff);
    
    return () => {
      EventBus.off('gems-matched', onGemsMatched);
      EventBus.off('enemy-turn', onEnemyTurn);
      EventBus.off('heal-player', onHealPlayer);
      EventBus.off('enemy-attack', onEnemyAttack);
      EventBus.off('enemy-heal', onEnemyHeal);
      EventBus.off('add-buff', onAddBuff);
    };
  }, []);

  const handleCastSkill = (idx: 1 | 2) => {
    if (combatState.isGameOver) return;
    
    const genId = idx === 1 ? combatState.general1 : combatState.general2;
    if (!genId) return;
    const gData = GENERALS[genId];
    if (!gData) return;
    
    const currentE = idx === 1 ? combatState.general1Energy : combatState.general2Energy;
    if (currentE < gData.skillCost) return;
    
    combatState.consumeGeneralEnergy(idx, gData.skillCost);
    EventBus.emit('cast-skill', gData.skillName);
  };

  const handleSurrender = () => {
    if (window.confirm('确定要撤退吗？')) {
      navigate('/campaign');
    }
  };

  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden text-slate-200">
      {/* 游戏背景 (被 Phaser Canvas 盖住，或者 Phaser 透明显示该背景) */}
      <div className="absolute inset-0 bg-slate-800 opacity-30 pointer-events-none"></div>

      {/* Phaser Canvas 容器 */}
      <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-auto">
        <div id="phaser-container" className="w-full h-full max-w-[600px] max-h-[800px]" />
      </div>

      {/* 顶部 HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-2 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex justify-between items-start max-w-2xl mx-auto">
          {/* 玩家状态 */}
          <div className="flex gap-2">
            <img
              src={`/images/leaders/${leader.id}.png`}
              alt={leader.name}
              className="w-12 h-12 rounded border-2 border-amber-600 object-cover shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Three%20Kingdoms%20general%20${leader.name}%20portrait%20ink%20style&image_size=square`;
              }}
            />
            <div className="flex flex-col gap-1 w-32">
              <div className="text-sm font-bold text-amber-500 drop-shadow-md">{leader.name} <span className="text-xs text-slate-300 ml-1">Lv.{leaderLevel}</span></div>
              
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300" style={{ width: `${Math.max(0, (combatState.playerHp / combatState.playerMaxHp) * 100)}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white shadow-black">{Math.floor(combatState.playerHp)}/{combatState.playerMaxHp}</span>
              </div>
              
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-300" style={{ width: `${(combatState.playerEnergy / combatState.playerMaxEnergy) * 100}%` }} />
              </div>
            </div>
          </div>
          
          <button onClick={handleSurrender} className="p-2 bg-slate-800/80 rounded-full border border-slate-600 text-slate-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 敌方状态 (固定在顶部下方一点) */}
      <div className="absolute top-20 right-4 z-20">
        <div className="bg-slate-900/80 border border-red-900/50 rounded-lg p-2 flex flex-col items-end shadow-xl">
          <div className="text-sm font-bold text-red-500 mb-1">{combatState.enemyName}</div>
          <div className="h-3 w-32 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative mb-1">
            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${Math.max(0, (combatState.enemyHp / combatState.enemyMaxHp) * 100)}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white shadow-black">{Math.floor(combatState.enemyHp)}/{combatState.enemyMaxHp}</span>
          </div>
          <div className="text-xs text-amber-400 flex items-center gap-1">
            <Swords className="w-3 h-3" /> 下回合伤害: {combatState.enemyNextDmg}
          </div>
        </div>
      </div>

      {/* 将领技能栏 (底部) */}
      <div className="absolute bottom-4 left-0 right-0 z-20 px-4 pointer-events-none">
        <div className="flex justify-center gap-6 max-w-2xl mx-auto">
          {[1, 2].map(idx => {
            const genId = idx === 1 ? combatState.general1 : combatState.general2;
            if (!genId) return <div key={idx} className="w-20 h-20 opacity-0" />;
            const g = GENERALS[genId];
            const e = idx === 1 ? combatState.general1Energy : combatState.general2Energy;
            const maxE = idx === 1 ? combatState.general1MaxEnergy : combatState.general2MaxEnergy;
            const canCast = e >= maxE;
            
            return (
              <div key={idx} className="flex flex-col items-center pointer-events-auto">
                <button 
                  onClick={() => handleCastSkill(idx as 1|2)}
                  disabled={!canCast}
                  className={clsx(
                    "relative w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold shadow-xl transition-all",
                    canCast 
                      ? "border-amber-400 bg-amber-700 text-white hover:scale-110 shadow-[0_0_15px_rgba(217,119,6,0.8)] animate-pulse" 
                      : "border-slate-600 bg-slate-800 text-slate-500"
                  )}
                >
                  <img
                    src={`/images/leaders/${g.id}.png`}
                    alt={g.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Three%20Kingdoms%20general%20${g.name}%20portrait%20ink%20style&image_size=square`;
                    }}
                  />
                  
                  {!canCast && (
                    <div 
                      className="absolute inset-0 bg-black/50 rounded-full" 
                      style={{ clipPath: `inset(${100 - (e / maxE) * 100}% 0 0 0)` }}
                    />
                  )}
                  {canCast && <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 drop-shadow" />}
                </button>
                <div className="mt-2 px-2 bg-black/60 rounded text-xs font-bold whitespace-nowrap text-amber-300 border border-slate-700">
                  {g.skillName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 结算页面 */}
      {combatState.isGameOver && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-slate-800 border-2 border-amber-900/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <h2 className={clsx("text-4xl font-black mb-6 drop-shadow-lg", combatState.result === 'win' ? "text-amber-400" : "text-slate-400")}>
              {combatState.result === 'win' ? '战役胜利' : '战役失败'}
            </h2>
            
            {combatState.result === 'win' && (
              <div className="flex justify-center gap-2 mb-8">
                <Star className="w-10 h-10 text-yellow-400 fill-current drop-shadow" />
                <Star className={clsx("w-10 h-10 text-yellow-400 drop-shadow", combatState.playerHp > combatState.playerMaxHp * 0.3 ? "fill-current" : "opacity-50")} />
                <Star className={clsx("w-10 h-10 text-yellow-400 drop-shadow", combatState.playerHp > combatState.playerMaxHp * 0.8 ? "fill-current" : "opacity-50")} />
              </div>
            )}
            
            {combatState.result === 'win' ? (
              <div className="bg-slate-900/50 p-4 rounded-lg mb-8 border border-slate-700">
                <h3 className="text-slate-400 text-sm mb-2">获得战利品</h3>
                <div className="flex justify-center gap-4 text-sm font-bold text-amber-500">
                  <span>银两 +500</span>
                  <span>木材 +100</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 mb-8">
                你的主公生命值归零，请提升等级和将领后再来挑战！
              </div>
            )}
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (combatState.result === 'win') {
                    useGameStore.getState().addSilver(500);
                    useGameStore.getState().addWood(100);
                    let stars = 1;
                    if (combatState.playerHp > combatState.playerMaxHp * 0.3) stars = 2;
                    if (combatState.playerHp > combatState.playerMaxHp * 0.8) stars = 3;
                    completeLevel(levelId, stars);
                  }
                  navigate('/campaign');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-lg font-bold shadow-[0_0_15px_rgba(217,119,6,0.4)] transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
