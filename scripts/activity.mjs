// 活跃、招新、战神与 UP 主的唯一判定。只比较快照内的日期，同一份数据任何时候构建结果都相同。
// 名人、大亨、神人靠人工判定，名单分别在 src/_data/famousPeople.js、tycoonPeople.js、shenrenPeople.js。
export const PERSON_ACTIVE_MONTHS = 12;
export const ACTIVE_MONTHS = 3;
export const RECRUIT_POST_MONTHS = 36;
export const RECRUIT_MIN_PILOTS = 10;
export const RECRUIT_FRESH_POST_MONTHS = 12;
export const CORP_MIN_MEMBERS = 21;
export const WARGOD_TOTAL_ISK = 10e12;
export const WARGOD_YEARLY_ISK = 1.5e12;
export const WARGOD_MIN_YEARS = 2;
export const UPZHU_MIN_VIDEOS = 10;
export const UPZHU_MIN_VIEWS = 3000;
// 已确认 B 站账号但高播（≥3000 播放）作品中 EVE 视频不足 10 条（含其他游戏、硬件、音乐等综合号）。
export const UPZHU_EXCLUDED_PEOPLE = new Set([
  'acr-impact',
  'bvjnj',
  'genshin-impart',
  'jibing779',
  'kurusugawa-himeko',
  'moon-island',
  'murphy222',
  'ozen-wand',
]);

const monthsBetween = (from, to) => {
  const month = value => Number(value.slice(0, 4)) * 12 + Number(value.slice(5, 7));
  return month(to) - month(from);
};
const latest = values => values.filter(Boolean).sort().at(-1) ?? '';

// 自然人按收录号与全部小号里最晚的记录算；一条快照都没有时不下判断。
// 军团武德（corp.ratings.pvp）：按 zKillboard 最近排名在对数轴上折线换算；没有最近排名记 10。
const PVP_ANCHORS = [[1, 95], [100, 86], [1000, 72], [7000, 55]];
export function pvpFromRank(rank) {
  if (!Number.isFinite(rank) || rank < 1) return 10;
  if (rank <= PVP_ANCHORS[0][0]) return PVP_ANCHORS[0][1];
  for (let i = 1; i < PVP_ANCHORS.length; i += 1) {
    const [r0, v0] = PVP_ANCHORS[i - 1];
    const [r1, v1] = PVP_ANCHORS[i];
    if (rank <= r1) return Math.round(v0 + (v1 - v0) * Math.log(rank / r0) / Math.log(r1 / r0));
  }
  const [rLast, vLast] = PVP_ANCHORS.at(-1);
  return Math.max(10, Math.round(vLast - 10 * Math.log10(rank / rLast)));
}

export function personActivity(identity) {
  const snapshots = [identity?.zkb, ...(identity?.alts ?? []).map(alt => alt.zkb)].filter(Boolean);
  if (!snapshots.length) return { state: 'unknown', lastActive: '', asOf: '' };
  const lastActive = latest(snapshots.map(zkb => zkb.last_active));
  const asOf = latest(snapshots.map(zkb => zkb.as_of));
  const active = lastActive && monthsBetween(lastActive, asOf) <= PERSON_ACTIVE_MONTHS;
  return { state: active ? 'active' : 'dormant', lastActive, asOf };
}

export function activityText({ state, lastActive } = {}) {
  if (state === 'active') return `活跃：最近击杀 ${lastActive}`;
  if (state === 'dormant') return lastActive ? `沉寂：最后击杀 ${lastActive}` : '沉寂：没有击杀记录';
  return '';
}

// 战神：收录号与全部小号的累计参与击杀总价值 ≥ 10 万亿 ISK，或按创号至最后击杀（至少按 2 年计）折算年均 ≥ 1.5 万亿 ISK。
export function personCombat(identity, birthday) {
  const snapshots = [identity?.zkb, ...(identity?.alts ?? []).map(alt => alt.zkb)].filter(Boolean);
  const iskDestroyed = snapshots.reduce((sum, zkb) => sum + (zkb.isk_destroyed ?? 0), 0);
  if (iskDestroyed <= 0) return { wargod: false, iskDestroyed: 0, yearlyIsk: 0 };
  const to = latest(snapshots.map(zkb => zkb.last_active || zkb.as_of));
  const from = String(birthday ?? '').slice(0, 7);
  const months = from && to ? Math.max(0, monthsBetween(from, to)) : 0;
  const years = Math.max(WARGOD_MIN_YEARS, months / 12);
  const yearlyIsk = iskDestroyed / years;
  const wargod = iskDestroyed >= WARGOD_TOTAL_ISK || yearlyIsk >= WARGOD_YEARLY_ISK;
  return { wargod, iskDestroyed, yearlyIsk };
}

