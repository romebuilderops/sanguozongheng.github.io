import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerGeneral, Building, LevelInfo } from '../types';
import { LEADERS, GENERALS, CHAPTERS, GAME_CONSTANTS } from '../game/constants';

interface GameState {
  // 资源系统
  silver: number;
  wood: number;
  yuanbao: number;
  stamina: number;
  maxStamina: number;
  lastStaminaTime: number;

  // 主公系统
  leaderId: string;
  leaderLevel: number;
  leaderExp: number;
  
  // 将领系统
  generals: Record<string, PlayerGeneral>;
  currentGenerals: [string | null, string | null];

  // 建筑系统
  buildings: Record<string, Building>;
  
  // 道具系统
  items: Record<string, number>;
  
  // 关卡系统
  levels: Record<string, LevelInfo>;

  //  Actions
  // 资源操作
  addSilver: (amount: number) => void;
  addWood: (amount: number) => void;
  addYuanbao: (amount: number) => void;
  consumeStamina: (amount: number) => boolean;
  addStamina: (amount: number) => void;
  
  // 建筑操作
  upgradeBuilding: (id: string, costSilver: number, costWood: number) => boolean;
  
  // 主公操作
  upgradeLeader: () => void;
  selectLeader: (leaderId: string) => void;
  addLeaderExp: (exp: number) => void;
  
  // 将领操作
  gainGeneral: (id: string) => void;
  upgradeGeneral: (id: string) => boolean;
  starUpGeneral: (id: string) => boolean;
  equipGeneral: (index: number, generalId: string | null) => void;
  
  // 道具操作
  gainItem: (id: string, amount: number) => void;
  useItem: (id: string) => boolean;
  
  // 关卡操作
  completeLevel: (levelId: string, stars: number) => void;
  unlockLevel: (levelId: string) => void;
}

const initialBuildings: Record<string, Building> = {
  hall: { id: 'hall', name: '主殿', level: 1 },
  barracks: { id: 'barracks', name: '兵营', level: 1 },
  training: { id: 'training', name: '校场', level: 1 },
  market: { id: 'market', name: '市场', level: 1 },
  workshop: { id: 'workshop', name: '工坊', level: 1 },
  tavern: { id: 'tavern', name: '酒馆', level: 1 },
};

