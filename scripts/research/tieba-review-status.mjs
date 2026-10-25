// 将冻结作业的抓取覆盖同步回正式逐帖档案，不再导出平行TSV状态表。
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeCache, validateThread } from '../tieba-archive.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [cache, extra] = process.argv.slice(2);
if (!cache || extra) {
  console.error('用法：node scripts/research/tieba-review-status.mjs <缓存目录>；正式状态在docs/tieba/，不再生成覆盖TSV');
  process.exit(1);
}
let synced = 0, unregistered = 0;
try {
  for (const name of (await readdir(path.resolve(root, cache))).sort()) {
    if (!/^\d+\.json$/.test(name)) continue;
    const file = path.join(root, 'docs/tieba', name);
    let record;
    try { record = validateThread(JSON.parse(await readFile(file, 'utf8')), name); }
    catch (error) { if (error.code !== 'ENOENT') throw error; unregistered++; continue; }
    const raw = path.resolve(root, cache, name);
    const merged = mergeCache(record, JSON.parse(await readFile(raw, 'utf8')), path.relative(root, raw).replaceAll(path.sep, '/'));
    await writeFile(file, JSON.stringify(merged, null, 2) + '\n');
    synced++;
  }
  console.log(JSON.stringify({ synced, unregistered, note: '只同步取得范围；未登记帖须先建正式档案，人工结论未修改' }));
} catch (error) { console.error(error.message); process.exitCode = 1; }
