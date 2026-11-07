import fs from 'node:fs';
import path from 'node:path';

const slugs = JSON.parse(fs.readFileSync('scratch/slugs-for-epithet.json', 'utf8'));

const out = slugs.map(c => {
  const mdPath = path.join('src/corps', c.slug, `${c.slug}.md`);
  let lore = '';
  if (fs.existsSync(mdPath)) {
    const raw = fs.readFileSync(mdPath, 'utf8');
    const clean = raw.replace(/#+.*?\n/g, ' ').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/\s+/g, ' ').trim();
    lore = clean.slice(0, 300);
  }
  return {
    slug: c.slug,
    cn: c.cn,
    ticker: c.ticker,
    alliance: c.alliance,
    pvp: c.pvp,
    shenren: c.shenren,
    influence: c.influence,
    currEpithet: c.currEpithet,
    lore
  };
});

fs.writeFileSync('scratch/all-corps-details.json', JSON.stringify(out, null, 2), 'utf8');
console.log('Saved 155 corps details to scratch/all-corps-details.json');
