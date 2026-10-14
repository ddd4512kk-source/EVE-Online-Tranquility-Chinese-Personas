// 已授权的B站Cookie只在请求时读取，存在内存，不写Cookie文件、不打印值。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {connectCdp} from './chrome-cdp.mjs';

export function bilibiliCookieHeader(cookies) {
  return cookies.filter(c => /^(?:\.)?(?:[a-z0-9-]+\.)*bilibili\.com$/i.test(c.domain || '') && /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(c.name || '') && !/[;\r\n]/.test(c.value || ''))
    .map(c => `${c.name}=${c.value}`).join('; ');
}
export async function readBilibiliSession() {
  if (process.platform !== 'win32') {
    const node='/mnt/c/Program Files/nodejs/node.exe';
    if(!fs.existsSync(node)) return '';
    const converted=spawnSync('wslpath',['-w',fileURLToPath(import.meta.url)],{encoding:'utf8'});
    if(converted.status!==0) return '';
    // 输出仅进入父进程内存；调用方不得记录header或错误对象的stdout。
    const result=spawnSync(node,[converted.stdout.trim(),'--internal-header'],{encoding:'utf8',timeout:20000});
    return result.status===0 ? result.stdout.trim() : '';
  }
  try {
    const targets=await(await fetch('http://127.0.0.1:9223/json/list',{signal:AbortSignal.timeout(5000)})).json();
    const page=targets.find(p=>p.type==='page' && /^https:\/\/(?:www|space)\.bilibili\.com\//.test(p.url));
    if(!page) return '';
    const cdp=await connectCdp(page.webSocketDebuggerUrl);
    try {
      // 按URL请求Cookie，不读取其他网站Cookie。
      const {cookies=[]}=await cdp.send('Network.getCookies',{urls:['https://www.bilibili.com/','https://api.bilibili.com/','https://space.bilibili.com/']});
      return bilibiliCookieHeader(cookies);
    } finally {cdp.close();}
  } catch {return '';}
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url) && process.argv[2]==='--internal-header') process.stdout.write(await readBilibiliSession());
