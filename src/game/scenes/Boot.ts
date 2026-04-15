import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const baseGemMap = [
      { key: 'raw_gem_red', file: '/images/gems/red.png' },
      { key: 'raw_gem_green', file: '/images/gems/green.png' },
      { key: 'raw_gem_yellow', file: '/images/gems/yellow.png' },
      { key: 'raw_gem_blue', file: '/images/gems/blue.png' },
      { key: 'raw_gem_purple', file: '/images/gems/purple.png' },
      { key: 'raw_gem_orange', file: '/images/gems/orange.png' },
      { key: 'board_background', file: '/images/board/board_background.png' },
    ];

    baseGemMap.forEach(({ key, file }) => {
      this.load.image(key, file);
    });
  }

  private createBaseGemTexture(rawKey: string, outputKey: string, fallbackColorHex: string) {
    const canvasTex = this.textures.createCanvas(outputKey, 60, 60);
    const ctx = canvasTex.getContext();
    const cx = 30;
    const cy = 30;
    const r = 26;

    const grad = ctx.createRadialGradient(cx - 8, cy - 8, 8, cx, cy, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, fallbackColorHex);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    if (this.textures.exists(rawKey)) {
      const source = this.textures.get(rawKey).getSourceImage() as CanvasImageSource & { width: number; height: number };
      const sw = source.width || 60;
      const sh = source.height || 60;
      const target = 46;
      const scale = Math.max(target / sw, target / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = cx - dw / 2;
      const dy = cy - dh / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(source, dx, dy, dw, dh);
      ctx.restore();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(15,23,42,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 22.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.arc(22, 21, 7, 0, Math.PI * 2);
    ctx.fill();

    canvasTex.refresh();
  }

  private createSpecialGemTexture(baseKey: string, suffix: 'enhance' | 'bomb' | 'cross') {
    const key = `${baseKey}_${suffix}`;
    const tex = this.textures.createCanvas(key, 60, 60);
    const ctx = tex.getContext();
    const base = this.textures.get(baseKey).getSourceImage() as CanvasImageSource;
    ctx.drawImage(base, 0, 0, 60, 60);

    ctx.save();
    ctx.translate(30, 30);

    if (suffix === 'enhance') {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    if (suffix === 'bomb') {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(15,23,42,0.86)';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, -24);
      ctx.stroke();
    }
    if (suffix === 'cross') {
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fillRect(-3, -18, 6, 36);
      ctx.fillRect(-18, -3, 36, 6);
    }
    ctx.restore();
    tex.refresh();
  }

  create() {
    this.createBaseGemTexture('raw_gem_red', 'gem_red', '#ef4444');
    this.createBaseGemTexture('raw_gem_green', 'gem_green', '#22c55e');
    this.createBaseGemTexture('raw_gem_yellow', 'gem_yellow', '#eab308');
    this.createBaseGemTexture('raw_gem_blue', 'gem_blue', '#3b82f6');
    this.createBaseGemTexture('raw_gem_purple', 'gem_purple', '#a855f7');
    this.createBaseGemTexture('raw_gem_orange', 'gem_orange', '#f97316');

    const baseKeys = ['gem_red', 'gem_green', 'gem_yellow', 'gem_blue', 'gem_purple', 'gem_orange'];
    baseKeys.forEach((baseKey) => {
      this.createSpecialGemTexture(baseKey, 'enhance');
      this.createSpecialGemTexture(baseKey, 'bomb');
      this.createSpecialGemTexture(baseKey, 'cross');
    });
    this.scene.start('MainGame');
  }
}
