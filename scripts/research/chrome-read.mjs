// 用 Windows 系统 Chrome 读取公开 zKillboard 页面；独立 profile、仅本机 CDP。
// node scripts/research/chrome-read.mjs <URL> <.cache/输出前缀>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('用法：node scripts/research/chrome-read.mjs <zkillboard URL> <.cache/输出前缀>');
  process.exit(1);
}
const url = new URL(input);
if (url.protocol !== 'https:' || url.hostname !== 'zkillboard.com' || url.username || url.password) {
  throw new Error('仅读取 https://zkillboard.com 的公开页面');
}
const prefix = path.resolve(repo, output);
const cache = path.resolve(repo, '.cache');
const relative = path.relative(cache, prefix);
if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
  throw new Error('原始页面只能保存到仓库 .cache 下');
}

if (process.platform !== 'win32') {
  const node = '/mnt/c/Program Files/nodejs/node.exe';
  if (!fs.existsSync(node)) throw new Error('需要 Windows Chrome 和 Windows Node；当前未找到 Windows Node');
  const converted = spawnSync('wslpath', ['-w', fileURLToPath(import.meta.url)], { encoding: 'utf8' });
  if (converted.status !== 0) throw new Error('无法转换 WSL 脚本路径');
  const result = spawnSync(node, [converted.stdout.trim(), input, output], { cwd: repo, stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

process.chdir(repo);
const { chromium } = await import('playwright');
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
    '--new-window', url.href,
  ], { detached: true, stdio: 'ignore' });
  child.on('error', error => { console.error(error.message); process.exitCode = 1; });
  child.unref();
  for (let n = 0; n < 40 && !await available(); n++) await new Promise(resolve => setTimeout(resolve, 500));
}
if (!await available()) throw new Error('Chrome 的本机调试连接未就绪');
fs.mkdirSync(path.dirname(prefix), { recursive: true });
const browser = await chromium.connectOverCDP(endpoint);
try {
  const context = browser.contexts()[0];
  if (!context) throw new Error('未取得 Chrome 上下文');
  let page = context.pages().find(candidate => candidate.url() === url.href);
  if (!page) {
    const navigationFile = path.join(cache, 'chrome-navigation.json');
    let lastNavigation = 0;
    try { lastNavigation = JSON.parse(fs.readFileSync(navigationFile, 'utf8')).at || 0; } catch {}
    await new Promise(resolve => setTimeout(resolve, Math.max(0, 2000 - (Date.now() - lastNavigation))));
    fs.writeFileSync(navigationFile, JSON.stringify({ at: Date.now() }));
    page = await context.newPage();
    await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 45000 });
  }
  const deadline = Date.now() + 180000;
  let ready = false;
  let title = '';
  let body = '';
  while (Date.now() < deadline) {
    try {
      title = await page.title();
      body = await page.locator('body').innerText({ timeout: 5000 });
      if (!/Just a moment|Attention Required/i.test(title) && /zKillboard/i.test(title) && body.trim()) {
        if (!url.pathname.includes('/top/') || /Top Characters|Top Ships/.test(body)) {
          ready = true;
          break;
        }
      }
    } catch { /* 验证页自行导航时等待下一次读取，不刷新页面。 */ }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  if (!ready) {
    await page.screenshot({ path: `${prefix}-blocked.png` }).catch(() => {});
    console.error('浏览器验证尚未通过，停止；未取得正文，不刷新或切换出口。');
    process.exitCode = 2;
  } else {
    const data = await page.evaluate(() => {
      const tables = [...document.querySelectorAll('table')].map(table => ({
        headers: [...table.querySelectorAll('thead th')].map(cell => cell.innerText.trim()),
        rows: [...table.querySelectorAll('tbody tr')].map(row => ({
          cells: [...row.querySelectorAll('td')].map(cell => cell.innerText.trim()),
          links: [...row.querySelectorAll('a[href]')].map(link => ({ text: link.innerText.trim(), href: link.href })),
          images: [...row.querySelectorAll('img')].map(image => ({ src: image.src, alt: image.alt })),
        })),
      }));
      const killLinks = [...new Set([...document.querySelectorAll('a[href]')]
        .map(link => link.href).filter(href => /\/kill\/\d+\//.test(href)))];
      return { tables, killLinks };
    });
    const characters = data.tables.find(table => table.headers.includes('Character') && table.headers.includes('Kills'));
    data.topCharacters = (characters?.rows || []).map(row => ({
      rank: Number(row.cells[0]?.replaceAll(',', '')),
      name: row.cells[1],
      kills: Number(row.cells[2]?.replaceAll(',', '')),
      id: Number(row.links.find(link => /\/character\/\d+\//.test(link.href))?.href.match(/\/character\/(\d+)\//)?.[1]),
    }));
    Object.assign(data, { source: page.url(), title, fetched_at: new Date().toISOString() });
    fs.writeFileSync(`${prefix}.json`, JSON.stringify(data, null, 2));
    fs.writeFileSync(`${prefix}.txt`, body);
    console.log(`已读取：${title}；角色榜 ${data.topCharacters.length} 条；保存 ${output}.json`);
  }
} finally {
  // 断开 CDP 连接，保留独立 Chrome 窗口及 profile，不触碰日常浏览器。
  await browser.close();
}
