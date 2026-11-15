import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { allianceBackdrop, coverCrop, coverSrc, emblemSides } from './battle-emblem.mjs';

test('联盟底图只给已缓存的自定义徽标', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'backdrop-'));
  try {
    writeFileSync(path.join(dir, 'alliance-1.png'), 'custom');
    assert.equal(allianceBackdrop(1, dir), '/assets/emblems/alliance-1.png');
    assert.equal(allianceBackdrop(2, dir), null);
    assert.equal(allianceBackdrop(null, dir), null);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  // 仓库里 99013541 联盟用的是默认金星图。
  assert.equal(allianceBackdrop(99013541), null);
});

test('封面从正中裁成最大的 16:9', () => {
  assert.equal(coverSrc('obe-2026'), '/assets/emblems/cover-obe-2026.webp');
  assert.deepEqual(coverCrop(1600, 900), { left: 0, top: 0, width: 1600, height: 900 });
  assert.deepEqual(coverCrop(1600, 1000), { left: 0, top: 50, width: 1600, height: 900 });
  assert.deepEqual(coverCrop(2000, 900), { left: 200, top: 0, width: 1600, height: 900 });
  assert.deepEqual(coverCrop(480, 360), { left: 0, top: 45, width: 480, height: 270 });
});

test("战徽保留同侧顺序，每方取一枚，并排除第三方", () => {
  const alliances = [1, 2, 3].map((id) => ({ id, kind: "alliance", name: String(id) }));
  const sides = [{ name: "帝国", emblemOrganization: alliances[0] }, { name: "联军", emblemOrganization: { id: 4, kind: "corporation" } }, { name: "第三方", emblemOrganization: alliances[0] }];
  const before = structuredClone(sides);
  const result = emblemSides(sides);
  assert.deepEqual(result.map((s) => s.logos.map((o) => o.src)), [
    ["/assets/emblems/alliance-1.png"],
    ["/assets/emblems/corporation-4.png"],
  ]);
  assert.deepEqual(sides, before);
});

test("无组织图标时保留阵营与文字退路，多方战役最多四栏", () => {
  const result = emblemSides(Array.from({ length: 5 }, () => ({ name: "凛冬联军" })));
  assert.equal(result.length, 4);
  assert.deepEqual(result[0], { name: "凛冬联军", initials: "凛冬", logos: [] });
  assert.deepEqual(emblemSides([]), []);
});

test("自动参战名单扩充后仍使用明确选定的主标", () => {
  const result = emblemSides([{ name: "甲方", alliances: [{ id: 2, kind: "alliance" }], emblemOrganization: { id: 1, kind: "alliance" } }]);
  assert.equal(result[0].logos[0].src, "/assets/emblems/alliance-1.png");
});
