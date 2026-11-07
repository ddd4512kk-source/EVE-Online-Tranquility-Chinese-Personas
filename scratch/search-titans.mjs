import fs from 'node:fs';
import path from 'node:path';

const tycoons = (await import('../src/_data/tycoonPeople.js')).default();
const peopleDir = './src/people';
const slugs = fs.readdirSync(peopleDir).filter(s => fs.statSync(path.join(peopleDir, s)).isDirectory());

const results = [];

for (const slug of slugs) {
  if (tycoons[slug]) continue;
  const p = path.join(peopleDir, slug);
  const files = fs.readdirSync(p).filter(f => f.endsWith('.md') || f.endsWith('.json'));

  let combinedText = '';
  for (const f of files) {
    combinedText += '\n' + fs.readFileSync(path.join(p, f), 'utf8');
  }

  // Look for titan manufacturing or capital wholesale
  const titanMatches = combinedText.match(/([^。\n]*?(?:造|制造|生产|手搓|出产|定制|承接|批发|卖出|卖|交货|搓)[^。\n]*?(?:泰坦|超旗|大航|超级旗舰|旗舰)[^。\n]*?[。\n])/g) || [];
  const titanMatches2 = combinedText.match(/([^。\n]*?(?:泰坦|超旗|大航|超级旗舰|旗舰)[^。\n]*?(?:造|制造|生产|手搓|出产|定制|承接|批发|卖出|卖|交货|搓|制造商|船厂)[^。\n]*?[。\n])/g) || [];

  const all = [...new Set([...titanMatches, ...titanMatches2])];

  // Filter out noise like "击毁泰坦", "泰坦会战", "开泰坦参战", "坐泰坦", "泰坦末日", "泰坦对泰坦", "被泰坦打死"
  const relevant = all.filter(sentence => {
    if (/(?:击毁|击沉|打掉|摧毁|会战|参战|出勤|陨落|开着泰坦|驾驶泰坦|坐进泰坦|泰坦开炮|泰坦末日|炸泰坦|丢了泰坦|泰坦损失|泰坦对泰坦|钓鱼)/.test(sentence) &&
        !/(?:制造|生产|手搓|造船|批发|订单|承接|工厂|船厂|出产)/.test(sentence)) {
      return false;
    }
    return true;
  });

  if (relevant.length > 0) {
    results.push({ slug, count: relevant.length, lines: relevant });
  }
}

results.sort((a, b) => b.count - a.count);
for (const r of results) {
  console.log(`=== ${r.slug} (${r.count}) ===`);
  for (const l of r.lines.slice(0, 4)) {
    console.log('   >', l.trim().replace(/\s+/g, ' '));
  }
}
