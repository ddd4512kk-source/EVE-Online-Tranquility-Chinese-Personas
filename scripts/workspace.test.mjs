import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { flatten, isPrivate, kbPath, unflatten, readdir, relativeOf, requireKb, resolve, trackedPrivateFiles } from './workspace.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eve-workspace-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, body = '') => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), body);
  };
  return { root, put };
}

test('私有路径：素材、私有 docs 目录与单个文件；规则文档和公开对象文件不算', () => {
  for (const file of ['src/people/a/materials-a.json', 'src/battles/b/materials-b.md', 'src/corps/materials-x.json',
    'docs/leads/x.tsv', 'docs/bilibili', 'docs/tieba/1.json', 'docs/pending-characters.md', 'scratch/xiaoshen-video-comments-replies.md']) {
    assert.ok(isPrivate(file), file);
  }
  for (const file of ['src/people/a/a.md', 'src/people/a/a.json', 'docs/rules-person.md', 'docs/leadsx/a.md', 'scratch/other.md',
    'src/people/a/b/materials-a.json']) {
    assert.ok(!isPrivate(file), file);
  }
});

test('逻辑路径与 kb/ 平放路径互转：去掉或补回 docs/、src/，kb 自身文件不映射', () => {
  assert.equal(flatten('docs/leads/a.tsv'), 'leads/a.tsv');
  assert.equal(flatten('docs/pending-characters.md'), 'pending-characters.md');
  assert.equal(flatten('src/people/a/materials-a.json'), 'people/a/materials-a.json');
  assert.equal(flatten('docs'), '');
  assert.equal(flatten('scratch/x.md'), 'scratch/x.md');
  for (const rel of ['docs/leads/a.tsv', 'docs/corps-excluded.json', 'src/battles/b/materials-b.json', 'src/corps/materials-x.json', 'scratch/x.md']) {
    assert.equal(unflatten(flatten(rel)), rel);
  }
  for (const own of ['AGENTS.md', 'CLAUDE.md', '.git/config', '']) assert.equal(unflatten(own), null);
});

test('无 kb/ 时退回仓库根；有 kb/ 时私有路径平放到 kb/，公开路径不变', t => {
  const { root, put } = fixture(t);
  assert.equal(resolve(root, 'docs/leads/a.tsv'), path.join(root, 'docs/leads/a.tsv'));
  assert.equal(kbPath(root, 'src/people/a'), path.join(root, 'src/people/a'));
  assert.throws(() => requireKb(root), /缺少私有资料库/);
  put('kb/.keep');
  assert.equal(resolve(root, 'docs/leads/a.tsv'), path.join(root, 'kb/leads/a.tsv'));
  assert.equal(resolve(root, 'docs/review-features.json'), path.join(root, 'kb/review-features.json'));
  assert.equal(resolve(root, 'src/people/a/materials-a.json'), path.join(root, 'kb/people/a/materials-a.json'));
  assert.equal(resolve(root, 'src/people/a/a.md'), path.join(root, 'src/people/a/a.md'));
  assert.equal(kbPath(root, 'src/people/a'), path.join(root, 'kb/people/a'));
  assert.equal(kbPath(root), path.join(root, 'kb'));
  assert.equal(relativeOf(root, path.join(root, 'kb/people/a/materials-a.json')), 'src/people/a/materials-a.json');
  assert.equal(relativeOf(root, path.join(root, 'kb/leads/a.tsv')), 'docs/leads/a.tsv');
  assert.equal(relativeOf(root, path.join(root, 'src/people/a/a.md')), 'src/people/a/a.md');
  assert.equal(requireKb(root), path.join(root, 'kb'));
});

test('合并列目录：两边同名去重并排序，只列逻辑上属于该目录的 kb 条目', t => {
  const { root, put } = fixture(t);
  put('src/people/a/a.md'); put('src/people/b/b.md'); put('docs/rules-person.md');
  put('kb/people/a/materials-a.json'); put('kb/people/c/materials-c.json');
  put('kb/leads/x.tsv'); put('kb/pending-characters.md'); put('kb/AGENTS.md');
  assert.deepEqual(readdir(root, 'src/people').map(entry => entry.name), ['a', 'b', 'c']);
  assert.deepEqual(readdir(root, 'src/people/a').map(entry => entry.name), ['a.md', 'materials-a.json']);
  assert.deepEqual(readdir(root, 'docs').map(entry => entry.name), ['leads', 'pending-characters.md', 'rules-person.md']);
  assert.deepEqual(readdir(root, 'docs/leads').map(entry => entry.name), ['x.tsv']);
  assert.ok(readdir(root, 'src').some(entry => entry.name === 'people'));
  assert.ok(!readdir(root, '').some(entry => entry.name === 'kb'));
  assert.deepEqual(readdir(root, 'missing'), []);
});

test('回流检查列出公开仓库已跟踪的私有文件与 kb/', t => {
  const { root, put } = fixture(t);
  assert.deepEqual(trackedPrivateFiles(root), []);
  execFileSync('git', ['init', '-q'], { cwd: root });
  put('src/people/a/a.md'); put('src/people/a/materials-a.json'); put('docs/leads/x.tsv'); put('docs/rules-person.md');
  execFileSync('git', ['add', '-A'], { cwd: root });
  assert.deepEqual(trackedPrivateFiles(root).sort(), ['docs/leads/x.tsv', 'src/people/a/materials-a.json']);
});
