import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GEM_TYPES, SPECIAL_GEMS, GAME_CONSTANTS } from '../constants';

const ROWS = GAME_CONSTANTS.BOARD_SIZE;
const COLS = GAME_CONSTANTS.BOARD_SIZE;
const TILE_SIZE = 60;
const OFFSET_X = (600 - (COLS * TILE_SIZE)) / 2;
const OFFSET_Y = 150; // 为上面的HUD留空间

const GEM_KEYS = ['red', 'green', 'yellow', 'blue', 'purple', 'orange'];

interface GemData {
  x: number;
  y: number;
  type: number; // 0-5
  sprite: Phaser.GameObjects.Sprite;
  special: 'none' | 'enhance' | 'bomb' | 'cross';
}

export class MainGame extends Scene {
  private grid: (GemData | null)[][] = [];
  private selectedGem: GemData | null = null;
  private isProcessing: boolean = false;
  private combo: number = 0;
  private skillEnergy: number = 0;
  private skillQueue: string[] = [];
  private processingTimeout: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super('MainGame');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0f172a');
    this.add.rectangle(300, 400, 600, 800, 0x0b1220, 0.45);
    this.add.rectangle(300, 390, 560, 560, 0x1e293b, 0.25).setStrokeStyle(2, 0x94a3b8, 0.2);
    
    // 使用水墨风格棋盘背景
    const boardBg = this.add.image(300, OFFSET_Y + (ROWS * TILE_SIZE) / 2 - TILE_SIZE/2, 'board_background');
    boardBg.setDisplaySize(COLS * TILE_SIZE + 40, ROWS * TILE_SIZE + 40);
    
    this.initGrid();
    
    this.input.on('pointerdown', this.onPointerDown, this);
    
    // React UI 事件监听
    EventBus.on('cast-skill', this.handleSkill, this);
    
