import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkInstructions, syncInstructions } from './check-instructions.mjs';
import { runtimeProblem } from './runtime.mjs';

test('接受统一工具链支持的 Node，旧版本在联网前拒绝', () => {
  for (const version of ['20.19.0', '20.20.0', '22.13.0', '22.20.0', '24.0.0', '24.14.1', '26.0.0']) assert.equal(runtimeProblem(version), null);
  for (const version of ['18.19.1', '20.0.0', '20.11.0', '20.18.9', '21.2.0', '22.12.9', '23.0.0']) assert.match(runtimeProblem(version), /需要 Node/);
});

test('递归发现目录规则、双向缺失与技能资源，忽略依赖和产物', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'eve-scopes-'));
  async function put(file, body = 'rules\n') {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), body);
  }
  try {
    await put('AGENTS.md');
    await put('src/people/AGENTS.md');
    await put('.agents/skills/one/references/format.md');
    await put('node_modules/vendor/CLAUDE.md');
    await put('_site/CLAUDE.md');
    await put('.cache/CLAUDE.md');
    assert.equal((await syncInstructions(root)).length, 3);
    assert.deepEqual(await checkInstructions(root), []);
    assert.deepEqual(await syncInstructions(root), []);
    await put('src/people/CLAUDE.md', 'different\n');
    assert.ok((await checkInstructions(root)).some(error => error.includes('src/people/AGENTS.md / src/people/CLAUDE.md')));
    await put('src/assets/CLAUDE.md');
    await put('.claude/skills/only-claude/references/extra.md');
    await syncInstructions(root);
    const errors = await checkInstructions(root);
    assert.ok(errors.some(error => error.includes('缺少指令副本：src/assets/AGENTS.md')));
    assert.ok(errors.some(error => error.includes('缺少指令副本：.agents/skills/only-claude/references/extra.md')));
    assert.equal(errors.length, 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('拒绝失效本地引用、超长指令及过大的父子指令链', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'eve-rule-links-'));
  try {
    await writeFile(path.join(root, 'AGENTS.md'), '[缺失](docs/gone.md)\n[外部](https://example.com/a)\n[锚点](#title)\n```markdown\n[示例](missing.md)\n```\n');
    await syncInstructions(root);
    assert.deepEqual(await checkInstructions(root), ['指令引用不存在：AGENTS.md -> docs/gone.md']);
    await mkdir(path.join(root, 'docs'));
    await writeFile(path.join(root, 'docs/gone.md'), 'text\n');
    assert.deepEqual(await checkInstructions(root), []);
    await writeFile(path.join(root, 'AGENTS.md'), 'rule\n'.repeat(101));
    await syncInstructions(root);
    assert.ok((await checkInstructions(root)).some(error => error.includes('超过 100 行')));
    await writeFile(path.join(root, 'AGENTS.md'), 'a'.repeat(20 * 1024));
    await writeFile(path.join(root, 'docs/AGENTS.md'), 'b'.repeat(13 * 1024));
    await syncInstructions(root);
    assert.deepEqual(await checkInstructions(root), ['指令路径超过 32 KiB：docs']);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('逐字核对全局说明，并发现新增技能的缺失副本与内容分歧', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'eve-instructions-'));
  async function put(file, body) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), body);
  }
  try {
    await put('AGENTS.md', 'rules\n'); await put('CLAUDE.md', 'rules\n');
    await put('.agents/skills/new/SKILL.md', 'skill\n');
    assert.deepEqual(await checkInstructions(root), ['缺少指令副本：.claude/skills/new/SKILL.md']);
    await put('.claude/skills/new/SKILL.md', 'skill\n');
    assert.deepEqual(await checkInstructions(root), []);
    await put('CLAUDE.md', 'rules\r\n');
    await put('.claude/skills/new/SKILL.md', 'different\n');
    assert.equal((await checkInstructions(root)).length, 2);
    await put('.claude/skills/claude-only/SKILL.md', 'extra\n');
    assert.ok((await checkInstructions(root)).some(error => error.includes('.agents/skills/claude-only/SKILL.md')));
  } finally { await rm(root, { recursive: true, force: true }); }
});
