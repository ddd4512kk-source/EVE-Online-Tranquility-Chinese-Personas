import fs from 'node:fs';

const slugs = ['kzu', 'sisters', 'your-ex-s', 'skull', 'blueice-aota', 'brigade-of-the-lost-capsuleer', 'snowmoon'];
for (const s of slugs) {
  const p = `src/corps/${s}/${s}.md`;
  const exists = fs.existsSync(p);
  const text = exists ? fs.readFileSync(p, 'utf8') : '';
  const isUnwritten = text.includes('corpUnwritten') || text.trim().length < 50;
  console.log(`${s}: exists=${exists}, unwritten=${isUnwritten}, len=${text.length}`);
}
