const CAMP_COLORS: Record<string, { start: string; end: string; accent: string }> = {
  魏: { start: "#2563eb", end: "#1e3a8a", accent: "#93c5fd" },
  蜀: { start: "#16a34a", end: "#14532d", accent: "#86efac" },
  吴: { start: "#dc2626", end: "#7f1d1d", accent: "#fca5a5" },
  群雄: { start: "#9333ea", end: "#581c87", accent: "#d8b4fe" },
};

const DEFAULT_COLOR = { start: "#64748b", end: "#1e293b", accent: "#e2e8f0" };

const CHARACTER_MARKS: Record<string, string> = {
  caocao: "魏",
  liubei: "仁",
  sunquan: "吴",
  dongzhuo: "霸",
  zhangfei: "猛",
  zhaoyun: "龙",
  zhouyu: "焰",
  zhugeliang: "智",
  lvbu: "战",
  liubei_g: "德",
};

export function getPortraitDataUri(id: string, name: string, camp: string): string {
  const color = CAMP_COLORS[camp] ?? DEFAULT_COLOR;
  const mark = CHARACTER_MARKS[id] ?? name[0] ?? "将";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color.start}" />
      <stop offset="100%" stop-color="${color.end}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="256" height="256" rx="32" fill="url(#bg)" />
  <circle cx="128" cy="96" r="46" fill="rgba(255,255,255,0.16)" />
  <path d="M46 226c14-50 48-78 82-78 35 0 69 28 82 78" fill="rgba(255,255,255,0.16)" />
  <circle cx="128" cy="128" r="112" fill="none" stroke="${color.accent}" stroke-width="8" opacity="0.9" />
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle"
        fill="#fff7d1" font-size="78" font-weight="700" font-family="serif">${mark}</text>
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle"
        fill="rgba(255,255,255,0.92)" font-size="26" font-weight="600" font-family="sans-serif">${name}</text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

