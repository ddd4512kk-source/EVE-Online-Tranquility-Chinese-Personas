// 顺序补全冻结清单的正倒序/楼中楼；首尾缓存可做起点。只抓取，不代替人工阅读。
// node scripts/research/tieba-review-batch.mjs <缓存目录> [本轮最多帖数，默认 1]
// 原始回复可能含现实隐私，请用忽略的临时目录；403/429 整批停止。
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pause } from './tieba-client-api.mjs';
const [cache, limitArg] = process.argv.slice(2);
const limit = limitArg === undefined ? 1 : Number(limitArg);
if (!cache || !(limit === Infinity || Number.isInteger(limit) && limit >= 1)) { console.error('用法：node scripts/research/tieba-review-batch.mjs <缓存目录> [最多帖数]'); process.exit(1); }
async function json(file) { try { return JSON.parse(await readFile(file,'utf8')); } catch(error) { if(error.code !== 'ENOENT') throw error; return null; } }
const inventory = await json(path.join(cache,'inventory.json'));
if (!Array.isArray(inventory)) throw new Error('缺少冻结帖号清单');
const work = [];
for (const item of inventory) {
 const edge = await json(path.join(cache,'edges',item.tid+'.json'));
 work.push({item,edge});
}
// 回复数只决定顺序，零/未知回复也保留；不能按标题筛掉求助、招新。
work.sort((a,b)=>(b.edge?.reply_num || 0)-(a.edge?.reply_num || 0));
let requested=0, skipped=0, unavailable=0;
for (const {item,edge} of work) {
 if (requested >= limit) break;
 const file=path.join(cache,item.tid+'.json');
 let saved=await json(file);
 if (!saved && edge && !edge.pages.length && edge.errors.length && edge.errors.every(e=>/^4:/.test(e.message))) {
  unavailable++; console.log(`【不可读】${item.tid} 首尾已返回可能已删除错误；保留失败记录，不当成无料。`); continue;
 }
 const c=saved?.coverage;
 // 主楼走完后仍可能在补楼中楼时中断；必须逐一对应所有有回复的楼层。
 const nestedCovered = c?.subposts && [...(saved?.pages || []), ...(saved?.reverse_pages || [])]
  .flatMap(page=>page.post_list || []).every(post=>!Number(post.sub_post_number || 0) || c.subposts.some(state=>
   String(state.pid)===String(post.id) && !state.error && state.pages && state.pages>=state.total_pages && state.expected>=Number(post.sub_post_number)));
 if(c?.main_complete && c.orders.forward?.complete && c.orders.reverse?.complete && !saved.errors?.length && nestedCovered && c.subposts.every(s=>s.pages && s.pages>=s.total_pages)) { skipped++; continue; }
 if(!saved && edge?.pages.length===2 && !edge.errors.length) {
  const total=Number(edge.pages[0].page.total_page);
  saved={source:`https://tieba.baidu.com/p/${item.tid}`,fetched_at:edge.fetched_at,complete:false,pages:[edge.pages[0]],reverse_pages:[edge.pages[1]],errors:[],coverage:{orders:{
   forward:{pages:1,page_numbers:[1],total_pages:total,complete:total===1},
   reverse:{pages:1,page_numbers:[total],total_pages:total,complete:total===1},
  },subposts:[]}};
  await writeFile(file,JSON.stringify(saved,null,2));
 }
 console.log(`全文 ${++requested} ${item.tid} ${saved ? '续跑' : '新取'} ${edge?.title || ''}`);
 const status=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['scripts/research/tieba-client-read.mjs',item.tid,file,'all','--both',...(saved?['--resume']:[])],{stdio:['ignore','inherit','inherit']});
  child.on('error',reject);child.on('close',resolve);
 });
 const result=await json(file);
 if(result?.errors.some(e=>/HTTP (429|403|412)|请求预算/.test(e.message))) { console.error('【限流暂停】保留当前进度，下轮沿原目录续跑。');process.exitCode=2;break; }
 if(status && !result) { console.error('未生成覆盖记录，停止，避免掩盖程序故障。');process.exitCode=2;break; }
 await pause(1500);
}
console.log(`本轮请求 ${requested} 帖；跳过已完成可见分页 ${skipped} 帖、已记录不可读 ${unavailable} 帖。人工是否已读请另记。`);
