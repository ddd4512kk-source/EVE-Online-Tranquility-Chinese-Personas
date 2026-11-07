// 校验正文专名：舰船、建筑、星系、星域写成英文即失败，并给出中文名。
import fs from 'node:fs';
import path from 'node:path';
import { glossaryEntries } from './glossary.mjs';
import regionNames from '../src/_data/regionNames.js';
import systemNames from '../src/_data/systemNames.js';
import { applyExceptions, findEnglishNames, gameNames, namePattern, validateExceptions } from './game-names.mjs';

const root = path.resolve(import.meta.dirname, '..');
const exceptionsFile = path.join(root, 'docs/game-name-exceptions.json');
const exceptions = JSON.parse(fs.readFileSync(exceptionsFile, 'utf8'));
const names = gameNames(glossaryEntries, systemNames, regionNames);
const pattern = namePattern(names);
const errors = validateExceptions(exceptions);
const seen = new Set();
for (const section of ['people', 'battles', 'corps']) {
  const dir = path.join(root, 'src', section);
  for (const { name: slug } of fs.readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const file = `src/${section}/${slug}/${slug}.md`;
    if (!fs.existsSync(path.join(root, file))) continue;
    seen.add(file);
    const { kept, stale } = applyExceptions(file, findEnglishNames(fs.readFileSync(path.join(root, file), 'utf8'), names, pattern), exceptions);
    for (const { line, term, zh } of kept) errors.push(`${file}:${line} ${term} → ${zh}`);
    for (const term of stale) errors.push(`docs/game-name-exceptions.json：${file} 已没有 ${term}，删掉这条例外`);
    for (const json of fs.readdirSync(path.join(dir, slug)).filter(name => name.endsWith('.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(dir, slug, json), 'utf8'));
      const epithet = (data.person ?? data.battle ?? data.corp)?.epithet;
      if (typeof epithet !== 'string') continue;
      for (const { term, zh } of findEnglishNames(epithet, names, pattern)) errors.push(`src/${section}/${slug}/${json} epithet ${term} → ${zh}`);
    }
  }
}
for (const file of Object.keys(exceptions.files ?? {})) {
  if (!seen.has(file)) errors.push(`docs/game-name-exceptions.json：找不到正文 ${file}`);
}
if (errors.length) {
  console.error(`${errors.join('\n')}\n\n正文的舰船、建筑、星系、星域名须写中文，见 docs/terminology.md；确是人名、组织名等同形词才登记例外。`);
  process.exit(1);
}
console.log(`专名校验通过（${seen.size} 篇正文）。`);
