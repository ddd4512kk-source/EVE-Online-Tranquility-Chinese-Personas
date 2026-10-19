// 战报快照：从 br.evetools 或 killmail.app 抓本场击杀记录，精简存进 src/battles/<短名>/br.json（勿手改）。
// 分方人数、损失、华人军团人数与已收录人物都由 battles.mjs 从快照算出，不再手抄进 front matter。
export const SNAPSHOT_FILE = "br.json";

const BR_API = "https://br.evetools.org/newapi/br";
const KMAPP_API = "https://killmail.app/api/battle-reports";

// 战报网页 → 接口网址；不是这两家战报的来源返回 null（这类战役仍手填数字）
export function brApiUrl(url) {
  const s = String(url);
  const battle = /^https?:\/\/br\.evetools\.org\/battle\/(\d+)\/?$/.exec(s);
  if (battle) return `${BR_API}/battle/${battle[1]}`;
  const m = /^https?:\/\/br\.evetools\.org\/(?:br\/([0-9a-f]{24})|related\/(\d+)\/(\d{12}))\/?$/.exec(s);
  if (m) return m[1] ? `${BR_API}/composition/${m[1]}` : `${BR_API}/related/${m[2]}/${m[3]}`;
  // killmail.app/br/<ID>-<星系>-<日期>，ID 后的短语只是网址装饰
  const k = /^https?:\/\/killmail\.app\/br\/([A-Za-z0-9]{6,})(?:-[\w-]*)?\/?$/.exec(s);
  return k ? `${KMAPP_API}/${k[1]}` : null;
}

// killmail.app 的击杀记录 → br.evetools 的写法
const fromKillmailApp = (k) => ({
  id: k.id,
  system: k.solar_system_id,
  time: Date.parse(k.created_at),
  victim: { char: k.character_id, corp: k.corporation_id, ally: k.alliance_id },
  attackers: (k.attackers ?? []).map((a) => ({ char: a.character_id, corp: a.corporation_id, ally: a.alliance_id })),
  totalValue: k.isk_value,
});

export const brSources = (data) => [data.loss_source].flat().filter((u) => brApiUrl(u));

// front matter 的 window：["2020-10-06 02:59", "2020-10-07 06:00"]（UTC）→ 毫秒；格式不对返回 null
export function parseWindow(w) {
  if (!Array.isArray(w) || w.length !== 2) return null;
  const ms = w.map((s) => (typeof s === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s) ? Date.parse(`${s.replace(" ", "T")}:00Z`) : NaN));
  return ms.every(Number.isFinite) && ms[0] < ms[1] ? ms : null;
}

