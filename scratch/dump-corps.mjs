import fs from 'node:fs';
import path from 'node:path';

const corpsDir = 'src/corps';
const entries = fs.readdirSync(corpsDir, { withFileTypes: true }).filter(d => d.isDirectory());
const all = [];

for (const e of entries) {
  const jsonPath = path.join(corpsDir, e.name, `${e.name}.json`);
  const mdPath = path.join(corpsDir, e.name, `${e.name}.md`);
  if (!fs.existsSync(jsonPath)) continue;
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  all.push({
    slug: e.name,
    cn: json.corp?.cn_name || '',
    name: json.esi?.name || '',
    ticker: json.esi?.ticker || '',
    alliance: json.esi?.alliance?.ticker || '独立',
    allianceName: json.esi?.alliance?.name || '独立',
    epithet: json.corp?.epithet || '',
    ratings: json.corp?.ratings || {},
    memberCount: json.esi?.member_count || 0,
    kills: json.zkb?.kills || 0,
    hasMd: md.trim().length > 100 && !md.includes('corpUnwritten'),
  });
}

all.sort((a, b) => b.kills - a.kills);

console.log(`Loaded ${all.length} corps.`);
fs.writeFileSync('scratch/all-corps-meta.json', JSON.stringify(all, null, 2), 'utf8');
console.log('Saved to scratch/all-corps-meta.json');
