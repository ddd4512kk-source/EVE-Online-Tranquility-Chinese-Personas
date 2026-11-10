// Offline, durable UID/BV archive. No network or browser access.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPersonDocument } from './person-document.mjs';
import { brApiUrl } from './battle-report.mjs';
import { readMaterial } from './material-document.mjs';

export const ARCHIVE = 'docs/bilibili';
const UID = /^\d+$/;
const BV = /^BV[A-Za-z0-9]{10}$/;
const STATES = new Set(['confirmed', 'candidate', 'associated', 'source', 'excluded']);
const COVERAGE = new Set(['unknown', 'legacy_record', 'captured', 'reviewed']);
const READING = new Set(['captured', 'material_linked', 'digested']);
const anchor = bv => `bili-${bv.toLowerCase()}`;
export { anchor };

// Public report URLs only; never retain the surrounding contact text.
export function battleReportLinks(text) {
  const links = new Set();
  for (const match of String(text ?? '').matchAll(/https?:\/\/[^\s<>"'\u3000-\u303f\uff00-\uffef]+/g)) {
    const raw = match[0].replace(/&amp;/g, '&').replace(/[)\]}.;,]+$/, '');
    try {
      const url = new URL(raw);
      if (url.username || url.password || url.port) continue;
      const valid = url.hostname === 'br.evetools.org' && /^\/(?:br|battle|related)\//.test(url.pathname)
        || url.hostname === 'killmail.app' && url.pathname.startsWith('/br/')
        || url.hostname === 'warbeacon.net' && /^\/br\/(?:report|related)\//.test(url.pathname)
        || url.hostname === 'br.inyour.space' && url.searchParams.has('s');
      if (valid) links.add(url.href);
    } catch { /* An incomplete URL remains in the description for manual review. */ }
  }
  return [...links];
}

const reportKey = link => {
  const u = new URL(link); u.hash = ''; u.searchParams.sort();
  return brApiUrl(u.origin + u.pathname) ?? u.href.replace(/\/$/, '');
};

// Discovery only: date/topic proximity never proves a camera's side or its pilot.
export function battleVideoCandidates(profiles, battle) {
  const day = value => {
    const s = String(value ?? '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? Date.parse(s + 'T00:00:00Z') : NaN;
  };
  const uploadDays = value => {
    const s = String(value ?? '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      // 中文日期没有具体时刻：北京时间这一天可落在UTC前一天或当天。
      const current = day(s);
      return [current - 86400000, current];
    }
    if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(s)) {
      const current = /^\d{4}-\d{2}-\d{2}[ T]/.test(s) ? day(s) : NaN;
      return Number.isFinite(current) ? [current - 86400000, current] : [];
    }
    const ms = Date.parse(s);
    return Number.isFinite(ms) ? [day(new Date(ms).toISOString())] : [];
  };
  const start = day(battle.start), end = day(battle.end ?? battle.start);
  const sources = new Set([battle.loss_source].flat().filter(Boolean).map(reportKey));
  const selected = new Set((battle.videos ?? []).map(v => v.url.match(/BV[A-Za-z0-9]{10}/)?.[0]).filter(Boolean));
  const result = [];
  for (const entry of profiles) {
    const p = entry.data ?? entry, videos = new Map();
    for (const listing of p.channel?.listings ?? []) for (const c of listing.candidates ?? []) {
      if (BV.test(c.bvid ?? '')) videos.set(c.bvid, { ...c, published_at: c.published_at ?? c.published, page_captured: false });
    }
    for (const v of p.videos ?? []) videos.set(v.bvid, { ...videos.get(v.bvid), ...v, page_captured: true });
    for (const v of videos.values()) {
      const days = uploadDays(v.published_at);
      const distance = days.length ? Math.min(...days.map(published => Math.max(start - published, published - end, 0) / 86400000)) : NaN;
      const text = [v.title, v.description, ...(v.description_history ?? []).map(h => h.text)].filter(Boolean).join('\n');
      const reports = battleReportLinks(text);
      const sourceMatch = reports.some(link => sources.has(reportKey(link)));
      const topic = /会战|大战|旗舰战|无畏战|超旗|星城|铁壁|千人|万人|dread|capital|keepstar|battle|brawl|siege/i.test(text)
        || (battle.systems ?? []).some(s => text.toUpperCase().includes(s.toUpperCase()));
      // A channel card often omits both the system and the battle terminology.
      // Keep the whole date window for review instead of treating unread prose as unrelated.
      if (!sourceMatch && !(distance < 5) && !selected.has(v.bvid)) continue;
      result.push({ uid: v.page_captured ? v.owner_uid : null, author: v.page_captured ? p.name : null,
        listed_by: [{ uid: p.uid, name: p.name }], bvid: v.bvid, title: v.title, published_at: v.published_at ?? null,
        page_captured: v.page_captured, selected: selected.has(v.bvid), days_from_battle: Number.isFinite(distance) ? distance : null,
        association: sourceMatch ? 'same-report-source' : distance < 5 ? (topic ? 'nearby-battle-topic' : 'nearby-needs-description') : 'existing-selection',
        reports, description_excerpt: String(v.description ?? '').slice(0, 500) });
    }
  }
  const unique = new Map();
  for (const row of result) {
    const previous = unique.get(row.bvid);
    const chosen = !previous || row.page_captured && !previous.page_captured ? row : previous;
    const listed = [...(previous?.listed_by ?? []), ...row.listed_by];
    chosen.listed_by = [...new Map(listed.map(p => [p.uid, p])).values()];
    unique.set(row.bvid, chosen);
  }
  return [...unique.values()].sort((a, b) => Number(b.association === 'same-report-source') - Number(a.association === 'same-report-source')
    || (a.days_from_battle ?? Infinity) - (b.days_from_battle ?? Infinity) || a.bvid.localeCompare(b.bvid));
}