// raws：各来源接口返回的 JSON；systemIds：只留这些星系的击杀（空则不筛）；window：[起, 止] 毫秒，只留这段时间的击杀
// 快照只存算数要用的东西：
//   pilots  { 角色ID: [军团ID, 联盟ID] }（无联盟记 0；同一角色取首次出现）
//   losses  [[KM ID, 受害角色ID, 军团ID, 联盟ID, 价值 ISK]]（建筑的角色ID为 0）
//   hits    [[攻击方, 受害方, 击杀条数]]，双方都按 entityKey 记；推断未点名联盟站哪边用
//   teams   战报作者分好的队伍，每队是 "联盟ID" 或 "corp:军团ID" 的列表（只有 br/ 链接才有）
export function compactReport(raws, systemIds = [], window = null) {
  const keep = new Set(systemIds.map(Number));
  const inWindow = (t) => !window || (t >= window[0] && t <= window[1]);
  const kms = new Map();
  const teams = [];
  for (const raw of raws) {
    if (raw?.result && raw.result !== "success") throw new Error(`战报接口返回 ${raw.result}`);
    if (raw?.status && raw.status !== "success") throw new Error(`战报接口返回 ${raw.status}`);
    const list = raw.killmails?.map(fromKillmailApp) ?? raw.kms ?? (raw.relateds ?? []).flatMap((r) => r.kms ?? []);
    for (const k of list) if ((!keep.size || keep.has(k.system)) && inWindow(k.time)) kms.set(k.id, k);
    for (const t of raw.teams ?? []) if (Array.isArray(t) && t.length) teams.push(t.map(String));
  }
  const pilots = {};
  const losses = [];
  const hits = new Map();
  const seen = (p) => {
    if (p?.char > 0 && !pilots[p.char]) pilots[p.char] = [p.corp ?? 0, p.ally ?? 0];
  };
  for (const k of [...kms.values()].sort((a, b) => a.id - b.id)) {
    seen(k.victim);
    for (const a of k.attackers ?? []) seen(a);
    const v = k.victim ?? {};
    losses.push([k.id, v.char ?? 0, v.corp ?? 0, v.ally ?? 0, Math.round(k.totalValue ?? 0)]);
    const victim = entityKey(v.corp, v.ally, v.char);
    for (const a of new Set((k.attackers ?? []).filter((a) => a.char > 0).map((a) => entityKey(a.corp, a.ally, a.char)))) {
      const pair = `${a} ${victim}`;
      hits.set(pair, (hits.get(pair) ?? 0) + 1);
    }
  }
  return { teams, pilots, losses, hits: [...hits].map(([pair, n]) => [...pair.split(" "), n]).sort((a, b) => b[2] - a[2]) };
}

// 联盟记 a:ID，无联盟的军团记 c:ID；NPC 军团不是一支舰队，按角色分开记 p:角色ID
const isNpcCorp = (corp) => corp >= 1000000 && corp < 2000000;
export const entityKey = (corp, ally, char) =>
  ally > 0 ? `a:${ally}` : isNpcCorp(corp) && char > 0 ? `p:${char}` : `c:${corp ?? 0}`;

// raws 与 brSources(data) 一一对应；systemIds 是 data.systems 的星系 ID
export const buildSnapshot = (data, raws, systemIds) => ({
  sources: brSources(data),
  systems: data.systems,
  systemIds,
  window: data.window ?? null,
  ...compactReport(raws, systemIds, parseWindow(data.window)),
});

// 快照与 front matter 的来源、星系、时间窗不一致就要重抓；一致返回 null
export function snapshotStale(data, snap) {
  if (!snap) return "缺少战报快照";
  const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  if (!same(snap.sources, brSources(data))) return "loss_source 改过";
  if (!same(snap.systems, data.systems)) return "systems 改过";
  if (!same(snap.window, data.window)) return "window 改过";
  return null;
}

// 本场战报里出场的军团、联盟 ID
export function battleOrgs(snap) {
  const ids = new Set();
  for (const [corp, ally] of [...Object.values(snap.pilots), ...snap.losses.map((l) => [l[2], l[3]])]) {
    for (const id of [corp, ally]) if (id > 0) ids.add(id);
  }
  return ids;
}

// 一行一条，便于 diff，又不至于几万行
export function stringifySnapshot(s) {
  const pilots = Object.entries(s.pilots).map(([id, v]) => `    "${id}": ${JSON.stringify(v)}`);
  return [
    "{",
    `  "sources": ${JSON.stringify(s.sources)},`,
    `  "systems": ${JSON.stringify(s.systems)},`,
    `  "systemIds": ${JSON.stringify(s.systemIds)},`,
    `  "window": ${JSON.stringify(s.window ?? null)},`,
    `  "teams": [${s.teams.map((t) => `\n    ${JSON.stringify(t)}`).join(",")}${s.teams.length ? "\n  " : ""}],`,
    `  "pilots": {\n${pilots.join(",\n")}\n  },`,
    `  "losses": [\n${s.losses.map((l) => `    ${JSON.stringify(l)}`).join(",\n")}\n  ],`,
    `  "hits": [\n${s.hits.map((h) => `    ${JSON.stringify(h)}`).join(",\n")}\n  ]`,
    "}",
    "",
  ].join("\n");
}
