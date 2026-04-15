import React from 'react';
import { useGameStore } from '../store';
import { Coins, TreePine, Gem, Heart } from 'lucide-react';

export default function TopBar() {
  const { silver, wood, yuanbao, stamina, maxStamina } = useGameStore();

  return (
    <div className="flex justify-between items-center bg-slate-800 p-2 px-4 shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-4 text-sm font-bold">
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span>{silver}</span>
        </div>
        <div className="flex items-center gap-1">
          <TreePine className="w-4 h-4 text-green-600" />
          <span>{wood}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>{stamina}/{maxStamina}</span>
        </div>
        <div className="flex items-center gap-1">
          <Gem className="w-4 h-4 text-yellow-300" />
          <span>{yuanbao}</span>
        </div>
      </div>
    </div>
  );
}
