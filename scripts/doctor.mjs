import './runtime.mjs';
import { createRequire } from 'node:module';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { checkInstructions } from './check-instructions.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(new URL('../package.json', import.meta.url));
const errors = await checkInstructions(root);
for (const name of ['@11ty/eleventy', 'gray-matter', 'markdown-it-container']) {
  try { require.resolve(name); }
  catch { errors.push(`缺少依赖 ${name}：请先由代理运行 npm ci。`); }
}
// Pagefind 的导出仅有 import 条件；核对 CLI，避免 require.resolve 误报缺依赖。
try { await access(new URL('../node_modules/pagefind/lib/runner/bin.cjs', import.meta.url)); }
catch { errors.push('缺少依赖 pagefind：请先由代理运行 npm ci。'); }
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`环境与指令副本通过（Node ${process.versions.node}）。`);
