// 人物画像工具：一次拉齐 research-method.md 第二节第 1、2 步的必查数据，输出 Markdown。
//
//   node scripts/research/profile.mjs <角色ID> [论坛用户名]  > 画像.md
//
// 内容：
//   - ESI 头衔、角色简介全文（已解码）
//   - 每段玩家军团雇佣 + 当时所在联盟（逐个查 alliancehistory，CODE./Goonswarm 之类只藏在这里）
//   - zKillboard 统计：击杀/损失、常用船、常去星系、联盟分布、ISK 最高的月份
//   - 凛冬论坛：本人全部主题与回帖标题、别人提到他的帖子
// 只读公开接口，不写仓库。依赖仓库里的角色缓存 src/_data/characters/<ID>.json。

import fs from "node:fs";

const id = process.argv[2];
let forumUser = process.argv[3];
if (!id) {
  console.error("用法：node scripts/research/profile.mjs <角色ID> [论坛用户名]");
  process.exit(1);
}
const UA = { "User-Agent": "eve-personas-research (github.com/ddd4512kk-source)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function json(url, opts = {}) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { ...opts, headers: { ...UA, Accept: "application/json", ...(opts.headers || {}) } });
      if (r.status === 404) return null;
      if (r.status === 429) { await sleep(5000); continue; }
      if (!r.ok) { await sleep(1500); continue; }
      return await r.json();
    } catch { await sleep(1500); }
  }
  return null;
}
const nameCache = {};
async function names(ids) {
  const need = [...new Set(ids.filter((x) => x && !nameCache[x]))];
  for (let i = 0; i < need.length; i += 500) {
    const r = await json("https://esi.evetech.net/latest/universe/names/", { method: "POST", body: JSON.stringify(need.slice(i, i + 500)) });
    for (const n of r || []) nameCache[n.id] = n.name;
  }
  return (x) => nameCache[x] || String(x);
}
const ymd = (s) => (s ? s.slice(0, 10) : "至今");
const out = [];
const p = (s = "") => out.push(s);

