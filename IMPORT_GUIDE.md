---
layout: none
---
# 游戏美术资源导入完整指南

## 📁 一、文件夹结构

推荐在 `src/assets/` 下创建以下结构：

```
src/assets/
├── images/
│   ├── ui/              # UI 元素（按钮、图标、边框等）
│   ├── characters/      # 角色立绘、头像（建议命名：caocao.png, liubei.png）
│   ├── buildings/       # 建筑图片（hall.png, barracks.png 等）
│   ├── backgrounds/     # 背景图（city_bg.jpg, battle_bg.jpg）
│   └── gems/           # 棋子纹理（red.png, green.png, blue.png 等）
├── audio/
│   ├── bgm/            # 背景音乐（menu.mp3, battle.mp3）
│   └── sfx/            # 音效（click.mp3, eliminate.mp3, skill.mp3）
└── catalog.json
```

---

## 🖼️ 二、React 组件中使用图片

### 方法 1：静态导入（适合少量固定资源）

{% raw %}
```tsx
// 在文件顶部导入
import caocaoAvatar from '@/assets/images/characters/caocao.png';
import cityBg from '@/assets/images/backgrounds/city_bg.jpg';

// 在 JSX 中使用
<img src={caocaoAvatar} alt="曹操" className="w-16 h-16 rounded-full" />

// 作为背景
<div 
  className="w-full h-full bg-cover bg-center" 
  style={{ backgroundImage: `url(${cityBg})` }}
/>
```
{% endraw %}

### 方法 2：动态路径（适合批量资源）

```tsx
// 直接使用路径字符串
<img src="/src/assets/images/characters/caocao.png" alt="曹操" />

// 或者使用变量拼接
const getCharacterImage = (id: string) => `/src/assets/images/characters/${id}.png`;
<img src={getCharacterImage('caocao')} alt="曹操" />
```

### 方法 3：批量导入（适合大量同类资源）

```tsx
// 使用 Vite 的 import.meta.glob
const characterImages = import.meta.glob('@/assets/images/characters/*.png', { 
  eager: true,
  import: 'default'
});

// 使用示例
const avatarUrl = characterImages['./caocao.png'];
<img src={avatarUrl} alt="曹操" />
```

---

## 🎮 三、Phaser 游戏引擎中加载图片

### 在 Boot 场景中预加载资源

修改 `src/game/scenes/Boot.ts`：

```typescript
preload() {
  // === 1. 加载角色头像 ===
  this.load.image('caocao_avatar', '/src/assets/images/characters/caocao.png');
  this.load.image('liubei_avatar', '/src/assets/images/characters/liubei.png');
  this.load.image('sunquan_avatar', '/src/assets/images/characters/sunquan.png');
  
  // === 2. 加载棋子纹理（替换程序生成的） ===
  this.load.image('gem_red', '/src/assets/images/gems/red.png');
  this.load.image('gem_green', '/src/assets/images/gems/green.png');
  this.load.image('gem_yellow', '/src/assets/images/gems/yellow.png');
  this.load.image('gem_blue', '/src/assets/images/gems/blue.png');
  this.load.image('gem_purple', '/src/assets/images/gems/purple.png');
  this.load.image('gem_orange', '/src/assets/images/gems/orange.png');
  
  // === 3. 加载特殊棋子 ===
  this.load.image('gem_red_enhance', '/src/assets/images/gems/red_enhance.png');
  this.load.image('gem_red_bomb', '/src/assets/images/gems/red_bomb.png');
  
  // === 4. 加载背景 ===
  this.load.image('battle_bg', '/src/assets/images/backgrounds/battle_bg.jpg');
  
  // === 5. 加载精灵图集（用于动画） ===
  this.load.atlas(
    'effects',
    '/src/assets/images/effects/atlas.png',
    '/src/assets/images/effects/atlas.json'
  );
  
  // === 6. 显示加载进度 ===
  this.load.on('progress', (value: number) => {
    console.log('资源加载中:', Math.floor(value * 100) + '%');
  });
  
  this.load.on('complete', () => {
    console.log('所有资源加载完成！');
  });
}

create() {
  // 如果加载了真实的棋子图片，就不需要再用 graphics 生成了
  // 直接启动主游戏场景
  this.scene.start('MainGame');
}
```

### 在游戏场景中使用加载的图片

修改 `src/game/scenes/MainGame.ts` 的 `createGem` 方法：

```typescript
private createGem(r: number, c: number, type: number, special: 'none' | 'enhance' | 'bomb' | 'cross') {
  const px = OFFSET_X + c * TILE_SIZE + TILE_SIZE / 2;
  const py = OFFSET_Y + r * TILE_SIZE;
  
  // 使用预加载的真实图片
  let key = GEM_KEYS[type]; // 例如 'gem_red'
  if (special !== 'none') key += '_' + special; // 例如 'gem_red_enhance'

  const sprite = this.add.sprite(px, py, key);
  sprite.setDisplaySize(TILE_SIZE, TILE_SIZE); // 调整显示大小
  sprite.setInteractive();
  
  this.grid[r][c] = { x: c, y: r, type, sprite, special };
}
```

