import './runtime.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HELP = `用法：npm run finish -- [person:短名 ...]
按收尾顺序依次运行 git diff --check、npm run check、npm run build；给出人物时再 verify 其 combat 与 writing-depth。
通过的步骤只打印一行；首个失败步骤打印末尾 40 行并以非零码退出，后续步骤不再运行。
不登记复查，不读生成页；登记和通读仍按增量复查与 add-person 第 4 步完成。`;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(HELP);
  process.exit(0);
}
const bad = args.filter(key => !/^person:[a-z0-9][a-z0-9-]*$/.test(key));
if (bad.length) {
  console.error(`无效参数：${bad.join(' ')}\n${HELP}`);
  process.exit(2);
}

const root = fileURLToPath(new URL('../', import.meta.url));
const steps = [
  ['差异空白', 'git diff HEAD --check'],
  ['npm run check', 'npm run check'],
  ['npm run build', 'npm run build'],
  ...(args.length ? ['combat', 'writing-depth'].map(feature => [`verify ${feature}`, `node scripts/review.mjs verify ${args.join(' ')} --feature ${feature}`]) : []),
];
for (const [label, command] of steps) {
  const result = spawnSync(`${command} 2>&1`, { cwd: root, shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.status === 0) {
    console.log(`通过：${label}`);
    continue;
  }
  console.log(`未通过：${label}（退出码 ${result.status ?? result.signal}）`);
  console.log((result.stdout ?? String(result.error ?? '')).trimEnd().split('\n').slice(-40).join('\n'));
  process.exitCode = 1;
  break;
}
