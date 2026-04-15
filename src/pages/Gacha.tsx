import React, { useState } from 'react';
import { useGameStore } from '../store';
import { GENERALS } from '../game/constants';
import { Gem, Dices } from 'lucide-react';
import clsx from 'clsx';

export default function Gacha() {
  const { yuanbao, addYuanbao, gainGeneral } = useGameStore();
  const [result, setResult] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleDraw = (times: number) => {
    const cost = times * 100;
    if (yuanbao < cost) {
      alert('元宝不足');
      return;
    }
    
    addYuanbao(-cost);
    setAnimating(true);
    setResult(null);
    
    setTimeout(() => {
      const keys = Object.keys(GENERALS);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      gainGeneral(randomKey);
      setResult(`获得了将领: ${GENERALS[randomKey].name}`);
      setAnimating(false);
    }, 1000);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #f59e0b 0%, transparent 70%)' }}></div>
      
      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mt-8 mb-4">酒馆招募</h2>
      <p className="text-slate-400 mb-12">招募天下英杰，助你一统天下</p>

      <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-amber-900/50 w-full max-w-md shadow-2xl relative z-10 flex flex-col items-center">
        
        <div className={clsx("w-32 h-32 mb-8 rounded-full flex items-center justify-center border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.6)] bg-slate-700 transition-all duration-1000", animating ? 'animate-spin scale-110 shadow-[0_0_50px_rgba(217,119,6,1)]' : '')}>
          <Dices className="w-16 h-16 text-amber-500" />
        </div>

        {result && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-400 font-bold animate-bounce text-center">
            {result}
          </div>
        )}

        <div className="w-full">
          <button 
            onClick={() => handleDraw(1)}
            disabled={animating}
            className="w-full flex flex-col items-center justify-center gap-1 py-4 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-xl font-bold border border-amber-400/50 shadow-[0_0_15px_rgba(217,119,6,0.5)] transition-colors disabled:opacity-50"
          >
            <span className="text-white">招募 1 次</span>
            <span className="text-yellow-200 flex items-center gap-1 text-sm"><Gem className="w-3 h-3" /> 100</span>
          </button>
        </div>
      </div>
      
      {/* 免费加元宝的作弊按钮，方便测试 */}
      <button 
        onClick={() => addYuanbao(1000)}
        className="mt-12 text-xs text-slate-600 border border-slate-700 px-3 py-1 rounded"
      >
        测试：+1000 元宝
      </button>
    </div>
  );
}
