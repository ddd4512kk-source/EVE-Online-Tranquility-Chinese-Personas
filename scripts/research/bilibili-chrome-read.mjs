// B站公开页面读取：Windows Chrome，持久配置与逐页CDP；不更改已有标签或导出凭据。
// node scripts/research/bilibili-chrome-read.mjs <URL或清单.json> <.cache/输出目录> [本轮最多页数]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import { createCooldownStore } from './request-guard.mjs';
import { connectChromePages } from './chrome-cdp.mjs';

export function validBilibiliUrl(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.username || u.password || u.port || !['www.bilibili.com','space.bilibili.com','search.bilibili.com','t.bilibili.com'].includes(u.hostname)) throw new Error('仅支持B站公开网页，不支持登录、私信或账户设置');
  const allowed = u.hostname === 'space.bilibili.com' ? /^\/\d+(?:\/(?:upload\/video|dynamic))?\/?$/ : u.hostname === 'search.bilibili.com' ? /^\/(?:all|upuser|video)\/?$/ : u.hostname === 't.bilibili.com' ? /^\/\d+\/?$/ : /^\/(?:video\/(?:BV[A-Za-z0-9]+|av\d+)\/?|opus\/\d+\/?|read\/cv\d+\/?|audio\/au\d+\/?)$/;
  if (!allowed.test(u.pathname)) throw new Error('不是允许的公开内容页');
  return u.href;
}
export function pageStatus(body, metadata, kind) {
  if (/安全验证|访问过于频繁|验证码|Just a moment|异常请求/.test(body)) return 'blocked';
  if (kind === 'video' && metadata?.title) return 'read';
  if (/视频不见了|稿件不存在|视频已被删除|页面不存在/.test(body) || kind === 'space' && /账号已注销/.test(body)) return 'unavailable';
  if (kind === 'space' && /TA的视频|全部视频|TA暂时还没有|还没有上传过|暂无视频|投稿.*视频/s.test(body) && body.length > 80) return 'read';
  if (kind === 'search' && /综合|用户|视频/.test(body) && body.length > 200 && !/正在加载/.test(body)) return 'read';
  if (kind === 'other' && body.length > 300) return 'partial';
  return 'partial';
}

export function revealCommentSection() {
  document.querySelector('video')?.pause();
  const section = document.querySelector('bili-comments,#commentapp,#comment,.comment');
  if (section) section.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 1600);
}

export async function loadCommentSection(page) {
  await page.evaluate(revealCommentSection);
  await page.mouse.wheel(0, 1100);
  await page.waitForTimeout(2000);
}

