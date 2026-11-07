import fs from 'node:fs';

const meta = JSON.parse(fs.readFileSync('scratch/all-corps-meta.json', 'utf8'));

console.log(`Writing slug list for all ${meta.length} corps...`);

const list = meta.map(c => ({
  slug: c.slug,
  cn: c.cn,
  name: c.name,
  ticker: c.ticker,
  alliance: c.alliance,
  pvp: c.ratings.pvp,
  shenren: c.ratings.shenren,
  influence: c.ratings.influence,
  kills: c.kills,
  currEpithet: c.epithet
}));

fs.writeFileSync('scratch/slugs-for-epithet.json', JSON.stringify(list, null, 2), 'utf8');
console.log('Saved to scratch/slugs-for-epithet.json');
