import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store';
import { CHAPTERS, GAME_CONSTANTS } from '../game/constants';
import { Swords, Star, Lock, Crown, Zap, Coins, TreePine, Gem, Heart } from 'lucide-react';
import clsx from 'clsx';

export default function Campaign() {
  const navigate = useNavigate();
  const { levels, stamina, consumeStamina } = useGameStore();
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const chapter = CHAPTERS[selectedChapter];
  const levelIds = chapter ? Array.from({ length: chapter.levelCount }, (_, i) => `chapter_${selectedChapter}_${i + 1}`) : [];

  const handleStartBattle = (levelId: string) => {
    const level = levels[levelId];
    // 检查关卡是否存在，或者是否是第一章第一关
    const isFirstLevel = levelId === 'chapter_0_1';
    if (!level && !isFirstLevel) {
      alert('关卡未解锁');
      return;
    }
    // 检查关卡是否解锁
    if (level && !level.isUnlocked) {
      alert('关卡未解锁');
      return;
    }
    
    if (!consumeStamina(GAME_CONSTANTS.STAMINA_PER_LEVEL)) {
      alert('体力不足');
      return;
    }
    
    navigate('/combat', { state: { levelId } });
  };

  const getLevelType = (index: number, levelCount: number) => {
    // 特殊关卡设置
    if (index === 4) return '精英'; // 第5关（索引4）是张宝精英关
    if (index === 9) return 'BOSS';  // 第10关（索引9）是张角BOSS关
    if (index >= 10) return '敬请期待'; // 第10关以后是敬请期待
    return '普通';
  };

  const getLevelRewards = (levelId: string, levelType: string) => {
    const baseSilver = 200;
    const baseWood = 50;
    const baseYuanbao = 0;
    
    switch (levelType) {
      case 'BOSS':
        return { silver: baseSilver * 3, wood: baseWood * 3, yuanbao: baseYuanbao + 10 };
      case '精英':
        return { silver: baseSilver * 2, wood: baseWood * 2, yuanbao: baseYuanbao + 5 };
      default:
        return { silver: baseSilver, wood: baseWood, yuanbao: baseYuanbao };
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 text-slate-200">
      {/* 章节选择 */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-slate-800 border-b border-slate-700">
        {CHAPTERS.map((ch, index) => {
          const isFutureChapter = index > 0; // 除了序章外的其他章节
          return (
            <button
              key={ch.id}
              onClick={() => !isFutureChapter && setSelectedChapter(index)}
              className={clsx(
                "px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors border-2",
                isFutureChapter 
                  ? "bg-slate-700 border-slate-600 text-slate-500 opacity-50 cursor-not-allowed"
                  : selectedChapter === index 
                    ? "bg-amber-700 border-amber-500 text-white" 
                    : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              )}
            >
              {isFutureChapter ? `${ch.name} (敬请期待)` : ch.name}
            </button>
          );
        })}
      </div>

      {/* 章节标题 */}
      {chapter && (
        <div className="bg-slate-800/50 p-3 border-b border-slate-700">
          <h2 className="text-xl font-bold text-amber-500">{chapter.title}</h2>
          <p className="text-xs text-slate-400">{chapter.name}</p>
        </div>
      )}

      {/* 关卡列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {levelIds.map((levelId, idx) => {
            const levelType = getLevelType(idx, chapter!.levelCount);
            const chapterIndex = selectedChapter;
            // 检查是否是第10关以后的关卡
            const isFutureLevel = idx >= 10;
            const prevLevelId = `chapter_${chapterIndex}_${idx}`;
            const level = levels[levelId] || { 
              id: levelId, 
              chapter: chapterIndex, 
              index: idx + 1, 
              type: levelType, 
              isUnlocked: !isFutureLevel && (idx === 0 || levels[prevLevelId]?.isPassed),
              isPassed: false, 
              stars: 0 
            };
            
            return (
              <div 
                key={levelId}
                onClick={() => level.isUnlocked && !isFutureLevel ? setSelectedLevel(levelId) : null}
                className={clsx(
                  "relative bg-slate-800 rounded-xl p-4 border-2 flex flex-col items-center justify-center min-h-32 transition-all",
                  level.isUnlocked && !isFutureLevel ? "border-slate-600 hover:border-amber-700/50 cursor-pointer hover:scale-105" : "border-slate-700 opacity-50 cursor-not-allowed"
                )}
              >
                {!level.isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <Lock className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  {level.type === 'BOSS' && <Crown className="w-5 h-5 text-red-500" />}
                  {level.type === '精英' && <Zap className="w-5 h-5 text-purple-500" />}
                  <span className="text-lg font-bold text-amber-500">{level.index}</span>
                </div>
                
                <span className="text-xs text-slate-400 mb-2">{level.type}关</span>
                
                {level.isPassed && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star key={i} className={clsx("w-4 h-4", i < level.stars ? "text-yellow-400 fill-current" : "text-slate-600")} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 关卡详情弹窗 */}
      {selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-amber-900/50 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-amber-500 mb-4 flex items-center justify-center gap-2">
              <Swords className="w-6 h-6" />
              关卡 {selectedLevel.split('_')[1]}
            </h2>
            
            <div className="flex flex-col gap-3 mb-6 text-sm">
              <div className="flex justify-between bg-slate-900/50 p-2 rounded">
                <span className="text-slate-400">消耗体力：</span>
                <span className="font-bold text-green-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> {GAME_CONSTANTS.STAMINA_PER_LEVEL}
                </span>
              </div>
              <div className="flex justify-between bg-slate-900/50 p-2 rounded">
                <span className="text-slate-400">当前体力：</span>
                <span className={clsx("font-bold", stamina >= GAME_CONSTANTS.STAMINA_PER_LEVEL ? "text-green-400" : "text-red-400")}>
                  {stamina}/{GAME_CONSTANTS.MAX_STAMINA}
                </span>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <span className="text-slate-400 block mb-2">首通奖励：</span>
                <div className="flex flex-wrap gap-3">
                  {(() => {
                    const rewards = getLevelRewards(selectedLevel, '普通');
                    return (
                      <>
                        {rewards.silver > 0 && (
                          <span className="font-bold text-yellow-400 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" /> {rewards.silver}
                          </span>
                        )}
                        {rewards.wood > 0 && (
                          <span className="font-bold text-green-400 flex items-center gap-1">
                            <TreePine className="w-3.5 h-3.5" /> {rewards.wood}
                          </span>
                        )}
                        {rewards.yuanbao > 0 && (
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Gem className="w-3.5 h-3.5" /> {rewards.yuanbao}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedLevel(null)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => handleStartBattle(selectedLevel)}
                className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-lg font-bold shadow-[0_0_15px_rgba(217,119,6,0.5)] transition-colors"
              >
                开始战斗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