export function cleanDescription(value) {
  return String(value ?? '').split('\n').map(line =>
    /(?:QQ群|群号|招新群|加群|微信|手机|电话|discord\s*[:：]|QQ\s*[:：号]|联系.{0,8}\d{5}|(?:企鹅|传送门).{0,8}\d)/i.test(line)
    || /\b1[3-9]\d{9}\b/.test(line)
      ? (battleReportLinks(line).join('\n') || null) : line
  ).filter(line => line !== null).join('\n').trim();
}

export function videoFromCapture(data) {
  if (data?.bvid && data?.owner && !data.metadata) {
    // Legacy public API cache: no acquisition date was retained. Do not use mtime as a reading date.
    data = { metadata: data, source: `https://www.bilibili.com/video/${data.bvid}/`, at: null };
  }
  const m = data?.metadata;
  const uid = String(m?.owner?.mid ?? '');
  if (!m || !UID.test(uid) || !BV.test(m.bvid ?? '')) throw new Error('缺少视频作者UID或有效BV');
  const source = new URL(data.source ?? data.url);
  if (!['www.bilibili.com', 'bilibili.com', 'm.bilibili.com'].includes(source.hostname)
    || source.pathname.replace(/\/$/, '') !== `/video/${m.bvid}`) throw new Error('作品页URL与metadata BV不符');
  if (data.status && data.status !== 'read') throw new Error('失败页面不能归档成成功作品');
  return {
    bvid: m.bvid, title: m.title, url: `https://www.bilibili.com/video/${m.bvid}/`, owner_uid: uid,
    published_at: m.pubdate ? new Date(m.pubdate * 1000).toISOString() : null,
    captured_at: data.at ?? null,
    description: cleanDescription(m.desc),
    stats: { views: m.stat?.view ?? null, replies: m.stat?.reply ?? null },
    credit: { state: 'unreviewed', team: (m.staff ?? []).map(s => ({ uid: String(s.mid), name: s.name, role: s.title })) },
    reading: { state: 'captured', scope: '标题、简介及计数已保存；未据取得状态推定已精读。人工摘要保存在本作品的reading.digest。' },
    usage: { body: false, selected: false },
  };
}

