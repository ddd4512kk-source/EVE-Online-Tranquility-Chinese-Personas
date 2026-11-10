import test from 'node:test';
import assert from 'node:assert/strict';
import { BATTLE_BLOCK_KINDS, validateBlocks } from './blocks.mjs';

const body = '开篇。\n\n::: 高潮 泰坦跳进来的那一刻\n……\n:::\n\n::: 评\n锐评。\n:::\n';

test('战役正文接受高潮块与评块', () => {
  assert.deepEqual(validateBlocks(body, 0, BATTLE_BLOCK_KINDS), []);
});

test('战役正文仍接受旧稿的红料、黑料块', () => {
  assert.deepEqual(validateBlocks('::: 红料 旧稿\n……\n:::\n::: 黑料 旧稿\n……\n:::\n', 0, BATTLE_BLOCK_KINDS), []);
});

test('列传正文默认不接受高潮块，并按文件行号报错', () => {
  const errors = validateBlocks(body, 4);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^第 7 行：未知块类型 "::: 高潮"（只能是 红料 \/ 黑料 \/ 评）$/);
});