---

## 🎵 四、音频资源加载

### 在 Boot 场景中加载音频

```typescript
preload() {
  // 背景音乐
  this.load.audio('bgm_menu', '/src/assets/audio/bgm/menu.mp3');
  this.load.audio('bgm_battle', '/src/assets/audio/bgm/battle.mp3');
  
  // 音效
  this.load.audio('sfx_click', '/src/assets/audio/sfx/click.mp3');
  this.load.audio('sfx_eliminate', '/src/assets/audio/sfx/eliminate.mp3');
  this.load.audio('sfx_skill', '/src/assets/audio/sfx/skill.mp3');
}
```

### 播放音频

```typescript
// 在 MainGame 场景的 create 方法中
create() {
  // 播放背景音乐（循环）
  this.sound.play('bgm_battle', { loop: true, volume: 0.5 });
  
  // 播放音效（一次性）
  this.input.on('pointerdown', () => {
    this.sound.play('sfx_click');
  });
}
```

---

## 📝 五、实际操作步骤

### 步骤 1：准备图片资源

确保你的图片符合以下规范：
- **格式**：PNG（带透明通道）或 JPG（背景图）
- **尺寸**：
  - 棋子：64x64 或 128x128 像素
  - 角色头像：256x256 或 512x512 像素
  - 背景：1920x1080 或更高
- **命名**：使用英文小写 + 下划线，例如 `caocao_avatar.png`

### 步骤 2：创建文件夹

在项目根目录执行：

```bash
mkdir -p src/assets/images/ui
mkdir -p src/assets/images/characters
mkdir -p src/assets/images/buildings
mkdir -p src/assets/images/backgrounds
mkdir -p src/assets/images/gems
mkdir -p src/assets/audio/bgm
mkdir -p src/assets/audio/sfx
```

### 步骤 3：复制图片到对应文件夹

将你的图片文件复制到刚创建的文件夹中。

### 步骤 4：更新代码引用

根据上面的示例代码，在对应的文件中添加图片加载和使用代码。

---

## 🔧 六、常见问题

### Q1: 图片显示不出来？
**A:** 检查以下几点：
1. 路径是否正确（注意大小写）
2. 图片文件是否真的存在
3. Phaser 中是否在 `preload()` 中加载了
4. 浏览器控制台是否有 404 错误

### Q2: 图片尺寸不对？
**A:** 使用 Phaser 的 `setDisplaySize()` 或 `setScale()` 调整：
```typescript
sprite.setDisplaySize(60, 60); // 设置显示尺寸为 60x60
// 或
sprite.setScale(0.5); // 缩放到原尺寸的 50%
```

### Q3: 如何优化加载速度？
**A:** 
1. 压缩图片（使用 TinyPNG 等工具）
2. 使用精灵图集（Sprite Atlas）合并小图
3. 懒加载非关键资源
4. 使用 WebP 格式（体积更小）

### Q4: 如何制作精灵图集？
**A:** 使用工具如：
- **TexturePacker**（推荐，支持 Phaser 格式导出）
- **Shoebox**（免费）
- **Free Texture Packer**（开源）

导出为 `.png` + `.json` 格式，然后用 `this.load.atlas()` 加载。

---

## 🎨 七、推荐的美术资源网站

### 免费资源
- **OpenGameArt.org** - 开源游戏素材
- **itch.io** - 独立游戏素材市场
- **Kenney.nl** - 高质量免费游戏素材包

### 付费资源
- **Unity Asset Store** - 可用于其他引擎
- **GameDevMarket** - 专业游戏素材
- **Envato Elements** - 订阅制素材库

---

## ✅ 八、快速测试

创建一个测试文件验证图片是否正确加载：

```tsx
// src/pages/TestAssets.tsx
import React from 'react';

export default function TestAssets() {
  const testImages = [
    '/src/assets/images/characters/caocao.png',
    '/src/assets/images/gems/red.png',
    '/src/assets/images/backgrounds/city_bg.jpg',
  ];

  return (
    <div className="p-4 bg-slate-900 min-h-screen">
      <h1 className="text-2xl text-white mb-4">资源加载测试</h1>
      <div className="grid grid-cols-3 gap-4">
        {testImages.map((src, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded">
            <img 
              src={src} 
              alt={`测试图片 ${i + 1}`}
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.style.border = '2px solid red';
                console.error('图片加载失败:', src);
              }}
              onLoad={() => console.log('图片加载成功:', src)}
            />
            <p className="text-xs text-slate-400 mt-2 break-all">{src}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

在 `App.tsx` 中添加路由：
```tsx
<Route path="/test-assets" element={<TestAssets />} />
```

然后访问 `/test-assets` 查看图片是否正确显示。

---

## 📞 需要帮助？

如果你在导入资源时遇到问题，可以：
1. 检查浏览器控制台的错误信息
2. 确认文件路径和文件名是否完全匹配
3. 尝试使用绝对路径 `/src/assets/...` 而不是相对路径

祝你游戏开发顺利！🎮
