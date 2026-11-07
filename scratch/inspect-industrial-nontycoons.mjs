import fs from 'node:fs';
import path from 'node:path';

const slugs = ['2gg', 'audacon-eyrou', 'emir1987', 'qian-nian', 'scottchen', 'titan-acrad', 'wuhuarou', 'yuenhc12'];
for (const s of slugs) {
  const mdPath = `src/people/${s}/${s}.md`;
  const matPath = `src/people/${s}/materials-${s}.md`;
  const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  const mat = fs.existsSync(matPath) ? fs.readFileSync(matPath, 'utf8') : '';
  console.log(`==================== ${s} ====================`);
  console.log(md);
  console.log('--- MATERIALS SNIPPET ---');
  console.log(mat.slice(0, 500));
}
