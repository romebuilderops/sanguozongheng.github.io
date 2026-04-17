import React, { useState } from 'react';
import { useGameStore } from '../store';
import { GENERALS, LEADERS, INITIAL_LEADERS } from '../game/constants';
import { getPortraitDataUri } from '../game/art';
import clsx from 'clsx';
import { Shield, Sword, Heart, Star, Users, ArrowUpCircle, PlusCircle, RefreshCw } from 'lucide-react';

export default function Generals() {
  console.log('Generals component loaded');
  const { generals = {}, leaderId = 'liubei', leaderLevel = 1, currentGenerals = [null, null], equipGeneral, upgradeGeneral, starUpGeneral, silver = 0, wood = 0, upgradeLeader, selectLeader } = useGameStore();
  console.log('Store data:', { leaderId, leaderLevel, currentGenerals, silver, wood, generalsCount: Object.keys(generals).length });
  console.log('Current generals:', currentGenerals);
  const leader = LEADERS[leaderId] || LEADERS.liubei;
  console.log('Leader:', leader);
  const [selectedGeneral, setSelectedGeneral] = useState<string | null>(null);
  const [showLeaderSelect, setShowLeaderSelect] = useState(false);

  const getUpgradeCost = (level: number) => {
    return {
      silver: Math.floor(level * 100 * Math.pow(1.1, level - 1)),
      wood: Math.floor(level * 50 * Math.pow(1.1, level - 1))
    };
  };

  const getStarUpCost = (star: number) => {
    return {
      fragments: 50 * star,
      silver: 1000 * star
    };
  };

  const leaderUpgradeCost = leaderLevel * 100;
  const canUpgradeLeader = wood >= leaderUpgradeCost;

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-slate-900 text-slate-200">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
        <Shield className="w-6 h-6" /> 我的阵营
      </h2>

      {/* 主公区块 */}
      <div className="bg-slate-800/80 rounded-xl p-4 border-2 border-amber-900/50 mb-8 shadow-lg">
        <div className="flex gap-4">
          <img
            src={`/images/leaders/${leader.id}.png`}
            alt={leader.name}
            className="w-20 h-20 rounded-lg object-cover border border-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPortraitDataUri(leader.id, leader.name, leader.camp);
            }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                  {leader.name}
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">Lv.{leaderLevel}</span>
                  <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-800/50">{leader.camp}</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">{leader.passiveName}: {leader.passiveDesc}</p>
              </div>
              <button
                onClick={() => setShowLeaderSelect(true)}
                className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-sm text-slate-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                切换主公
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-700">
                <Sword className="w-4 h-4 text-red-400" />
                <span className="text-sm">攻击: {Math.floor(leader.baseAttack * (1 + (leaderLevel - 1) * 0.1))}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-700">
                <Heart className="w-4 h-4 text-green-400" />
                <span className="text-sm">生命: {Math.floor(leader.baseHp * (1 + (leaderLevel - 1) * 0.1))}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>升级消耗</span>
                <span>{leaderUpgradeCost} 木材</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (wood / leaderUpgradeCost) * 100)}%` }}
                />
              </div>
              <button
                onClick={() => upgradeLeader()}
                disabled={!canUpgradeLeader}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all",
                  canUpgradeLeader ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-[0_0_10px_rgba(217,119,6,0.4)]" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
              >
                <ArrowUpCircle className="w-4 h-4" />
                升级主公
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
        <Users className="w-6 h-6" /> 上阵将领
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[0, 1].map((idx) => {
          const gId = currentGenerals[idx];
          const gData = gId ? generals[gId] : null;
          const staticG = gId && gData ? GENERALS[gData.generalId] : null;
          
          return (
            <div key={idx} className="bg-slate-800/80 rounded-xl p-4 border border-slate-600 flex flex-col items-center justify-center min-h-32">
              {gData && staticG ? (
                <>
                  <img
                    src={`/images/leaders/${staticG.id}.png`}
                    alt={staticG.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-600 mb-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getPortraitDataUri(staticG.id, staticG.name, staticG.camp);
                    }}
                  />
                  <div className="text-lg font-bold text-amber-500">{staticG.name}</div>
                  <div className="text-xs text-slate-400 mb-2">Lv.{gData.level} ★{gData.star}</div>
                  <button 
                    onClick={() => equipGeneral(idx as 0|1, null)}
                    className="text-xs bg-red-900/50 text-red-400 px-3 py-1 rounded border border-red-800/50 hover:bg-red-800/50"
                  >
                    下阵
                  </button>
                </>
              ) : (
                <div className="text-slate-500 text-sm font-medium">点击下方将领上阵</div>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
        <Users className="w-6 h-6" /> 我的将领
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(generals).map((g) => {
          const staticG = GENERALS[g.generalId];
          if (!staticG) return null;
          
          const isEquipped = currentGenerals.includes(g.id);
          const upgradeCost = getUpgradeCost(g.level);
          const starUpCost = getStarUpCost(g.star);
          const canUpgrade = silver >= upgradeCost.silver && wood >= upgradeCost.wood;
          const canStarUp = g.fragments >= starUpCost.fragments && silver >= starUpCost.silver && g.star < 5;
          
          return (
            <div key={g.id} className="bg-slate-800 rounded-lg p-3 flex gap-3 border border-slate-700 hover:border-amber-700/50 transition-colors">
              <div className="w-16 h-16 rounded overflow-hidden border border-slate-600 relative">
                <img
                  src={`/images/leaders/${staticG.id}.png`}
                  alt={staticG.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPortraitDataUri(staticG.id, staticG.name, staticG.camp);
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex justify-center -mb-1">
                  {Array.from({ length: g.star }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-200">{staticG.name} <span className="text-xs text-slate-400 font-normal">Lv.{g.level}</span></span>
                  <span className="text-xs text-amber-500 bg-amber-900/30 px-1.5 py-0.5 rounded">{staticG.rarity}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{staticG.skillDesc}</p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">碎片: {g.fragments}/{starUpCost.fragments}</span>
                    {!isEquipped && (
                      <button 
                        onClick={() => {
                          console.log('Attempting to equip general:', g.id);
                          console.log('Current generals before:', currentGenerals);
                          console.log('Position 0:', currentGenerals[0]);
                          console.log('Position 1:', currentGenerals[1]);
                          if (!currentGenerals[0]) {
                            console.log('Equipping to position 0');
                            equipGeneral(0, g.id);
                          } else if (!currentGenerals[1]) {
                            console.log('Equipping to position 1');
                            equipGeneral(1, g.id);
                          } else {
                            console.log('Both positions are full');
                            alert('上阵位置已满');
                          }
                        }}
                        className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-slate-300"
                      >
                        上阵
                      </button>
                    )}
                    {isEquipped && <span className="text-xs text-green-500 font-bold px-2 py-1">已上阵</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => upgradeGeneral(g.id)}
                      disabled={!canUpgrade}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-1 text-xs py-1 rounded transition-colors",
                        canUpgrade ? "bg-amber-600 hover:bg-amber-500 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                      )}
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      升级
                    </button>
                    <button
                      onClick={() => starUpGeneral(g.id)}
                      disabled={!canStarUp}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-1 text-xs py-1 rounded transition-colors",
                        canStarUp ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                      )}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      升星
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {Object.values(generals).length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-500 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
            暂无将领，去抽卡试试手气吧！
          </div>
        )}
      </div>

      {/* 主公选择弹窗 */}
      {showLeaderSelect && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-amber-500">选择主公</h3>
              <button
                onClick={() => setShowLeaderSelect(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(INITIAL_LEADERS).map(([id, leaderData]) => (
                <div
                  key={id}
                  onClick={() => {
                    selectLeader(id);
                    setShowLeaderSelect(false);
                  }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${id === leaderId ? 'border-amber-500 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
                >
                  <div className="flex gap-3 p-3">
                    <img
                      src={`/images/leaders/${id}.png`}
                      alt={leaderData.name}
                      className="w-16 h-16 rounded object-cover border border-slate-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getPortraitDataUri(id, leaderData.name, leaderData.camp);
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-white">{leaderData.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${leaderData.camp === '魏' ? 'bg-blue-900/50 text-blue-400' : leaderData.camp === '蜀' ? 'bg-green-900/50 text-green-400' : leaderData.camp === '吴' ? 'bg-red-900/50 text-red-400' : 'bg-purple-900/50 text-purple-400'}`}>
                          {leaderData.camp}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        <div className="flex justify-between">
                          <span>攻击: {leaderData.baseAttack}</span>
                          <span>生命: {leaderData.baseHp}</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-300">
                        <div className="font-medium text-amber-400 mb-1">{leaderData.passiveName}</div>
                        <p>{leaderData.passiveDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
