// 已授权的B站Cookie只在请求时读取，存在内存，不写Cookie文件、不打印值。
import {connectCdp} from './chrome-cdp.mjs';

export function bilibiliCookieHeader(cookies) {
  return cookies.filter(c => /^(?:\.)?(?:[a-z0-9-]+\.)*bilibili\.com$/i.test(c.domain || '') && /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(c.name || '') && !/[;\r\n]/.test(c.value || ''))
    .map(c => `${c.name}=${c.value}`).join('; ');
}
export async function readBilibiliSession() {
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
