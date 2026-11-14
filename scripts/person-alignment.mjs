// 九宫格阵营是独立展示组件：代码与判词存在人物档案 person.alignment，判定规则见 docs/person-alignment.md。
export const ALIGNMENT_LAW = [
  { key: 'L', label: '守序', short: '守' },
  { key: 'N', label: '中立', short: '中' },
  { key: 'C', label: '混乱', short: '混' },
];
export const ALIGNMENT_MORAL = [
  { key: 'G', label: '善良', short: '善' },
  { key: 'N', label: '中立', short: '中' },
  { key: 'E', label: '邪恶', short: '恶' },
];

// 行按善恶、列按守序／混乱排，与首页筛选面板一致。
export const ALIGNMENTS = ALIGNMENT_MORAL.flatMap(moral => ALIGNMENT_LAW.map(law => {
  const code = law.key + moral.key;
  return {
    code,
    law: law.key,
    moral: moral.key,
    label: code === 'NN' ? '绝对中立' : law.label + moral.label,
    short: code === 'NN' ? '绝中' : law.short + moral.short,
  };
}));
const BY_CODE = new Map(ALIGNMENTS.map(item => [item.code, item]));
export const NOTE_LIMIT = 40;

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function validatePersonAlignment(alignment) {
  if (alignment === undefined) return [];
  if (!object(alignment)) return ['alignment 必须是对象；未定阵营请省略此字段'];
  const errors = [];
  for (const key of Object.keys(alignment)) if (!['code', 'note'].includes(key)) errors.push(`alignment 未知字段 ${key}`);
  if (!BY_CODE.has(alignment.code)) errors.push(`alignment.code 必须是 ${ALIGNMENTS.map(item => item.code).join('、')} 之一，现为 ${JSON.stringify(alignment.code)}`);
  if ('note' in alignment) {
    const note = alignment.note;
    if (typeof note !== 'string' || !note.trim()) errors.push('alignment.note 不写就省略，不能为空');
    else if ([...note].length > NOTE_LIMIT) errors.push(`alignment.note 不超过 ${NOTE_LIMIT} 字，现为 ${[...note].length} 字`);
  }
  return errors;
}

// 模板只读展示模型：有阵营给出全称、判词与九格高亮，没有则为 null。
export function personAlignment(alignment) {
  if (!alignment) return null;
  const errors = validatePersonAlignment(alignment);
  if (errors.length) throw new Error(errors.join('；'));
  const current = BY_CODE.get(alignment.code);
  return {
    ...current,
    note: alignment.note ?? '',
    title: `阵营：${current.label}${alignment.note ? `。${alignment.note}` : ''}`,
    cells: ALIGNMENTS.map(item => ({ ...item, on: item.code === current.code })),
  };
}

// 选择值：单格 CE、整列 L*、整行 *E；空值表示不按阵营筛。
export const alignmentSelection = value => typeof value === 'string' && /^([LNC][GNE]|[LNC]\*|\*[GNE])$/.test(value);
export const alignmentMatches = (code, selection) => !selection || (typeof code === 'string' && [0, 1].every(i => selection[i] === '*' || selection[i] === code[i]));

export function selectionLabel(selection) {
  if (!alignmentSelection(selection)) return '';
  if (BY_CODE.has(selection)) return BY_CODE.get(selection).label;
  return selection[0] === '*' ? ALIGNMENT_MORAL.find(m => m.key === selection[1]).label : ALIGNMENT_LAW.find(l => l.key === selection[0]).label;
}

// 首页面板：每格、每行、每列的人数；没人有阵营时 total 为 0，模板据此不输出筛选组。
export function alignmentCounts(codes) {
  const list = codes.filter(code => BY_CODE.has(code));
  const count = selection => list.filter(code => alignmentMatches(code, selection)).length;
  return {
    total: list.length,
    cells: ALIGNMENTS.map(item => ({ ...item, count: count(item.code) })),
    laws: ALIGNMENT_LAW.map(law => ({ ...law, selection: `${law.key}*`, count: count(`${law.key}*`) })),
    morals: ALIGNMENT_MORAL.map(moral => ({ ...moral, selection: `*${moral.key}`, count: count(`*${moral.key}`) })),
  };
}