export function mergeVideo(previous, incoming) {
  if (!previous) return incoming;
  if (previous.bvid !== incoming.bvid || previous.owner_uid !== incoming.owner_uid) throw new Error('UID/BV冲突，禁止覆盖');
  // Reimport never downgrades editorial work or discards an older description.
  const newest = (incoming.captured_at ?? '') > (previous.captured_at ?? '') ? incoming : previous;
  const other = newest === incoming ? previous : incoming;
  const result = { ...newest, credit: previous.credit, reading: previous.reading, usage: previous.usage };
  const descriptions = new Map();
  for (const v of [previous, incoming]) {
    for (const h of v.description_history ?? []) descriptions.set(h.text, h);
    if (v.description) descriptions.set(v.description, { captured_at: v.captured_at, text: v.description });
  }
  if (!result.description && other.description) result.description = other.description;
  result.description_history = [...descriptions.values()].filter(h => h.text !== result.description);
  if (!result.description_history.length) delete result.description_history;
  return result;
}

// Text posts share the UID archive, but never masquerade as BV video metadata.
export function postFromCapture(data) {
  const m = data?.metadata;
  const source = new URL(data.source ?? data.url);
  const kind = m?.kind;
  const id = m?.id;
  const uid = String(m?.owner?.mid ?? '');
  const route = kind === 'opus' ? `/opus/${id}` : `/read/cv${id}`;
  if (!['opus', 'article'].includes(kind) || typeof id !== 'string' || !UID.test(id) || !UID.test(uid)) throw new Error('图文缺少有效类型、字符串ID或作者UID');
  if (source.protocol !== 'https:' || source.username || source.password || source.port
    || source.hostname !== 'www.bilibili.com' || source.pathname.replace(/\/$/, '') !== route) throw new Error('图文URL与类型／ID不符');
  if (data.status !== 'read' || !m.text?.trim() || !data.coverage?.trim()) throw new Error('图文须核对作者、正文及实际读取范围；列表摘要或失败页面不能冒作正文');
  const text = cleanDescription(m.text);
  if (!text) throw new Error('图文清理后没有可归档正文');
  return { key: `${kind}:${id}`, kind, id, title: cleanDescription(m.title ?? ''),
    url: `https://www.bilibili.com${route}`, owner_uid: uid,
    published_at: m.published_at ?? null, captured_at: data.at ?? null,
    text, capture_scope: data.coverage,
    credit: { state: 'unreviewed' },
    reading: { state: 'captured', scope: '公开文字已保存；图片、评论及人工消化范围另核。' },
    usage: { body: false, selected: false } };
}

export function mergePost(previous, incoming) {
  if (!previous) return incoming;
  if (previous.key !== incoming.key || previous.owner_uid !== incoming.owner_uid) throw new Error('UID／图文ID冲突，禁止覆盖');
  const newest = (incoming.captured_at ?? '') > (previous.captured_at ?? '') ? incoming : previous;
  const versions = new Map();
  for (const post of [previous, incoming]) {
    for (const h of post.text_history ?? []) versions.set(JSON.stringify([h.title, h.text, h.capture_scope]), h);
    const h = { title: post.title, text: post.text, captured_at: post.captured_at, capture_scope: post.capture_scope };
    versions.set(JSON.stringify([h.title, h.text, h.capture_scope]), h);
  }
  const result = { ...newest, credit: previous.credit, reading: previous.reading, usage: previous.usage };
  result.text_history = [...versions.values()].filter(h => h.text !== result.text || h.title !== result.title || h.capture_scope !== result.capture_scope);
  if (!result.text_history.length) delete result.text_history;
  return result;
}

const contentToken = item => item.bvid ?? item.url;
export const opusCoverage = () => ({ state: 'unknown', scope: '尚未核定图文列表覆盖；视频排序与动态首页不能替代图文列表。' });

async function safeFile(root, relative) {
  let full = path.resolve(root, relative.split('#')[0]);
  if (!(await fs.access(full).then(() => true, () => false)) && /\.md$/.test(full)) {
    for (const json of [full.replace(/\.md$/, '.json'), full.replace(/\.md$/, '-material.json')]) {
      if (!(await fs.access(json).then(() => true, () => false))) continue;
      const document = JSON.parse(await fs.readFile(json, 'utf8'));
      if (document?.type === 'material') { readMaterial(json); full = json; break; }
    }
  }
  if (!full.startsWith(path.resolve(root) + path.sep) || relative.startsWith('.cache/')) throw new Error(`归档链接不可依赖缓存或越界：${relative}`);
  await fs.access(full);
  return full;
}

