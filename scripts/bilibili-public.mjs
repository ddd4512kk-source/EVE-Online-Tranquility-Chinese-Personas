// 从私有 B站档案生成网站要显示的精简派生文件：每人已确认账号名与 UP主高播视频数，不含作品、摘要和来源。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { personUpzhu } from './activity.mjs';
import { ARCHIVE } from './bilibili-archive.mjs';
import { BILIBILI_PUBLIC } from './person-identity.mjs';
import { flatten, readdir, requireKb, resolve } from './workspace.mjs';

const HELP = `用法：node scripts/bilibili-public.mjs write | check
  write  从 kb/${flatten(ARCHIVE)}/ 重新生成 ${BILIBILI_PUBLIC}
  check  比对重新生成的结果与现有文件，不一致时退出码为 1`;

export function buildBilibiliPublic(root) {
  const byPerson = new Map();
  for (const { name: file } of readdir(root, ARCHIVE).filter(entry => /^\d+\.json$/.test(entry.name))) {
    const profile = JSON.parse(fs.readFileSync(resolve(root, `${ARCHIVE}/${file}`), 'utf8'));
    const slug = profile.identity?.state === 'confirmed' ? profile.identity.person : '';
    if (!slug) continue;
    if (!fs.existsSync(path.join(root, 'src/people', slug, `${slug}.md`))) throw new Error(`${ARCHIVE}/${file}：B站已对应人物不存在：${slug}`);
    if (!byPerson.has(slug)) byPerson.set(slug, []);
    byPerson.get(slug).push(profile);
  }
  const result = {};
  for (const slug of [...byPerson.keys()].sort()) {
    const profiles = byPerson.get(slug); // 沿用档案文件名顺序，与原先读取 docs/bilibili 的顺序一致
    const up = personUpzhu(profiles, slug);
    result[slug] = { accounts: profiles.map(profile => profile.name), ...(up.upzhu ? { upzhu: up.count } : {}) };
  }
  return `${JSON.stringify(result, null, 2)}\n`;
}

export function run(root, command) {
  if (command === 'write') {
    fs.writeFileSync(path.join(root, BILIBILI_PUBLIC), buildBilibiliPublic(root));
    return `已生成 ${BILIBILI_PUBLIC}`;
  }
  if (command === 'check') {
    const file = path.join(root, BILIBILI_PUBLIC);
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    if (current !== buildBilibiliPublic(root)) throw new Error(`${BILIBILI_PUBLIC} 需要更新：运行 npm run bilibili:public`);
    return `${BILIBILI_PUBLIC} 与 B站档案一致`;
  }
  throw new Error(HELP);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(import.meta.dirname, '..');
    if (['write', 'check'].includes(process.argv[2])) requireKb(root);
    console.log(run(root, process.argv[2]));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
