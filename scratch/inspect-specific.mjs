import fs from 'node:fs';

const list = ['titan-acrad', 'qian-nian', 'audacon-eyrou', 'emir1987', 'scottchen'];
for (const s of list) {
  const md = fs.readFileSync(`src/people/${s}/${s}.md`, 'utf8');
  console.log(`\n================== ${s} ==================`);
  console.log(md);
}
