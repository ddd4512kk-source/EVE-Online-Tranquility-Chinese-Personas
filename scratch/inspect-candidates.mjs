import fs from 'node:fs';
import path from 'node:path';

const candidates = [
  'ai-ruo',
  'gipsydanger-066',
  'yuenhc12',
  'edwin-jang',
  'huozhang-ji',
  '2gg',
  's2eirio',
  'l-nex',
  'ranger-yl',
  'zerohuang-ss',
  'drone-wang',
  'fauux',
  'freakdog-otto',
  'fu1crum',
  'hm-hongming',
  'optimus-mecca'
];

for (const slug of candidates) {
  const p = path.join('./src/people', slug);
  const md = fs.readFileSync(path.join(p, `${slug}.md`), 'utf8');
  const mat = fs.existsSync(path.join(p, `materials-${slug}.md`)) ? fs.readFileSync(path.join(p, `materials-${slug}.md`), 'utf8') : '';
  const text = md + '\n' + mat;

  const lines = text.split('\n').filter(l => /(?:泰坦|超旗|旗舰|大航|造船|制造|手搓|批发|订单|工业)/.test(l));
  console.log(`=== ${slug} ===`);
  for (const l of lines.slice(0, 6)) {
    console.log('  *', l.trim().slice(0, 150));
  }
}