function validateReading(reading, label, fail) {
  if (!READING.has(reading?.state)) fail(`${label}阅读状态无效`);
  if (reading && Object.hasOwn(reading, 'material_refs')) fail(`${label}仍使用旧material_refs，请将作品摘记迁入reading.digest`);
  if (reading?.digest !== undefined && (typeof reading.digest !== 'string' || !reading.digest.trim())) fail(`${label}消化摘要须为非空文字`);
  if (reading?.state === 'digested' && (typeof reading.digest !== 'string' || !reading.digest.trim()
    || typeof reading.scope !== 'string' || !reading.scope.trim())) fail(`${label}消化状态缺少本作品摘要与阅读范围`);
}

// 账号概览只报覆盖，单篇查询才输出完整摘要，避免整频道重复倾倒。
const readingSummary = reading => {
  const { digest, ...summary } = reading;
  return { ...summary, has_digest: Boolean(digest?.trim()) };
};

export async function readProfiles(root) {
  const dir = path.join(root, ARCHIVE);
  const names = (await fs.readdir(dir)).filter(n => /^\d+\.json$/.test(n));
  const profiles = await Promise.all(names.map(async name => ({ file: `${ARCHIVE}/${name}`, data: JSON.parse(await fs.readFile(path.join(dir, name), 'utf8')) })));
  return profiles.sort((a, b) => BigInt(a.data.uid) < BigInt(b.data.uid) ? -1 : 1);
}

function personaUsage(text, video) {
  const selection = /^::: 红料 B站作品精选\s*\n[\s\S]*?^:::/gm;
  const chosen = [...text.matchAll(selection)].map(m => m[0]).join('\n');
  const body = text.replace(selection, '');
  const normal = s => s.replace(/[\s\p{P}\p{S}]/gu, '').toLowerCase();
  const title = normal(video.title);
  return {
    body: body.includes(contentToken(video)) || (video.bvid && title.length >= 8 && normal(body).includes(title)) || false,
    selected: chosen.includes(contentToken(video)),
  };
}

export async function syncProfile(root, profile) {
  const p = structuredClone(profile);
  let body = '';
  if (p.identity.person) {
    const file = path.join(root, `src/people/${p.identity.person}/${p.identity.person}.md`);
    readPersonDocument(file); // Same <ID>-id.json identity/configuration contract as the site.
    body = await fs.readFile(file, 'utf8');
  }
  const materials = new Map();
  for (const ref of [p.identity.material, ...(p.identity.related ?? []).map(r => r.material)].filter(Boolean)) {
    const file = await safeFile(root, ref);
    if (file.endsWith('.json')) {
      const document = JSON.parse(await fs.readFile(file, 'utf8'));
      materials.set(ref, document?.type === 'material' ? readMaterial(file) : JSON.stringify(document));
    } else materials.set(ref, await fs.readFile(file, 'utf8'));
  }
  for (const v of [...p.videos, ...(p.posts ?? [])]) {
    v.usage = personaUsage(body, v);
    if (v.reading.state !== 'digested') {
      v.reading.state = [...materials.values()].some(text => text.includes(contentToken(v))) ? 'material_linked' : 'captured';
    }
  }
  return p;
}

