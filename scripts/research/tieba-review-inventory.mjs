// 收集所有已归档贴吧帖号；可续跑逐帖首尾抽查，不把抽查算整帖回查。
// node scripts/research/tieba-review-inventory.mjs <临时目录> [--probe]
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { mainPage, pause, contentText } from './tieba-client-api.mjs';
const [out, flag] = process.argv.slice(2);
if (!out || flag && flag !== '--probe') { console.error('用法：node scripts/research/tieba-review-inventory.mjs <临时目录> [--probe]'); process.exit(1); }
const files = new Map();
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.md')) {
      for (const [, tid] of (await readFile(file, 'utf8')).matchAll(/tieba\.baidu\.com\/p\/(\d+)/g)) {
        if (!files.has(tid)) files.set(tid, new Set());
        files.get(tid).add(file);
      }
    }
  }
}
await mkdir(out, { recursive: true });
let inventory;
// 续跑沿用初始清单，避免回查新增的候选反过来被算作原来已经收录。
if (flag) {
  try { inventory = JSON.parse(await readFile(path.join(out, 'inventory.json'), 'utf8')); } catch {}
}
if (!inventory) {
  await walk('src/people'); await walk('docs');
  inventory = [...files].map(([tid, refs]) => ({ tid, files: [...refs].sort() })).sort((a,b) => a.tid.localeCompare(b.tid));
  await writeFile(path.join(out, 'inventory.json'), JSON.stringify(inventory, null, 2));
}
console.log(`归档帖号 ${inventory.length}`);
if (!flag) process.exit(0);
await mkdir(path.join(out, 'edges'), { recursive: true });
let done = 0, requested = 0, rateLimited = false;
// 顺序请求并冷却；已有结果续跑时不重复请求，避免大批回查触发限流。
async function worker() {
  while (inventory.length && !rateLimited && requested < 10) {
    const item = inventory.shift(), target = path.join(out, 'edges', item.tid + '.json');
    try {
      const saved = JSON.parse(await readFile(target, 'utf8'));
      if (saved.edge_version === 2 && !saved.errors?.some((error) => /HTTP (429|403)|timeout|fetch failed/i.test(error.message))) { done++; continue; }
    } catch {}
    requested++;
    const result = { ...item, edge_version: 2, fetched_at: new Date().toISOString(), status: 'partial', pages: [], errors: [] };
    for (const reverse of [false, true]) {
      try {
        // r=1 仅倒排当前页；真正的帖尾必须用首楼返回的 total_page。
        const pn = reverse ? Number(result.pages[0]?.page.total_page || 1) : 1;
        const page = await mainPage(item.tid, pn, reverse); result.pages.push(page);
      }
      catch (error) {
        result.errors.push({ reverse, message: error.message });
        if (/HTTP (429|403|412)|请求预算/.test(error.message)) { rateLimited = true; break; }
      }
      await pause(1000);
    }
    if (!result.pages.length) result.status = 'failed';
    const first = result.pages[0];
    if (first) {
      result.title = first.thread.title; result.forum = first.forum?.name; result.reply_num = Number(first.thread.reply_num);
      result.total_pages = Number(first.page.total_page);
      const posts = [...new Map(result.pages.flatMap(p=>p.post_list).map(p=>[String(p.id),p])).values()];
      result.main_posts = posts.length;
      result.subposts_expected = posts.reduce((s,p)=>s+Number(p.sub_post_number||0),0);
      result.subposts_preview = posts.reduce((s,p)=>s+(p.sub_post_list?.sub_post_list?.length||0),0);
      result.main_text = posts.map(p=>`#${p.floor} ${contentText(p.content)}`).join('\n');
    }
    await writeFile(target, JSON.stringify(result,null,2));
    done++;
    console.log(`${done} ${item.tid} ${result.status} ${result.reply_num ?? '?'}回复 ${result.title || result.errors[0]?.message}`);
  }
}
await worker();
if (rateLimited) { console.error('【限流暂停】保留已有结果，冷却后续跑；失败不等于无料。'); process.exitCode = 2; }
