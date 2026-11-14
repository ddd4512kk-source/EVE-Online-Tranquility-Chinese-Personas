import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkMaterials, maintainerProcessErrors, materialPath, materialReferences, materialSection, materialText, parseMaterial, planMaterialMigration, projectMaterial, readMaterial, serializeMaterial, validateMaterial } from './material-document.mjs';
import { applyMigration, run as runMigration } from './migrate-materials.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'material-document-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, content) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
    return target;
  };
  return { root, put };
}

test('分 section 保存原始 Markdown，可完整恢复标题、锚点、表格、链接与换行', () => {
  const source = '<a id="kept-anchor"></a>\r\n# 标题\r\n\r\n前导文字与原话。\r\n\r\n## 重复 标题\r\n\r\n| A | B |\r\n| - | - |\r\n| 甲 | [来源](https://example.test) |\r\n\r\n```md\r\n## 代码中的伪标题\r\n```\r\n\r\n## 重复 标题\n末尾无换行';
  const document = parseMaterial(source);
  assert.equal(document.title, '标题');
  assert.deepEqual(document.sections.map(section => section.id), ['kept-anchor', '标题', '重复-标题', '重复-标题-2']);
  assert.equal(document.sections[1].content, '\r\n前导文字与原话。\r\n\r\n');
  assert.equal(document.sections[2].heading_line, '## 重复 标题\r\n');
  assert.equal(materialSection(document, 'kept-anchor').id, 'kept-anchor');
  assert.equal(projectMaterial(document), source);
  assert.equal(projectMaterial(JSON.parse(serializeMaterial(document))), source);
  assert.ok(materialReferences(document).includes('https://example.test'));
  assert.ok(materialText(document).includes('前导文字与原话。'));
  assert.deepEqual(materialReferences(parseMaterial('## [标题来源](shared.json)\n')), ['shared.json']);
});

test('无标题素材生成前导 level 0 section，空文件和末尾换行也可逆', () => {
  for (const source of ['', '只有前导文字', '只有前导文字\n', '## 二级标题\n内容\n']) {
    const document = parseMaterial(source);
    assert.equal(projectMaterial(document), source);
  }
  const document = parseMaterial('无标题段落\n\n### 子标题\n正文');
  assert.equal(document.title, '子标题');
  assert.equal(parseMaterial('## 原材料题目\n正文\n# 后续标题\n').title, '原材料题目');
  assert.equal(document.sections[0].level, 0);
  assert.equal(document.sections[1].level, 3);
  assert.equal(document.sections[1].content, '正文');
  const canonical = { ...document, sections: document.sections.map(section => ({ id: section.id, heading: section.heading, level: section.level, content: section.content })) };
  assert.equal(projectMaterial(canonical), '无标题段落\n\n### 子标题\n正文');
});

test('读取器兼容 Markdown 并投影 material JSON，文件查找优先 JSON', t => {
  const { put } = fixture(t);
  const markdown = '# 说明\n\n完整事件经过。\n';
  const md = put('materials-demo.md', markdown);
  const json = put('materials-demo.json', serializeMaterial(parseMaterial(markdown)));
  assert.equal(readMaterial(md), markdown);
  assert.equal(readMaterial(json), markdown);
  assert.equal(materialPath(path.dirname(md), 'demo'), json);
  fs.rmSync(json);
  assert.equal(materialPath(path.dirname(md), 'demo'), md);
});

test('结构错误携带上下文；损坏 JSON 和未知 JSON 类型不会被投影成素材', t => {
  const { put } = fixture(t);
  const invalid = put('broken.json', '{');
  assert.throws(() => readMaterial(invalid), /broken\.json：JSON 解析失败/);
  const ordinary = put('record.json', '{"id":42}');
  assert.throws(() => readMaterial(ordinary), /type 必须为 material/);
  const errors = validateMaterial({ version: 1, type: 'material', title: '', sections: [{ id: 'a', heading: '', level: 7, content: '' }, { id: 'a', heading: '', level: 0, content: 1 }] }, 'demo.json').join('\n');
  assert.match(errors, /demo\.json.*level/s);
  assert.match(errors, /id 重复/);
  assert.match(errors, /content 必须/s);
});

