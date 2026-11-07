// 战役标签只保留四个维度；联盟从本场历史参战记录生成，不受阵营展示门槛影响。
export const BATTLE_TYPES = ['超旗战', '旗舰战', '常规战'];
export const BATTLE_SPACES = ['00区', '低安', '高安', '虫洞', '三神裔'];
export const BATTLE_TAG_GROUPS = [
  { name: '规模', labels: ['史诗', '大型', '中型'] },
  { name: '战斗类型', labels: BATTLE_TYPES },
  { name: '地带', labels: BATTLE_SPACES },
  { name: '参战联盟', labels: null },
];

const FIXED_TAGS = BATTLE_TAG_GROUPS.flatMap(group => group.labels ?? []);
export const isAllianceLabel = tag => !FIXED_TAGS.includes(tag);

export function checkBattleTaxonomy(tags) {
  if (!Array.isArray(tags)) return ['tags 必须填写一个地带和一个战斗类型'];
  const errors = [];
  for (const [name, allowed] of [['地带', BATTLE_SPACES], ['战斗类型', BATTLE_TYPES]]) {
    if (tags.filter(tag => allowed.includes(tag)).length !== 1) errors.push(`tags 必须恰好包含一个${name}：${allowed.join('、')}`);
  }
  for (const tag of tags) {
    if (![...BATTLE_TYPES, ...BATTLE_SPACES].includes(tag)) errors.push(`标签「${tag}」不在战役分类中；参战联盟与规模由档案自动生成`);
  }
  return errors;
}

// 联盟标签只给本方占比达标的联盟，配角、增援与零星参战不上标签。
export const ALLIANCE_TAG_SHARE = 0.3;

export function battleAllianceIds(stats, table) {
  return [...new Set(stats.sides.flatMap(side => side.alliance_participation
    ? side.alliance_participation.filter(alliance => alliance.pilots >= (side.pilots || Infinity) * ALLIANCE_TAG_SHARE).map(alliance => alliance.id)
    : [...(side.organizations ?? []).filter(id => table.alliances[id]), ...(side.corps ?? []).map(corp => corp.alliance_id).filter(id => id > 0)]))];
}

export function battleLabels(data, stats, table, tier) {
  const alliances = battleAllianceIds(stats, table).map(id => table.alliances[id]?.ticker || `联盟 #${id}`);
  return [...new Set([tier?.name, ...BATTLE_TYPES.filter(tag => data.tags?.includes(tag)), ...BATTLE_SPACES.filter(tag => data.tags?.includes(tag)), ...alliances].filter(Boolean))];
}

// 目录筛选只列出至少两场战役参战的联盟，单场联盟仍保留在战役自身标签里。
const MIN_ALLIANCE_FILTER_COUNT = 2;

export function groupBattleTags(battles) {
  const counts = new Map();
  for (const battle of battles) {
    for (const tag of new Set(battle.data.labels ?? [])) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return BATTLE_TAG_GROUPS.map(group => ({
    name: group.name,
    tags: (group.labels ?? [...counts.keys()].filter(isAllianceLabel).sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b, 'zh')))
      .filter(tag => group.labels ? counts.has(tag) : counts.get(tag) >= MIN_ALLIANCE_FILTER_COUNT).map(name => ({ name, count: counts.get(name) })),
  })).filter(group => group.tags.length);
}
