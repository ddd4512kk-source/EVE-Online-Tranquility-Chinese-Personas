// 贴吧正式档案的离线查询与缓存覆盖同步；抓取永远不能提升人工阅读状态。
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRECTORY = path.join(ROOT, 'docs/tieba');
const STATES = new Set(['unread', 'legacy', 'partial', 'text-read', 'reviewed', 'excluded']);

export function validateThread(record, filename) {
  const id = String(record.thread_id || '');
  if (!/^\d+$/.test(id) || filename !== `${id}.json`) throw new Error(`${filename}：帖号与文件名不一致`);
  if (record.schema_version !== 1 || record.url !== `https://tieba.baidu.com/p/${id}`) throw new Error(`${filename}：版本或来源网址无效`);
  if (!STATES.has(record.review?.status) || !Array.isArray(record.review.notes)) throw new Error(`${filename}：缺少有效人工状态或说明`);
  if (!Array.isArray(record.references) || !Array.isArray(record.legacy_records)) throw new Error(`${filename}：缺少来源引用或迁移记录`);
  if (['partial', 'text-read', 'reviewed', 'excluded'].includes(record.review.status) && !record.review.notes.length) throw new Error(`${filename}：人工结论必须说明范围或理由`);
  return record;
}

export function summarizeCache(data, cachePath) {
  const posts = new Map();
  for (const page of [...(data.pages || []), ...(data.reverse_pages || [])]) {
    for (const post of page.post_list || []) {
      const id = String(post.id), previous = posts.get(id);
      const replies = new Map([...(previous?.sub_post_list?.sub_post_list || []), ...(post.sub_post_list?.sub_post_list || [])].map(reply => [String(reply.id), reply]));
      posts.set(id, { ...post, sub_post_list: { sub_post_list: [...replies.values()] } });
    }
  }
  const coverage = data.coverage || {};
  return {
    cache: cachePath,
    fetched_at: data.resumed_at || data.fetched_at || null,
    main_posts: posts.size,
    subposts: [...posts.values()].reduce((sum, post) => sum + (post.sub_post_list?.sub_post_list?.length || 0), 0),
    floors: [...new Set([...posts.values()].map(post => Number(post.floor)))].sort((a, b) => a - b),
    orders: coverage.orders || {},
    subpost_gaps: (coverage.subposts || []).filter(item => Number(item.expected) > Number(item.fetched) || item.error).map(item => ({
      floor: item.floor, expected: item.expected, fetched: item.fetched, error: item.error || null,
    })),
    errors: (data.errors || []).map(item => item.message || String(item)),
  };
}

export function mergeCache(record, data, cachePath) {
  const id = String(record.thread_id);
  if (!new RegExp(`/p/${id}(?:[?#/]|$)`).test(data.source || '')) throw new Error(`${cachePath}：缓存来源与帖号不符`);
  const summary = summarizeCache(data, cachePath);
  // 迟到的旧缓存不能覆盖新快照；人工结论与旧记录始终保留。
  if (summary.fetched_at && !Number.isFinite(Date.parse(summary.fetched_at))) throw new Error(`${cachePath}：缓存时间无效`);
  if (record.acquisition?.fetched_at && (!summary.fetched_at || Date.parse(summary.fetched_at) < Date.parse(record.acquisition.fetched_at))) return structuredClone(record);
  return { ...structuredClone(record), acquisition: summary };
}

export async function readArchive(directory = DIRECTORY) {
  const records = [];
  for (const name of (await readdir(directory)).sort()) {
    if (!/^\d+\.json$/.test(name)) continue;
    records.push(validateThread(JSON.parse(await readFile(path.join(directory, name), 'utf8')), name));
  }
  return records;
}

