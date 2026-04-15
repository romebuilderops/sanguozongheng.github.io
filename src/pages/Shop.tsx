import React from 'react';
import { useGameStore } from '../store';
import { Gem, Coins, TreePine, Battery } from 'lucide-react';
import clsx from 'clsx';

const SHOP_ITEMS = [
  { id: 'stamina_potion', name: '体力药水', icon: Battery, color: 'text-green-500', bg: 'bg-green-900/50', price: 50, gainAmount: 1, type: 'item' },
  { id: 'silver_bag', name: '银两袋', icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-900/50', price: 100, gainAmount: 2000, type: 'silver' },
  { id: 'wood_pack', name: '木材包', icon: TreePine, color: 'text-green-600', bg: 'bg-green-900/50', price: 100, gainAmount: 1000, type: 'wood' },
  { id: 'exp_book', name: '经验书', icon: Gem, color: 'text-purple-400', bg: 'bg-purple-900/50', price: 200, gainAmount: 5, type: 'item' },
];

export default function Shop() {
  const { yuanbao, addYuanbao, gainItem, addSilver, addWood } = useGameStore();

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (yuanbao < item.price) {
      alert('元宝不足');
      return;
    }
    
    addYuanbao(-item.price);
    
    if (item.type === 'item') gainItem(item.id, item.gainAmount);
    else if (item.type === 'silver') addSilver(item.gainAmount);
    else if (item.type === 'wood') addWood(item.gainAmount);
    
    alert(`购买成功：${item.name} x${item.gainAmount}`);
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-slate-900 text-slate-200">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 border-b border-slate-700 pb-2">商城</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {SHOP_ITEMS.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-xl p-4 border-2 border-slate-700 hover:border-amber-700/50 transition-colors flex flex-col items-center justify-center relative">
            <div className={clsx("w-16 h-16 rounded-full flex items-center justify-center mb-3", item.bg)}>
              <item.icon className={clsx("w-8 h-8", item.color)} />
            </div>
            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
            <p className="text-xs text-slate-400 mb-4">获得 {item.gainAmount} 个</p>
            
            <button 
              onClick={() => handleBuy(item)}
              className="flex items-center gap-1 px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg font-bold w-full justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <Gem className="w-4 h-4 text-yellow-200" />
              <span>{item.price}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
