// Offline, durable UID/BV archive. No network or browser access.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPersonDocument } from './person-document.mjs';

export const ARCHIVE = 'docs/bilibili';
const UID = /^\d+$/;
const BV = /^BV[A-Za-z0-9]{10}$/;
const STATES = new Set(['confirmed', 'candidate', 'associated', 'source', 'excluded']);
const COVERAGE = new Set(['unknown', 'legacy_record', 'captured', 'reviewed']);
const READING = new Set(['captured', 'material_linked', 'digested']);
const anchor = bv => `bili-${bv.toLowerCase()}`;
export { anchor };

export function cleanDescription(value) {
  return String(value ?? '').split('\n').filter(line =>
    !/(?:QQ群|群号|招新群|加群|微信|手机|电话|discord\s*[:：]|QQ\s*[:：号]|联系.{0,8}\d{5}|(?:企鹅|传送门).{0,8}\d)/i.test(line)
    && !/\b1[3-9]\d{9}\b/.test(line)
  ).join('\n').trim();
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
    reading: { state: 'captured', material_refs: [], scope: '标题、简介及计数已保存；未据取得状态推定已精读。评论摘要须另入人物素材。' },
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

async function safeFile(root, relative) {
  const full = path.resolve(root, relative.split('#')[0]);
  if (!full.startsWith(path.resolve(root) + path.sep) || relative.startsWith('.cache/')) throw new Error(`归档链接不可依赖缓存或越界：${relative}`);
  await fs.access(full);
  return full;
}

// Locate the existing prose on demand; never infer digestion from a matching BV.
export async function materialEvidence(root, video) {
  const results = [];
  for (const ref of video.reading?.material_refs ?? []) {
    const lines = (await fs.readFile(await safeFile(root, ref), 'utf8')).split('\n');
    let section = '', start = 0;
    for (let i = 0; i < lines.length; i++) {
      if (/^#{1,6} /.test(lines[i])) { section = lines[i]; start = i; }
      if (!lines[i].includes(video.bvid)) continue;
      results.push({ ref, line: i + 1, section,
        kind: lines[i].startsWith('|') ? 'table_row' : 'prose_reference',
        // Include the section introduction/reading boundary and the matching paragraph.
        context: lines.slice(start + 1, Math.min(i, start + 7)).join('\n').trim().slice(0, 1200),
        text: lines[i].slice(0, 2400) });
    }
  }
  return results;
}

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
    body: body.includes(video.bvid) || (title.length >= 8 && normal(body).includes(title)),
    selected: chosen.includes(video.bvid),
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
    materials.set(ref, await fs.readFile(await safeFile(root, ref), 'utf8'));
  }
  for (const v of p.videos) {
    v.usage = personaUsage(body, v);
    if (v.reading.state !== 'digested') {
      v.reading.material_refs = [...materials].filter(([, text]) => text.includes(v.bvid)).map(([ref]) => ref);
      v.reading.state = v.reading.material_refs.length ? 'material_linked' : 'captured';
    }
  }
  return p;
}

export async function validateProfile(root, file, p) {
  const errors = [];
  const fail = message => errors.push(`${file}：${message}`);
  if (p.version !== 1 || !UID.test(p.uid ?? '') || path.basename(file) !== `${p.uid}.json`) fail('版本／UID／文件名不一致');
  if (!p.name || p.url !== `https://space.bilibili.com/${p.uid}/`) fail('缺少账号名或规范主页');
  if (!STATES.has(p.identity?.state)) fail('身份状态无效');
  for (const ref of [p.identity?.material, ...(p.identity?.related ?? []).map(r => r.material)].filter(Boolean)) {
    try { await safeFile(root, ref); } catch { fail(`素材链接无效：${ref}`); }
  }
  for (const key of ['latest', 'popular', 'series']) {
    const c = p.channel?.coverage?.[key];
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
    if (!READING.has(v.reading?.state)) fail(`${v.bvid}阅读状态无效`);
    if (v.usage?.selected && v.usage?.body) fail(`${v.bvid}正文与精选重复`);
    if (v.reading?.state === 'digested' && (!v.reading.material_refs?.length || !v.reading.scope)) fail(`${v.bvid}消化状态缺少素材与范围`);
    for (const ref of v.reading?.material_refs ?? []) {
      try {
        const full = await safeFile(root, ref), text = await fs.readFile(full, 'utf8');
        const id = ref.split('#')[1];
        if (!text.includes(v.bvid) || (id && !text.includes(`id="${id}"`))) fail(`${v.bvid}素材或锚点未落档：${ref}`);
      } catch { fail(`${v.bvid}素材路径无效：${ref}`); }
    }
  }
  return errors;
}

export async function run(root, command, input, bvid) {
  if (command === 'scans') {
    return [JSON.stringify(JSON.parse(await fs.readFile(path.join(root, ARCHIVE, 'scans.json'), 'utf8')), null, 2)];
  }
  if (command === 'show') {
    if (!UID.test(input ?? '')) throw new Error('show需要确切UID');
    const p = JSON.parse(await fs.readFile(path.join(root, ARCHIVE, `${input}.json`), 'utf8'));
    if (bvid) {
      const v = p.videos.find(v => v.bvid === bvid);
      if (!v) throw new Error('此UID没有该BV的作品页档案；先查channel.listings是否仅有标题。');
      return [JSON.stringify({ ...v, material_evidence: await materialEvidence(root, v) }, null, 2)];
    }
    return [JSON.stringify({ uid: p.uid, name: p.name, identity: p.identity,
      profile: p.channel.profile, coverage: p.channel.coverage,
      ...(p.discovery ? { discovery: p.discovery } : {}),
      ...(p.channel.tag_review ? { tag_review: p.channel.tag_review } : {}),
      prior_notes: p.channel.prior_notes ?? [],
      videos: p.videos.map(v => ({ bvid: v.bvid, title: v.title, reading: v.reading, usage: v.usage })) }, null, 2)];
  }
  if (command === 'import') {
    const captured = JSON.parse(await fs.readFile(input, 'utf8'));
    const v = videoFromCapture(captured), file = path.join(root, ARCHIVE, `${v.owner_uid}.json`);
    const p = JSON.parse(await fs.readFile(file, 'utf8')); // Unknown owners require explicit identity registration.
    const i = p.videos.findIndex(x => x.bvid === v.bvid);
    if (i < 0) p.videos.push(v); else p.videos[i] = mergeVideo(p.videos[i], v);
    await fs.writeFile(file, JSON.stringify(p, null, 2) + '\n');
    return [`${v.owner_uid}/${v.bvid}已保存；阅读状态未升级。运行sync更新索引。`];
  }
  if (!['sync', 'check'].includes(command)) throw new Error('用法：bilibili-archive.mjs sync|check|scans|show <UID> [BV]|import <作品页JSON>');
  const profiles = await readProfiles(root), errors = [];
  for (const entry of profiles) {
    const fresh = await syncProfile(root, entry.data);
    if (command === 'sync') {
      entry.data = fresh;
      await fs.writeFile(path.join(root, entry.file), JSON.stringify(fresh, null, 2) + '\n');
    } else if (JSON.stringify(fresh) !== JSON.stringify(entry.data)) errors.push(`${entry.file}状态过期，运行npm run bilibili:sync`);
    errors.push(...await validateProfile(root, entry.file, entry.data));
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return [`B站档案通过：${profiles.length}个UID、${profiles.reduce((n, p) => n + p.data.videos.length, 0)}个已存作品；仅离线校验。`];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    for (const line of await run(root, process.argv[2] ?? 'check', process.argv[3], process.argv[4])) console.log(line);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
