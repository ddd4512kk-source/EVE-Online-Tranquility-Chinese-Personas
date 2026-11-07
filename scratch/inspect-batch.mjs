import fs from 'node:fs';
import path from 'node:path';

const slugs = JSON.parse(fs.readFileSync('scratch/slugs-for-epithet.json', 'utf8'));

// Print in batches of 15
const batchIdx = parseInt(process.argv[2] || '0', 10);
const start = batchIdx * 15;
const batch = slugs.slice(start, start + 15);

console.log(`=== BATCH ${batchIdx} (${start} to ${start + batch.length - 1} of ${slugs.length}) ===\n`);

for (const c of batch) {
  const mdPath = path.join('src/corps', c.slug, `${c.slug}.md`);
  let mdHead = '';
  if (fs.existsSync(mdPath)) {
    const lines = fs.readFileSync(mdPath, 'utf8').split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#'));
    mdHead = lines.slice(0, 2).join(' ').slice(0, 100);
  }
  console.log(`[${c.slug}] ${c.cn} [${c.ticker}] (${c.alliance}) | pvp:${c.pvp} shen:${c.shenren} inf:${c.influence}`);
  console.log(`  Current: "${c.currEpithet}" (${c.currEpithet.length} chars)`);
  if (mdHead) console.log(`  Lore: ${mdHead}...`);
  console.log('');
}
