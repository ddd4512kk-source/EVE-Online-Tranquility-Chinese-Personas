// 六维是有出处的编辑阶位评定（EX/S/A/B/C/D/E，基准常人为 D），不由击杀额或职务自动换算。
export const RADAR_TIERS = ['EX', 'S', 'A', 'B', 'C', 'D', 'E'];

export const RADAR_AXES = [
  { key: 'shenren', label: '神力', fullLabel: '神力' },
  { key: 'combat', label: '战力', fullLabel: '战斗力' },
  { key: 'command', label: '统御', fullLabel: '统御力' },
  { key: 'charisma', label: '魅力', fullLabel: '魅力' },
  { key: 'politics', label: '政治', fullLabel: '政治力' },
  { key: 'wealth', label: '财力', fullLabel: '财力' },
];

const TIER_SCALE = {
  EX: 1.0,
  S: 0.85,
  A: 0.70,
  B: 0.55,
  C: 0.40,
  D: 0.25,
  E: 0.12,
};

const CENTER_X = 115;
const CENTER_Y = 102;
const RADIUS = 56;

const point = (index, ratio) => {
  const angle = (index * 60 - 90) * Math.PI / 180;
  return {
    x: +(CENTER_X + Math.cos(angle) * RADIUS * ratio).toFixed(1),
    y: +(CENTER_Y + Math.sin(angle) * RADIUS * ratio).toFixed(1),
  };
};

const LABEL_COORDS = [
  { x: 115, y: 20, anchor: 'middle' },   // 0: 神力 (Top)
  { x: 170, y: 74, anchor: 'start' },    // 1: 战力 (Top-Right)
  { x: 170, y: 136, anchor: 'start' },   // 2: 统御 (Bottom-Right)
  { x: 115, y: 192, anchor: 'middle' },  // 3: 魅力 (Bottom)
  { x: 60, y: 136, anchor: 'end' },      // 4: 政治 (Bottom-Left)
  { x: 60, y: 74, anchor: 'end' },       // 5: 财力 (Top-Left)
];

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;

export function validatePersonRadar(radar) {
  if (radar === undefined) return [];
  if (!object(radar)) return ['radar 必须是对象；未评人物请省略此字段'];
  const errors = [];
  for (const key of Object.keys(radar)) {
    if (!['version', 'reviewedAt', 'verdict', 'axes'].includes(key)) errors.push(`radar 未知字段 ${key}`);
  }
  if (radar.version !== 1) errors.push('radar.version 必须为 1');
  if (!text(radar.verdict) || radar.verdict.length > 60) errors.push('radar.verdict 必须为 1–60 字的史官评语');
  if (typeof radar.reviewedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(radar.reviewedAt) || !Number.isFinite(Date.parse(radar.reviewedAt)) || new Date(radar.reviewedAt).toISOString().replace('.000Z', 'Z') !== radar.reviewedAt) {
    errors.push('radar.reviewedAt 必须是有效的 UTC 时间戳（精确到秒，Z 结尾）');
  }
  if (!object(radar.axes)) return [...errors, 'radar.axes 必须明确填写六维'];
  for (const key of Object.keys(radar.axes)) {
    if (!RADAR_AXES.some(axis => axis.key === key)) errors.push(`radar.axes 未知维度 ${key}`);
  }
  for (const { key } of RADAR_AXES) {
    const axis = radar.axes[key];
    if (!object(axis)) {
      errors.push(`radar.axes.${key} 缺失；待考也须填写 tier: null 与原因`);
      continue;
    }
    for (const field of Object.keys(axis)) {
      if (!['tier', 'score', 'reason', 'sources'].includes(field)) errors.push(`radar.axes.${key} 未知字段 ${field}`);
    }
    const tier = 'tier' in axis ? axis.tier : axis.score;
    if (tier !== null && (typeof tier !== 'string' || !RADAR_TIERS.includes(tier))) {
      errors.push(`radar.axes.${key}.tier 只能是 EX/S/A/B/C/D/E 或 null`);
    }
    if (!text(axis.reason) || axis.reason.length > 240) errors.push(`radar.axes.${key}.reason 必须为 1–240 字的具体理由`);
    if (!Array.isArray(axis.sources) || (tier !== null && !axis.sources.length)) {
      errors.push(`radar.axes.${key}.sources 必须为列表；已评维度至少附一个公开出处`);
      continue;
    }
    for (const source of axis.sources) {
      let validUrl = false;
      try {
        const url = new URL(source?.url);
        validUrl = url.protocol === 'https:' && !url.username && !url.password;
      } catch { /* 统一附带位置返回 */ }
      if (!object(source) || !text(source.label) || !validUrl || Object.keys(source).some(field => !['label', 'url'].includes(field))) {
        errors.push(`radar.axes.${key}.sources 只接受含 label 与公开 HTTPS url 的对象`);
      }
    }
  }
  return errors;
}

export function personRadar(radar) {
  if (radar === undefined) return null;
  const errors = validatePersonRadar(radar);
  if (errors.length) throw new Error(errors.join('\n'));
  const axes = RADAR_AXES.map((axis, index) => {
    const rating = radar.axes[axis.key];
    const tier = 'tier' in rating ? rating.tier : rating.score;
    const known = tier !== null;
    const ratio = known ? TIER_SCALE[tier] : null;
    return {
      ...axis,
      ...rating,
      tier,
      known,
      tierLabel: known ? tier : '待考',
      scoreLabel: known ? tier : '待考',
      tierClass: known ? `tier-${tier.toLowerCase()}` : 'tier-unknown',
      point: ratio !== null ? point(index, ratio) : null,
      spokeEnd: point(index, 1.0),
      labelCoord: LABEL_COORDS[index],
    };
  });
  const complete = axes.every(axis => axis.known);
  const rings = [0.25, 0.70, 1.0].map(ratio =>
    [0, 1, 2, 3, 4, 5].map(i => {
      const p = point(i, ratio);
      return `${p.x},${p.y}`;
    }).join(' ')
  );
  return {
    ...radar,
    axes,
    complete,
    rings,
    polygon: complete ? axes.map(a => `${a.point.x},${a.point.y}`).join(' ') : null,
    reviewedDate: radar.reviewedAt.slice(0, 10),
    // 目录排序用：EX=7 … E=1，待考=0
    ranks: Object.fromEntries(axes.map(a => [a.key, a.known ? RADAR_TIERS.length - RADAR_TIERS.indexOf(a.tier) : 0])),
  };
}
