import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Play, LogOut, X } from 'lucide-react';

export default function MainMenu() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSoundOn] = useState(true);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 bg-[url('/images/cover.png')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-slate-900/50 to-slate-950/90"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-80"></div>
        
        <div className="flex flex-col gap-6 w-64">
          <button 
            onClick={() => navigate('/campaign')}
            className="flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg text-xl font-bold border-2 border-amber-400/50 shadow-[0_0_15px_rgba(217,119,6,0.6)] hover:scale-105 transition-transform"
          >
            <Play className="fill-current w-6 h-6" />
            开始游戏
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-slate-800/80 rounded-lg text-lg font-bold border-2 border-slate-600 hover:bg-slate-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            设置
          </button>
          
          <button 
            onClick={() => alert('此功能在网页中不可用')}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-slate-800/80 rounded-lg text-lg font-bold border-2 border-slate-600 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            退出
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-amber-900/50 rounded-xl p-6 w-full max-w-xs shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-center text-amber-500 mb-6 border-b border-slate-700 pb-2">游戏设置</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-300">背景音乐</span>
                <button 
                  onClick={() => setMusicOn(!musicOn)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${musicOn ? 'bg-amber-500' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${musicOn ? 'left-6.5 translate-x-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-300">游戏音效</span>
                <button 
                  onClick={() => setSoundOn(!sfxOn)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${sfxOn ? 'bg-amber-500' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${sfxOn ? 'left-6.5 translate-x-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full mt-8 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg font-bold transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
