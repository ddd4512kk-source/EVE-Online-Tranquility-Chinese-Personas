import fs from 'node:fs';
import path from 'node:path';

const tycoons = (await import('../src/_data/tycoonPeople.js')).default();
const peopleDir = './src/people';
const slugs = fs.readdirSync(peopleDir).filter(s => fs.statSync(path.join(peopleDir, s)).isDirectory());

const capShips = ['泰坦', '超旗', '大航', '超母', '神使', '俄洛巴斯', '拉格纳洛克', '勒维亚坦', '征服者', '科莫多', '摩洛克', '萨拉希尔', '归魂', '夜神', '万古', '归一', '天灾', '飞龙', '赫尔', '无畏', '神示', '绝念', '纳迦法', '凤凰', '使徒', '大鲸鱼', '长须鲸', '小金鱼'];

const found = [];

for (const slug of slugs) {
  if (tycoons[slug]) continue;
  const mdPath = path.join(peopleDir, slug, `${slug}.md`);
  if (!fs.existsSync(mdPath)) continue;
  const md = fs.readFileSync(mdPath, 'utf8');

  // Find sentences with build words and capital ship names
  const sentences = md.split(/[。\n\r]/);
  for (const s of sentences) {
    const clean = s.trim();
    if (!clean) continue;
    if (/(?:造|搓|生产|制造|产出|出产|批发|流水线|下水|交付|承接).*(?:泰坦|超旗|大航|神使|俄洛巴斯|拉格纳洛克|勒维亚坦|萨拉希尔|大鲸鱼|长须鲸|小金鱼)/.test(clean) ||
        /(?:泰坦|超旗|大航|神使|俄洛巴斯|拉格纳洛克|勒维亚坦|萨拉希尔|大鲸鱼|长须鲸|小金鱼).*(?:造|搓|生产|制造|产出|出产|批发|流水线|下水|交付|承接)/.test(clean)) {
      if (/击毁|击沉|KM|被摧毁|损失报告|战损/.test(clean) && !/(?:造|搓|生产|制造|订单|作业|下水|交付)/.test(clean)) continue;
      found.push({ slug, sentence: clean });
    }
  }
}

const bySlug = {};
for (const f of found) {
  if (!bySlug[f.slug]) bySlug[f.slug] = [];
  bySlug[f.slug].push(f.sentence);
}

for (const [slug, sents] of Object.entries(bySlug)) {
  console.log(`=== ${slug} ===`);
  for (const s of sents) {
    console.log('  *', s);
  }
}
