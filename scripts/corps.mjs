// 军团档案校验、视觉流派与三维评级定义：同名 JSON 字段合法，正文按军团志模板。校验函数不读盘，CLI 在 check-corps.mjs。
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ZONE_KEYS = ['high', 'low', 'null', 'wh', 'pochven'];
const https = value => /^https:\/\//.test(value ?? '');

export const CORP_STYLES = ['tycoon', 'warlord', 'syndicate', 'neon', 'dynasty', 'phantom', 'forge', 'abyss', 'academy', 'corsair', 'nebula'];

export const CORP_RATING_DIMENSIONS = [
  { key: 'pvp', label: '武德', hint: '前线交火与 PVP 活跃度' },
  { key: 'shenren', label: '含神量', hint: '现役神人与出格黑料浓度' },
  { key: 'influence', label: '声望', hint: '社区贡献与江湖影响力' },
];

const isScore = value => Number.isInteger(value) && value >= 0 && value <= 100;

export function validateCorpArchive(archive, slug) {
  const errors = [];
  const fail = message => errors.push(`${slug}：${message}`);
  const { corp, esi, zkb, recruitment, pilots } = archive ?? {};
  if (!Number.isInteger(corp?.id)) fail('corp.id 必须是军团 ID');
  if (!corp?.cn_name) fail('缺 corp.cn_name');
  if (!corp?.epithet) fail('缺 corp.epithet');
  else if (/[！!]/.test(corp.epithet)) fail('corp.epithet 不用感叹号');
  if (!CORP_STYLES.includes(corp?.style)) fail(`corp.style 只能是 ${CORP_STYLES.join('、')}`);
  for (const { key } of CORP_RATING_DIMENSIONS) {
    if (!isScore(corp?.ratings?.[key])) fail(`corp.ratings.${key} 必须是 0–100 的整数`);
  }
  if (corp?.zones?.some(zone => !ZONE_KEYS.includes(zone))) fail(`corp.zones 只能是 ${ZONE_KEYS.join('、')}`);
  if (!esi?.name || !esi?.ticker) fail('缺 ESI 快照，先运行 corp-snapshot');
  if (!DATE.test(esi?.as_of ?? '')) fail('esi.as_of 必须是 YYYY-MM-DD');
  if (!DATE.test(zkb?.as_of ?? '')) fail('zkb.as_of 必须是 YYYY-MM-DD');
  if (!/^(\d{4}-\d{2})?$/.test(zkb?.last_active ?? 'x')) fail('zkb.last_active 必须是 YYYY-MM 或空');
  if (recruitment) {
    if (!DATE.test(recruitment.last_seen ?? '')) fail('recruitment.last_seen 必须是 YYYY-MM-DD');
    if (!https(recruitment.source)) fail('recruitment.source 必须是 https 链接');
    if (recruitment.qq !== undefined && !/^[1-9]\d{5,10}$/.test(recruitment.qq)) fail('recruitment.qq 必须是群号字符串');
  }
  if (pilots && (!Number.isInteger(pilots.year) || !Number.isInteger(pilots.peak))) fail('pilots 只由 corps:pilots 写入');
  return errors;
}

export function validateCorpBody(raw, slug) {
  const errors = [];
  if (/^:::\s*(?:红料|黑料|评)/m.test(raw)) errors.push(`${slug}：军团志不用列传的料块和朱批，见 docs/corp-template.md`);
  if (!raw.trim()) errors.push(`${slug}：正文不能为空`);
  return errors;
}