test('目录校验不会漏掉坏 JSON、材料路径缺少 type 或 title 的 JSON', t => {
  const { root, put } = fixture(t);
  put('docs/sources/broken.json', '{');
  put('docs/sources/implicit-material.json', JSON.stringify({ sections: [] }));
  put('src/people/demo/materials-demo.json', JSON.stringify({ version: 1, sections: [] }));
  const result = checkMaterials(root);
  assert.equal(result.checked, 2);
  assert.equal(result.errors.length, 6);
  assert.match(result.errors.join('\n'), /broken\.json：JSON 解析失败/);
  assert.match(result.errors.join('\n'), /implicit-material\.json：type 必须为 material/);
  assert.match(result.errors.join('\n'), /materials-demo\.json：title 必须为字符串/);
});

test('正式目录拒绝旧材料文件，规则说明和历史证据读取仍可保留 Markdown', t => {
  const { root, put } = fixture(t);
  const old = put('src/people/demo/materials-demo.md', '# 旧材料\n事件原话。\n');
  put('docs/sources/low-credibility-sources.md', '# 来源规则\n');
  put('docs/leads/README.md', '# 使用说明\n');
  const result = checkMaterials(root);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /materials-demo\.md：叙述材料使用 JSON/);
  assert.equal(readMaterial(old), '# 旧材料\n事件原话。\n');
});

test('迁移 dry-run 仅列目标素材并验证往返，不写文件', t => {
  const { root, put } = fixture(t);
  put('src/people/demo/materials-demo.md', '# 人物\n\n一段完整中文事件。\n');
  put('src/battles/demo/materials-demo.md', '<a id="battle"></a>\n战役原话');
  put('src/corps/demo/materials-demo.md', '军团材料');
  put('docs/sources/history.md', '# 来源\n引用。');
  put('docs/sources/low-credibility-sources.md', '# 规则，不是素材');
  put('docs/leads/README.md', '# 忽略');
  put('docs/leads/AGENTS.md', '# 忽略');
  put('docs/leads/lead.md', '线索');
  put('docs/corporations/notes/legacy.md', '共享军团材料');
  put('docs/corporations/notes/README.md', '# 忽略');
  put('docs/reviews/receipt.md', '# 冻结回执');
  const result = runMigration(root);
  assert.equal(result.mode, 'dry-run');
  assert.equal(result.count, 6);
  assert.equal(result.corporationsNotes, 1);
  assert.ok(result.entries.some(entry => entry.source === 'src/people/demo/materials-demo.md'));
  assert.ok(result.entries.some(entry => entry.source === 'docs/corporations/notes/legacy.md'));
  assert.ok(!result.entries.some(entry => entry.source.endsWith('low-credibility-sources.md')));
  assert.equal(fs.existsSync(path.join(root, 'src/people/demo/materials-demo.json')), false);
  assert.equal(fs.existsSync(path.join(root, 'docs/reviews/receipt.json')), false);
});

