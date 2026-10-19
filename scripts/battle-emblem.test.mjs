import test from "node:test";
import assert from "node:assert/strict";
import { emblemSides } from "./battle-emblem.mjs";

test("战徽保留同侧顺序，每方取一枚，并排除第三方", () => {
  const alliances = [1, 2, 3].map((id) => ({ id, kind: "alliance", name: String(id) }));
  const sides = [{ name: "帝国", alliances }, { name: "联军", alliances: [{ id: 4, kind: "corporation" }] }, { name: "第三方", alliances }];
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
