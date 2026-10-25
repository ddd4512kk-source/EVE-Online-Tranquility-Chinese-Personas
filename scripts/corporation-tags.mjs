// 旧军团标签只用于识别错误，不能继续用于人物标签。
export const legacyCorporationTags = new Set([
  'I-BAN', 'PLA', '混沌仲裁', '混沌', '凌晨四点玩原神', '吃瓜', '凤凰城', '女娲',
  'F1 Monkey', 'KZU', 'TCF', 'AKINA mountain family', '采星', 'Dusk dreadnought',
  '创世', 'Arknights.', '彩虹小马', '菜鸟事务所', '图万·奥斯神殿', '伏羲',
  'FRT Holding', '闪电', '太极', '行星之光', '雪月城', '叶落星海', "Navigators' Union",
]);

// 联盟俗称不再用作标签，统一改用当前联盟 ticker。
export const legacyAllianceTags = new Set([
  '蜜蜂', 'Goons', 'DC', 'INIT', '蓝章鱼', '北极星', 'Snuffed Out', 'The Black Shores', 'Insidious.',
]);

// 目录仅保留主要联盟；使用 ID 判断，避免同名或同缩写的军团混入。
export const majorAllianceIds = new Set([
  99003581, // Fraternity.
  99009163, // Dracarys.
  1354830081, // Goonswarm Federation
  1900696668, // The Initiative.
  1727758877, // Northern Coalition.
  99004901, // Snuffed Out
  99009927, // Deepwater Hooligans
  498125261, // Test Alliance Please Ignore
  99005338, // Pandemic Horde
]);

// 已出售角色的当前归属属于买家，不能作为原人物的组织标签。
export const soldCharacterIds = new Set([
  2120656041, // 黑鸦 Scorpio D，2025-12 出售
  2119864581, // 兄贵 Aniki Z，2026-10 随矿队账号出售
]);

export function currentCorporation(character) {
  const affiliation = character.affiliation;
  return affiliation && !affiliation.left_at && !character.current_corporation?.npc &&
    affiliation.corporation.id === character.current_corporation?.id
    ? affiliation.corporation : null;
}

export function validateCorporationTags(tags, character, corporations, alliances = []) {
  const errors = [];
  const current = currentCorporation(character);
  const alliance = current && !soldCharacterIds.has(character.id) ? character.affiliation.alliance : null;
  const major = alliance && majorAllianceIds.has(alliance.id) ? alliance : null;
  const corporationTags = new Set([...corporations, character.affiliation?.corporation].filter(Boolean).flatMap(corp => [corp.ticker, corp.name]).filter(Boolean));
  const allianceTags = new Set([...alliances, character.affiliation?.alliance].filter(Boolean).flatMap(item => [item.ticker, item.name]).filter(Boolean));
  for (const tag of tags) {
    // 军团与主要联盟同缩写时，保留有效的当前联盟标签。
    if (major?.ticker === tag) continue;
    if (legacyCorporationTags.has(tag) || corporationTags.has(tag)) {
      errors.push(`军团标签 "${tag}" 已停用，请删除`);
    } else if (legacyAllianceTags.has(tag) || allianceTags.has(tag) || tag === alliance?.ticker) {
      errors.push(`联盟标签 "${tag}" 不属于此人物当前的主要联盟，请删除`);
    }
  }
  if (major) {
    if (!major.ticker) errors.push('当前主要联盟快照缺少 ticker，请刷新角色数据');
    else if (!tags.includes(major.ticker)) errors.push(`当前属于主要联盟，必须添加联盟标签 "${major.ticker}"`);
  }
  return errors;
}