// 初始化关卡数据
const initialLevels: Record<string, LevelInfo> = {};
// 只初始化序章的第一关
initialLevels['chapter_0_1'] = { id: 'chapter_0_1', chapter: 0, index: 1, type: '普通', isUnlocked: true, isPassed: false, stars: 0 };

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // 初始资源
      silver: 100000,
      wood: 50000,
      yuanbao: 10000,
      stamina: 100,
      maxStamina: 100,
      lastStaminaTime: Date.now(),
      
      // 初始主公
      leaderId: 'liubei',
      leaderLevel: 1,
      leaderExp: 0,

      // 初始将领
      generals: {},
      currentGenerals: [null, null],

      // 初始建筑
      buildings: initialBuildings,

      // 初始道具
      items: {
        stamina_potion: 5,
        exp_book: 10,
        universal_fragment: 5,
        silver_bag: 2,
        wood_pack: 2
      },

      // 初始关卡
      levels: initialLevels,

      // 资源操作方法
      addSilver: (amount) => set((state) => ({ silver: state.silver + amount })),
      addWood: (amount) => set((state) => ({ wood: state.wood + amount })),
      addYuanbao: (amount) => set((state) => ({ yuanbao: state.yuanbao + amount })),
      
      consumeStamina: (amount) => {
        const { stamina } = get();
        if (stamina >= amount) {
          set({ stamina: stamina - amount });
          return true;
        }
        return false;
      },
      
      addStamina: (amount) => set((state) => ({ 
        stamina: Math.min(state.maxStamina, state.stamina + amount) 
      })),

      // 建筑升级
      upgradeBuilding: (id, costSilver, costWood) => {
        const { silver, wood, buildings } = get();
        if (silver >= costSilver && wood >= costWood) {
          set({
            silver: silver - costSilver,
            wood: wood - costWood,
            buildings: {
              ...buildings,
              [id]: { ...buildings[id], level: buildings[id].level + 1 }
            }
          });
          return true;
        }
        return false;
      },

      // 主公升级
      upgradeLeader: () => set((state) => {
        const requiredWood = state.leaderLevel * 100;
        if (state.wood >= requiredWood) {
          return {
            leaderLevel: state.leaderLevel + 1,
            maxStamina: Math.min(GAME_CONSTANTS.MAX_STAMINA, state.maxStamina + 2),
            wood: state.wood - requiredWood
          };
        }
        return state;
      }),

      // 增加主公经验（保留用于其他地方）
      addLeaderExp: (exp) => set((state) => ({
        leaderExp: state.leaderExp + exp
      })),

      // 选择主公
      selectLeader: (leaderId) => set(() => ({
        leaderId,
        leaderLevel: 1,
        leaderExp: 0
      })),

      // 获得将领
      gainGeneral: (id) => set((state) => {
        if (state.generals[id]) {
          return {
            generals: {
              ...state.generals,
              [id]: { ...state.generals[id], fragments: state.generals[id].fragments + 10 }
            }
          };
        }
        return {
          generals: {
            ...state.generals,
            [id]: { id, generalId: id, level: 1, star: 1, fragments: 0 }
          }
        };
      }),

      // 升级将领
      upgradeGeneral: (id) => {
        const { generals, items, silver } = get();
        const general = generals[id];
        if (!general) return false;
        
        const requiredExp = Math.floor(50 * Math.pow(general.level, 1.3));
        const requiredSilver = general.level * 100;
        
        if (items.exp_book && items.exp_book > 0 && silver >= requiredSilver) {
          set({
            items: {
              ...items,
              exp_book: items.exp_book - 1
            },
            silver: silver - requiredSilver,
            generals: {
              ...generals,
              [id]: { ...general, level: general.level + 1 }
            }
          });
          return true;
        }
        return false;
      },

      // 将领升星
      starUpGeneral: (id) => {
        const { generals, items, silver } = get();
        const general = generals[id];
        if (!general || general.star >= 5) return false;
        
        const requiredFragments = general.star * 20;
        const requiredSilver = general.star * 500;
        const availableFragments = general.fragments + (items.universal_fragment || 0);
        
        if (availableFragments >= requiredFragments && silver >= requiredSilver) {
          let fragmentsUsed = requiredFragments;
          let universalUsed = 0;
          
          if (general.fragments >= requiredFragments) {
            fragmentsUsed = requiredFragments;
          } else {
            universalUsed = requiredFragments - general.fragments;
            fragmentsUsed = general.fragments;
          }
          
          set({
            silver: silver - requiredSilver,
            items: {
              ...items,
              universal_fragment: (items.universal_fragment || 0) - universalUsed
            },
            generals: {
              ...generals,
              [id]: {
                ...general,
                star: general.star + 1,
                fragments: general.fragments - fragmentsUsed
              }
            }
          });
          return true;
        }
        return false;
      },

      // 装备将领
      equipGeneral: (index, generalId) => set((state) => {
        console.log('equipGeneral called:', { index, generalId, currentGenerals: state.currentGenerals });
        const newGens = [...state.currentGenerals] as [string | null, string | null];
        newGens[index] = generalId;
        console.log('After equipGeneral:', { newGens });
        return { currentGenerals: newGens };
      }),

      // 获得道具
      gainItem: (id, amount) => set((state) => ({
        items: {
          ...state.items,
          [id]: (state.items[id] || 0) + amount
        }
      })),

      // 使用道具
      useItem: (id) => {
        const { items, stamina, maxStamina } = get();
        if (!items[id] || items[id] <= 0) return false;
        
        if (id === 'stamina_potion') {
          const newStamina = Math.min(maxStamina, stamina + 50);
          set({
            items: {
              ...items,
              [id]: items[id] - 1
            },
            stamina: newStamina
          });
          return true;
        } else if (id === 'silver_bag') {
          set({
            items: {
              ...items,
              [id]: items[id] - 1
            },
            silver: get().silver + 1000
          });
          return true;
        } else if (id === 'wood_pack') {
          set({
            items: {
              ...items,
              [id]: items[id] - 1
            },
            wood: get().wood + 500
          });
          return true;
        }
        return false;
      },

      // 完成关卡
      completeLevel: (levelId, stars) => set((state) => {
        const level = state.levels[levelId];
        if (!level) return state;
        
        const chapter = CHAPTERS[level.chapter];
        if (!chapter) return state;
        
        const nextIndex = level.index + 1;
        let nextChapter = level.chapter;
        let nextIdxInChap = nextIndex;
        
        if (nextIndex > chapter.levelCount) {
          nextChapter = level.chapter + 1;
          nextIdxInChap = 1;
        }
        
        const nextId = `chapter_${nextChapter}_${nextIdxInChap}`;
        const nextChapterData = CHAPTERS[nextChapter];
        
        const newLevels = {
          ...state.levels,
          [levelId]: { ...level, isPassed: true, stars: Math.max(level.stars, stars) }
        };
        
        if (nextChapterData && nextIdxInChap <= nextChapterData.levelCount) {
          newLevels[nextId] = newLevels[nextId] || {
            id: nextId,
            chapter: nextChapter,
            index: nextIdxInChap,
            type: nextIdxInChap === nextChapterData.levelCount ? 'BOSS' : (nextIdxInChap === nextChapterData.levelCount - 1 ? '精英' : '普通'),
            isUnlocked: true,
            isPassed: false,
            stars: 0
          };
        }
        
        // 奖励
        const silverReward = 500 + (level.chapter * 100) + (level.index * 50);
        const woodReward = 100 + (level.chapter * 20) + (level.index * 10);
        
        return {
          levels: newLevels,
          silver: state.silver + silverReward,
          wood: state.wood + woodReward
        };
      }),

      // 解锁关卡
      unlockLevel: (levelId) => set((state) => ({
        levels: {
          ...state.levels,
          [levelId]: {
            ...state.levels[levelId],
            isUnlocked: true
          }
        }
      }))
    }),
    {
      name: 'game-storage',
    }
  )
);
