import React, { useState } from 'react';
import { useGameStore } from '../store';
import { CheckCircle2, Gift } from 'lucide-react';
import clsx from 'clsx';

const TASKS = [
  { id: 1, name: '登录游戏', reward: '50 元宝', current: 1, target: 1, type: 'yuanbao', amount: 50 },
  { id: 2, name: '通关战役关卡 3 次', reward: '1000 银两', current: 0, target: 3, type: 'silver', amount: 1000 },
  { id: 3, name: '升级主殿 1 次', reward: '200 元宝', current: 0, target: 1, type: 'yuanbao', amount: 200 },
  { id: 4, name: '进行 1 次抽卡', reward: '10 将领经验书', current: 0, target: 1, type: 'item', itemId: 'exp_book', amount: 10 },
];

export default function Tasks() {
  const { addYuanbao, addSilver, gainItem } = useGameStore();
  const [completed, setCompleted] = useState<number[]>([1]); // Dummy state for demo
  const [claimed, setClaimed] = useState<number[]>([]);

  const handleClaim = (task: typeof TASKS[0]) => {
    if (claimed.includes(task.id)) return;
    
    if (task.type === 'yuanbao') addYuanbao(task.amount);
    else if (task.type === 'silver') addSilver(task.amount);
    else if (task.type === 'item') gainItem(task.itemId!, task.amount);
    
    setClaimed(prev => [...prev, task.id]);
    alert(`获得奖励：${task.reward}`);
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-slate-900 text-slate-200">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6" /> 每日任务
      </h2>
      
      <div className="flex flex-col gap-4">
        {TASKS.map((task) => {
          const isCompleted = completed.includes(task.id) || task.current >= task.target;
          const isClaimed = claimed.includes(task.id);
          
          return (
            <div key={task.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-center relative overflow-hidden">
              <div className="flex-1 z-10">
                <h3 className="font-bold text-lg text-slate-200 mb-1">{task.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-amber-400 flex items-center gap-1">
                    <Gift className="w-4 h-4" /> 奖励：{task.reward}
                  </span>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400">
                    进度：{task.current}/{task.target}
                  </span>
                </div>
              </div>
              
              <div className="z-10 ml-4">
                <button
                  onClick={() => handleClaim(task)}
                  disabled={!isCompleted || isClaimed}
                  className={clsx(
                    "px-4 py-2 rounded font-bold transition-all text-sm w-24",
                    isClaimed ? "bg-slate-700 text-slate-500" :
                    isCompleted ? "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_10px_rgba(217,119,6,0.4)]" :
                    "bg-slate-700 text-slate-400"
                  )}
                >
                  {isClaimed ? '已领取' : isCompleted ? '领取' : '未完成'}
                </button>
              </div>
              
              {isClaimed && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
