// 系统 Chrome 读取 zKillboard 的公共部分：独立 profile、仅本机 CDP，不触碰日常浏览器。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { connectChromePages } from './chrome-cdp.mjs';

export const repo = fileURLToPath(new URL('../../', import.meta.url));
export const cache = path.resolve(repo, '.cache');
const endpoint = 'http://127.0.0.1:9223';
// 与首次已验证的系统 Chrome 使用同一独立 profile，保留正常验证状态。
const profile = path.join(cache, 'zkill-curl-check', 'chrome-cdp-profile');

export function zkillUrl(input) {
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.hostname !== 'zkillboard.com' || url.username || url.password) {
    throw new Error('仅读取 https://zkillboard.com 的公开页面');
  }
  return url;
}

export function cachePrefix(output) {
  const prefix = path.resolve(repo, output);
  const relative = path.relative(cache, prefix);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('原始页面只能保存到仓库 .cache 下');
  fs.mkdirSync(path.dirname(prefix), { recursive: true });
  return prefix;
}

async function available() {
  try {
    const response = await fetch(`${endpoint}/json/version`, { signal: AbortSignal.timeout(5000) });
    const data = await response.json();
    return response.ok && /^Chrome\//.test(data.Browser || '');
  } catch { return false; }
}

// 逐页连接（chrome-cdp.mjs），不像 Playwright 那样附加到同一 Chrome 里的 B站等日常标签。
export async function connectZkillChrome(firstUrl) {
  process.chdir(repo);
  const executable = [
    path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ].find(value => fs.existsSync(value));
  if (!executable) throw new Error('未找到系统 Chrome');
  if (!await available()) {
    const child = spawn(executable, [
      '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9223',
      `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
      '--new-window', firstUrl,
    ], { detached: true, stdio: 'ignore' });
    child.on('error', error => { console.error(error.message); process.exitCode = 1; });
    child.unref();
    for (let n = 0; n < 40 && !await available(); n++) await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!await available()) throw new Error('Chrome 的本机调试连接未就绪');
  const browser = await connectChromePages(endpoint);
  return { browser, context: browser.contexts()[0] };
}

// 限速 2 秒后新开标签；用完由调用方 page.close()。
export async function openZkillPage(context, href) {
  const navigationFile = path.join(cache, 'chrome-navigation.json');
  let lastNavigation = 0;
  try { lastNavigation = JSON.parse(fs.readFileSync(navigationFile, 'utf8')).at || 0; } catch {}
  await new Promise(resolve => setTimeout(resolve, Math.max(0, 2000 - (Date.now() - lastNavigation))));
  fs.writeFileSync(navigationFile, JSON.stringify({ at: Date.now() }));
  const page = await context.newPage();
  await page.goto(href, { timeout: 45000 });
  return page;
}

// 等 Cloudflare 验证自行通过；ready(page, title, body) 额外判定页面就绪。
export async function waitZkillReady(page, ready = () => true, timeout = 180000) {
  const deadline = Date.now() + timeout;
  let title = '', body = '';
  while (Date.now() < deadline) {
    try {
      title = await page.title();
      body = await page.locator('body').innerText({ timeout: 5000 });
      if (!/Just a moment|Attention Required/i.test(title) && /zKillboard/i.test(title) && body.trim()
        && await ready(page, title, body)) return { title, body };
    } catch { /* 验证页自行导航时等待下一次读取，不刷新页面。 */ }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  return null;
}
