import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkInstructions } from './check-instructions.mjs';
import { runtimeProblem } from './runtime.mjs';

test('接受支持 import.meta.dirname 的 Node，旧版本在联网前拒绝', () => {
  for (const version of ['20.11.0', '20.19.0', '21.2.0', '22.0.0', '24.14.1']) assert.equal(runtimeProblem(version), null);
  for (const version of ['18.19.1', '20.0.0', '20.10.0', '21.0.0', '21.1.0']) assert.match(runtimeProblem(version), /需要 Node/);
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
