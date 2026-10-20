// 生成全站衬线字体切片：Noto Serif SC（SIL Open Font License 1.1）固定 400、700 两个字重，按本站用字频率切成若干 woff2，
// 浏览器按 unicode-range 只下载当页用到的切片。字集 = 本站已用字 ∪ GB2312，新收的生僻字不在其中时该字回退系统宋体。
// 一次性工具，不接入构建与 CI；字形缺得多了再跑一次（npm i --no-save 会清掉别的临时包，playwright 一并装）：
//   npm i --no-save subset-font playwright && npm run build && node scripts/make-fonts.mjs <NotoSerifSC-VF.ttf>
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const source = process.argv[2];
if (!source) {
  console.error("用法：node scripts/make-fonts.mjs <NotoSerifSC-VF.ttf>");
  process.exit(1);
}
let subsetFont;
try {
  ({ default: subsetFont } = await import("subset-font"));
} catch {
  console.error("缺 subset-font：先运行 npm i --no-save subset-font playwright");
  process.exit(1);
}

const OUT_DIR = "src/assets/fonts/serif";
const CSS = "src/assets/css/fonts.css";
const FAMILY = "Yeshi Serif";
const WEIGHTS = [400, 700];
// 字表前段（常用字）切得细，后段切得粗：多数页面只下载前几片
const sliceSize = (i) => (i < 10 ? 200 : 500);

const isWanted = (ch) => /[\p{Script=Han}　-〿！-～—…“”‘’·]/u.test(ch);
const isHan = (ch) => /\p{Script=Han}/u.test(ch);

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "pagefind") yield* htmlFiles(p); }
    else if (e.name.endsWith(".html")) yield p;
  }
}

const freq = new Map();
for await (const file of htmlFiles("_site")) {
  const text = (await readFile(file, "utf8")).replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, "");
  for (const ch of text) if (isWanted(ch)) freq.set(ch, (freq.get(ch) || 0) + 1);
}
if (!freq.size) {
  console.error("_site 为空：先 npm run build");
  process.exit(1);
}

const gb = new TextDecoder("gb2312");
const gbChars = [];
for (let hi = 0xb0; hi <= 0xf7; hi++) {
  for (let lo = 0xa1; lo <= 0xfe; lo++) {
    const ch = gb.decode(Uint8Array.of(hi, lo));
    if ([...ch].length === 1 && isHan(ch)) gbChars.push(ch);
  }
}

const used = [...freq].sort((a, b) => b[1] - a[1]).map(([ch]) => ch);
const usedSet = new Set(used);
const punct = used.filter((ch) => !isHan(ch));
const han = [...used.filter(isHan), ...gbChars.filter((ch) => !usedSet.has(ch))];

const ascii = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i));
const slices = [];
for (let at = 0, i = 0; at < han.length; i++) {
  const n = sliceSize(i);
  slices.push(han.slice(at, at + n));
  at += n;
}
slices[0] = [...ascii, ...punct, ...slices[0]];

function unicodeRange(chars) {
  const cps = [...new Set(chars.map((c) => c.codePointAt(0)))].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < cps.length; i++) {
    let j = i;
    while (j + 1 < cps.length && cps[j + 1] === cps[j] + 1) j++;
    const hex = (n) => n.toString(16);
    out.push(j > i ? `U+${hex(cps[i])}-${hex(cps[j])}` : `U+${hex(cps[i])}`);
    i = j;
  }
  return out.join(",");
}

const font = await readFile(source);
await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });
const faces = [];
const totals = {};
for (const weight of WEIGHTS) {
  totals[weight] = 0;
  for (const [i, chars] of slices.entries()) {
    const buf = await subsetFont(font, chars.join(""), {
      targetFormat: "woff2",
      variationAxes: { wght: weight },
      preserveNameIds: [0, 1, 2, 3, 4, 5, 6, 13, 14], // 保留版权与 OFL 许可声明
    });
    const name = `${weight}-${String(i).padStart(2, "0")}-${createHash("sha1").update(buf).digest("hex").slice(0, 8)}.woff2`;
    await writeFile(path.join(OUT_DIR, name), buf);
    totals[weight] += buf.length;
    faces.push(`@font-face{font-family:"${FAMILY}";font-style:normal;font-weight:${weight};font-display:swap;src:url("../fonts/serif/${name}") format("woff2");unicode-range:${unicodeRange(chars)}}`);
  }
}
await writeFile(CSS, `/* 由 scripts/make-fonts.mjs 生成，勿手改。衬线字体：Noto Serif SC ${WEIGHTS.join("、")}，SIL Open Font License 1.1。 */\n${faces.join("\n")}\n`);
console.log(`${slices.length} 片 × ${WEIGHTS.length} 字重，${han.length} 个汉字（本站已用 ${used.length - punct.length}），` +
  WEIGHTS.map((w) => `${w}：${(totals[w] / 1024).toFixed(0)} KB`).join("，"));
