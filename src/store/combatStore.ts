import { create } from 'zustand';

export interface CombatState {
  playerMaxHp: number;
  playerHp: number;
  playerEnergy: number;
  playerMaxEnergy: number;
  playerShields: number;

  enemyName: string;
  enemyMaxHp: number;
  enemyHp: number;
  enemyNextDmg: number;

  general1: string | null;
  general1Energy: number;
  general1MaxEnergy: number;

  general2: string | null;
  general2Energy: number;
  general2MaxEnergy: number;

  isGameOver: boolean;
  result: 'win' | 'lose' | null;

  initCombat: (data: Partial<CombatState>) => void;
  setPlayerHp: (hp: number) => void;
  setEnemyHp: (hp: number) => void;
  addEnergy: (val: number, max: number) => void;
  addShield: () => void;
  setEnemyNextDmg: (val: number) => void;
  addGeneralEnergy: (g1Val: number, g2Val: number) => void;
  consumeGeneralEnergy: (index: 1 | 2, val: number) => void;
  setGameOver: (result: 'win' | 'lose') => void;
}

export const useCombatStore = create<CombatState>()(
  (set, get) => ({
    playerMaxHp: 1000,
    playerHp: 1000,
    playerEnergy: 0,
    playerMaxEnergy: 100,
    playerShields: 0,

    enemyName: '黄巾贼',
    enemyMaxHp: 2000,
    enemyHp: 2000,
    enemyNextDmg: 50,

    general1: null,
    general1Energy: 0,
    general1MaxEnergy: 50,

    general2: null,
    general2Energy: 0,
    general2MaxEnergy: 50,

    isGameOver: false,
    result: null,

    initCombat: (data) => set({ ...data, isGameOver: false, result: null, general1Energy: 0, general2Energy: 0 }),
    
    setPlayerHp: (hp) => set(state => ({ 
      playerHp: Math.max(0, Math.min(state.playerMaxHp, hp)),
      isGameOver: hp <= 0 ? true : state.isGameOver,
      result: hp <= 0 ? 'lose' : state.result
    })),
    
    setEnemyHp: (hp) => set(state => ({ 
      enemyHp: Math.max(0, Math.min(state.enemyMaxHp, hp)),
      isGameOver: hp <= 0 ? true : state.isGameOver,
      result: hp <= 0 ? 'win' : state.result
    })),

    addEnergy: (val, max) => set(state => ({ 
      playerEnergy: Math.min(state.playerMaxEnergy, state.playerEnergy + val)
    })),
    
    addShield: () => set(state => ({
      playerShields: Math.min(4, state.playerShields + 1)
    })),

    setEnemyNextDmg: (val) => set({ enemyNextDmg: val }),

    addGeneralEnergy: (g1Val, g2Val) => set(state => ({
      general1Energy: Math.min(state.general1MaxEnergy, state.general1Energy + g1Val),
      general2Energy: Math.min(state.general2MaxEnergy, state.general2Energy + g2Val),
    })),

    consumeGeneralEnergy: (index, val) => set(state => {
      if (index === 1) return { general1Energy: Math.max(0, state.general1Energy - val) };
      return { general2Energy: Math.max(0, state.general2Energy - val) };
    }),

    setGameOver: (result) => set({ isGameOver: true, result }),
  })
);
