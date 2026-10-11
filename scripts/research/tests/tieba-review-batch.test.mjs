import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const exec = promisify(execFile);
const batch = path.resolve('scripts/research/tieba-review-batch.mjs');
function page(pn) {return {thread:{id:123},page:{current_page:pn,total_page:3},post_list:[{id:pn,floor:pn,content:[],time:1,sub_post_number:pn===3?2:0,sub_post_list:{sub_post_list:[]}}]};}
async function fixture(mode) {
 const dir=await mkdtemp(path.join(tmpdir(),'tieba-batch-test-'));
 await mkdir(path.join(dir,'edges'));
 await writeFile(path.join(dir,'inventory.json'),JSON.stringify([{tid:'123',files:[]}])) ;
 await writeFile(path.join(dir,'edges','123.json'),JSON.stringify({fetched_at:'2026-10-10',reply_num:10,pages:[page(1),page(3)],errors:[]}));
 const preload=path.join(dir,'fixture.mjs');
 await writeFile(preload,`import {appendFile} from 'node:fs/promises';
 const native=globalThis.setTimeout;globalThis.setTimeout=(cb,ms,...a)=>native(cb,ms<=6000?0:ms,...a);
 globalThis.fetch=async(url,init)=>{
 const f=Object.fromEntries(init.body),pn=Number(f.pn);
 await appendFile(${JSON.stringify(path.join(dir,'requests.txt'))},url+' '+f.pn+' '+(f.r||'')+'\\n');
 if(url.endsWith('/page')&&pn===2&&${JSON.stringify(mode)}==='rate')return {ok:false,status:429};
 const data=url.endsWith('/page')?{error_code:0,...(${page.toString()})(pn)}:{error_code:0,thread:{id:123},post:{id:3},page:{current_page:pn,total_page:1,total_count:2},subpost_list:[{id:31,time:1,content:[]},{id:32,time:1,content:[]}]};
 return {ok:true,json:async()=>data};};`);
 return {dir,env:{...process.env,RESEARCH_STATE_FILE:path.join(dir,"cooldown.json"),NODE_OPTIONS:`--import="${preload.replaceAll('\\','/')}"`}};
}
test('清单全文复用首尾，补齐楼中楼；重复批次跳过已完成分页',async()=>{
 const f=await fixture('');try{
  await exec(process.execPath,[batch,f.dir,'1'],{env:f.env});
  const data=JSON.parse(await readFile(path.join(f.dir,'123.json'),'utf8'));
  assert.equal(data.complete,true);assert.equal(data.coverage.main_posts,3);assert.equal(data.coverage.subposts_fetched,2);
  const before=await readFile(path.join(f.dir,'requests.txt'),'utf8');assert.equal(before.trim().split('\n').length,5);
  await exec(process.execPath,[batch,f.dir,'1'],{env:f.env});assert.equal(await readFile(path.join(f.dir,'requests.txt'),'utf8'),before);
 }finally{await rm(f.dir,{recursive:true,force:true});}
});
test('批次在429后停止，保留复用页及未取范围',async()=>{
 const f=await fixture('rate');try{
  await assert.rejects(exec(process.execPath,[batch,f.dir,'1'],{env:f.env}),error=>error.code===2);
  const data=JSON.parse(await readFile(path.join(f.dir,'123.json'),'utf8'));assert.equal(data.complete,false);assert.equal(data.pages.length,1);assert.equal(data.reverse_pages.length,1);assert.match(data.errors[0].message,/HTTP 429/);
  const calls=await readFile(path.join(f.dir,'requests.txt'),'utf8');assert.equal(calls.trim().split('\n').length,1);
 }finally{await rm(f.dir,{recursive:true,force:true});}
});

test('主楼完成但楼中楼中断的缓存不能跳过，包括残留完成标志',async()=>{
 for(const staleComplete of [false,true]){
  const f=await fixture('');try{
   const pages=[page(1),page(2),page(3)];
   await writeFile(path.join(f.dir,'123.json'),JSON.stringify({source:'https://tieba.baidu.com/p/123',pages,reverse_pages:pages,errors:[],coverage:{main_complete:staleComplete,orders:{forward:{pages:3,page_numbers:[1,2,3],total_pages:3,complete:true},reverse:{pages:3,page_numbers:[3,2,1],total_pages:3,complete:true}},subposts:[]}}));
   await exec(process.execPath,[batch,f.dir,'1'],{env:f.env});
   const data=JSON.parse(await readFile(path.join(f.dir,'123.json'),'utf8'));
   assert.equal(data.complete,true);assert.equal(data.coverage.subposts_fetched,2);
   const calls=await readFile(path.join(f.dir,'requests.txt'),'utf8');assert.equal(calls.trim().split('\n').length,1);assert.match(calls,/floor/);
  }finally{await rm(f.dir,{recursive:true,force:true});}
 }
});