export function combatText(combat) {
  if (!combat?.wargod) return '';
  const total = (combat.iskDestroyed / 1e12).toFixed(1);
  const yearly = (combat.yearlyIsk / 1e12).toFixed(1);
  return `战神：参与击杀 ${total} 万亿 ISK（年均 ${yearly} 万亿）`;
}

// UP 主：已确认本人的 B 站账号下，按 BV 去重后播放量 ≥ 3000 的 EVE 视频不少于 10 条。
export function personUpzhu(profiles, slug) {
  if (!slug || UPZHU_EXCLUDED_PEOPLE.has(slug)) return { upzhu: false, count: 0 };
  const views = new Map();
  for (const entry of profiles ?? []) {
    const p = entry?.data ?? entry;
    if (p?.identity?.state !== 'confirmed' || p?.identity?.person !== slug) continue;
    for (const v of p.videos ?? []) {
      if (v?.bvid && (!v.owner_uid || String(v.owner_uid) === String(p.uid))) {
        views.set(v.bvid, Math.max(views.get(v.bvid) ?? 0, v.views ?? 0));
      }
    }
    for (const listing of p.channel?.listings ?? []) {
      for (const c of listing.candidates ?? []) {
        if (c?.bvid) views.set(c.bvid, Math.max(views.get(c.bvid) ?? 0, c.views ?? 0));
      }
    }
  }
  const count = [...views.values()].filter(v => v >= UPZHU_MIN_VIEWS).length;
  return { upzhu: count >= UPZHU_MIN_VIDEOS, count };
}

export function upzhuText(up) {
  return up?.upzhu ? `UP主：B 站高播 EVE 视频 ${up.count} 条` : '';
}

export function personStatusTags(activity, { famous, wargod, tycoon, shenren, upzhu } = {}) {
  const state = { active: '活跃', dormant: '沉寂' }[activity?.state];
  return [
    ...(state ? [state] : []),
    ...(famous ? ['名人'] : []),
    ...(wargod ? ['战神'] : []),
    ...(tycoon ? ['大亨'] : []),
    ...(shenren ? ['神人'] : []),
    ...(upzhu ? ['UP主'] : []),
  ];
}

const STATUS_CHIPS = [
  ['活跃', 'live'],
  ['沉寂', 'ash'],
  ['名人', 'fame'],
  ['战神', 'wargod'],
  ['大亨', 'tycoon'],
  ['神人', 'shenren'],
  ['UP主', 'upzhu'],
];

export const statusChips = people => STATUS_CHIPS.map(([name, kind]) => ({
  name,
  kind,
  count: people.filter(person => person.data.statusTags?.includes(name)).length,
}));

