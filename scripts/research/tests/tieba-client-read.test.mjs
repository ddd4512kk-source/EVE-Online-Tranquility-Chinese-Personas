import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const exec = promisify(execFile);
const reader = path.resolve('scripts/research/tieba-client-read.mjs');
const dump = path.resolve('scripts/research/tieba-client-dump.mjs');
const fixture = `
import { readFile } from 'node:fs/promises';
const mode = process.env.TIEBA_TEST_MODE;
const nativeTimeout = globalThis.setTimeout;
globalThis.setTimeout = (callback, ms, ...args) => nativeTimeout(callback, ms <= 6000 ? 0 : ms, ...args);
globalThis.fetch = async (url, init) => {
  const fields = Object.fromEntries(init.body), pn = Number(fields.pn), reverse = fields.r === '1';
  let data;
  if (url.endsWith('/page')) {
    if (mode === 'failure' && pn === 2) throw new Error('模拟失败');
    if (mode === 'rate' && pn === 2) return { ok:false, status:429 };
    const post = { id: pn, floor: pn, time: 1710000000, author_id: 99, content: [{text: '第'+pn+'页'}], sub_post_number: pn === 3 ? 31 : 0, sub_post_list: { sub_post_list: pn === 3 ? [{id:100,content:[{text:'预览'}],time:1710000000,author_id:99}] : [] } };
    data = {error_code:0,thread:{id:123,title:'测试'},page:{current_page:pn,total_page:3,has_more:reverse ? Number(pn>1) : Number(pn<3)},post_list:[post],user_list:[{id:99,name:'原名',name_show:'展示名'}]};
    if (pn === 2 && ['main-empty','main-wrong-thread','main-invalid-list'].includes(mode)) {
      delete data.post_list; data.page.total_num=90;
      if(mode==='main-wrong-thread') data.thread.id=999;
      if(mode==='main-invalid-list') data.post_list={};
    }
  } else {
    if (mode === 'no-refetch') throw new Error('已结束可见分页不应重取');
    if (mode === 'checkpoint' && pn === 2) {
      const saved = JSON.parse(await readFile(process.argv[3], 'utf8'));
      const reversePost = saved.reverse_pages.flatMap(page => page.post_list).find(post => post.id === 3);
      if (reversePost.sub_post_list.sub_post_list.length !== 30) throw new Error('中途保存仍是倒序预览');
    }
    const count = pn === 1 ? 30 : mode === 'gap' ? 0 : 1;
    data = { error_code:0,thread:{id:123},post:{id:3},page:{current_page:pn,total_page:2,total_count:31},subpost_list:Array.from({length:count},(_,i)=>({id:100+(pn-1)*30+i,time:1710000000,author:{id:99,name:'原名',name_show:'展示名'},content:[{text:'楼中楼'+((pn-1)*30+i)}]})) };
    if (pn === 2 && ['missing-list', 'wrong-post-empty', 'invalid-list'].includes(mode)) {
      delete data.subpost_list;
      if (mode === 'wrong-post-empty') data.post.id = 999;
      if (mode === 'invalid-list') data.subpost_list = {};
    }
    if (['zero-pages', 'wrong-zero-pages','zero-with-replies'].includes(mode)) {
      data.page = {current_page:0,total_page:0,total_count:0};data.subpost_num=0;
      if(mode !== 'zero-with-replies') data.subpost_list=[];
      if (mode === 'wrong-zero-pages') data.post.id=999;
    }
  }
  return {ok:true,json:async()=>data};
};
`;
async function run(args, mode = '') {
  const dir = await mkdtemp(path.join(tmpdir(), 'tieba-read-test-'));
  const preload = path.join(dir,'fixture.mjs'), output = path.join(dir,'thread.json');
  await writeFile(preload,fixture);
  let failure;
  try { await exec(process.execPath,['--import',preload,reader,'https://tieba.baidu.com/p/123',output,...args],{env:{...process.env,TIEBA_TEST_MODE:mode,RESEARCH_STATE_FILE:path.join(dir,"cooldown.json")}}); } catch(error) { failure = error; }
  const data = JSON.parse(await readFile(output,'utf8'));
  return {dir,output,data,failure};
}
test('倒序从真正末页开始，页数限制保留缺口',async()=>{
 const r=await run(['1','--reverse']);try{
  assert.equal(r.failure,undefined);assert.deepEqual(r.data.coverage.orders.reverse.page_numbers,[3]);assert.equal(r.data.pages[0].post_list[0].floor,3);assert.equal(r.data.complete,false);
 }finally{await rm(r.dir,{recursive:true,force:true});}
});
test('正倒序跨全部页，楼中楼超过30条继续翻页并去重',async()=>{
 const r=await run(['all','--both']);try{
  assert.equal(r.failure,undefined);assert.deepEqual(r.data.coverage.orders.reverse.page_numbers,[3,2,1]);assert.equal(r.data.complete,true);assert.equal(r.data.coverage.main_posts,3);assert.equal(r.data.coverage.subposts_fetched,31);
  const printed=await exec(process.execPath,[dump,r.output]);assert.equal((printed.stdout.match(/#3 pid=/g)||[]).length,1);assert.match(printed.stdout,/楼中楼30/);assert.match(printed.stdout,/uid 99/);
 }finally{await rm(r.dir,{recursive:true,force:true});}
});
test('接口宣称数高于可见楼中楼时不得标记完整',async()=>{
 const r=await run(['all','--both'],'gap');try{assert.equal(r.data.complete,false);assert.equal(r.data.coverage.subposts[0].fetched,30);}finally{await rm(r.dir,{recursive:true,force:true});}
});
test('主楼对应页省略列表时继续后页并保留全文缺口',async()=>{
 const r=await run(['all','--both'],'main-empty');try{
  assert.equal(r.failure,undefined);assert.equal(r.data.coverage.main_complete,true);
  assert.equal(r.data.coverage.main_posts,2);assert.equal(r.data.complete,false);
  assert.deepEqual(r.data.coverage.orders.forward.empty_pages,[2]);
  assert.deepEqual(r.data.coverage.orders.reverse.empty_pages,[2]);
  assert.equal(r.data.coverage.main_empty_pages,true);
 }finally{await rm(r.dir,{recursive:true,force:true});}
});
test('省略主楼列表也必须对应帖号且拒绝异常列表类型',async()=>{
 for(const mode of ['main-wrong-thread','main-invalid-list']){
  const r=await run(['all','--both'],mode);try{
   assert.equal(r.failure.code,2);assert.equal(r.data.coverage.orders.forward.complete,false);
   assert.match(r.data.errors[0].message,/不对应或为空/);
  }finally{await rm(r.dir,{recursive:true,force:true});}
 }
});
test('对应页元数据完整但省略回复列表时记录空页及计数差', async () => {
 const r=await run(['all','--both'],'missing-list');
 try {
  assert.equal(r.failure,undefined); assert.equal(r.data.complete,false);
  assert.equal(r.data.coverage.subposts[0].pages,2);
  assert.deepEqual(r.data.coverage.subposts[0].empty_pages,[2]);
  assert.equal(r.data.coverage.subposts_fetched,30); assert.deepEqual(r.data.errors,[]);
 } finally {await rm(r.dir,{recursive:true,force:true});}
});
test('空楼中楼仍校验对应楼层和列表类型', async () => {
 for (const mode of ['wrong-post-empty','invalid-list']) {
  const r=await run(['all','--both'],mode);
  try {assert.equal(r.failure.code,2);assert.match(r.data.errors[0].message,/不对应或缺少列表/);assert.equal(r.data.coverage.subposts[0].pages,1);}
  finally {await rm(r.dir,{recursive:true,force:true});}
 }
});
test('对应楼层的零页响应保留主楼预览及原声明缺口', async () => {
 const r=await run(['all','--both'],'zero-pages');
 try {
  assert.equal(r.failure,undefined);assert.equal(r.data.complete,false);
  const state=r.data.coverage.subposts[0];assert.equal(state.total_pages,0);assert.equal(state.pages,1);
  assert.equal(state.no_visible_pages,true);assert.equal(state.expected,31);assert.equal(state.fetched,1);assert.deepEqual(r.data.errors,[]);
  await exec(process.execPath,['--import',path.join(r.dir,'fixture.mjs'),reader,'123',r.output,'all','--both','--resume'],{env:{...process.env,TIEBA_TEST_MODE:'no-refetch'}});
 } finally {await rm(r.dir,{recursive:true,force:true});}
});
test('老帖分页元数据全零但带真实回复时保留列表且不标完整', async () => {
 const r=await run(['all','--both'],'zero-with-replies');try{
  assert.equal(r.failure,undefined);assert.equal(r.data.coverage.subposts_fetched,30);
  assert.equal(r.data.coverage.subposts[0].zero_page_metadata,true);
  assert.equal(r.data.coverage.subposts[0].complete,false);assert.equal(r.data.complete,false);
 }finally{await rm(r.dir,{recursive:true,force:true});}
});
test('零页响应属于别的楼层时仍报错', async () => {
 const r=await run(['all','--both'],'wrong-zero-pages');
 try {assert.equal(r.failure.code,2);assert.match(r.data.errors[0].message,/不对应或缺少列表/);}
 finally {await rm(r.dir,{recursive:true,force:true});}
});
test('中途保存时倒序副本也保留已补全的楼中楼', async () => {
 const r = await run(['all', '--both'], 'checkpoint');
 try {assert.equal(r.failure, undefined); assert.equal(r.data.complete, true);}
 finally {await rm(r.dir, {recursive:true, force:true});}
});
test('续跑保留不可见计数差，不重复已经结束的楼中楼分页', async () => {
 const r = await run(['all', '--both'], 'gap');
 try {
  await exec(process.execPath, ['--import', path.join(r.dir, 'fixture.mjs'), reader, '123', r.output, 'all', '--both', '--resume'], {env:{...process.env,TIEBA_TEST_MODE:'no-refetch'}});
  const saved = JSON.parse(await readFile(r.output, 'utf8'));
  assert.equal(saved.complete, false);
  assert.equal(saved.coverage.subposts_fetched, 30);
  assert.equal(saved.errors.length, 0);
 } finally {await rm(r.dir, {recursive:true, force:true});}
});
test('中途失败保存已取得页面及错误',async()=>{
 const r=await run(['all'],'failure');try{assert.equal(r.failure.code,2);assert.equal(r.data.pages.length,1);assert.equal(r.data.complete,false);assert.match(r.data.errors[0].message,/模拟失败/);}finally{await rm(r.dir,{recursive:true,force:true});}
});

test('限流后停止正倒序和楼中楼请求并保存缺口',async()=>{
 const r=await run(['all','--both'],'rate');try{assert.equal(r.failure.code,2);assert.equal(r.data.pages.length,1);assert.equal(r.data.reverse_pages.length,0);assert.equal(r.data.coverage.orders.reverse.error,'限流后未请求');assert.match(r.data.errors[0].message,/HTTP 429/);}finally{await rm(r.dir,{recursive:true,force:true});}
});

test('失败后续跑保留旧页与错误历史，补齐缺页及楼中楼', async () => {
 const r = await run(['all', '--both'], 'rate');
 try {
  await exec(process.execPath, ['--import', path.join(r.dir, 'fixture.mjs'), reader, '123', r.output, 'all', '--both', '--resume'], {env:{...process.env,TIEBA_TEST_MODE:''}});
  const data = JSON.parse(await readFile(r.output, 'utf8'));
  assert.equal(data.complete, true);
  assert.equal(data.pages.length, 3);
  assert.deepEqual(data.coverage.orders.forward.page_numbers, [1,2,3]);
  assert.deepEqual(data.coverage.orders.reverse.page_numbers, [3,2,1]);
  assert.equal(data.coverage.subposts_fetched, 31);
  assert.equal(data.errors.length, 0);
  assert.match(data.previous_errors[0].message, /HTTP 429/);
 } finally {await rm(r.dir,{recursive:true,force:true});}
});