export async function validateProfile(root, file, p) {
  const errors = [];
  const fail = message => errors.push(`${file}：${message}`);
  if (p.version !== 2 || !UID.test(p.uid ?? '') || path.basename(file) !== `${p.uid}.json`) fail('版本／UID／文件名不一致（UID档案须为version 2）');
  if (!p.name || p.url !== `https://space.bilibili.com/${p.uid}/`) fail('缺少账号名或规范主页');
  if (!STATES.has(p.identity?.state)) fail('身份状态无效');
  for (const ref of [p.identity?.material, ...(p.identity?.related ?? []).map(r => r.material)].filter(Boolean)) {
    try { await safeFile(root, ref); } catch { fail(`素材链接无效：${ref}`); }
  }
  for (const key of ['latest', 'popular', 'series', 'opus']) {
    const c = p.channel?.coverage?.[key] ?? (key === 'opus' ? opusCoverage() : null);
    if (!c || !COVERAGE.has(c.state) || !c.scope) fail(`${key}覆盖状态／范围缺失`);
    if (c?.state !== 'unknown' && !c?.evidence) fail(`${key}已取得状态缺少依据`);
    if (c?.evidence && !/^https?:\/\//.test(c.evidence)) {
      try { await safeFile(root, c.evidence); } catch { fail(`${key}覆盖依据路径无效：${c.evidence}`); }
    }
  }
  if (p.discovery) {
    try {
      const scans = JSON.parse(await fs.readFile(await safeFile(root, p.discovery.source), 'utf8'));
      if (!scans.runs?.some(r => r.id === p.discovery.run) || !p.discovery.scope || !p.discovery.next) fail('发现记录缺少原扫描批次、范围或下一步');
    } catch { fail('发现记录的扫描依据无效'); }
  }
  const seen = new Set();
  for (const v of p.videos ?? []) {
    if (!BV.test(v.bvid ?? '') || seen.has(v.bvid)) fail(`BV无效或重复：${v.bvid}`);
    seen.add(v.bvid);
    if (v.owner_uid !== p.uid || v.url !== `https://www.bilibili.com/video/${v.bvid}/` || !v.title) fail(`${v.bvid}作者／链接／标题无效`);
    validateReading(v.reading, v.bvid, fail);
    if (v.usage?.selected && v.usage?.body) fail(`${v.bvid}正文与精选重复`);
  }
  const postKeys = new Set();
  for (const post of p.posts ?? []) {
    const label = post.key ?? '缺少图文key';
    try {
      const normalized = postFromCapture({ source: post.url, status: 'read', coverage: post.capture_scope,
        metadata: { ...post, owner: { mid: post.owner_uid } } });
      if (normalized.key !== post.key || post.owner_uid !== p.uid || post.url !== normalized.url || postKeys.has(post.key)) fail(`${label}类型／ID／作者／链接无效或重复`);
    } catch (error) { fail(`${label}：${error.message}`); }
    postKeys.add(post.key);
    validateReading(post.reading, label, fail);
    if (post.usage?.body && post.usage?.selected) fail(`${label}正文与精选重复`);
  }
  return errors;
}

// A BV or UP link anywhere in repo content means we met it, so it must be archived.
const MENTION_DIRS = ['src', 'docs/sources', 'docs/leads', 'docs/corporations', 'docs/tieba'];
const BV_MENTION = /\bBV1[1-9A-HJ-NP-Za-km-z]{9}\b/g, UID_MENTION = /space\.bilibili\.com\/(\d+)/g;

