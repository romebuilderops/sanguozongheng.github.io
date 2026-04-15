import { Leader, General } from '../types';

// 棋子类型定义
export const GEM_TYPES = {
  RED: 0,    // 攻击
  GREEN: 1,  // 生命
  YELLOW: 2, // 士气
  BLUE: 3,   // 防御
  PURPLE: 4, // 谋略
  ORANGE: 5  // 粮草
};

// 特殊棋子类型
export const SPECIAL_GEMS = {
  POWER: 6,  // 强化棋子（4连珠）
  BOMB: 7,   // 炸弹棋子（5连珠）
  CROSS: 8   // 十字消除棋子（T/L型）
};

// 初始可选主公列表
export const INITIAL_LEADERS: Record<string, Leader> = {
  caocao: { id: 'caocao', name: '曹操', camp: '魏', baseAttack: 80, baseHp: 1200, passiveName: '护盾积累', passiveDesc: '每消除10个蓝色棋子，获得1层护盾（每层减伤5%，上限4层）' },
  liubei: { id: 'liubei', name: '刘备', camp: '蜀', baseAttack: 70, baseHp: 1400, passiveName: '生命回复', passiveDesc: '每消除10个绿色棋子，回复5%生命' },
  sunquan: { id: 'sunquan', name: '孙权', camp: '吴', baseAttack: 90, baseHp: 1100, passiveName: '火焰伤害', passiveDesc: '每消除10个红色棋子，对随机敌人造成50%攻击力的火焰伤害' },
  dongzhuo: { id: 'dongzhuo', name: '董卓', camp: '群雄', baseAttack: 100, baseHp: 1000, passiveName: '技能增伤', passiveDesc: '每消除10个紫色棋子，下次技能伤害+30%' }
};

// 所有主公列表（包括需要合成的）
export const LEADERS: Record<string, Leader> = {
  ...INITIAL_LEADERS,
  zhangjiao: { id: 'zhangjiao', name: '张角', camp: '群雄', baseAttack: 95, baseHp: 1150, passiveName: '黄天之力', passiveDesc: '每消除10个黄色棋子，获得1层「黄天之力」（每层增加技能伤害10%，上限5层）' }
};

// 将领列表
export const GENERALS: Record<string, General> = {
  simayi: { id: 'simayi', name: '司马懿', camp: '魏', rarity: '传说', baseAttack: 85, baseHp: 900, skillName: '隐忍待发', skillCost: 55, skillDesc: '将所有蓝色棋子转化为强化棋子，并获得2层护盾（每层减伤5%）' },
  guojia: { id: 'guojia', name: '郭嘉', camp: '魏', rarity: '传说', baseAttack: 75, baseHp: 850, skillName: '奇谋妙算', skillCost: 50, skillDesc: '随机将10个紫色棋子变为炸弹棋子，并增加10点能量' },
  zhangfei: { id: 'zhangfei', name: '张飞', camp: '蜀', rarity: '传说', baseAttack: 90, baseHp: 800, skillName: '横扫千军', skillCost: 40, skillDesc: '消除最下面3行所有棋子，对敌人造成额外10%伤害' },
  zhugeliang: { id: 'zhugeliang', name: '诸葛亮', camp: '蜀', rarity: '传说', baseAttack: 80, baseHp: 750, skillName: '八卦阵', skillCost: 60, skillDesc: '将棋盘上所有棋子重新排列，确保至少3组可消除，并为所有友军回复10%生命' },
  zhouyu: { id: 'zhouyu', name: '周瑜', camp: '吴', rarity: '传说', baseAttack: 85, baseHp: 700, skillName: '火烧连营', skillCost: 50, skillDesc: '随机消除15个红色棋子，并对敌人造成持续2回合的火焰伤害（每回合5%最大生命）' },
  xiaoqiao: { id: 'xiaoqiao', name: '小乔', camp: '吴', rarity: '传说', baseAttack: 65, baseHp: 850, skillName: '琴音绕梁', skillCost: 45, skillDesc: '将所有绿色棋子转化为黄色棋子，并为友军回复15%生命' },
  lvbu: { id: 'lvbu', name: '吕布', camp: '群雄', rarity: '传说', baseAttack: 100, baseHp: 900, skillName: '乱世枭雄', skillCost: 80, skillDesc: '消除棋盘上所有同色棋子（玩家选择颜色），并对敌人造成相当于消除数量×5的伤害' },
  diaochan: { id: 'diaochan', name: '貂蝉', camp: '群雄', rarity: '传说', baseAttack: 70, baseHp: 800, skillName: '倾国倾城', skillCost: 40, skillDesc: '随机将8个紫色棋子变为黄色棋子，并使敌人下一回合攻击伤害降低30%' },
  zhangbao: { id: 'zhangbao', name: '张宝', camp: '群雄', rarity: '史诗', baseAttack: 75, baseHp: 850, skillName: '地公将军', skillCost: 45, skillDesc: '消除棋盘上所有绿色棋子，并对敌人造成相当于消除数量×3的伤害' },
  zhangjiao_g: { id: 'zhangjiao_g', name: '张角', camp: '群雄', rarity: '传说', baseAttack: 95, baseHp: 1150, skillName: '太平要术', skillCost: 70, skillDesc: '将棋盘上所有黄色棋子变为强化棋子，并获得2层「黄天之力」' }
};

// 道具列表
export const ITEMS = {
  stamina_potion: { id: 'stamina_potion', name: '体力药水', desc: '恢复 50 点体力' },
  exp_book: { id: 'exp_book', name: '将领经验书', desc: '用于将领升级' },
  universal_fragment: { id: 'universal_fragment', name: '万能碎片', desc: '可用于任意将领升星' },
  silver_bag: { id: 'silver_bag', name: '银两袋', desc: '获得 1000 银两' },
  wood_pack: { id: 'wood_pack', name: '木材包', desc: '获得 500 木材' }
};

// 关卡章节配置
export const CHAPTERS = [
  { id: 'chapter_0', name: '序章', title: '黄巾之乱', levelCount: 10 },
  { id: 'chapter_1', name: '第一章', title: '诸侯讨董', levelCount: 10 },
  { id: 'chapter_2', name: '第二章', title: '官渡之战', levelCount: 15 },
  { id: 'chapter_3', name: '第三章', title: '赤壁之战', levelCount: 15 },
  { id: 'chapter_4', name: '第四章', title: '三分天下', levelCount: 20 },
  { id: 'chapter_5', name: '终章', title: '一统天下', levelCount: 10 }
];

// 游戏常量
export const GAME_CONSTANTS = {
  BOARD_SIZE: 8,          // 8x8棋盘
  ENERGY_PER_GEM: 1,      // 每个棋子提供的能量
  ENERGY_PER_SPECIAL: 2,  // 每个特殊棋子提供的额外能量
  ENERGY_CAP: 100,         // 能量上限
  STAMINA_PER_LEVEL: 10,   // 每个关卡消耗的体力
  STAMINA_RECOVERY: 5,     // 体力恢复时间（分钟/点）
  INITIAL_STAMINA: 100,    // 初始体力
  MAX_STAMINA: 200,        // 体力上限
  BASE_ATTACK_MULTIPLIER: {
    3: 1.0,
    4: 1.5,
    5: 2.0,
    6: 2.5
  },
  COMBO_BONUS: 0.05,       // 每连击增加的伤害百分比
  COMBO_BONUS_CAP: 1.0     // 连击加成上限
};