// ---------- ESI ----------
const ch = await json(`https://esi.evetech.net/latest/characters/${id}/`);
const cachePath = `src/_data/characters/${id}.json`;
let cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, "utf8")) : null;
if (!cache) {
  // 还没建列传的人没有缓存：直接读 EveWho 雇佣记录
  const ew = await json(`https://evewho.com/api/character/${id}`);
  if (ew?.history) {
    const toIso = (s) => (s ? s.replace(/\//g, "-").replace(" ", "T") + ":00Z" : null);
    const hist = ew.history.map((h) => ({ corporation_id: h.corporation_id, start: toIso(h.start_date), end: toIso(h.end_date), npc: h.corporation_id >= 1000000 && h.corporation_id < 2000000 }));
    const n = await names(hist.map((h) => h.corporation_id));
    cache = { name: ew.info?.[0]?.name, history: hist.map((h) => ({ ...h, name: n(h.corporation_id) })) };
  }
}
const charName = ch?.name || cache?.name || id;
p(`# 画像：${charName}（${id}）`);
p();
p(`- 建号：${ymd(ch?.birthday || cache?.birthday)}；安全等级：${ch?.security_status?.toFixed?.(1) ?? "?"}`);
const clean = (s) =>
  (s || "")
    .replace(/^u'|'$/g, "")
    .replace(/\\u([0-9a-f]{4})/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\(.)/g, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<a href="([^"]+)">/gi, "[$1] ")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
p(`- 头衔：${clean(ch?.title) || "（无）"}`);
p();
p("## 角色简介全文");
p();
p("```");
p(clean(ch?.description) || "（空）");
p("```");
p();

// ---------- 雇佣 + 当时联盟 ----------
p("## 雇佣记录与当时联盟");
p();
const hist = (cache?.history || []).filter((h) => !h.npc);
for (const h of hist) {
  const ah = (await json(`https://esi.evetech.net/latest/corporations/${h.corporation_id}/alliancehistory/`)) || [];
  ah.sort((a, b) => a.start_date.localeCompare(b.start_date));
  const s = h.start, e = h.end || "9999";
  const spans = ah.map((x, i) => ({ alliance_id: x.alliance_id, start: x.start_date, end: ah[i + 1]?.start_date || "9999" }));
  const hit = spans.filter((x) => x.alliance_id && x.start < e && x.end > s);
  const n = await names(hit.map((x) => x.alliance_id));
  const al = hit.map((x) => `${n(x.alliance_id)}（${ymd(x.start < s ? s : x.start)}–${ymd(x.end > e ? h.end : x.end === "9999" ? null : x.end)}）`).join("、") || "无联盟";
  p(`- ${ymd(h.start)} → ${ymd(h.end)}　${h.name}　｜　${al}`);
}
const npcGaps = (cache?.history || []).filter((h) => h.npc && h.end && new Date(h.end) - new Date(h.start) > 365 * 864e5);
for (const g of npcGaps) p(`- （${ymd(g.start)} → ${ymd(g.end)} 在 NPC 军团，超过一年）`);
p();

// ---------- zKillboard ----------
p("## zKillboard 统计");
p();
const zk = await json(`https://zkillboard.com/api/stats/characterID/${id}/`);
if (!zk || !zk.id) {
  p("（zKillboard 无数据或请求失败）");
} else {
  const B = (x) => ((x || 0) / 1e9).toFixed(1) + "B";
  p(`- 击杀 ${zk.shipsDestroyed || 0}（${B(zk.iskDestroyed)}），损失 ${zk.shipsLost || 0}（${B(zk.iskLost)}），单杀 ${zk.soloKills || 0}`);
  const tops = Object.fromEntries((zk.topAllTime || []).map((t) => [t.type, t.data || []]));
  const ids = [];
  for (const k of ["ship", "system", "alliance", "corporation"]) for (const d of (tops[k] || []).slice(0, 10)) ids.push(d.shipTypeID || d.solarSystemID || d.allianceID || d.corporationID);
  const n = await names(ids);
  const line = (k, f) => (tops[k] || []).slice(0, 10).map((d) => `${n(d[f])} ${d.kills}`).join("，");
  p(`- 常用船（击杀次数）：${line("ship", "shipTypeID")}`);
  p(`- 常去星系：${line("system", "solarSystemID")}`);
  p(`- 联盟分布：${line("alliance", "allianceID")}`);
  p(`- 军团分布：${line("corporation", "corporationID")}`);
  const months = Object.entries(zk.months || {}).map(([k, v]) => ({ k, ...v }));
  if (months.length) {
    const active = months.filter((m) => (m.shipsDestroyed || 0) + (m.shipsLost || 0) > 0).map((m) => m.k).sort();
    p(`- 活跃月份：${active[0]} → ${active.at(-1)}（共 ${active.length} 个月有记录）`);
    const topIsk = [...months].sort((a, b) => (b.iskDestroyed || 0) - (a.iskDestroyed || 0)).slice(0, 6);
    p(`- 击杀 ISK 最高的月份：${topIsk.map((m) => `${m.k} ${B(m.iskDestroyed)}`).join("，")}`);
    const topLost = [...months].sort((a, b) => (b.iskLost || 0) - (a.iskLost || 0)).slice(0, 4);
    p(`- 损失 ISK 最高的月份：${topLost.map((m) => `${m.k} ${B(m.iskLost)}`).join("，")}`);
  }
  p(`- 链接：https://zkillboard.com/character/${id}/`);
}
p();

// ---------- 凛冬论坛 ----------
p("## 凛冬论坛");
p();
const F = "https://forums.winterco.org";
if (!forumUser) {
  const guess = charName.replace(/\s+/g, "_");
  const u = await json(`${F}/u/${encodeURIComponent(guess)}.json`);
  if (u?.user) forumUser = u.user.username;
  else {
    const s = await json(`${F}/u/search/users.json?term=${encodeURIComponent(charName)}`);
    const cand = (s?.users || []).map((x) => x.username);
    if (cand.length) p(`- 未精确匹配到论坛用户，近似候选：${cand.join("、")}（需人工确认）`);
  }
}
if (forumUser) {
  p(`- 论坛用户：${forumUser}（${F}/u/${forumUser}/activity）`);
  for (const [filter, label] of [[4, "本人主题"], [5, "本人回帖"]]) {
    const seen = new Set();
    const rows = [];
    for (let off = 0; off < 600; off += 30) {
      const r = await json(`${F}/user_actions.json?username=${encodeURIComponent(forumUser)}&filter=${filter}&offset=${off}`);
      const a = r?.user_actions || [];
      for (const x of a) {
        const k = `${x.topic_id}/${x.post_number}`;
        if (seen.has(k)) continue;
        seen.add(k);
        rows.push(`  - ${ymd(x.created_at)} [${x.title}](${F}/t/topic/${x.topic_id}/${x.post_number}) — ${(x.excerpt || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").slice(0, 90)}`);
      }
      if (a.length < 30) break;
    }
    p(`- ${label}：${rows.length} 条`);
    out.push(...rows);
  }
} else p("- 没有找到论坛用户（可能不用论坛，或用户名与角色名不同）");
p();
p("### 别人提到他的帖子（按角色名搜索）");
const terms = [charName, ...(process.env.ALIASES ? process.env.ALIASES.split(",") : [])];
const seenP = new Set();
for (const t of terms) {
  for (let pg = 1; pg <= 3; pg++) {
    const r = await json(`${F}/search/query.json?term=${encodeURIComponent(t)}&page=${pg}`);
    const posts = r?.posts || [];
    const topics = Object.fromEntries((r?.topics || []).map((x) => [x.id, x.title]));
    for (const x of posts) {
      const k = `${x.topic_id}/${x.post_number}`;
      if (seenP.has(k) || x.username === forumUser) continue;
      seenP.add(k);
      p(`- 「${t}」${ymd(x.created_at)} ${x.username} 在 [${topics[x.topic_id] || x.topic_id}](${F}/t/topic/${x.topic_id}/${x.post_number})：${(x.blurb || "").replace(/\s+/g, " ").slice(0, 140)}`);
    }
    if (posts.length < 20) break;
  }
}
console.log(out.join("\n"));
