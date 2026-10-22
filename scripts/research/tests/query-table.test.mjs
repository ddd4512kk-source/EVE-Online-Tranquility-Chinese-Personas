import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { queryTable, run } from '../query-table.mjs';

function fixture(t, text) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'query-tsv-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'ledger.tsv');
  fs.writeFileSync(file, text);
  return file;
}

test('帮助无需表格路径，命令行直接输出文本且不掩盖混合参数错误', () => {
  assert.equal(typeof run(['--help']), 'string');
  assert.throws(() => run(['missing.tsv', '--help']), /单独使用/);
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('../query-table.mjs', import.meta.url)), '--help'], { encoding: 'utf8' });
  assert.ok(output.includes('npm run research:query --'));
  assert.throws(() => JSON.parse(output), SyntaxError);
});

test('组合精确筛选、关键词与分页；保留稳定ID、空值和原状态，不混合榜单范围', t => {
  const file = fixture(t, '\uFEFFcorp_id\tscope\tcharacter_id\tstatus\ttitle\r\n10\tall-time\t00123\t取得，未读\t\r\n10\tmonthly\t00123\t已读\tFC\r\n10\tall-time\t456\t取得，未读\t名字\r\n');
  const result = run([file, '未读', '--where', 'corp_id=10', '--where', 'scope=all-time', '--limit', '1']);
  assert.equal(result.rows, 3);
  assert.equal(result.total, 2);
  assert.equal(result.records[0].character_id, '00123');
  assert.equal(result.records[0].title, '');
  assert.equal(result.records[0].status, '取得，未读');
  const next = queryTable(file, { where: ['corp_id=10', 'scope=all-time'], offset: 1, limit: 1 });
  assert.equal(next.records[0].character_id, '456');
  assert.equal(queryTable(file, { query: 'fc' }).records[0].scope, 'monthly');
});

test('坏列名、损坏行和参数不能伪装成零命中', t => {
  const file = fixture(t, 'id\tstatus\n1\t未读\n2\n');
  assert.throws(() => queryTable(file, { where: ['stats=未读'] }), /未知列/);
  assert.throws(() => queryTable(file), /第 3 行列数/);
  assert.throws(() => run([file, '--where']), /缺少值/);
  assert.throws(() => run([file, '--limit', 'NaN']), /正整数/);
  assert.throws(() => run([file, '--unknown']), /未知选项/);
  assert.throws(() => run([]), /用法/);
});