export async function repoMentions(root) {
  const mentions = new Map(), materialFiles = new Set();
  for (const dir of MENTION_DIRS) {
    const names = await fs.readdir(path.join(root, dir), { recursive: true }).catch(error => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    for (const name of names.filter(n => /\.(?:md|json)$/.test(n))) {
      const file = path.posix.join(dir, name.replaceAll('\\', '/'));
      const full = path.join(root, file), raw = await fs.readFile(full, 'utf8');
      const isMaterialArea = /^src\/(?:people|battles)\/[^/]+\/materials-[^/]+\.json$/.test(file)
        || /^docs\/(?:sources|leads|corporations\/notes)\/.+\.json$/.test(file);
      let text = raw;
      if (isMaterialArea) {
        const document = JSON.parse(raw);
        if (document?.type === 'material') { text = readMaterial(full); materialFiles.add(file); }
      }
      for (const token of [...text.matchAll(BV_MENTION)].map(m => m[0]).concat([...text.matchAll(UID_MENTION)].map(m => m[1]))) {
        if (!mentions.has(token)) mentions.set(token, new Set());
        mentions.get(token).add(file);
      }
    }
  }
  mentions.materialFiles = materialFiles;
  return mentions;
}

function newProfile(uid, name, mentions, tokens) {
  const unknown = { state: 'unknown', observed_at: null, scope: '尚未核定覆盖；登记时只见到仓库链接或作品页。', evidence: null };
  const related = [...new Set(tokens.flatMap(t => [...mentions.get(t) ?? []]))]
    .filter(f => f.endsWith('.md') || mentions.materialFiles?.has(f)).sort()
    .map(material => ({ material, label: '仓库提及，未核对应' }));
  return { version: 2, uid, name, url: `https://space.bilibili.com/${uid}/`,
    identity: { state: 'candidate', person: null, material: null, label: name, evidence: ['作品页作者或仓库链接；未核对应人物'], related },
    channel: { profile: {}, coverage: { latest: { ...unknown }, popular: { ...unknown }, series: { ...unknown } }, prior_notes: [] },
    videos: [] };
}

async function unregisteredErrors(root, profiles) {
  const known = new Set();
  const unavailable = JSON.parse(await fs.readFile(path.join(root, ARCHIVE, 'unavailable.json'), 'utf8').catch(error => {
    if (error.code === 'ENOENT') return '{}';
    throw error;
  }));
  for (const [token, reason] of Object.entries(unavailable)) {
    if (!(BV.test(token) || UID.test(token)) || !String(reason).trim()) throw new Error(`${ARCHIVE}/unavailable.json：${token}缺少有效编号或原因`);
    known.add(token);
  }
  for (const { data: p } of profiles) {
    known.add(p.uid);
    for (const v of p.videos ?? []) known.add(v.bvid);
    for (const listing of p.channel?.listings ?? []) for (const c of listing.candidates ?? []) known.add(c.bvid);
  }
  const missing = [...await repoMentions(root)].filter(([token]) => !known.has(token));
  if (!missing.length) return [];
  const bvs = missing.filter(([t]) => t.startsWith('BV')).map(([t]) => t), uids = missing.filter(([t]) => !t.startsWith('BV')).map(([t]) => t);
  return [`B站档案未登记${missing.length}项：`, ...missing.map(([t, files]) => `  ${t}：${[...files][0]}`),
    ...(bvs.length ? [`视频：node scripts/research/bilibili.mjs capture ${bvs.join(',')} .cache/bilibili-capture，再 node scripts/bilibili-archive.mjs import .cache/bilibili-capture`] : []),
    ...(uids.length ? ['UP：node scripts/bilibili-archive.mjs register <UID> <账号名>'] : []),
    `已失效的作品或账号写入${ARCHIVE}/unavailable.json（编号: 原因）；之后运行npm run bilibili:sync。`];
}

export async function run(root, command, input, bvid) {
  if (command === 'candidates') {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input ?? '')) throw new Error('candidates需要战役短名');
    const offset = Number(bvid ?? 0);
    if (!Number.isSafeInteger(offset) || offset < 0) throw new Error('candidates偏移须为非负整数');
    if (input === 'all') {
      const profiles = await readProfiles(root), rows = [];
      for (const dir of await fs.readdir(path.join(root, 'src/battles'), { withFileTypes: true })) {
        if (!dir.isDirectory()) continue;
        const { battle } = JSON.parse(await fs.readFile(path.join(root, `src/battles/${dir.name}/${dir.name}.json`), 'utf8'));
        const candidates = battleVideoCandidates(profiles, battle);
        rows.push({ battle: dir.name, total: candidates.length,
          nearby_topic: candidates.filter(v => v.association === 'nearby-battle-topic').length,
          needs_description: candidates.filter(v => v.association === 'nearby-needs-description').length,
          uncaptured: candidates.filter(v => !v.page_captured).length,
          not_selected: candidates.filter(v => !v.selected).length });
      }
      rows.sort((a, b) => b.not_selected - a.not_selected || a.battle.localeCompare(b.battle));
      return [JSON.stringify({ total: rows.length, offset, limit: 10, rows: rows.slice(offset, offset + 10),
        scope: '全站日期窗口候选盘点；待补简介不能算无视频。按各场candidates继续读取，不代表关联、视角或推荐已经人工核定。' }, null, 2)];
    }
    const { battle } = JSON.parse(await fs.readFile(path.join(root, `src/battles/${input}/${input}.json`), 'utf8'));
    const rows = battleVideoCandidates(await readProfiles(root), battle);
    return [JSON.stringify({ battle: input, total: rows.length, offset, limit: 10, rows: rows.slice(offset, offset + 10),
      scope: '离线候选，不按UP规模或计数筛选；不足5日全部进入复查池，大战主题为高概率关联，缺主题者待补简介，明确别场者排除。同链接主报匹配不证明视频视角；不同BR核实际时期地点即可确认。' }, null, 2)];
  }
  if (command === 'reports') {
    const offset = Number(input ?? 0), limit = Number(bvid ?? 10);
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 20) throw new Error('reports偏移须为非负整数，条数须为1..20');
    const profiles = await readProfiles(root), battles = [];
    for (const dir of await fs.readdir(path.join(root, 'src/battles'), { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      const file = `src/battles/${dir.name}/${dir.name}.json`;
      const { battle } = JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
      const material = `src/battles/${dir.name}/materials-${dir.name}.json`;
      const legacyMaterial = `src/battles/${dir.name}/materials-${dir.name}.md`;
      let text = '';
      let usedMaterial = material;
      try { text = readMaterial(path.join(root, material)); }
      catch (error) {
        if (error.code !== 'ENOENT' && !/ENOENT/.test(error.message)) throw error;
        usedMaterial = legacyMaterial;
        try { text = readMaterial(path.join(root, legacyMaterial)); }
        catch (legacyError) { if (legacyError.code !== 'ENOENT' && !/ENOENT/.test(legacyError.message)) throw legacyError; }
      }
      battles.push({ file, material: usedMaterial, text, sources: [battle.loss_source].flat().filter(Boolean) });
    }
    const rows = [];
    for (const { file, data: p } of profiles) for (const v of p.videos) {
      const versions = [{ text: v.description, captured_at: v.captured_at }, ...(v.description_history ?? [])];
      for (const link of new Set(versions.flatMap(h => battleReportLinks(h.text)))) {
        rows.push({ uid: p.uid, author: p.name, bvid: v.bvid, title: v.title, archive: file, report: link,
          versions: versions.filter(h => battleReportLinks(h.text).includes(link)).map(h => ({ captured_at: h.captured_at, current: h === versions[0] })),
          source_matches: battles.filter(b => b.sources.some(s => { try { return reportKey(s) === reportKey(link); } catch { return false; } })).map(b => b.file),
          material_mentions: battles.filter(b => battleReportLinks(b.text).some(s => reportKey(s) === reportKey(link))).map(b => b.material),
        });
      }
    }
    return [JSON.stringify({ total: rows.length, offset, limit, rows: rows.slice(offset, offset + limit),
      scope: '仅查已存简介及旧版本；链接相同或素材提及不代表已核读、同一窗口或分方正确。不同BR仍须人工核对，未匹配不代表应新增战役。' }, null, 2)];
  }
  if (command === 'scans') {
    return [JSON.stringify(JSON.parse(await fs.readFile(path.join(root, ARCHIVE, 'scans.json'), 'utf8')), null, 2)];
  }
  if (command === 'show') {
    if (!UID.test(input ?? '')) throw new Error('show需要确切UID');
    const p = JSON.parse(await fs.readFile(path.join(root, ARCHIVE, `${input}.json`), 'utf8'));
    if (bvid) {
      const v = p.videos.find(v => v.bvid === bvid) ?? (p.posts ?? []).find(v => v.key === bvid);
      if (!v) throw new Error('此UID没有该BV／图文key的作品页档案；先查channel.listings是否仅有候选。');
      return [JSON.stringify(v, null, 2)];
    }
    return [JSON.stringify({ uid: p.uid, name: p.name, identity: p.identity,
      profile: p.channel.profile, coverage: { ...p.channel.coverage, opus: p.channel.coverage.opus ?? opusCoverage() },
      ...(p.discovery ? { discovery: p.discovery } : {}),
      ...(p.channel.tag_review ? { tag_review: p.channel.tag_review } : {}),
      prior_notes: p.channel.prior_notes ?? [],
      posts: (p.posts ?? []).map(v => ({ key: v.key, title: v.title, reading: readingSummary(v.reading), usage: v.usage })),
      videos: p.videos.map(v => ({ bvid: v.bvid, title: v.title, reading: readingSummary(v.reading), usage: v.usage })) }, null, 2)];
  }
  if (command === 'register') {
    if (!UID.test(input ?? '') || !bvid?.trim()) throw new Error('register需要确切UID和账号名');
    const file = path.join(root, ARCHIVE, `${input}.json`);
    if (await fs.access(file).then(() => true, () => false)) throw new Error(`${input}已有档案，不覆盖`);
    await fs.writeFile(file, JSON.stringify(newProfile(input, bvid.trim(), await repoMentions(root), [input]), null, 2) + '\n');
    return [`${input}已按candidate登记，未核对应人物。运行sync更新索引。`];
  }
  if (command === 'import') {
    const inputs = (await fs.stat(input)).isDirectory()
      ? (await fs.readdir(input)).filter(n => n.endsWith('.json')).sort().map(n => path.join(input, n)) : [input];
    const saved = [], mentions = await repoMentions(root);
    for (const one of inputs) {
      const captured = JSON.parse(await fs.readFile(one, 'utf8'));
      const isPost = ['opus', 'article'].includes(captured.metadata?.kind);
      const v = isPost ? postFromCapture(captured) : videoFromCapture(captured), file = path.join(root, ARCHIVE, `${v.owner_uid}.json`);
      // An unknown owner is registered only as a candidate; identity stays a manual call.
      const owner = captured.metadata?.owner?.name ?? captured.owner?.name;
      const p = await fs.readFile(file, 'utf8').then(JSON.parse, error => {
        if (error.code !== 'ENOENT') throw error;
        saved.push(`${v.owner_uid}是新UID，已按candidate登记，未核对应人物`);
        return newProfile(v.owner_uid, owner || '（账号名待核）', mentions, [v.owner_uid, v.bvid ?? v.url]);
      });
      const items = isPost ? (p.posts ??= []) : p.videos;
      const i = items.findIndex(x => isPost ? x.key === v.key : x.bvid === v.bvid);
      if (i < 0) items.push(v); else items[i] = isPost ? mergePost(items[i], v) : mergeVideo(items[i], v);
      await fs.writeFile(file, JSON.stringify(p, null, 2) + '\n');
      saved.push(`${v.owner_uid}/${v.bvid ?? v.key}已保存；阅读状态未升级。运行sync更新索引。`);
    }
    return saved;
  }
  if (!['sync', 'check'].includes(command)) throw new Error('用法：bilibili-archive.mjs sync|check|scans|reports [偏移] [条数]|candidates <战役短名> [偏移]|show <UID> [BV或opus:ID或article:ID]|import <作品页JSON或目录>|register <UID> <账号名>');
  const profiles = await readProfiles(root), errors = [];
  for (const entry of profiles) {
    const fresh = await syncProfile(root, entry.data);
    if (command === 'sync') {
      entry.data = fresh;
      await fs.writeFile(path.join(root, entry.file), JSON.stringify(fresh, null, 2) + '\n');
    } else if (JSON.stringify(fresh) !== JSON.stringify(entry.data)) errors.push(`${entry.file}状态过期，运行npm run bilibili:sync`);
    errors.push(...await validateProfile(root, entry.file, entry.data));
  }
  if (command === 'check') errors.push(...await unregisteredErrors(root, profiles));
  if (errors.length) throw new Error(errors.join('\n'));
  return [`B站档案通过：${profiles.length}个UID、${profiles.reduce((n, p) => n + p.data.videos.length, 0)}个视频、${profiles.reduce((n, p) => n + (p.data.posts?.length ?? 0), 0)}篇图文；仅离线校验。`];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    for (const line of await run(root, process.argv[2] ?? 'check', process.argv[3], process.argv[4])) console.log(line);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