test('apply 先备份，再改目标引用并删除源 Markdown；冻结回执与历史日志不动', async t => {
  const { root, put } = fixture(t);
  const peopleMaterial = 'src/people/demo/materials-demo.md';
  const sourceMaterial = 'docs/sources/history.md';
  const personArchive = 'src/people/demo/person.json';
  const review = 'docs/reviews/receipt.md';
  const history = 'docs/sources/material-index-legacy-2026-10-22.jsonl';
  put(peopleMaterial, '# 人物素材\n\n引用[共享资料](../../docs/sources/history.md)。\n');
  put(sourceMaterial, '# 共享资料\n\n关联[src](../../src/people/demo/materials-demo.md#人物素材)。\n');
  put(personArchive, JSON.stringify({ material: peopleMaterial }));
  put(review, `历史回执沿用 ${peopleMaterial}\n`);
  put(history, `${JSON.stringify({ refs: [peopleMaterial] })}\n`);
  const plan = planMaterialMigration(root);
  assert.equal(plan.errors.length, 0);
  const result = await applyMigration(root, plan);
  assert.equal(result.removed, 2);
  assert.ok(result.updatedFiles >= 1);
  assert.equal(fs.existsSync(path.join(root, peopleMaterial)), false);
  assert.equal(fs.existsSync(path.join(root, sourceMaterial)), false);
  const target = path.join(root, 'src/people/demo/materials-demo.json');
  assert.match(readMaterial(target), /\.\.\/\.\.\/docs\/sources\/history\.json/);
  assert.match(fs.readFileSync(path.join(root, personArchive), 'utf8'), /materials-demo\.json/);
  assert.equal(fs.readFileSync(path.join(root, review), 'utf8'), `历史回执沿用 ${peopleMaterial}\n`);
  assert.ok(fs.readFileSync(path.join(root, history), 'utf8').includes(peopleMaterial));
  assert.equal(fs.readFileSync(path.join(root, result.backup, peopleMaterial), 'utf8'), '# 人物素材\n\n引用[共享资料](../../docs/sources/history.md)。\n');
});

test('引用改写不改变标题含 Markdown 链接的 section id', async t => {
  const { root, put } = fixture(t);
  const source = 'src/people/demo/materials-demo.md';
  const original = '# [人物素材](../../docs/sources/history.md)\n\n事件经过。\n';
  put(source, original);
  put('docs/sources/history.md', '# 共享材料');
  const expectedId = parseMaterial(original).sections[0].id;
  await applyMigration(root, planMaterialMigration(root));
  const converted = JSON.parse(fs.readFileSync(path.join(root, 'src/people/demo/materials-demo.json'), 'utf8'));
  assert.equal(converted.title, parseMaterial(original).title);
  assert.equal(converted.sections[0].id, expectedId);
  assert.equal(converted.sections[0].heading, '[人物素材](../../docs/sources/history.json)');
});

test('apply 遇到已有目标冲突时不覆盖目标也不删除源文件', async t => {
  const { root, put } = fixture(t);
  const source = 'src/people/demo/materials-demo.md';
  const target = 'src/people/demo/materials-demo.json';
  const original = '# 人物素材\n';
  put(source, original);
  put(target, '{"existing":true}');
  const plan = planMaterialMigration(root);
  await assert.rejects(() => applyMigration(root, plan), /目标路径冲突/);
  assert.equal(fs.readFileSync(path.join(root, source), 'utf8'), original);
  assert.equal(fs.readFileSync(path.join(root, target), 'utf8'), '{"existing":true}');
});

test('HED-GP 来源素材让位给既有战役 JSON 快照', t => {
  const { root, put } = fixture(t);
  put('docs/sources/hed-gp-incident-2023.md', '# 来源材料\n');
  put('docs/sources/hed-gp-incident-2023.json', '{"battle":true}');
  const plan = planMaterialMigration(root);
  assert.equal(plan.conflicts.length, 0);
  assert.equal(plan.entries[0].target, path.join(root, 'docs/sources/hed-gp-incident-2023-material.json'));
});

test('材料校验拒绝维护者确认／指认等对话过程，放行游戏工具维护者语境', () => {
  for (const text of ['维护者确认本人小号', '由维护者指认', '2026-11-10 维护者补正：内容', '按维护者明确指示不予合并']) {
    assert.equal(maintainerProcessErrors(text).length, 1);
  }
  for (const text of ['运费计算器维护者与教学译者', '不是 SeAT 维护者任职证据', '隐秘诱导小号与踢团指控及维护者回应已归档']) {
    assert.equal(maintainerProcessErrors(text).length, 0);
  }
  const errors = validateMaterial(parseMaterial('# 标题\n\n维护者确认同人。\n'), 'demo.json');
  assert.match(errors.join('\n'), /不得记录“维护者确认”/);
});
