import fs from 'node:fs';

const all = JSON.parse(fs.readFileSync('scratch/all-corps-details.json', 'utf8'));

for (let i = 0; i < all.length; i++) {
  const c = all[i];
  console.log(`${i}. [${c.slug}] "${c.cn}" [${c.ticker}] (${c.alliance})`);
}
