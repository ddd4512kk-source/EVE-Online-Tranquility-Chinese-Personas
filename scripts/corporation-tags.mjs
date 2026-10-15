// 旧军团标签只用于识别错误，不能继续用于人物标签。
export const legacyCorporationTags = new Set([
  "PLA", "混沌仲裁", "混沌", "凌晨四点玩原神", "吃瓜", "凤凰城", "女娲",
  "F1 Monkey", "KZU", "TCF", "AKINA mountain family", "采星", "Dusk dreadnought",
  "创世", "Arknights.", "彩虹小马", "菜鸟事务所", "图万·奥斯神殿", "伏羲",
  "FRT Holding", "闪电", "太极", "行星之光", "雪月城", "叶落星海", "Navigators' Union",
]);

// 联盟俗称不再用作标签，统一改用当前联盟 ticker。
export const legacyAllianceTags = new Set([
  "蜜蜂", "Goons", "DC", "INIT", "蓝章鱼", "北极星", "Snuffed Out", "The Black Shores", "Insidious.",
]);

export function currentCorporation(character) {
  const affiliation = character.affiliation;
  return affiliation && !affiliation.left_at && !character.current_corporation?.npc &&
    affiliation.corporation.id === character.current_corporation?.id
    ? affiliation.corporation : null;
}

export function validateCorporationTags(tags, character, corporations) {
  const errors = [];
  const current = currentCorporation(character);
  const tickers = new Set(corporations.map((corp) => corp.ticker).filter(Boolean));
  const names = new Set(corporations.map((corp) => corp.name).filter(Boolean));
  const allianceTicker = current ? character.affiliation.alliance?.ticker : null;
  for (const tag of tags) {
    if (legacyAllianceTags.has(tag)) {
      errors.push(`联盟标签 "${tag}" 必须改用当前联盟的游戏内 ticker（${allianceTicker ?? "无当前联盟"}）`);
    } else if (legacyCorporationTags.has(tag) || (names.has(tag) && !tickers.has(tag))) {
      errors.push(`军团标签 "${tag}" 必须改用当前军团的游戏内 ticker（${current?.ticker ?? "无当前玩家军团"}）`);
    } else if (tickers.has(tag) && tag !== current?.ticker) {
      // 军团与联盟可能恰好同缩写，当前联盟标签仍可保留。
      if (tag !== allianceTicker) errors.push(`军团标签 "${tag}" 不属于快照里的当前军团`);
    }
  }
  if (current && character.affiliation.alliance) {
    if (!current.ticker) errors.push("当前有联盟，但军团快照缺少 ticker，请刷新角色数据");
    else if (!tags.includes(current.ticker)) errors.push(`当前有联盟，必须添加军团标签 "${current.ticker}"`);
    if (allianceTicker && !tags.includes(allianceTicker)) errors.push(`当前有联盟，必须添加联盟标签 "${allianceTicker}"`);
  }
  return errors;
}
