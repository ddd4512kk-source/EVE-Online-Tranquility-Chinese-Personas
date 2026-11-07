// 校验军团篇：每个军团目录有同名正文与档案，字段合法，正文按军团志模板。
import fs from 'node:fs';
import path from 'node:path';
import { validateCorpArchive, validateCorpBody } from './corps.mjs';

const root = path.resolve(import.meta.dirname, '../src/corps');
const errors = [];
const seen = new Map();
const slugs = fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
for (const slug of slugs) {
  const body = path.join(root, slug, `${slug}.md`);
  const data = path.join(root, slug, `${slug}.json`);
  if (!fs.existsSync(body) || !fs.existsSync(data)) {
    errors.push(`${slug}：缺同名 .md 或 .json`);
    continue;
  }
  const archive = JSON.parse(fs.readFileSync(data, 'utf8'));
  errors.push(...validateCorpArchive(archive, slug), ...validateCorpBody(fs.readFileSync(body, 'utf8'), slug));
  const id = archive.corp?.id;
  if (seen.has(id)) errors.push(`${slug}：军团 ID 与 ${seen.get(id)} 重复`);
  seen.set(id, slug);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`军团篇校验通过（${slugs.length} 个军团）。`);
