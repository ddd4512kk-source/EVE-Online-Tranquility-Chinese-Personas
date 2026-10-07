// 批量中文搜索：按节奏依次跑一批关键词，百度被验证码拦了自动换 360、再换必应，三家都拦就冷却后重试。
//
//   node scripts/research/batch-search.mjs <查询清单.tsv> <输出目录>
//
// 查询清单每行一条：<标识>\t<关键词>（标识一般是列传文件名）。
// 每条结果写到 <输出目录>/<标识>__<序号>.txt，第一行注明用的引擎或“搜索失败”。已存在的结果会跳过，可随时中断后续跑。
// 依赖 playwright（见 baidu-search.mjs 顶部的安装说明）。

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [listFile, outDir] = process.argv.slice(2);
if (!listFile || !outDir) {
  console.error("用法：node scripts/research/batch-search.mjs <查询清单.tsv> <输出目录>");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });
const rows = fs.readFileSync(listFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => l.split("\t"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PACE = Number(process.env.PACE_MS || 15000); // 每条之间的间隔
const COOL = Number(process.env.COOL_MS || 10 * 60000); // 三家都被拦时的冷却

const browser = await chromium.launch();
const ctx = await browser.newContext({
  locale: "zh-CN",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
});
const page = await ctx.newPage();

const engines = {
  百度: {
    url: (q) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`,
    sel: "#content_left > div",
    pick: (d) => {
      const a = d.querySelector("h3 a");
      return a ? { title: a.innerText.trim(), url: d.getAttribute("mu") || a.href, text: d.innerText.replace(/\s+/g, " ") } : null;
    },
  },
  "360": {
    url: (q) => `https://www.so.com/s?q=${encodeURIComponent(q)}`,
    sel: "ul.result > li",
    pick: (l) => {
      const a = l.querySelector("h3 a");
      return a ? { title: a.innerText.trim(), url: a.href, text: l.innerText.replace(/\s+/g, " ") } : null;
    },
  },
  必应: {
    url: (q) => `https://cn.bing.com/search?q=${encodeURIComponent(q)}`,
    sel: "#b_results > li.b_algo",
    wait: "li.b_algo",
    pick: (l) => {
      const a = l.querySelector("h2 a");
      return a ? { title: a.innerText.trim(), url: a.href, text: l.innerText.replace(/\s+/g, " ") } : null;
    },
  },
};
const blockedUntil = { 百度: 0, "360": 0, 必应: 0 };

async function search(engineName, q) {
  const e = engines[engineName];
  await page.goto(e.url(q), { waitUntil: "domcontentloaded", timeout: 45000 });
  if (e.wait) await page.waitForSelector(e.wait, { timeout: 10000 }).catch(() => {});
  else await page.waitForTimeout(2500);
  const title = await page.title();
  if (/验证|captcha|异常/i.test(title) || (await page.locator("text=安全验证").count()) > 0) return { blocked: true, title };
  const items = await page.$$eval(e.sel, (els, pickSrc) => {
    const pick = new Function(`return (${pickSrc})`)();
    return els.map(pick).filter(Boolean);
  }, e.pick.toString());
  return { blocked: false, items };
}

let n = 0;
for (let i = 0; i < rows.length; i++) {
  const [tag, q] = rows[i];
  const file = path.join(outDir, `${tag}__${String(i).padStart(4, "0")}.txt`);
  if (fs.existsSync(file)) continue;
  let done = false;
  for (let attempt = 0; attempt < 4 && !done; attempt++) {
    for (const name of ["百度", "360", "必应"]) {
      if (Date.now() < blockedUntil[name]) continue;
      let r;
      try { r = await search(name, q); } catch (err) { r = { blocked: true, title: String(err).slice(0, 80) }; }
      if (r.blocked) {
        blockedUntil[name] = Date.now() + COOL;
        console.log(`[${i}] ${name} 被拦（${r.title}），换下一家`);
        continue;
      }
      const body = r.items.map((it) => `■ ${it.title}\n  ${it.url}\n  ${it.text.slice(0, 500)}\n`).join("\n");
      fs.writeFileSync(file, `引擎：${name}\n查询：${q}\n结果数：${r.items.length}\n\n${body}`);
      console.log(`[${i}/${rows.length}] ${name} ${r.items.length} 条：${q}`);
      done = true;
      break;
    }
    if (!done) {
      const wait = Math.max(0, Math.min(...Object.values(blockedUntil)) - Date.now()) + 5000;
      console.log(`[${i}] 三家都被拦，冷却 ${Math.round(wait / 60000)} 分钟`);
      await sleep(wait);
    }
  }
  if (!done) fs.writeFileSync(file, `引擎：搜索失败\n查询：${q}\n三家都被拦，未搜到。不等于没有料。\n`);
  n++;
  await sleep(PACE + Math.random() * 5000);
}
await browser.close();
console.log(`完成，本次新跑 ${n} 条`);
