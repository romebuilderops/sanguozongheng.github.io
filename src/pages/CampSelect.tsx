import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store';
import { INITIAL_LEADERS } from '../game/constants';

export default function CampSelect() {
  const navigate = useNavigate();
  const { selectLeader } = useGameStore();
  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);

  const handleSelectLeader = (leaderId: string) => {
    setSelectedLeader(leaderId);
  };

  const handleConfirm = () => {
    if (selectedLeader) {
      selectLeader(selectedLeader);
      navigate('/city');
    }
  };

  const getCampColor = (camp: string) => {
    switch (camp) {
      case '魏': return 'bg-blue-900 border-blue-400';
      case '蜀': return 'bg-green-900 border-green-400';
      case '吴': return 'bg-red-900 border-red-400';
      case '群雄': return 'bg-purple-900 border-purple-400';
      default: return 'bg-slate-800 border-slate-400';
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/board/board_background.png')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest mb-12 text-center leading-tight">
          选择主公
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {Object.entries(INITIAL_LEADERS).map(([id, leader]) => (
            <div
              key={id}
              onClick={() => handleSelectLeader(id)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${selectedLeader === id ? getCampColor(leader.camp) : 'bg-slate-800/80 border-slate-600'}`}
            >
              <div className="aspect-[3/4] bg-slate-900 relative">
                <img 
                  src={`/images/leaders/${id}.png`} 
                  alt={leader.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x300?text=${leader.name}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCampColor(leader.camp)}`}>
                    {leader.camp}
                  </span>
                </div>
                <div className="text-sm text-slate-300 mb-3">
                  <div className="flex justify-between mb-1">
                    <span>攻击: {leader.baseAttack}</span>
                    <span>生命: {leader.baseHp}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  <div className="font-medium text-amber-400 mb-1">{leader.passiveName}</div>
                  <p>{leader.passiveDesc}</p>
                </div>
              </div>
              {selectedLeader === id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={handleConfirm}
          disabled={!selectedLeader}
          className={`mt-12 px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 ${selectedLeader ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.6)]' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
          确认选择
        </button>
      </div>
    </div>
  );
}