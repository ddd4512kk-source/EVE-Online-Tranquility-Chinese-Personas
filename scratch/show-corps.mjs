import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scratch/all-corps-meta.json', 'utf8'));

console.log('--- ALL CORPS SUMMARY ---');
for (let i = 0; i < data.length; i += 20) {
  const chunk = data.slice(i, i + 20);
  console.log(`\nBatch ${i} to ${i + chunk.length}:`);
  for (const c of chunk) {
    console.log(`${c.slug.padEnd(25)} | ${c.cn.padEnd(16)} [${c.ticker.padEnd(6)}] | ${c.alliance.padEnd(6)} | pvp:${c.ratings.pvp} shen:${c.ratings.shenren} inf:${c.ratings.influence} | currLen:${c.epithet.length}`);
  }
}