async function main() {
const repo = fileURLToPath(new URL('../../', import.meta.url));
const [input, output, maxArg='30'] = process.argv.slice(2);
if (!input || !output) throw new Error('用法：<URL或清单.json> <.cache/输出目录> [最多页数]');
const limit = Number(maxArg);
if (!Number.isInteger(limit) || limit < 1 || limit > 60) throw new Error('单批页数须为1—60；批量预算另在覆盖表记录');
const records = input.startsWith('https://') ? [{url:input}] : JSON.parse(fs.readFileSync(path.resolve(repo,input),'utf8'));
if (!Array.isArray(records)) throw new Error('清单须为数组');
for (const record of records) record.url = validBilibiliUrl(record.url);
const prefix = path.resolve(repo, output), cache = path.resolve(repo,'.cache');
const relative = path.relative(cache,prefix);
if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('输出只能存入.cache');
if (process.platform !== 'win32') {
 const executable = '/mnt/c/Program Files/nodejs/node.exe';
 const converted = spawnSync('wslpath',['-w',fileURLToPath(import.meta.url)],{encoding:'utf8'});
 if (converted.status !== 0 || !fs.existsSync(executable)) throw new Error('需要Windows Node与Chrome');
 const result = spawnSync(executable,[converted.stdout.trim(),input,output,maxArg],{cwd:repo,stdio:'inherit'});
 if (result.error) throw result.error;
 process.exitCode = result.status ?? 1; return;
}
process.chdir(repo);
const cooldown = createCooldownStore(path.join(cache,'bilibili-browser-cooldown.json'));
if (cooldown.until('bilibili.com') > Date.now()) throw new Error('Chrome遇验证后的30分钟冷却仍有效；未打开新页面');
const endpoint = 'http://127.0.0.1:9223';
// 与首次已验证的系统 Chrome 使用同一独立 profile，保留正常验证状态。
const profile = path.join(cache, 'zkill-curl-check', 'chrome-cdp-profile');
const executable = [
  path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
].find(value => fs.existsSync(value));
if (!executable) throw new Error('未找到系统 Chrome');

async function available() {
  try {
    const response = await fetch(`${endpoint}/json/version`, { signal: AbortSignal.timeout(1500) });
    const data = await response.json();
    if (!response.ok || !/^Chrome\//.test(data.Browser || '')) return false;
    return true;
  } catch { return false; }
}
if (!await available()) {
  const child = spawn(executable, [
    '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9223',
    `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--new-window', 'about:blank',
  ], { detached: true, stdio: 'ignore' });
  child.on('error', error => { console.error(error.message); process.exitCode = 1; });
  child.unref();
  for (let n = 0; n < 40 && !await available(); n++) await new Promise(resolve => setTimeout(resolve, 500));
}
if (!await available()) throw new Error('Chrome 的本机调试连接未就绪');
fs.mkdirSync(prefix,{recursive:true});
const browser = await connectChromePages(endpoint);
try {
 const context = browser.contexts()[0];
 if (!context) throw new Error('未取得Chrome上下文');
 let count=0;
 for (const record of records) {
   if (count >= limit) break;
   const filename=path.join(prefix,`${String(records.indexOf(record)+1).padStart(3,'0')}.json`);
   if (fs.existsSync(filename)) { console.log(`缓存 ${record.url}`); continue; }
   const previous = fs.readdirSync(prefix).filter(f=>f.endsWith('.json')).map(f=>({filename:f,data:JSON.parse(fs.readFileSync(path.join(prefix,f),'utf8'))})).find(entry=>entry.data.source?.replace(/\/$/,'') === record.url.replace(/\/$/,''));
   if(previous) {fs.writeFileSync(filename,JSON.stringify({...previous.data,source:record.url,reused_from:previous.filename},null,2));console.log(`共享缓存 ${record.url}`);continue;}
   count++;
   const kind = record.url.includes('space.bilibili.com') ? 'space' : record.url.includes('search.bilibili.com') ? 'search' : record.url.includes('/video/') ? 'video' : 'other';
   const page=await context.newPage();
   await page.addInitScript(()=>document.addEventListener('play',event=>{if(event.target instanceof HTMLMediaElement) event.target.pause();},true));
   const requests=[];
   const listener=response=>{try {const u=new URL(response.url());if(u.hostname.endsWith('bilibili.com') && /api|app/.test(u.hostname)) requests.push({host:u.hostname,path:u.pathname,status:response.status()});}catch{}};
   page.on('response',listener);
   let data;
   try {
    const response=await page.goto(record.url,{waitUntil:'domcontentloaded',timeout:45000});
    const navStatus=response?.status();
    await page.waitForTimeout(8000);
    let body='', metadata=null, status='partial';
    for(let i=0;i<5;i++) {
      body=await page.locator('body').innerText({timeout:5000});
      metadata=await page.evaluate(()=>{const v=window.__INITIAL_STATE__?.videoData;return v ? {aid:v.aid,bvid:v.bvid,title:v.title,desc:v.desc,pubdate:v.pubdate,owner:{mid:v.owner?.mid,name:v.owner?.name},stat:v.stat,pages:v.pages?.map(p=>({cid:p.cid,page:p.page,part:p.part,duration:p.duration}))} : null;});
      status=pageStatus(body,metadata,kind);
      if (status !== 'partial') break;
      await page.waitForTimeout(2500);
    }
    if ([403,429,412].includes(navStatus)) status='blocked';
    let comments = [];
    if (kind === 'video' && status === 'read') {
      await loadCommentSection(page);
      comments = await page.evaluate(()=>{
        const root=document.querySelector('bili-comments');
        function text(node) {
          if(node.nodeType===3) return node.textContent;
          if(['STYLE','SCRIPT','SVG'].includes(node.nodeName)) return '';
          const children=node.shadowRoot?.childNodes || node.childNodes;
          return Array.from(children || []).map(text).join(' ');
        }
        const threads=root?.shadowRoot?.querySelectorAll('bili-comment-thread-renderer') || document.querySelectorAll('.reply-item');
        return Array.from(threads).slice(0,20).map(el=>text(el).replace(/\s+/g,' ').trim()).filter(Boolean);
      });
    }
    const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].filter(a=>a.getClientRects().length).map(a=>({text:a.innerText.trim(),href:a.href})).filter(l=>l.text && /bilibili\.com/.test(l.href)));
    data={source:record.url,final_url:page.url(),title:await page.title(),at:new Date().toISOString(),status,nav_status:navStatus,kind,body,metadata,links,comments,requests,login:'持久Chrome配置；沿用该窗口现有登录；不导出凭据',coverage:'当前可见DOM、公开元数据与最多20个已加载主评论线程；未自动翻页、未观看影像、未展开楼中楼'};
   } catch(error) {data={source:record.url,status:'failed',error:error.message,requests};}
   if (data.metadata?.desc) data.metadata.desc = data.metadata.desc.replace(/(?:商务合作|微信|联系方式|群号|QQ群|招募群|wx[:：]|vx[:：]|电话[:：]|手机[:：])[^\n]*\d{5,}[^\n]*/gi,'[联系方式略]').replace(/(?:加入我们|联系我)\d{5,}/g,'[联系方式略]');
   if (data.body) data.body = data.body.replace(/(?:商务合作|微信|联系方式|群号|QQ群|wx[:：]|vx[:：]|电话[:：]|手机[:：])[^\n]*/gi,'[联系方式略]');
   data.links = (data.links || []).filter(link => !/(?:商务合作|微信|联系方式|群号|wx[:：]|vx[:：])/.test(link.text));
   fs.writeFileSync(filename,JSON.stringify(data,null,2));
   console.log(JSON.stringify({file:path.relative(repo,filename),url:record.url,status:data.status,title:data.title,body_chars:data.body?.length,video_links:new Set((data.links||[]).map(l=>l.href.match(/\/video\/(BV[A-Za-z0-9]+)/)?.[1]).filter(Boolean)).size}));
   await page.close();
   if (data.status === 'blocked') {cooldown.stop('bilibili.com');console.log('Chrome遇验证或拦截，停止本批；保留未读队列。');break;}
   await new Promise(r=>setTimeout(r,2000));
 }
} finally {await browser.close();}
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