// ESI 的军团简介可能是 Python 转义串（u'\u516c…'）并夹 HTML，还原成可读文字。
export const decodeCorpDescription = text => String(text ?? '')
  .replace(/^u?(['"])([\s\S]*)\1$/, '$2')
  .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/\\x([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/\\(['"\\])/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/<[^>]*>/g, ' ');

// 军团简介是否写明开放招新。只看文字，要不要算招新还得 KB 活跃，见 corpStatus。
const OPEN_RECRUITING = /招新|招人|招募|纳新|诚招|入团|加入.{0,8}(?:联系|私聊|邮件|QQ|群)|加团|加群咨询|recr?u?it|application is open/i;
const CLOSED_RECRUITING = /(?:不|暂不|不再|暂停|停止|关闭|拒绝|非公开)(?:招新|招人|招募|纳新|入团)|招新(?:已)?(?:暂停|停止|关闭)|招募状态\W{0,4}(?:关闭|closed)|仅限邀请|vouch only|not recruiting|recruit(?:ment|ing)?(?: status)?(?: is)?\W{0,4}closed/i;
export const describesRecruiting = text => OPEN_RECRUITING.test(text ?? '') && !CLOSED_RECRUITING.test(text ?? '');
// 仅限邀请：担保制同样算；写明对华语开放（CN OPEN）的不算，本站读者进得去。
const INVITE_ONLY = /仅限邀请|邀请制|invite only|invitation only|vouch only/i;
const CN_OPEN = /CN\W{0,3}OPEN/i;
export const describesInviteOnly = text => INVITE_ONLY.test(text ?? '') && !CN_OPEN.test(text ?? '');

// 简介里的招新群号；写明不招新的不算。帖子里的群号人工核对后记入 recruitment.qq。
const QQ_GROUP = /(?:Q|企鹅|群|裙)\D{0,12}([1-9]\d{5,10})/i;
// 有的简介只把号码单独列一行，解码后前后是连续空白。
const QQ_ALONE = /(?:^|\s{2,})([1-9]\d{5,10})(?=\s{2,}|$)/;
export const qqGroupFromDescription = text => (CLOSED_RECRUITING.test(text ?? '') ? '' : (text?.match(QQ_GROUP) ?? text?.match(QQ_ALONE))?.[1] ?? '');

// 正文还是占位的军团不出页面，也不进目录。
export const CORP_PLACEHOLDER = '待写';
export const corpUnwritten = body => String(body ?? '').trim() === CORP_PLACEHOLDER;

const within = (date, asOf, months) => Boolean(date && asOf) && monthsBetween(date, asOf) <= months;

// 招新群号：简介、三年内招新帖，或已核实归属的 B 站 EVE 视频简介／回复。
export const corpRecruitQq = ({ zkb, recruitment, esi } = {}) => esi?.qq
  || (within(recruitment?.last_seen, zkb?.as_of, RECRUIT_POST_MONTHS) && recruitment?.qq)
  || '';

// 军团：招新活动或 zKB 任一近期有动静即活跃；一年内发布或有人回复的招新帖直接算招新；旧证据则需有招新群号，且今年某月上 KB 的驾驶员超过 10 人。last_seen 包括招新帖近期回复或带该团群号的 B 站视频简介／回复日期；ESI 在册人数不超过 20 的军团，KB 不算活跃（活人太少视同沉寂）。
export const corpHasEnoughMembers = esi => !(esi?.member_count < CORP_MIN_MEMBERS);

export function corpStatus({ zkb, recruitment, esi, pilots } = {}) {
  const lastActive = zkb?.last_active ?? '';
  const asOf = zkb?.as_of ?? '';
  const lastSeen = recruitment?.last_seen ?? '';
  const kbActive = within(lastActive, asOf, ACTIVE_MONTHS) && corpHasEnoughMembers(esi);
  const pilotsThisYear = pilots?.year === Number(asOf.slice(0, 4)) && pilots.peak > RECRUIT_MIN_PILOTS;
  const freshPost = within(lastSeen, asOf, RECRUIT_FRESH_POST_MONTHS);
  const recruiting = Boolean(corpRecruitQq({ zkb, recruitment, esi })) && (freshPost || pilotsThisYear);
  const active = recruiting || kbActive || within(lastSeen, asOf, ACTIVE_MONTHS);
  return {
    state: active ? 'active' : 'dormant',
    recruiting,
    group: recruiting ? 'recruiting' : active ? 'active' : 'dormant',
    lastActive,
    lastSeen,
    asOf,
  };
}

const CORP_GROUPS = [
  { key: 'recruiting', kind: 'recruit', name: '活跃·招新中', note: `找得到招新群号（简介或 ${RECRUIT_POST_MONTHS / 12} 年内的招新帖），且招新帖在 ${RECRUIT_FRESH_POST_MONTHS} 个月内，或今年有月份超过 ${RECRUIT_MIN_PILOTS} 人上 KB` },
  { key: 'active', kind: 'live', name: '活跃·未见招新', note: `${ACTIVE_MONTHS} 个月内仍有动静，没找到招新群号或今年上 KB 的人不够` },
  { key: 'dormant', kind: 'ash', name: '已沉寂', note: '战绩与招新都已停摆，往事留档' },
];

export const groupCorps = corps => CORP_GROUPS
  .map(group => ({ ...group, items: corps.filter(corp => corp.data.status.group === group.key) }))
  .filter(group => group.items.length);

const NO_ALLIANCE = '无联盟';
export const corpAlliance = esi => esi?.alliance?.ticker ?? NO_ALLIANCE;

// 联盟筛选按钮：家数多的在前，无联盟垫底。
export function corpAllianceChips(corps) {
  const chips = new Map();
  for (const { data: { esi } } of corps) {
    const name = corpAlliance(esi);
    chips.set(name, { name, title: esi?.alliance?.name, count: (chips.get(name)?.count ?? 0) + 1 });
  }
  return [...chips.values()].sort((a, b) => (a.name === NO_ALLIANCE) - (b.name === NO_ALLIANCE) || b.count - a.count);
}

// 区域：优先手工指定（招新帖写明驻地时），否则按 zKB 击杀分布，近期不足 20 杀才退回历史累计。
const ZONES = [['high', '高安'], ['low', '低安'], ['null', '00'], ['wh', '虫洞'], ['pochven', '波赫文']];
const ZONE_NAMES = Object.fromEntries(ZONES);
const ZONE_SHARE = 0.25;
const ZONE_MIN_RECENT = 20;
const zoneTotal = zones => Object.values(zones ?? {}).reduce((sum, kills) => sum + kills, 0);

export function corpZones({ corp, zkb } = {}) {
  const named = keys => keys.map(key => ({ key, name: ZONE_NAMES[key] }));
  if (corp?.zones?.length) return named(corp.zones);
  const zones = zoneTotal(zkb?.zones_recent) >= ZONE_MIN_RECENT ? zkb.zones_recent : zkb?.zones;
  const total = zoneTotal(zones);
  if (!total) return [];
  const ranked = ZONES.map(([key]) => key).filter(key => zones[key]).sort((a, b) => zones[b] - zones[a]);
  const major = ranked.filter(key => zones[key] / total >= ZONE_SHARE);
  return named(major.length ? major : ranked.slice(0, 1));
}

// zKB 的区域标签形如 { shipsDestroyed, shipsLost, … }，按击杀加损失计活动量。
const zoneActivity = label => (label?.shipsDestroyed ?? 0) + (label?.shipsLost ?? 0);

export const zoneKeysFromLabels = labels => ({
  high: zoneActivity(labels?.['loc:highsec']),
  low: zoneActivity(labels?.['loc:lowsec']),
  null: zoneActivity(labels?.['loc:nullsec']),
  wh: zoneActivity(labels?.['loc:w-space']),
  pochven: zoneActivity(labels?.['loc:pochven']),
});

export const corpZoneChips = corps => ZONES
  .map(([key, name]) => ({ key, name, count: corps.filter(c => c.data.zones.some(z => z.key === key)).length }))
  .filter(chip => chip.count);

export const corpKey = d => [d.displayName, d.esi?.name, d.esi?.ticker, d.esi?.alliance?.name, corpAlliance(d.esi), d.corp?.epithet, ...(d.zones ?? []).map(z => z.name)]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

// 卡片上的击杀数：16.2 万、3512。
export const killCount = kills => (kills >= 10000 ? `${+(kills / 10000).toFixed(1)} 万` : String(kills ?? 0));

// 列传与军团互链：主事者（CEO 是本人或其小号）、主角色雇佣记录、正文点名三路，名人排前。NPC 军团不进 ID 比对范围。
export function corpMembers(people, corporationId, { ceoId, linkedIds = [] } = {}) {
  const ceo = [];
  const current = [];
  const former = [];
  const mentioned = [];
  for (const person of people) {
    const ids = [person.data.character_id, ...(person.data.identity?.alts ?? []).map(alt => alt.id)];
    const stints = (person.data.char?.history ?? []).filter(h => h.corporation_id === corporationId);
    if (ids.includes(ceoId)) ceo.push(person);
    else if (stints.some(h => !h.end)) current.push(person);
    else if (stints.length) former.push(person);
    else if (ids.some(id => linkedIds.includes(id))) mentioned.push(person);
  }
  const fameFirst = list => list.sort((a, b) => Boolean(b.data.famous) - Boolean(a.data.famous));
  return { ceo, current: fameFirst(current), former: fameFirst(former), mentioned: fameFirst(mentioned) };
}

// 参战录：战役统计里本团至少这么多人，或归方时点名了本团。
const CORP_BATTLE_PILOTS = 3;
export const corpBattles = (battles, corporationId) => (battles ?? [])
  .map(battle => ({ battle, pilots: battle.data.corpPilots?.[corporationId] ?? 0 }))
  .filter(({ pilots }) => pilots >= CORP_BATTLE_PILOTS);

// 列传反查现属军团：只认当前所在的玩家军团（非 NPC、未离开），不列历史待过的军团。
export const corpsOfPerson = (corps, char) => {
  if (!char) return [];
  if (char.affiliation?.left_at) return [];
  const currentCorpId = char.affiliation?.corporation?.id
    ?? char.current_corporation?.id
    ?? (char.history ?? []).find(h => !h.end)?.corporation_id;
  if (!currentCorpId) return [];
  return (corps ?? []).filter(corp => corp.data.corp?.id === currentCorpId);
};
