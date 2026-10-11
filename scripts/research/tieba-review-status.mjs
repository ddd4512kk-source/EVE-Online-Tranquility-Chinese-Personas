// 将临时原料的抓取覆盖输出为可提交清单；保留原清单的人工处理字段。
// node scripts/research/tieba-review-status.mjs <缓存目录> <覆盖.tsv>
// 不导出原文、作者、图片或联系方式；接口成功不自动标成人工已读。
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const [cache, output] = process.argv.slice(2);
if (!cache || !output) { console.error('用法：node scripts/research/tieba-review-status.mjs <缓存目录> <覆盖.tsv>'); process.exit(1); }
const inventory = JSON.parse(await readFile(path.join(cache, 'inventory.json'), 'utf8'));
const previous = new Map();
try { for (const line of (await readFile(output, 'utf8')).split('\n').slice(1)) { const fields = line.split('\t'); previous.set(fields[0], fields[9]); } } catch (error) { if (error.code !== 'ENOENT') throw error; }
async function json(file) { try { return JSON.parse(await readFile(file, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; return null; } }
const counts = { total: inventory.length, unrequested: 0, edges: 0, partial: 0, failed: 0, main_paginated: 0, manually_read: 0 };
const clean = (value) => String(value ?? '').replace(/[\t\r\n]+/g, ' ');
const rows = [];
for (const item of inventory) {
  const edge = await json(path.join(cache, 'edges', item.tid + '.json'));
  const full = await json(path.join(cache, item.tid + '.json'));
  const coverage = full?.coverage || {};
  let status;
  if (!edge) { status = '未请求'; counts.unrequested++; }
  else if (edge.pages.length === 2 && !edge.errors.length) { status = '首尾已取'; counts.edges++; }
  else if (edge.pages.length) { status = '部分取得'; counts.partial++; }
  else { status = '请求失败'; counts.failed++; }
  const human = previous.get(item.tid) || '未人工通读';
  if (coverage.main_complete) counts.main_paginated++;
  if (human.startsWith('已读') && !human.includes('首尾')) counts.manually_read++;
  rows.push([item.tid, item.files.join(';'), status, edge?.reply_num, edge?.total_pages,
    coverage.main_complete, coverage.main_posts, coverage.subposts_fetched,
    full ? (coverage.subposts || []).reduce((sum, state) => sum + Math.max(0, state.expected - state.fetched), 0) : '',
    human, (full?.errors || edge?.errors || []).map((error) => error.message).join(';') || '无',
    (coverage.subposts || []).filter(state => state.empty_pages?.length).map(state => `#${state.floor}:${state.empty_pages.join(',')}`).join(';') || '无',
    Object.entries(coverage.orders || {}).filter(([,state]) => state.empty_pages?.length).map(([order,state])=>`${order}:${state.empty_pages.join(',')}`).join(';') || '无',
    (coverage.subposts || []).filter(state => state.zero_page_metadata).map(state=>`#${state.floor}`).join(';') || '无'].map(clean).join('\t'));
}
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, ['帖号\t初始引用文件\t首尾状态\t接口回复数\t主楼总页数\t主楼分页完成\t已取主楼\t已取楼中楼\t楼中楼计数差\t人工处理\t当前错误\t楼中楼空页\t主楼无列表页\t楼中楼分页元数据全零', ...rows].join('\n') + '\n');
console.log(JSON.stringify(counts));
