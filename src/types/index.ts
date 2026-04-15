export type Camp = '魏' | '蜀' | '吴' | '群雄';

export interface Leader {
  id: string;
  name: string;
  camp: Camp;
  baseAttack: number;
  baseHp: number;
  passiveName: string;
  passiveDesc: string;
}

export interface General {
  id: string;
  name: string;
  camp: Camp;
  rarity: '普通' | '稀有' | '传说';
  baseAttack: number;
  baseHp: number;
  skillName: string;
  skillCost: number;
  skillDesc: string;
}

export interface PlayerGeneral {
  id: string;
  generalId: string;
  level: number;
  star: number;
  fragments: number;
}

export interface Building {
  id: string;
  name: string;
  level: number;
}

export interface LevelInfo {
  id: string;
  chapter: number;
  index: number;
  type: '普通' | '精英' | 'BOSS';
  isUnlocked: boolean;
  isPassed: boolean;
  stars: number;
}
