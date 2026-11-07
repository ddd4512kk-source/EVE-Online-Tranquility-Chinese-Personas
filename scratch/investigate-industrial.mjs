import fs from 'node:fs';
import path from 'node:path';

const tycoons = (await import('../src/_data/tycoonPeople.js')).default();
const peopleDir = './src/people';
const slugs = fs.readdirSync(peopleDir).filter(s => fs.statSync(path.join(peopleDir, s)).isDirectory());

const industrialPeople = [];
for (const slug of slugs) {
  const idPath = fs.readdirSync(path.join(peopleDir, slug)).find(f => f.endsWith('-id.json'));
  if (!idPath) continue;
  const idJson = JSON.parse(fs.readFileSync(path.join(peopleDir, slug, idPath), 'utf8'));
  const tags = idJson.person?.tags || [];
  if (tags.includes('工业')) {
    industrialPeople.push({
      slug,
      name: idJson.person?.cn_name,
      isTycoon: !!tycoons[slug],
      tags
    });
  }
}
console.log('Total people with 工业 tag:', industrialPeople.length);
for (const p of industrialPeople) {
  console.log(`${p.slug.padEnd(25)} ${(p.name || '').padEnd(12)} Tycoon: ${p.isTycoon}`);
}
