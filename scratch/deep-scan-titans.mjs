import fs from 'node:fs';
import path from 'node:path';

const tycoons = (await import('../src/_data/tycoonPeople.js')).default();
const peopleDir = './src/people';
const slugs = fs.readdirSync(peopleDir).filter(s => fs.statSync(path.join(peopleDir, s)).isDirectory());

const results = [];

const keywords = [
  '泰坦', '超旗', '超级旗舰', '索迪约', '阿兹贝尔', '旗舰制造', '制造泰坦',
  '手搓泰坦', '搓泰坦', '造泰坦', '批发旗舰', '量产旗舰', '旗舰订单',
  '泰坦订单', '征服者', '科莫多', '萨拉希尔', '神使', '俄洛巴斯', '拉格纳洛克', '勒维亚坦',
  '大航', '超母', '天灾', '夜神', '归一', '飞龙', '万古', '赫尔'
];

for (const slug of slugs) {
  const dir = path.join(peopleDir, slug);
  const files = fs.readdirSync(dir);
  const texts = [];
  let name = slug;
  let tags = [];

  for (const f of files) {
    const full = path.join(dir, f);
    if (f.endsWith('-id.json')) {
      const j = JSON.parse(fs.readFileSync(full, 'utf8'));
      name = j.person?.cn_name || slug;
      tags = j.person?.tags || [];
    } else if (f.endsWith('.md')) {
      texts.push(fs.readFileSync(full, 'utf8'));
    }
  }

  const allText = texts.join('\n');

  // Let's find paragraphs or sentences matching manufacturing + titan / super / capital
  const sentences = allText.split(/[。\n\r]/);
  const hits = [];

  for (const s of sentences) {
    const clean = s.trim();
    if (!clean) continue;
    // Check if sentence relates to manufacturing or building or wholesale of capitals/titans
    const hasBuild = /(?:造|搓|生产|制造|产出|出产|订单|批发|下水|交付|流水线|工程|作业|蓝图|BPC)/.test(clean);
    const hasBigShip = /(?:泰坦|超旗|旗舰|大航|超母|神使|俄洛巴斯|拉格纳洛克|勒维亚坦|万古|归一|夜神|天灾|飞龙|赫尔|萨拉希尔|小金鱼|大鲸鱼|长须鲸|索迪约)/.test(clean);

    if (hasBuild && hasBigShip) {
      // Exclude simple combat kill or loss sentences unless about building/order
      if (/击毁|击沉|KM|被摧毁|损失报告/.test(clean) && !/(?:造|搓|生产|制造|订单|作业|下水|交付)/.test(clean)) {
        continue;
      }
      hits.push(clean);
    }
  }

  if (hits.length > 0) {
    results.push({
      slug,
      name,
      isTycoon: !!tycoons[slug],
      tags,
      hitCount: hits.length,
      hits: hits.slice(0, 5)
    });
  }
}

console.log(`Scanned ${slugs.length} people, found ${results.length} with build/capital mentions.`);
const nonTycoons = results.filter(r => !r.isTycoon);
console.log(`Non-tycoons with mentions: ${nonTycoons.length}`);

// Sort by hitCount
nonTycoons.sort((a, b) => b.hitCount - a.hitCount);

fs.writeFileSync('scratch/deep-scan-results.json', JSON.stringify(nonTycoons, null, 2), 'utf8');

for (const r of nonTycoons.slice(0, 30)) {
  console.log(`\n[${r.slug}] ${r.name} (${r.tags.join(', ')}) - hits: ${r.hitCount}`);
  for (const h of r.hits.slice(0, 3)) {
    console.log(`  > ${h.slice(0, 100)}`);
  }
}
