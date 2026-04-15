import React from 'react';
import { useGameStore } from '../store';
import { ITEMS } from '../game/constants';
import { Backpack, Package } from 'lucide-react';

export default function Bag() {
  const { items, gainItem, addStamina } = useGameStore();

  const handleUse = (id: string) => {
    if (id === 'stamina_potion') {
      if (items[id] > 0) {
        gainItem(id, -1);
        addStamina(50);
        alert('恢复 50 点体力');
      }
    } else {
      alert('该物品无法直接使用');
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-slate-900 text-slate-200">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
        <Backpack className="w-6 h-6" /> 我的背包
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(items).map(([key, amount]) => {
          if (amount <= 0) return null;
          const item = ITEMS[key as keyof typeof ITEMS];
          if (!item) return null;
          
          return (
            <div key={key} className="bg-slate-800 rounded-lg p-3 flex flex-col gap-2 border border-slate-700">
              <div className="w-full aspect-square bg-slate-700 rounded flex flex-col items-center justify-center relative">
                <Package className="w-12 h-12 text-amber-500" />
                <span className="absolute bottom-1 right-2 text-sm font-bold text-white bg-black/50 px-1 rounded">x{amount}</span>
              </div>
              <h3 className="font-bold text-slate-200">{item.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.desc}</p>
              
              <button 
                onClick={() => handleUse(key)}
                className="mt-2 bg-slate-700 hover:bg-slate-600 py-1.5 rounded text-sm text-slate-300 font-medium transition-colors"
              >
                使用
              </button>
            </div>
          );
        })}
      </div>
      
      {Object.values(items).every(v => v <= 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Backpack className="w-16 h-16 mb-4 opacity-50" />
          <p>背包空空如也</p>
        </div>
      )}
    </div>
  );
}
