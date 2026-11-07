import fs from 'node:fs';

const results = JSON.parse(fs.readFileSync('scratch/deep-scan-results.json', 'utf8'));

console.log(`Total non-tycoons with hits: ${results.length}`);

for (const r of results) {
  // Let's filter hits to see if any hit is about PERSON MANUFACTURING TITAN / CAPITALS
  const buildHits = r.hits.filter(h =>
    /(?:自造|手搓|造过|搓过|制造|生产|下水|交付|承接|批发|量产|出产|工厂).*(?:泰坦|超旗|大航|神使|俄洛巴斯|萨拉希尔|小金鱼|大鲸鱼|索迪约)/.test(h) ||
    /(?:泰坦|超旗|大航|神使|俄洛巴斯|萨拉希尔|小金鱼|大鲸鱼|索迪约).*(?:自造|手搓|造过|搓过|制造|生产|下水|交付|承接|批发|量产|出产|工厂)/.test(h)
  );

  if (buildHits.length > 0) {
    console.log(`\n========================================`);
    console.log(`[${r.slug}] ${r.name} | Tags: ${r.tags.join(', ')}`);
    for (const bh of buildHits) {
      console.log(`  * ${bh}`);
    }
  }
}
