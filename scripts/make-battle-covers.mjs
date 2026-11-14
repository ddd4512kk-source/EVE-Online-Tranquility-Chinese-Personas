// 按 battle.cover 把视频封面裁成 16:9 战役头图 src/assets/emblems/cover-<短名>.webp。
// battle.coverEdit 可抹掉封面原有大字（erase 矩形，原图像素）并写入自己的文字（lines）：先抹字，再裁剪。
// 不接入构建：头图进仓库，校验只查文件是否存在。原图存 .cache/battle-covers/，重做不重新下载。
//   npm run covers              补齐缺失头图
//   npm run covers -- <短名>…   重做指定战役（换过封面视频后用）
/* global createImageBitmap, document, window -- 这几段在 page.evaluate 里运行于浏览器 */
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { readBattleDocument } from './battle-archive.mjs';
import { coverCrop, coverSrc } from './battle-emblem.mjs';
import { createRequestGuard } from './research/request-guard.mjs';

const MAX_WIDTH = 960; // 详情页头图约 992px 宽；小图不放大
const root = path.resolve(import.meta.dirname, '..');
const cacheDir = path.join(root, '.cache/battle-covers');
const request = createRequestGuard({ limit: 60 });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const videoIdOf = url => url.match(/BV[0-9A-Za-z]{10}/)?.[0] ?? new URL(url).searchParams.get('v');

async function coverUrls(id) {
  if (!id.startsWith('BV')) return [`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`];
  const res = await request(`https://api.bilibili.com/x/web-interface/view?bvid=${id}`, { headers: { 'User-Agent': UA } });
  const body = await res.json();
  if (body.code !== 0) throw new Error(`B站视频信息获取失败：${id} 接口返回 ${body.code} ${body.message ?? ''}`);
  return [body.data.pic.replace(/^http:/, 'https:')];
}

async function originalOf(id) {
  const file = path.join(cacheDir, `${id}.img`);
  try { return await readFile(file); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  for (const url of await coverUrls(id)) {
    const res = await request(url);
    if (!res.ok) continue;
    const bytes = Buffer.from(await res.arrayBuffer());
    await mkdir(cacheDir, { recursive: true });
    await writeFile(file, bytes);
    return bytes;
  }
  throw new Error(`封面下载失败：${id}`);
}

// 浏览器内执行：亮色（白字）掩膜扩张后，用四向最近已知像素按距离反比插值填平，再叠颗粒；随后写入自己的文字。
async function edit({ erase = [], lines = [] }) {
  const bitmap = window.bitmap;
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  context.drawImage(bitmap, 0, 0);
  const W = canvas.width, H = canvas.height;
  const image = context.getImageData(0, 0, W, H), d = image.data, original = d.slice();
  const mask = new Uint8Array(W * H), grown = new Uint8Array(W * H), R = 7;
  for (const [x0, y0, w, h] of erase) {
    for (let y = y0; y < Math.min(H, y0 + h); y++) for (let x = x0; x < Math.min(W, x0 + w); x++) {
      const i = (y * W + x) * 4;
      const bright = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2] > 130;
      const redOutline = d[i] > 150 && d[i + 1] < 100 && d[i + 2] < 100; // 红色描边字
      if (bright || redOutline) mask[y * W + x] = 1;
    }
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) {
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 1 && yy < H - 1 && xx >= 1 && xx < W - 1) grown[yy * W + xx] = 1;
    }
  }
  const filled = [];
  for (let p = 0; p < W * H; p++) if (grown[p]) filled.push(p);
  const nearest = (p, step) => {
    let q = p, n = 0;
    while (n < 400 && q >= 0 && q < W * H && grown[q]) { q += step; n++; }
    return q >= 0 && q < W * H && !grown[q] ? { q, n } : null;
  };
  for (const p of filled) {
    let r = 0, g = 0, b = 0, sum = 0;
    for (const step of [-1, 1, -W, W]) {
      const hit = nearest(p, step);
      if (!hit) continue;
      const w = 1 / (hit.n * hit.n);
      r += original[hit.q * 4] * w; g += original[hit.q * 4 + 1] * w; b += original[hit.q * 4 + 2] * w; sum += w;
    }
    if (!sum) continue;
    const noise = (Math.random() - 0.5) * 6;
    d[p * 4] = r / sum + noise; d[p * 4 + 1] = g / sum + noise; d[p * 4 + 2] = b / sum + noise;
  }
  for (let pass = 0; pass < 6; pass++) for (const p of filled) for (let k = 0; k < 3; k++) {
    d[p * 4 + k] = (d[(p - 1) * 4 + k] + d[(p + 1) * 4 + k] + d[(p - W) * 4 + k] + d[(p + W) * 4 + k] + 2 * d[p * 4 + k]) / 6;
  }
  context.putImageData(image, 0, 0);
  context.lineJoin = 'round';
  for (const { text, size, x, y } of lines) {
    context.font = `800 ${size}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    context.lineWidth = size / 6;
    context.strokeStyle = 'rgba(0,0,0,.85)';
    context.strokeText(text, x, y);
    context.fillStyle = '#fff';
    context.fillText(text, x, y);
  }
  window.bitmap = await createImageBitmap(canvas);
}

const named = process.argv.slice(2);
const slugs = (await readdir(path.join(root, 'src/battles'), { withFileTypes: true }))
  .filter(d => d.isDirectory() && !d.name.startsWith('_')).map(d => d.name);
const unknown = named.filter(s => !slugs.includes(s));
if (unknown.length) {
  console.error(`没有这些战役：${unknown.join('、')}`);
  process.exit(1);
}

const todo = [];
for (const slug of named.length ? named : slugs) {
  const { cover, coverEdit } = readBattleDocument(path.join(root, 'src/battles', slug, `${slug}.md`)).data;
  if (!cover) {
    if (named.length) throw new Error(`${slug} 未配置 battle.cover`);
    continue;
  }
  const file = path.join(root, 'src', coverSrc(slug));
  if (!named.length) {
    try { await readFile(file); continue; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  todo.push({ slug, cover, coverEdit, file });
}

if (todo.length) {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  try {
    for (const { slug, cover, coverEdit, file } of todo) {
      const original = await originalOf(videoIdOf(cover));
      const size = await page.evaluate(async base64 => {
        const bitmap = await createImageBitmap(await (await fetch(`data:image/*;base64,${base64}`)).blob());
        window.bitmap = bitmap;
        return { width: bitmap.width, height: bitmap.height };
      }, original.toString('base64'));
      if (coverEdit) await page.evaluate(edit, coverEdit);
      const webp = await page.evaluate(({ crop, maxWidth }) => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(maxWidth, crop.width);
        canvas.height = Math.round(canvas.width * crop.height / crop.width);
        const context = canvas.getContext('2d');
        context.imageSmoothingQuality = 'high';
        context.drawImage(window.bitmap, crop.left, crop.top, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/webp', 0.78);
      }, { crop: coverCrop(size.width, size.height), maxWidth: MAX_WIDTH });
      if (!webp.startsWith('data:image/webp;base64,')) throw new Error(`${slug}：浏览器未能编码 WebP`);
      const temp = `${file}.${process.pid}.tmp`;
      await writeFile(temp, Buffer.from(webp.split(',')[1], 'base64'));
      await rename(temp, file);
    }
  } finally {
    await browser.close();
  }
}
console.log(`战役头图生成 ${todo.length} 张。`);
