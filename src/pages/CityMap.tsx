import React, { useState, useRef } from 'react';
import { useGameStore } from '../store';
import { LEADERS, GAME_CONSTANTS } from '../game/constants';
import { Building as BuildingType } from '../types';
import clsx from 'clsx';
import { X, ArrowUpCircle, Coins, TreePine, Users, Sword, Shield, Star, Crown } from 'lucide-react';

const BUILDING_POSITIONS = {
  hall: { top: '20%', left: '45%' },
  barracks: { top: '50%', left: '20%' },
  training: { top: '55%', left: '65%' },
  market: { top: '80%', left: '30%' },
  workshop: { top: '75%', left: '75%' },
  tavern: { top: '35%', left: '80%' },
};

const BUILDING_EFFECTS = {
  hall: {
    description: '主殿是城池的核心，提升等级解锁更多建筑和功能',
    effects: ['解锁新建筑', '提高最大体力上限', '增加主公经验获取']
  },
  barracks: {
    description: '兵营用于招募和管理将领，提升等级增加将领上限',
    effects: ['增加可招募将领数量', '提高将领招募品质', '缩短招募冷却时间']
  },
  training: {
    description: '校场用于训练将领，提升等级增加将领经验获取速度',
    effects: ['提高将领经验获取', '解锁将领升星功能', '增加技能熟练度获取']
  },
  market: {
    description: '市场用于交易资源，提升等级增加银两产出',
    effects: ['增加银两产出', '解锁特殊商品', '提高交易效率']
  },
  workshop: {
    description: '工坊用于生产木材，提升等级增加木材产出',
    effects: ['增加木材产出', '解锁特殊道具制作', '提高生产效率']
  },
  tavern: {
    description: '酒馆用于宴请和招募将领，提升等级增加高级将领出现概率',
    effects: ['增加高级将领出现概率', '解锁特殊宴请活动', '提高将领好感度获取']
  }
};

export default function CityMap() {
  const { buildings, silver, wood, upgradeBuilding, leaderId, leaderLevel, leaderExp, upgradeLeader, addLeaderExp } = useGameStore();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Simple zoom implementation
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const selectedData = selectedBuilding ? buildings[selectedBuilding] : null;
  const costSilver = selectedData ? Math.floor(selectedData.level * 500 * Math.pow(1.2, selectedData.level - 1)) : 0;
  const costWood = selectedData ? Math.floor(selectedData.level * 300 * Math.pow(1.2, selectedData.level - 1)) : 0;
  const canUpgrade = selectedData && silver >= costSilver && wood >= costWood;

  const leader = LEADERS[leaderId];
  const requiredWood = leaderLevel * 100;
  const canUpgradeLeader = wood >= requiredWood;

  const getBuildingIcon = (buildingId: string) => {
    switch (buildingId) {
      case 'hall': return <Star className="w-5 h-5 text-amber-500" />;
      case 'barracks': return <Users className="w-5 h-5 text-blue-500" />;
      case 'training': return <Sword className="w-5 h-5 text-red-500" />;
      case 'market': return <Coins className="w-5 h-5 text-yellow-500" />;
      case 'workshop': return <TreePine className="w-5 h-5 text-green-500" />;
      case 'tavern': return <Shield className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      {/* 缩放控制 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-slate-800/80 p-2 rounded-lg border border-slate-600">
        <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-xl font-bold">+</button>
        <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-xl font-bold">-</button>
      </div>

      {/* 模拟拖拽区域 */}
      <div className="w-full h-full overflow-auto relative">
        <div 
          ref={mapRef}
          className="relative min-w-[800px] min-h-[800px] w-[150%] h-[150%] origin-top-left transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
          
          {Object.entries(buildings).map(([key, b]) => {
            const pos = BUILDING_POSITIONS[key as keyof typeof BUILDING_POSITIONS];
            if (!pos) return null;
            
            return (
              <div 
                key={key}
                onClick={() => setSelectedBuilding(key)}
                className={clsx(
                  "absolute w-24 h-24 -ml-12 -mt-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-transform hover:scale-110 shadow-lg",
                  "border-2",
                  selectedBuilding === key ? "border-amber-400 bg-amber-900/80" : "border-slate-500 bg-slate-800/80"
                )}
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="mb-2">
                  {getBuildingIcon(key)}
                </div>
                <div className="text-amber-500 font-bold text-lg mb-1">{b.name}</div>
                <div className="bg-black/50 px-2 py-0.5 rounded text-xs">Lv.{b.level}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 建筑详情面板 */}
      {selectedBuilding && selectedData && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-800/95 border-2 border-amber-900/80 rounded-xl p-4 shadow-2xl backdrop-blur-sm z-20">
          <button 
            onClick={() => setSelectedBuilding(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
              {getBuildingIcon(selectedBuilding)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-500">{selectedData.name} <span className="text-sm text-slate-300 ml-2">Lv.{selectedData.level}</span></h3>
              <p className="text-xs text-slate-400">{BUILDING_EFFECTS[selectedBuilding as keyof typeof BUILDING_EFFECTS].description}</p>
            </div>
          </div>

          {/* 建筑效果 */}
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-300 mb-2">建筑效果：</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {BUILDING_EFFECTS[selectedBuilding as keyof typeof BUILDING_EFFECTS].effects.map((effect, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-slate-700 pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">升级消耗：</span>
              <div className="flex gap-4">
                <span className={clsx("text-sm font-bold flex items-center gap-1", silver < costSilver ? 'text-red-400' : 'text-slate-200')}>
                  <Coins className="w-3.5 h-3.5 text-yellow-400" /> {costSilver}
                </span>
                <span className={clsx("text-sm font-bold flex items-center gap-1", wood < costWood ? 'text-red-400' : 'text-slate-200')}>
                  <TreePine className="w-3.5 h-3.5 text-green-600" /> {costWood}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => upgradeBuilding(selectedBuilding, costSilver, costWood)}
              disabled={!canUpgrade}
              className={clsx(
                "flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-colors",
                canUpgrade 
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_10px_rgba(217,119,6,0.4)]" 
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              )}
            >
              <ArrowUpCircle className="w-5 h-5" />
              升级
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
