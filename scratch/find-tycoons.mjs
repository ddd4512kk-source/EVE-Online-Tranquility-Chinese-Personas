import fs from 'node:fs';
import path from 'node:path';

const tycoons = (await import('../src/_data/tycoonPeople.js')).default();
const peopleDir = './src/people';
const slugs = fs.readdirSync(peopleDir).filter(s => fs.statSync(path.join(peopleDir, s)).isDirectory());

const candidates = [];

for (const slug of slugs) {
  if (tycoons[slug]) continue;
  const mdPath = path.join(peopleDir, slug, `${slug}.md`);
  const matPath = path.join(peopleDir, slug, `materials-${slug}.md`);
  const idPath = fs.readdirSync(path.join(peopleDir, slug)).find(f => f.endsWith('-id.json'));
  const idJson = idPath ? JSON.parse(fs.readFileSync(path.join(peopleDir, slug, idPath), 'utf8')) : null;

  const content = (fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '') + '\n' +
                  (fs.existsSync(matPath) ? fs.readFileSync(matPath, 'utf8') : '');

  const patterns = [
    /(?:制造|生产|手搓|造|出产|定制|承接|批发).{0,15}(?:泰坦|超旗|旗舰|大航|超级航空母舰|无畏)/g,
    /(?:泰坦|超旗|旗舰|大航|超级航空母舰|无畏).{0,15}(?:制造|生产|手搓|制造商|工厂|订单|批发|下水|交付)/g,
    /(?:工业|造船|船厂|制造).{0,15}(?:大户|大佬|核心|骨干|主管|总监)/g
  ];

  const matches = [];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) matches.push(...m);
  }

  if (matches.length > 0) {
    candidates.push({
      slug,
      name: idJson?.person?.cn_name || slug,
      matchCount: matches.length,
      samples: [...new Set(matches)].slice(0, 8),
      tags: idJson?.person?.tags || []
    });
  }
}

candidates.sort((a, b) => b.matchCount - a.matchCount);
fs.writeFileSync('scratch/candidates.json', JSON.stringify(candidates, null, 2), 'utf8');
console.log(`Found ${candidates.length} candidates. Top 25:`);
for (const c of candidates.slice(0, 25)) {
  console.log(`${c.slug} (${c.name}): matches=${c.matchCount}, tags=${c.tags.join(',')}`);
  console.log('   samples:', c.samples.slice(0, 4).join(' | '));
}
