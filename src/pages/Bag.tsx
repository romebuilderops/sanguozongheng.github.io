import React from 'react';
import { useGameStore } from '../store';
import { ITEMS } from '../game/constants';
import { Backpack, Package, FlaskConical, BookOpen, Gem, Wallet, TreeDeciduous } from 'lucide-react';
import clsx from 'clsx';

export default function Bag() {
  const { items, gainItem, useItem, addSilver, addWood } = useGameStore();

  const handleUse = (id: string) => {
    if (id === 'stamina_potion' || id === 'silver_bag' || id === 'wood_pack') {
      if (items[id] > 0) {
        useItem(id);
      }
    } else {
      alert('该物品无法直接使用');
    }
  };

  const getItemIcon = (id: string) => {
    switch (id) {
      case 'stamina_potion':
        return <FlaskConical className="w-8 h-8 text-green-500" />;
      case 'exp_book':
        return <BookOpen className="w-8 h-8 text-blue-500" />;
      case 'universal_fragment':
        return <Gem className="w-8 h-8 text-purple-500" />;
      case 'silver_bag':
        return <Wallet className="w-8 h-8 text-yellow-500" />;
      case 'wood_pack':
        return <TreeDeciduous className="w-8 h-8 text-amber-700" />;
      default:
        return <Package className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-slate-900 text-slate-200">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
        <Backpack className="w-6 h-6" /> 我的背包
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Object.entries(ITEMS).map(([key, item]) => {
          const amount = items[key] || 0;
          const canUse = amount > 0 && (key === 'stamina_potion' || key === 'silver_bag' || key === 'wood_pack');
          
          return (
            <div 
              key={key} 
              className={clsx(
                "bg-slate-800 rounded-lg p-2 flex flex-col gap-1.5 border transition-all relative overflow-hidden",
                canUse ? "border-slate-700 hover:border-amber-600 hover:shadow-md hover:shadow-amber-900/20" : "border-slate-700 opacity-60"
              )}
            >
              <div className="w-full aspect-square bg-slate-700/50 rounded-md flex flex-col items-center justify-center relative border border-slate-600">
                {getItemIcon(key)}
                <span className="absolute bottom-1 right-1.5 text-xs font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-full">x{amount}</span>
              </div>
              <h3 className="font-bold text-slate-200 text-sm">{item.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.desc}</p>
              
              {canUse ? (
                <button 
                  onClick={() => handleUse(key)}
                  className="mt-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 py-1.5 rounded text-xs text-white font-medium transition-all"
                >
                  使用
                </button>
              ) : (
                <div className="mt-1 bg-slate-700/70 py-1.5 rounded text-xs text-slate-500 font-medium text-center">
                  {amount <= 0 ? '暂无' : '不可用'}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {Object.values(items).every(v => !v || v <= 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Backpack className="w-16 h-16 mb-4 opacity-50" />
          <p>背包空空如也</p>
        </div>
      )}
    </div>
  );
}
