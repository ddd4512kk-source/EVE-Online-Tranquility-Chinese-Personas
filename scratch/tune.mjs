import fs from 'node:fs';

const fileContent = fs.readFileSync('scratch/rewrite-positive-epithets.mjs', 'utf8');

// Extract the POSITIVE_EPITHETS object
const match = fileContent.match(/const POSITIVE_EPITHETS = (\{[\s\S]*?\n\};)/);
if (!match) {
  console.error('Could not find POSITIVE_EPITHETS');
  process.exit(1);
}

const obj = eval('(' + match[1].slice(0, -1) + ')');

console.log('Total entries:', Object.keys(obj).length);

// Let's print all entries that are > 38 or < 36
for (const [k, v] of Object.entries(obj)) {
  if (v.length < 36 || v.length > 38) {
    console.log(`[${k}] len=${v.length}: "${v}"`);
  }
}
