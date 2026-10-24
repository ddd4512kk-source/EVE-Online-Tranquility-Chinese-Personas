// 用 Windows 系统 Chrome 读取公开 zKillboard 页面；独立 profile、仅本机 CDP。
// node scripts/research/chrome-read.mjs <URL> <.cache/输出前缀>
import fs from 'node:fs';
import { zkillUrl, cachePrefix, connectZkillChrome, openZkillPage, waitZkillReady } from './zkill-chrome.mjs';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('用法：node scripts/research/chrome-read.mjs <zkillboard URL> <.cache/输出前缀>');
  process.exit(1);
}
const url = zkillUrl(input);
const prefix = cachePrefix(output);
const { browser, context } = await connectZkillChrome(url.href);
let page;
try {
  page = await openZkillPage(context, url.href);
  const loaded = await waitZkillReady(page, (_, __, body) => !url.pathname.includes('/top/') || /Top Characters|Top Ships/.test(body));
  if (!loaded) {
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
    Object.assign(data, { source: page.url(), title: loaded.title, fetched_at: new Date().toISOString() });
    fs.writeFileSync(`${prefix}.json`, JSON.stringify(data, null, 2));
    fs.writeFileSync(`${prefix}.txt`, loaded.body);
    console.log(`已读取：${loaded.title}；角色榜 ${data.topCharacters.length} 条；保存 ${output}.json`);
  }
} finally {
  // 关掉本次标签并断开 CDP，保留独立 Chrome 窗口及 profile，不触碰日常浏览器。
  await page?.close().catch(() => {});
  await browser.close();
}