    this.events.once('shutdown', () => {
      EventBus.off('cast-skill', this.handleSkill, this);
    });
  }

  private initGrid() {
    this.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let type;
        do {
          type = Phaser.Math.Between(0, 5);
        } while (
          (c >= 2 && this.grid[r][c - 1]?.type === type && this.grid[r][c - 2]?.type === type) ||
          (r >= 2 && this.grid[r - 1][c]?.type === type && this.grid[r - 2][c]?.type === type)
        );
        this.createGem(r, c, type, 'none');
      }
    }
  }

  private createGem(r: number, c: number, type: number, special: 'none' | 'enhance' | 'bomb' | 'cross') {
    const px = OFFSET_X + c * TILE_SIZE + TILE_SIZE / 2;
    const py = OFFSET_Y + r * TILE_SIZE;
    
    let key = `gem_${GEM_KEYS[type]}`;
    if (special !== 'none') key += '_' + special;

    const sprite = this.add.sprite(px, py, key);
    sprite.setDisplaySize(54, 54);
    sprite.setInteractive();
    
    // 为特殊棋子添加点击事件
    if (special !== 'none') {
      sprite.on('pointerdown', () => {
        if (!this.isProcessing) {
          this.processSpecialGem(this.grid[r][c]!);
        }
      });
    }
    
    this.grid[r][c] = { x: c, y: r, type, sprite, special };
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (this.isProcessing) {
      // 如果卡住超过5秒，自动解除
      if (!this.processingTimeout) {
        this.processingTimeout = this.time.delayedCall(5000, () => {
          console.warn('Processing timeout - forcing isProcessing = false');
          this.isProcessing = false;
          this.processingTimeout = null;
        });
      }
      return;
    }
    
    // 取消之前的超时
    if (this.processingTimeout) {
      this.processingTimeout.remove();
      this.processingTimeout = null;
    }

    const c = Math.floor((pointer.x - OFFSET_X) / TILE_SIZE);
    const r = Math.floor((pointer.y + TILE_SIZE/2 - OFFSET_Y) / TILE_SIZE);

    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.grid[r][c]) {
      const clickedGem = this.grid[r][c]!;
      
      if (!this.selectedGem) {
        // 如果是被虚化的棋子，可以选中但标记为虚化状态
        if ((clickedGem as any).isCursed) {
          clickedGem.sprite.setAlpha(0.5); // 虚化的棋子选中时显示不同的透明度
          (clickedGem as any).isSelectedWhileCursed = true;
        }
        this.selectedGem = clickedGem;
        this.selectedGem.sprite.setAlpha(0.5);
      } else {
        // 检查是否尝试与虚化的棋子交换
        const isTargetCursed = (clickedGem as any).isCursed;
        const isSourceCursed = (this.selectedGem as any).isSelectedWhileCursed;
        
        if (isTargetCursed || isSourceCursed) {
          // 虚化的棋子不能交换，取消选中状态
          if ((this.selectedGem as any).isSelectedWhileCursed) {
            (this.selectedGem as any).isSelectedWhileCursed = false;
          }
          this.selectedGem.sprite.setAlpha(1);
          this.selectedGem = null;
          return;
        }
        
        const dx = Math.abs(this.selectedGem.x - c);
        const dy = Math.abs(this.selectedGem.y - r);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
          this.swapGems(this.selectedGem, clickedGem);
        } else {
          // 取消之前的虚化标记
          if ((this.selectedGem as any).isSelectedWhileCursed) {
            (this.selectedGem as any).isSelectedWhileCursed = false;
          }
          this.selectedGem.sprite.setAlpha(1);
          this.selectedGem = clickedGem;
          // 如果是虚化的棋子，标记为选中状态
          if ((clickedGem as any).isCursed) {
            (clickedGem as any).isSelectedWhileCursed = true;
          }
          this.selectedGem.sprite.setAlpha(0.5);
        }
      }
    }
  }

  private swapGems(g1: GemData, g2: GemData) {
    this.isProcessing = true;
    if (this.selectedGem) this.selectedGem.sprite.setAlpha(1);
    this.selectedGem = null;

    // 交换数组
    this.grid[g1.y][g1.x] = g2;
    this.grid[g2.y][g2.x] = g1;

    const tempX = g1.x; const tempY = g1.y;
    g1.x = g2.x; g1.y = g2.y;
    g2.x = tempX; g2.y = tempY;

    // 动画
    this.tweens.add({
      targets: g1.sprite,
      x: OFFSET_X + g1.x * TILE_SIZE + TILE_SIZE / 2,
      y: OFFSET_Y + g1.y * TILE_SIZE,
      duration: 100
    });
    this.tweens.add({
      targets: g2.sprite,
      x: OFFSET_X + g2.x * TILE_SIZE + TILE_SIZE / 2,
      y: OFFSET_Y + g2.y * TILE_SIZE,
      duration: 100,
      onComplete: () => {
        const { matches, specialGems } = this.findMatches();
        if (matches.length > 0) {
          this.combo = 0;
          this.removeCurseEffects(); // 玩家成功移动后解除虚化效果
          this.processMatches({ matches, specialGems });
        } else {
          // 还原
          this.grid[g1.y][g1.x] = g2;
          this.grid[g2.y][g2.x] = g1;

          const tX = g1.x; const tY = g1.y;
          g1.x = g2.x; g1.y = g2.y;
          g2.x = tX; g2.y = tY;

          this.tweens.add({
            targets: g1.sprite,
            x: OFFSET_X + g1.x * TILE_SIZE + TILE_SIZE / 2,
            y: OFFSET_Y + g1.y * TILE_SIZE,
            duration: 100
          });
          this.tweens.add({
            targets: g2.sprite,
            x: OFFSET_X + g2.x * TILE_SIZE + TILE_SIZE / 2,
            y: OFFSET_Y + g2.y * TILE_SIZE,
            duration: 100,
            onComplete: () => { this.isProcessing = false; }
          });
        }
      }
    });
  }

  private findMatches() {
    let matches: Set<GemData> = new Set();
    let specialGems: {r: number, c: number, type: number, special: 'enhance' | 'bomb' | 'cross'}[] = [];

    // 横向
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        let g1 = this.grid[r][c];
        if (!g1) continue;
        let matchLen = 1;
        while (c + matchLen < COLS && this.grid[r][c + matchLen]?.type === g1.type) {
          matchLen++;
        }
        if (matchLen >= 3) {
          for (let i = 0; i < matchLen; i++) {
            matches.add(this.grid[r][c + i]!);
          }
          // 特殊棋子生成
          if (matchLen === 4) {
            specialGems.push({ r, c: c + 1, type: g1.type, special: 'enhance' });
          } else if (matchLen >= 5) {
            specialGems.push({ r, c: c + Math.floor(matchLen / 2), type: g1.type, special: 'bomb' });
          }
        }
      }
    }

    // 纵向
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 2; r++) {
        let g1 = this.grid[r][c];
        if (!g1) continue;
        let matchLen = 1;
        while (r + matchLen < ROWS && this.grid[r + matchLen][c]?.type === g1.type) {
          matchLen++;
        }
        if (matchLen >= 3) {
          for (let i = 0; i < matchLen; i++) {
            matches.add(this.grid[r + matchLen - 1 - i][c]!);
          }
          // 特殊棋子生成
          if (matchLen === 4) {
            specialGems.push({ r: r + 1, c, type: g1.type, special: 'enhance' });
          } else if (matchLen >= 5) {
            specialGems.push({ r: r + Math.floor(matchLen / 2), c, type: g1.type, special: 'bomb' });
          }
        }
      }
    }

    // T/L型消除（十字消除棋子）
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const center = this.grid[r][c];
        if (!center) continue;
        
        // 检查 T 型
        if (this.grid[r-1][c]?.type === center.type && this.grid[r+1][c]?.type === center.type && this.grid[r][c-1]?.type === center.type) {
          matches.add(center);
          matches.add(this.grid[r-1][c]!);
          matches.add(this.grid[r+1][c]!);
          matches.add(this.grid[r][c-1]!);
          specialGems.push({ r, c, type: center.type, special: 'cross' });
        } else if (this.grid[r-1][c]?.type === center.type && this.grid[r+1][c]?.type === center.type && this.grid[r][c+1]?.type === center.type) {
          matches.add(center);
          matches.add(this.grid[r-1][c]!);
          matches.add(this.grid[r+1][c]!);
          matches.add(this.grid[r][c+1]!);
          specialGems.push({ r, c, type: center.type, special: 'cross' });
        }
        
        // 检查 L 型
        if (this.grid[r-1][c]?.type === center.type && this.grid[r][c-1]?.type === center.type && this.grid[r-1][c-1]?.type === center.type) {
          matches.add(center);
          matches.add(this.grid[r-1][c]!);
          matches.add(this.grid[r][c-1]!);
          matches.add(this.grid[r-1][c-1]!);
          specialGems.push({ r, c, type: center.type, special: 'cross' });
        } else if (this.grid[r-1][c]?.type === center.type && this.grid[r][c+1]?.type === center.type && this.grid[r-1][c+1]?.type === center.type) {
          matches.add(center);
          matches.add(this.grid[r-1][c]!);
          matches.add(this.grid[r][c+1]!);
          matches.add(this.grid[r-1][c+1]!);
          specialGems.push({ r, c, type: center.type, special: 'cross' });
        } else if (this.grid[r+1][c]?.type === center.type && this.grid[r][c-1]?.type === center.type && this.grid[r+1][c-1]?.type === center.type) {
          matches.add(center);
          matches.add(this.grid[r+1][c]!);
          matches.add(this.grid[r][c-1]!);
          matches.add(this.grid[r+1][c-1]!);
          specialGems.push({ r, c, type: center.type, special: 'cross' });
        } else if (this.grid[r+1][c]?.type === center.type && this.grid[r][c+1]?.type === center.type && this.grid[r+1][c+1]?.type === center.type) {
          matches.add(center);
          matches.add(this.grid[r+1][c]!);
          matches.add(this.grid[r][c+1]!);
          matches.add(this.grid[r+1][c+1]!);
          specialGems.push({ r, c, type: center.type, special: 'cross' });
        }
      }
    }
    
    // 把 Set 转换为 Array 返回
    return { matches: Array.from(matches), specialGems };
  }

  private processSpecialGem(gem: GemData) {
    if (gem.special === 'none') return;
    
    this.isProcessing = true;
    const matches: GemData[] = [];
    
    switch (gem.special) {
      case 'enhance':
        // 强化棋子：消除周围的棋子
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue; // 跳过自己
            const r = gem.y + dr;
            const c = gem.x + dc;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.grid[r][c]) {
              matches.push(this.grid[r][c]!);
            }
          }
        }
        matches.push(gem); // 包括自己
        break;
        
      case 'bomb':
        // 炸弹棋子：消除3x3区域的棋子
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const r = gem.y + dr;
            const c = gem.x + dc;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.grid[r][c]) {
              matches.push(this.grid[r][c]!);
            }
          }
        }
        break;
        
      case 'cross':
        // 十字消除棋子：消除十字范围内的棋子
        // 横向
        for (let c = 0; c < COLS; c++) {
          if (this.grid[gem.y][c]) {
            matches.push(this.grid[gem.y][c]!);
          }
        }
        // 纵向
        for (let r = 0; r < ROWS; r++) {
          if (this.grid[r][gem.x]) {
            matches.push(this.grid[r][gem.x]!);
          }
        }
        break;
    }
    
    if (matches.length > 0) {
      this.combo = 0;
      this.processMatches({ matches, specialGems: [] });
    } else {
      this.isProcessing = false;
    }
  }

  private processMatches({ matches, specialGems }: { matches: GemData[], specialGems: {r: number, c: number, type: number, special: 'enhance' | 'bomb' | 'cross'}[] }) {
    this.combo++;
    
    // 分离类型数量，用于伤害计算
    const typeCount: Record<number, number> = {};
    let energyGained = 0;
    
    matches.forEach(g => {
      typeCount[g.type] = (typeCount[g.type] || 0) + 1;
      this.grid[g.y][g.x] = null;
      this.playGemEliminateFx(g);
      
      // 计算能量
      energyGained += GAME_CONSTANTS.ENERGY_PER_GEM;
      if (g.special !== 'none') {
        energyGained += GAME_CONSTANTS.ENERGY_PER_SPECIAL;
      }
      
      this.tweens.add({
        targets: g.sprite,
        scale: 0,
        alpha: 0,
        duration: 200,
        onComplete: () => g.sprite.destroy()
      });
    });

    // 更新能量
    this.skillEnergy = Math.min(GAME_CONSTANTS.ENERGY_CAP, this.skillEnergy + energyGained);

    // 通知 React 层，携带连击数、每种消除的数量和获得的能量
    EventBus.emit('gems-matched', { 
      typeCount, 
      combo: this.combo, 
      energyGained, 
      currentEnergy: this.skillEnergy 
    });
    
    this.showComboText(this.combo, matches.length);
    if (matches.length >= 5) {
      this.cameras.main.shake(120, 0.004);
    }

    this.time.delayedCall(250, () => this.applyGravity(specialGems));
  }

  private playGemEliminateFx(gem: GemData) {
    const x = OFFSET_X + gem.x * TILE_SIZE + TILE_SIZE / 2;
    const y = OFFSET_Y + gem.y * TILE_SIZE;
    const color = [0xef4444, 0x22c55e, 0xeab308, 0x3b82f6, 0xa855f7, 0xf97316][gem.type];

    const flash = this.add.circle(x, y, 8, color, 0.9);
    this.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 220,
      ease: 'Sine.easeOut',
      onComplete: () => flash.destroy(),
    });

    for (let i = 0; i < 6; i++) {
      const p = this.add.circle(x, y, 3, color, 0.95);
      const angle = Phaser.Math.DegToRad(i * 60 + Phaser.Math.Between(-18, 18));
      const dist = Phaser.Math.Between(20, 40);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 260,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  private showComboText(combo: number, eliminated: number) {
    const text = this.add.text(300, 120, `${combo} COMBO`, {
      fontFamily: 'Arial Black',
      fontSize: combo >= 3 ? '44px' : '34px',
      color: '#fbbf24',
      stroke: '#7c2d12',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(1000);

    const sub = this.add.text(300, 155, `消除 ${eliminated} 枚`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#fde68a',
      stroke: '#1e293b',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(1000);

    this.tweens.add({
      targets: [text, sub],
      y: '-=24',
      alpha: 0,
      duration: 700,
      ease: 'Sine.easeOut',
      onComplete: () => {
        text.destroy();
        sub.destroy();
      },
    });
  }

  private applyGravity(specialGems: {r: number, c: number, type: number, special: 'enhance' | 'bomb' | 'cross'}[]) {
    let moved = false;
    // 下落
    for (let c = 0; c < COLS; c++) {
      let emptySpots = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (this.grid[r][c] === null) {
          emptySpots++;
        } else if (emptySpots > 0) {
          const g = this.grid[r][c]!;
          this.grid[r + emptySpots][c] = g;
          this.grid[r][c] = null;
          g.y += emptySpots;
          
          this.tweens.add({
            targets: g.sprite,
            y: OFFSET_Y + g.y * TILE_SIZE,
            duration: 200,
            ease: 'Bounce.easeOut'
          });
          moved = true;
        }
      }
      
      // 补充顶部
      for (let i = 0; i < emptySpots; i++) {
        const type = Phaser.Math.Between(0, 5);
        this.createGem(i, c, type, 'none');
        const g = this.grid[i][c]!;
        g.sprite.y = OFFSET_Y - TILE_SIZE; // 出生在屏幕上方
        
        this.tweens.add({
          targets: g.sprite,
          y: OFFSET_Y + g.y * TILE_SIZE,
          duration: 200 + i * 50,
          ease: 'Bounce.easeOut'
        });
        moved = true;
      }
    }

    // 创建特殊棋子
    specialGems.forEach(gemData => {
      if (this.grid[gemData.r][gemData.c] === null) {
        this.createGem(gemData.r, gemData.c, gemData.type, gemData.special);
        const g = this.grid[gemData.r][gemData.c]!;
        g.sprite.y = OFFSET_Y - TILE_SIZE;
        
        this.tweens.add({
          targets: g.sprite,
          y: OFFSET_Y + g.y * TILE_SIZE,
          duration: 300,
          ease: 'Bounce.easeOut'
        });
      }
    });

    this.time.delayedCall(400, () => {
      const { matches, specialGems: newSpecialGems } = this.findMatches();
      if (matches.length > 0) {
        this.processMatches({ matches, specialGems: newSpecialGems });
      } else {
        this.isProcessing = false;
        // 检查技能队列
        this.processSkillQueue();
        // 玩家回合结束，敌人行动
        if (this.combo > 0) {
          EventBus.emit('enemy-turn');
        }
        
        // 检查死局
        if (!this.hasPossibleMoves()) {
          EventBus.emit('no-moves');
          this.reshuffle();
        }
      }
    });
  }

  private hasPossibleMoves() {
    // 检查是否有可消除的组合
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const gem = this.grid[r][c];
        if (!gem) continue;
        
        // 检查右侧
        if (c < COLS - 1) {
          const rightGem = this.grid[r][c + 1];
          if (rightGem) {
            // 交换检查
            this.swapGemsTemp(gem, rightGem);
            const { matches } = this.findMatches();
            this.swapGemsTemp(rightGem, gem);
            if (matches.length > 0) return true;
          }
        }
        
        // 检查下方
        if (r < ROWS - 1) {
          const downGem = this.grid[r + 1][c];
          if (downGem) {
            // 交换检查
            this.swapGemsTemp(gem, downGem);
            const { matches } = this.findMatches();
            this.swapGemsTemp(downGem, gem);
            if (matches.length > 0) return true;
          }
        }
      }
    }
    return false;
  }

  private swapGemsTemp(g1: GemData, g2: GemData) {
    // 临时交换，用于检查是否有可消除的组合
    this.grid[g1.y][g1.x] = g2;
    this.grid[g2.y][g2.x] = g1;

    const tempX = g1.x; const tempY = g1.y;
    g1.x = g2.x; g1.y = g2.y;
    g2.x = tempX; g2.y = tempY;
  }

  private reshuffle() {
    // 重新排列所有砖块
    const gems: GemData[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c]) {
          gems.push(this.grid[r][c]!);
          this.grid[r][c]!.sprite.destroy();
        }
      }
    }

    // 清空网格
    this.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

    // 重新创建所有棋子
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let type;
        do {
          type = Phaser.Math.Between(0, 5);
        } while (
          (c >= 2 && this.grid[r][c - 1]?.type === type && this.grid[r][c - 2]?.type === type) ||
          (r >= 2 && this.grid[r - 1][c]?.type === type && this.grid[r - 2][c]?.type === type)
        );
        this.createGem(r, c, type, 'none');
      }
    }

    this.isProcessing = false;
    // 检查技能队列
    this.processSkillQueue();
  }

  // 处理技能队列
  private processSkillQueue() {
    if (this.skillQueue.length > 0) {
      const nextSkill = this.skillQueue.shift();
      if (nextSkill) {
        this.handleSkill(nextSkill);
      }
    }
  }

  // 解除所有被妖术影响的棋子
  private removeCurseEffects() {
    this.grid.forEach(row => row.forEach(g => {
      if (g && (g as any).isCursed) {
        g.sprite.setAlpha(1); // 恢复透明度
        g.sprite.input.enabled = true; // 恢复交互
        (g as any).isCursed = false; // 移除标记
      }
    }));
  }

  // 技能处理
  private handleSkill(skillName: string) {
    if (this.isProcessing) {
      // 如果正在处理，将技能添加到队列
      this.skillQueue.push(skillName);
      return;
    }
    this.isProcessing = true;
    
    // 简单实现
    let toDestroy: GemData[] = [];
    
    if (skillName === '横扫千军') {
      for (let r = ROWS - 3; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (this.grid[r][c]) toDestroy.push(this.grid[r][c]!);
        }
      }
    } else if (skillName === '突袭') {
      // 随机交换两个棋子
      const gems: GemData[] = [];
      this.grid.forEach(row => row.forEach(g => { if (g) gems.push(g); }));
      if (gems.length >= 2) {
        const [g1, g2] = Phaser.Math.RND.pickMultiple(gems, 2);
        this.swapGems(g1, g2);
        return;
      }
    } else if (skillName === '火攻' || skillName === '火烧连营') {
      const reds: GemData[] = [];
      this.grid.forEach(row => row.forEach(g => { if (g && g.type === GEM_TYPES.RED) reds.push(g); }));
      Phaser.Math.RND.shuffle(reds);
      toDestroy = reds.slice(0, 15);
    } else if (skillName === '八卦阵') {
      this.reshuffle();
      // 为所有友军回复10%生命
      EventBus.emit('heal-player', { percentage: 10 });
      this.isProcessing = false;
      return;
    } else if (skillName === '乱世枭雄') {
      const types = [0,1,2,3,4,5];
      const maxType = types.sort((a,b) => this.countType(b) - this.countType(a))[0];
      this.grid.forEach(row => row.forEach(g => { if (g && g.type === maxType) toDestroy.push(g); }));
    } else if (skillName === '仁德') {
      // 将所有绿色棋子变为炸弹棋子
      this.grid.forEach(row => row.forEach(g => {
        if (g && g.type === GEM_TYPES.GREEN) {
          g.sprite.destroy();
          this.createGem(g.y, g.x, g.type, 'bomb');
        }
      }));
      this.isProcessing = false;
      return;
    } else if (skillName === '隐忍待发') {
      // 将所有蓝色棋子转化为强化棋子
      this.grid.forEach(row => row.forEach(g => {
        if (g && g.type === GEM_TYPES.BLUE) {
          g.sprite.destroy();
          this.createGem(g.y, g.x, g.type, 'enhance');
        }
      }));
      this.isProcessing = false;
      return;
    } else if (skillName === '奇谋妙算') {
      // 随机将10个紫色棋子变为炸弹棋子
      const purples: GemData[] = [];
      this.grid.forEach(row => row.forEach(g => { if (g && g.type === GEM_TYPES.PURPLE) purples.push(g); }));
      Phaser.Math.RND.shuffle(purples);
      const selected = purples.slice(0, 10);
      selected.forEach(g => {
        g.sprite.destroy();
        this.createGem(g.y, g.x, g.type, 'bomb');
      });
      // 增加10点能量
      this.skillEnergy = Math.min(GAME_CONSTANTS.ENERGY_CAP, this.skillEnergy + 10);
      EventBus.emit('gems-matched', { 
        typeCount: {}, 
        combo: 0, 
        energyGained: 10, 
        currentEnergy: this.skillEnergy 
      });
      this.isProcessing = false;
      return;
    } else if (skillName === '琴音绕梁') {
      // 将所有绿色棋子转化为黄色棋子
      this.grid.forEach(row => row.forEach(g => {
        if (g && g.type === GEM_TYPES.GREEN) {
          g.sprite.destroy();
          this.createGem(g.y, g.x, GEM_TYPES.YELLOW, 'none');
        }
      }));
      this.isProcessing = false;
      return;
    } else if (skillName === '倾国倾城') {
      // 随机将8个紫色棋子变为黄色棋子
      const purples: GemData[] = [];
      this.grid.forEach(row => row.forEach(g => { if (g && g.type === GEM_TYPES.PURPLE) purples.push(g); }));
      Phaser.Math.RND.shuffle(purples);
      const selected = purples.slice(0, 8);
      selected.forEach(g => {
        g.sprite.destroy();
        this.createGem(g.y, g.x, GEM_TYPES.YELLOW, 'none');
      });
      // 触发消除检测
      this.time.delayedCall(100, () => {
        const { matches, specialGems } = this.findMatches();
        if (matches.length > 0) {
          this.combo = 0;
          this.processMatches({ matches, specialGems });
        } else {
          this.isProcessing = false;
        }
      });
      return;
    } else if (skillName === '太平要术') {
      // 将棋盘上所有黄色棋子变为强化棋子，并获得2层「黄天之力」
      const yellows: GemData[] = [];
      this.grid.forEach(row => row.forEach(g => {
        if (g && g.type === GEM_TYPES.YELLOW) {
          yellows.push(g);
        }
      }));
      
      if (yellows.length > 0) {
        // 先添加视觉反馈（缩放动画）
        yellows.forEach(g => {
          this.tweens.add({
            targets: g.sprite,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 150,
            yoyo: true,
            onComplete: () => {
              // 动画完成后转换为强化棋子
              g.sprite.destroy();
              this.createGem(g.y, g.x, g.type, 'enhance');
            }
          });
        });
        
        // 延迟触发强化效果爆炸
        this.time.delayedCall(200, () => {
          yellows.forEach(g => {
            const enhanced = this.grid[g.y][g.x];
            if (enhanced && enhanced.special === 'enhance') {
              this.tweens.add({
                targets: enhanced.sprite,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                  enhanced.sprite.setScale(1);
                  enhanced.sprite.setAlpha(1);
                }
              });
            }
          });
          // 立即触发强化效果
          this.time.delayedCall(100, () => {
            const allGems: GemData[] = [];
            this.grid.forEach(row => row.forEach(g => { if (g) allGems.push(g); }));
            allGems.forEach(g => {
              if (g.special === 'enhance') {
                this.processSpecialGem(g);
              }
            });
            this.time.delayedCall(300, () => {
              this.isProcessing = false;
            });
          });
        });
      } else {
        this.isProcessing = false;
      }
      return;
    } else if (skillName === '地公将军') {
      // 消除棋盘上所有绿色棋子，并对敌人造成相当于消除数量×3的伤害
      const greens: GemData[] = [];
      this.grid.forEach(row => row.forEach(g => { if (g && g.type === GEM_TYPES.GREEN) greens.push(g); }));
      const greenCount = greens.length;
      // 实际消除绿色棋子
      greens.forEach(g => {
        g.sprite.destroy();
        this.grid[g.y][g.x] = null;
      });
      // 触发绿色棋子的消除效果
      if (greenCount > 0) {
        const typeCount: Record<number, number> = {};
        typeCount[GEM_TYPES.GREEN] = greenCount;
        EventBus.emit('gems-matched', { typeCount, combo: 1 });
      }
      // 填充新棋子
      this.time.delayedCall(100, () => {
        this.applyGravity([]);
        this.isProcessing = false;
      });
      return;
    } else if (skillName === '魔·地公将军') {
          // 当生命值低于40%时，每回合有50%概率释放，对玩家造成150点伤害并随机消除玩家5点能量
          EventBus.emit('enemy-attack', { damage: 150, energyLoss: 5 });
          this.isProcessing = false;
          return;
      } else if (skillName === '魔·妖术') {
          // 每3回合释放，将棋盘上3个随机棋子变为黑色棋子（无法消除，持续1回合）
          const gems: GemData[] = [];
          this.grid.forEach(row => row.forEach(g => { if (g) gems.push(g); }));
          Phaser.Math.RND.shuffle(gems);
          const selected = gems.slice(0, 3);
          // 保存原始状态
          const originalStates = selected.map(g => ({
            gem: g,
            alpha: g.sprite.alpha,
            interactive: g.sprite.input.enabled
          }));
          // 将棋子标暗并禁用交互
          selected.forEach(g => {
            g.sprite.setAlpha(0.3); // 标暗
            g.sprite.input.enabled = false; // 禁用交互
          });
          // 标记这些棋子为被妖术影响
          selected.forEach(g => {
            (g as any).isCursed = true;
          });
          // 不自动解除，等到玩家移动棋子或回合结束时解除
          // 注意：在玩家移动棋子的逻辑中需要检查并解除这些棋子的状态
          this.isProcessing = false;
          return;
      } else if (skillName === '魔·天公将军') {
          // 当生命值低于50%时，每2回合释放，对玩家造成200点伤害并使玩家下回合消除棋子获得的能量减少50%
          EventBus.emit('enemy-attack', { damage: 200, energyReduction: 50 });
          this.isProcessing = false;
          return;
      } else if (skillName === '魔·黄天当立') {
          // 当生命值低于20%时，每回合释放，回复自身10%最大生命值并对玩家造成150点伤害
          EventBus.emit('enemy-heal', { percentage: 10 });
          EventBus.emit('enemy-attack', { damage: 150 });
          this.isProcessing = false;
          return;
      }

    if (toDestroy.length > 0) {
      this.combo = 0;
      this.processMatches({ matches: toDestroy, specialGems: [] });
    } else {
      this.isProcessing = false;
    }
  }

  private countType(type: number) {
    let count = 0;
    this.grid.forEach(row => row.forEach(g => { if (g && g.type === type) count++; }));
    return count;
  }
}
