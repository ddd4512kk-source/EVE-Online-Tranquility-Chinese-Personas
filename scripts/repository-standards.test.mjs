import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { ESLint } from 'eslint';

const root = fileURLToPath(new URL('../', import.meta.url));
const execute = promisify(execFile);

test('新文件受统一格式与错误规则约束，浏览器和 Node 使用各自环境', async () => {
  const eslint = new ESLint({ cwd: root });
  const [bad] = await eslint.lintText('const title = "新文件"\nmissing(title)\n', { filePath: 'scripts/new-code.mjs' });
  const rules = new Set(bad.messages.map(message => message.ruleId));
  assert.ok(rules.has('@stylistic/quotes'));
  assert.ok(rules.has('@stylistic/semi'));
  assert.ok(rules.has('no-undef'));
  for (const [filePath, content] of [
    ['scripts/new-code.mjs', 'console.log(process.cwd());\n'],
    ['src/assets/js/new-code.js', "document.querySelector('button');\n"],
    ['src/sw.js', "self.addEventListener('fetch', event => event.respondWith(fetch(event.request)));\n"],
  ]) {
    const [result] = await eslint.lintText(content, { filePath });
    assert.deepEqual(result.messages, []);
  }
});

test('历史基线只容纳现存文件的格式差异，不豁免代码错误', async () => {
  const baseline = JSON.parse(await readFile(path.join(root, 'eslint-suppressions.json'), 'utf8'));
  for (const [file, rules] of Object.entries(baseline)) {
    assert.ok((await readFile(path.join(root, file))).length > 0);
    for (const [rule, { count }] of Object.entries(rules)) {
      assert.ok(rule.startsWith('@stylistic/'), `${file}: ${rule}`);
      assert.ok(Number.isSafeInteger(count) && count > 0);
    }
  }
});

test('真实 Eleventy 配置排除各级指令，资源透传保留公开文件', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'eve-instruction-output-'));
  async function put(file, body) {
    await mkdir(path.dirname(path.join(fixture, file)), { recursive: true });
    await writeFile(path.join(fixture, file), body);
  }
  async function outputFiles(directory) {
    const result = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) result.push(...await outputFiles(file));
      else result.push(path.relative(path.join(fixture, '_site'), file));
    }
    return result.sort();
  }
  try {
    await mkdir(path.join(fixture, 'src/people'), { recursive: true });
    await put('src/index.md', '# 公开页面\n');
    await put('src/assets/js/public.js', "console.log('公开资源');\n");
    for (const directory of ['src', 'src/people', 'src/nested', 'src/assets', 'src/assets/nested']) {
      for (const file of ['AGENTS.md', 'CLAUDE.md']) await put(`${directory}/${file}`, '内部指令，不应发布\n');
    }
    await execute(process.execPath, [path.join(root, 'node_modules/@11ty/eleventy/cmd.cjs'), '--config', path.join(root, 'eleventy.config.js')], {
      cwd: fixture,
      env: { ...process.env, PATH_PREFIX: '/' },
      timeout: 30000,
    });
    assert.deepEqual(await outputFiles(path.join(fixture, '_site')), [path.join('assets', 'js', 'public.js'), 'index.html']);
    assert.match(await readFile(path.join(fixture, '_site/index.html'), 'utf8'), /公开页面/);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});