export function queryArchive(records, { query = '', status, limit = 10, offset = 0 } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 50 || !Number.isSafeInteger(offset) || offset < 0) throw new Error('limit须为1—50，offset须为非负整数');
  if (status && !STATES.has(status)) throw new Error(`未知人工状态：${status}`);
  const needle = query.toLowerCase();
  const selected = records.filter(record => (!status || record.review.status === status) && (!needle || JSON.stringify(record).toLowerCase().includes(needle)));
  return { total: selected.length, offset, limit, records: selected.slice(offset, offset + limit).map(record => ({
    thread_id: record.thread_id, title: record.title, status: record.review.status,
    notes: record.review.notes, references: record.references,
    legacy_notes: [...new Set(record.legacy_records.map(item => item.values?.['人工处理'] || item.values?.['状态']).filter(Boolean))],
    main_posts: record.acquisition?.main_posts, subposts: record.acquisition?.subposts,
  })) };
}

const HELP = `贴吧统一档案，所有命令均离线。
  node scripts/tieba-archive.mjs list [关键词] [--status 状态] [--limit 10] [--offset 0]
  node scripts/tieba-archive.mjs show <帖号>
  node scripts/tieba-archive.mjs scans
  node scripts/tieba-archive.mjs sync-cache <帖号> <缓存.json>
  node scripts/tieba-archive.mjs check
状态：unread、legacy（旧人工记录待对照）、partial、text-read、reviewed、excluded。
sync-cache只更新取得范围，不修改人工结论；新帖先在docs/tieba/<帖号>.json登记。`;

export async function run(args, { root = ROOT, directory = DIRECTORY } = {}) {
  const [command, ...rest] = args;
  if (command === '--help' && !rest.length) return HELP;
  if (command === 'scans' && !rest.length) return JSON.parse(await readFile(path.join(directory, 'scans.json'), 'utf8'));
  if (command === 'show' && rest.length === 1 && /^\d+$/.test(rest[0])) {
    const name = `${rest[0]}.json`;
    return validateThread(JSON.parse(await readFile(path.join(directory, name), 'utf8')), name);
  }
  if (command === 'sync-cache' && rest.length === 2 && /^\d+$/.test(rest[0])) {
    const name = `${rest[0]}.json`, file = path.join(directory, name);
    const record = validateThread(JSON.parse(await readFile(file, 'utf8')), name);
    const cache = path.resolve(root, rest[1]);
    const merged = mergeCache(record, JSON.parse(await readFile(cache, 'utf8')), path.relative(root, cache).replaceAll(path.sep, '/'));
    await writeFile(file, JSON.stringify(merged, null, 2) + '\n');
    return { thread_id: rest[0], status: merged.review.status, acquisition: merged.acquisition };
  }
  if (command === 'check' && !rest.length) {
    const records = await readArchive(directory);
    const scans = JSON.parse(await readFile(path.join(directory, 'scans.json'), 'utf8'));
    if (scans.schema_version !== 1 || !Array.isArray(scans.scans)) throw new Error('scans.json：扫描记录格式无效');
    const ids = new Set(records.map(record => record.thread_id));
    for (const scan of scans.scans) {
      if (!scan.id || !Array.isArray(scan.thread_ids) || new Set(scan.thread_ids).size !== scan.thread_ids.length) throw new Error('scans.json：扫描编号或帖号去重无效');
      for (const id of scan.thread_ids) if (!ids.has(id)) throw new Error(`${scan.id}：缺少帖子档案${id}`);
    }
    return { valid: true, threads: records.length, scans: scans.scans.length };
  }
  if (command === 'list') {
    const options = {}, words = [];
    for (let i = 0; i < rest.length; i++) {
      const arg = rest[i];
      if (['--status', '--limit', '--offset'].includes(arg)) {
        const value = rest[++i];
        if (value === undefined || value.startsWith('--')) throw new Error(`${arg}缺少参数`);
        options[arg.slice(2)] = arg === '--status' ? value : Number(value);
      } else if (arg.startsWith('--')) throw new Error(`未知参数：${arg}`);
      else words.push(arg);
    }
    return queryArchive(await readArchive(directory), { ...options, query: words.join(' ') });
  }
  throw new Error(HELP);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await run(process.argv.slice(2));
    console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
