import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { stringifyBattleArchive } from "./battle-archive.mjs";
import {
  battleStats,
  checkSnapshot,
  checkBattles,
  findOverlaps,
  formatIsk,
  orgIds,
  peopleIndex,
  sideStats,
  statsOf,
  tierOf,
  toYmd,
  validateBattle,
  visibleSides,
} from "./battles.mjs";

const ok = {
  title: "测试之战",
  start: new Date("2020-12-30T00:00:00Z"),
  systems: ["M2-XFE"],
  total_loss: 1500,
  loss_source: "https://example.com/br",
  sides: [
    { name: "甲方", organizations: [1], pilots: 100, loss: 500, loss_count: 12, corps: [{ id: 500, pilots: 20 }], people: [42] },
    { name: "乙方", pilots: null, loss: null, loss_count: null, stats_note: "官方只给总计；续查原报分组，详见素材。", note: "折损泰坦 3 条" },
  ],
};
const check = (patch = {}, body = "") => validateBattle({ ...ok, ...patch }, body, 0, new Map([[42, 42], [43, 43]]));
const withSide = (patch) => check({ sides: [{ ...ok.sides[0], ...patch }, ok.sides[1]] });

test("100B–不足 400B 为中型，400B–不足 1T 为大型，1T 及以上为史诗，不足 100B 不收", () => {
  assert.equal(tierOf(100).name, "中型");
  assert.equal(tierOf(399.9).name, "中型");
  assert.equal(tierOf(400).name, "大型");
  assert.equal(tierOf(999.99).name, "大型");
  assert.equal(tierOf(1000).name, "史诗");
  assert.equal(tierOf(99.9), null);
  assert.match(check({ total_loss: 80 })[0], /不足 100B/);
});

test("合格的战役文件无报错", () => {
  assert.deepEqual(check(), []);
  assert.deepEqual(check({ start: "2020-12-30", end: "2020-12-31" }), []);
});

test("标题使用已登记的星系中文名，英文别名与 systems 保留", () => {
  assert.ok(check({ title: "Sosala，凌晨刚结账，晚上又开席" }).some(e => /索萨拉/.test(e)));
  assert.ok(check({ title: "old man star 告别战" }).some(e => /老人星/.test(e)));
  assert.deepEqual(check({ title: "索萨拉，凌晨刚结账，晚上又开席", systems: ["Sosala"], aliases: ["Sosala Waifu War"] }), []);
  assert.deepEqual(check({ title: "M2-XFE 大屠杀" }), []);
});

test("必填字段、未知字段与日期顺序", () => {
  const errs = validateBattle({ foo: 1 }, "", 0, new Set());
  for (const re of [/未知字段 "foo"/, /title/, /systems/, /start/, /total_loss/, /loss_source/, /sides/]) {
    assert.ok(errs.some((e) => re.test(e)), re);
  }
  assert.match(check({ end: "2020-12-01" })[0], /end 早于 start/);
  assert.match(check({ total_loss: "1.5T" })[0], /必须是数字/);
});

test("各方结构：2–4 方，字段类型", () => {
  assert.match(check({ sides: [ok.sides[0]] })[0], /2–4/);
  assert.match(check({ sides: ["甲方", "乙方"] })[0], /结构/);
  assert.match(check({ sides: [{ organizations: [1] }, ok.sides[1]] })[0], /缺少 name/);
  assert.match(withSide({ flag: 1 })[0], /未知字段 "flag"/);
  assert.match(withSide({ pilots: 1.5 })[0], /pilots 必须是正整数/);
  assert.match(withSide({ loss: "1T" })[0], /loss 必须是数字/);
  assert.match(withSide({ organizations: ["A"] })[0], /organizations 必须是非空组织 ID 列表/);
  assert.match(withSide({ corps: [{ pilots: 3 }] })[0], /corps 每项必须写 id/);
  assert.match(withSide({ corps: [{ name: "X" }] })[0], /corps 每项必须写 id/);
  assert.match(withSide({ corps: [{ id: 500, ticker: "X" }] })[0], /未知字段 "ticker"/);
  assert.match(check({ pilots: 0 })[0], /pilots 必须是正整数/);
});

test("people 只能列已收录人物，各方之间也不重复", () => {
  assert.match(withSide({ people: [7] })[0], /没有对应列传/);
  assert.match(withSide({ people: [42, 42] })[0], /重复/);
  const errs = check({ sides: [ok.sides[0], { ...ok.sides[1], people: [43, 42] }] });
  assert.equal(errs.length, 1);
  assert.match(errs[0], /42 重复（已列在sides「甲方」）/);
});

test("分方统计不可由全场总计替代，缺项须显式声明并保留续查依据", () => {
  const errs = check({ pilots: 1000, sides: [{ name: "甲方" }, ok.sides[1]] });
  for (const key of ["pilots", "loss", "loss_count", "stats_note"]) assert.ok(errs.some(e => e.includes(key)));
  assert.ok(withSide({ loss: null }).some(e => e.includes("stats_note")));
  assert.deepEqual(withSide({ loss: null, stats_note: "完整 BR 未给本方金额，续查受害方统计。" }), []);
  assert.deepEqual(withSide({ loss: 0, loss_count: 0 }), []);
  assert.ok(withSide({ loss_count: -1 }).some(e => /loss_count 必须是非负整数/.test(e)));
  assert.ok(withSide({ loss_count: 1.5 }).some(e => /loss_count 必须是非负整数/.test(e)));
  assert.ok(withSide({ stats_note: " " }).some(e => /stats_note 必须是非空字符串/.test(e)));
});

test("分方显示保留未知项，零损失显示为零", () => {
  assert.equal(sideStats({ pilots: 100, loss: 0, loss_count: 0 }), "参战 100 人 · 损失 0B · 损失记录 0 条");
  assert.equal(sideStats({}), "参战人数待补 · 损失金额待补 · 损失计数待补");
  assert.match(sideStats({ pilots: 20, loss: 1500, note: "折损泰坦" }), /参战 20 人 · 损失 1.5T · 损失计数待补 · 折损泰坦/);
});

test("正文块沿用列传规则", () => {
  assert.match(check({}, "::: 战报\n:::")[0], /未知块类型/);
  assert.deepEqual(check({}, "::: 评\n锐评\n:::"), []);
});

test("金额与日期显示", () => {
  assert.equal(formatIsk(6640), "6.64T");
  assert.equal(formatIsk(969.12), "969B");
  assert.equal(toYmd(new Date("2014-01-27T00:00:00Z")), "2014-01-27");
  assert.equal(toYmd("2014-1-27"), null);
});

test("tags 与多场编组的 loss_source 列表", () => {
  assert.deepEqual(check({ tags: ["00区", "泰坦战"] }), []);
  assert.match(check({ tags: "00区" })[0], /tags 必须是字符串列表/);
  assert.deepEqual(check({ loss_source: ["https://example.com/a", "https://example.com/b"] }), []);
  assert.match(check({ loss_source: ["https://example.com/a", "某帖"] })[0], /loss_source/);
  assert.match(check({ loss_source: [] })[0], /loss_source/);
});

test("同一星系日期重叠的两页报错，编组外的不报", () => {
  const b = (file, systems, start, end) => ({ file, data: { systems, start, end } });
  const group = b("y-mpwl-2025", ["Y-MPWL"], "2025-08-19", "2025-08-25");
  assert.equal(findOverlaps([group, b("y-0821", ["Y-MPWL"], "2025-08-21")]).length, 1);
  assert.deepEqual(findOverlaps([group, b("y-0901", ["Y-MPWL"], "2025-09-01")]), []);
  assert.deepEqual(findOverlaps([group, b("m2-0821", ["M2-XFE"], "2025-08-21")]), []);
});

test("orgIds 收集各方点名的联盟与手填军团 ID", () => {
  assert.deepEqual(orgIds({ ...ok, sides: [...ok.sides, { name: "丙方", organizations: [1, 2] }] }), [1, 500, 1, 2]);
});

// 下限仍须达到收录门槛，不能用字符串绕过口径标记。
test("损失下限标记只接受布尔值且不放宽规模门槛", () => {
  assert.deepEqual(check({ loss_is_lower_bound: true }), []);
  assert.deepEqual(check({ loss_is_lower_bound: false }), []);
  assert.match(check({ loss_is_lower_bound: "true" })[0], /必须是布尔值/);
  assert.ok(check({ loss_is_lower_bound: true, total_loss: 99 }).some(e => /不足 100B/.test(e)));
});

test("最高同屏人数独立于全程参战人数，且必须是正整数", () => {
  assert.deepEqual(check({ pilots_peak: 10253 }), []);
  assert.deepEqual(check({ pilots: 12000, pilots_peak: 10253 }), []);
  for (const value of [0, -1, 1.5, "10253"]) {
    assert.ok(check({ pilots_peak: value }).some(e => /pilots_peak 必须是正整数/.test(e)));
  }
});

// —— 快照战役：loss_source 全是 br.evetools 战报，数字由 br.json 算 ——
const BR = "https://br.evetools.org/br/6851ec3687003700128d432f";
const snapData = {
  title: "快照之战",
  start: "2025-06-17",
  systems: ["X"],
  loss_source: BR,
  sides: [{ name: "甲方", organizations: [1], emblem: 1 }, { name: "乙方", organizations: [2], emblem: 2 }],
};
// 联盟 A=1、B=2，C=3 未点名；华人军团 500（名称表标 chinese）在 A；13 在 NPC 军团
const table = {
  alliances: { 1: { name: "A" }, 2: { name: "B" }, 3: { name: "C" } },
  corporations: { 500: { name: "华人军团", chinese: true }, 600: { name: "乙军团" } },
};
const snap = {
  sources: [BR], systems: ["X"], systemIds: [1], window: null,
  teams: [],
  pilots: { 10: [500, 1], 42: [500, 1], 11: [600, 2], 12: [700, 3], 13: [1000001, 0] },
  losses: [[1, 10, 500, 1, 1e11], [2, 11, 600, 2, 2e11], [3, 12, 700, 3, 1e9]],
  hits: [["a:1", "a:3", 3]],
};
// 12 是 43 的小号（人物档案 identity.alts）
const known = new Map([[42, 42], [43, 43], [12, 43]]);
const bySide = (st) => Object.fromEntries(st.sides.map((s) => [s.name, [s.pilots, s.loss, s.loss_count]]));

test("快照分方：点名联盟归方，未点名的按交火推断，剩下自动并入第三方", () => {
  const st = battleStats(snapData, snap, known, table);
  assert.equal(st.total_loss, 301);
  assert.equal(st.pilots, 5);
  // C 只挨甲方打，推到乙方；NPC 军团散人归不了方
  assert.deepEqual(bySide(st), { 甲方: [2, 100, 1], 乙方: [2, 201, 2], 第三方: [1, 0, 0] });
  assert.deepEqual(st.sides[0].corps, [{ id: 500, pilots: 2 }]);
  assert.deepEqual(st.sides[0].people, [42]);
  // 小号出场按收录号认人
  assert.deepEqual(st.sides[1].people, [43]);
});

test("交火太少或不偏向一方的不推断", () => {
  const few = battleStats(snapData, { ...snap, hits: [["a:1", "a:3", 2]] }, known, table);
  assert.deepEqual(bySide(few).第三方, [2, 1, 1]);
  const split = battleStats(snapData, { ...snap, hits: [["a:1", "a:3", 2], ["a:2", "a:3", 2]] }, known, table);
  assert.deepEqual(bySide(split).第三方, [2, 1, 1]);
});

test("战报分了队就照分队，不再推断；队里点名联盟分属两方的不采用，改按交火推断", () => {
  const teamed = battleStats(snapData, { ...snap, teams: [["1"], ["2", "3"]], hits: [["a:2", "a:3", 9]] }, known, table);
  assert.deepEqual(bySide(teamed), { 甲方: [2, 100, 1], 乙方: [2, 201, 2], 第三方: [1, 0, 0] });
  const mixed = battleStats(snapData, { ...snap, teams: [["1", "2", "3"]] }, known, table);
  assert.deepEqual(bySide(mixed), { 甲方: [2, 100, 1], 乙方: [2, 201, 2], 第三方: [1, 0, 0] });
  // NPC 军团整队分进来时，散人跟着走
  const npc = battleStats(snapData, { ...snap, teams: [["1", "corp:1000001"], ["2"]] }, known, table);
  assert.deepEqual(bySide(npc).甲方, [3, 100, 1]);
});

test("点名为第三方的联盟只把自己摘出分队，不拆散整队", () => {
  const data = { ...snapData, sides: [...snapData.sides, { name: "第三方", organizations: [3] }] };
  const snap3 = { ...snap, teams: [["1"], ["2", "3"]] };
  assert.deepEqual(bySide(battleStats(data, snap3, known, table)), { 甲方: [2, 100, 1], 乙方: [1, 200, 1], 第三方: [2, 1, 1] });
});

test("多份战报对同一组织分队冲突时，不按来源顺序抢先归方", () => {
  const teams = [["1", "3", "corp:1000001"], ["2", "3"]];
  for (const ordered of [teams, [...teams].reverse()]) {
    // 组织3被两方认领且没有交火依据，应留第三方；无冲突的NPC队友仍跟甲方。
    const st = battleStats(snapData, { ...snap, teams: ordered, hits: [] }, known, table);
    assert.deepEqual(bySide(st), { 甲方: [3, 100, 1], 乙方: [1, 200, 1], 第三方: [1, 1, 1] });
    assert.equal(st.pilots, 5);
    assert.equal(st.total_loss, 301);
  }
});

test("跨战报分队冲突的组织按交火推断，明确点名的归属仍优先", () => {
  const teams = [["1", "3"], ["2", "3"]];
  for (const ordered of [teams, [...teams].reverse()]) {
    const st = battleStats(snapData, { ...snap, teams: ordered }, known, table);
    // 组织3只挨甲方打，推断为乙方，不能被第一份战报分给甲方。
    assert.deepEqual(bySide(st), { 甲方: [2, 100, 1], 乙方: [2, 201, 2], 第三方: [1, 0, 0] });
    const data = { ...snapData, sides: [...snapData.sides, { name: "第三方", organizations: [3] }] };
    assert.deepEqual(bySide(battleStats(data, { ...snap, teams: ordered }, known, table)), {
      甲方: [2, 100, 1], 乙方: [1, 200, 1], 第三方: [2, 1, 1],
    });
  }
});

test("无联盟的军团可按军团 ID 点名归方", () => {
  const solo = { ...snap, pilots: { ...snap.pilots, 11: [600, 0] }, losses: [[1, 10, 500, 1, 1e11], [2, 11, 600, 0, 2e11]] };
  const data = { ...snapData, sides: [snapData.sides[0], { name: "乙方", organizations: [600] }] };
  // 11 按军团 600 归乙方；12（C）照旧按交火推到乙方
  assert.deepEqual(bySide(battleStats(data, solo, known, table)).乙方, [2, 200, 1]);
});

test("页面用的联盟、军团从名称表取名字，并标出 EveWho 链接类别", () => {
  const st = statsOf(snapData, snap, table, known);
  assert.deepEqual(st.sides[0].alliances, [{ id: 1, kind: "alliance", name: "A" }]);
  assert.deepEqual(st.sides[0].corps, [{ id: 500, kind: "corporation", name: "华人军团", pilots: 2 }]);
  const manual = statsOf(ok, null, table, known);
  assert.deepEqual(manual.sides[0].corps, [{ id: 500, kind: "corporation", name: "华人军团", pilots: 20 }]);
  assert.equal(manual.sides[1].corps, undefined);
});

test("战役组织保留全名与游戏内缩写，快照和手填军团都可显示缩写", () => {
  const named = {
    alliances: { ...table.alliances, 1: { name: "Alliance Full Name", ticker: "ALLY" } },
    corporations: { ...table.corporations, 500: { ...table.corporations[500], ticker: "CORP" } },
  };
  for (const st of [statsOf(snapData, snap, named, known), statsOf(ok, null, named, known)]) {
    assert.equal(st.sides[0].alliances[0].ticker, "ALLY");
    assert.equal(st.sides[0].alliances[0].name, "Alliance Full Name");
    assert.equal(st.sides[0].corps[0].ticker, "CORP");
    assert.equal(st.sides[0].corps[0].kind, "corporation");
  }
});

test("快照战役不手填数字，顶层 corps 已取消，手填战役不用 window", () => {
  const v = (patch) => validateBattle({ ...snapData, ...patch }, "", 0, known);
  assert.deepEqual(v({}), []);
  assert.deepEqual(v({ window: ["2025-06-17 18:00", "2025-06-18 06:00"] }), []);
  assert.match(v({ total_loss: 500 })[0], /total_loss 由战报快照算出/);
  assert.match(v({ window: ["2025-06-18 06:00", "2025-06-17 18:00"] })[0], /window/);
  assert.match(v({ sides: [{ ...snapData.sides[0], pilots: 3 }, snapData.sides[1]] })[0], /pilots 由战报快照算出/);
  assert.match(v({ sides: [{ ...snapData.sides[0], corps: [{ id: 500 }] }, snapData.sides[1]] })[0], /corps 由战报快照算出.*chinese/);
  assert.match(v({ corps: ["华人军团"] })[0], /顶层 corps 已取消.*chinese/);
  assert.match(check({ window: ["2025-06-17 18:00", "2025-06-18 06:00"] })[0], /window 只用于/);
  assert.match(v({ sides: [{ ...snapData.sides[0], people: [42] }, snapData.sides[1]] })[0], /people 由战报快照算出.*alts/);
  // 混有非 br.evetools 来源就回到手填
  assert.ok(v({ loss_source: [BR, "https://example.com/a"] }).some((e) => /total_loss 必须是数字/.test(e)));
});

test("快照过期、点名不在战报、规模不够都报错", () => {
  assert.deepEqual(checkSnapshot(snapData, snap, known, table), []);
  assert.match(checkSnapshot(snapData, null, known, table)[0], /缺少战报快照，请运行 npm run fetch/);
  // 名称表里有、本场没出场的不认
  const gone = { ...snapData, sides: [snapData.sides[0], { name: "乙方", organizations: [2, 9] }] };
  assert.match(checkSnapshot(gone, snap, known, table)[0], /（9）不在战报里/);
  const small = checkSnapshot(snapData, { ...snap, losses: [[1, 10, 500, 1, 5e10]] }, known, table);
  assert.match(small[0], /不足 100B/);
});

test("peopleIndex：收录号与身份档案 alts 都指向收录号，_ 开头目录与散文件跳过", (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), "people-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const put = (name, fm) => { mkdirSync(path.join(dir, name)); writeFileSync(path.join(dir, name, `${name}.md`), "正文"); const id = Number(fm.split(": ")[1]); writeFileSync(path.join(dir, name, `${id}-id.json`), JSON.stringify({id, person: {}, identity: {version: 1}})); };
  put("a", "character_id: 42");
  writeFileSync(path.join(dir, "a", "42-id.json"), JSON.stringify({ id: 42, person: {}, identity: { version: 1, alts: [12, 13].map(id => ({ id, name: `Alt ${id}`, sources: ["a.md"] })) } }));
  put("b", "character_id: 43");
  put("_c", "character_id: 44");
  writeFileSync(path.join(dir, "people.11tydata.js"), "");
  assert.deepEqual([...peopleIndex(dir)].sort((x, y) => x[0] - y[0]), [[12, 42], [13, 42], [42, 42], [43, 43]]);
});


test("军团覆盖联盟的错误配置会移动人物与损失，但必须被校验拦截", () => {
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [1] }, { name: "乙方", organizations: [2, 500] }] };
  const st = battleStats(data, snap, known, table);
  assert.deepEqual(bySide(st).甲方, [0, 0, 0]);
  assert.deepEqual(bySide(st).乙方, [4, 301, 3]);
  assert.ok(st.sides[1].people.includes(42));
  assert.match(checkSnapshot(data, snap, known, table).join("\n"), /联盟 1.*点名归方.*冲突/);
});

test("第三方展示以30人为界，不删除未知人数或主阵营", () => {
  const sides = [{ name: "甲方", pilots: 1 }, { name: "第三方", pilots: 29 }];
  assert.deepEqual(visibleSides(sides), [sides[0]]);
  assert.equal(sides.length, 2);
  for (const pilots of [30, 31, null]) assert.equal(visibleSides([{ name: "第三方", pilots }]).length, 1);
});

test("战役视频可选，最多8项，必须为完整B站视频且不重复", () => {
  const video = { title: "本场复盘", url: "https://www.bilibili.com/video/BV1UK4y1H7XT/", author: "UP", description: "本场撤离视角。" };
  assert.deepEqual(check({ videos: [] }), []);
  assert.deepEqual(check({ videos: [video] }), []);
  const eight = Array.from({ length: 8 }, (_, i) => ({ ...video, url: `https://www.bilibili.com/video/BV${String(i).padStart(10, "0")}` }));
  assert.deepEqual(check({ videos: eight }), []);
  assert.deepEqual(check({ videos: eight.slice(0, 7) }), []);
  assert.ok(check({ videos: [...eight, video] }).some(e => /最多 8/.test(e)));
  assert.ok(check({ videos: [video, { ...video, url: "https://bilibili.com/video/BV1UK4y1H7XT?p=2" }] }).some(e => /重复/.test(e)));
  const yt = { ...video, url: "https://www.youtube.com/watch?v=3O56g8KC6CM" };
  assert.deepEqual(check({ videos: [video, yt] }), []);
  assert.ok(check({ videos: [yt, { ...yt, url: "https://www.youtube.com/watch?v=3O56g8KC6CM&t=60" }] }).some(e => /重复/.test(e)));
  for (const url of ["javascript:alert(1)", "https://www.bilibili.com.evil.test/video/BV1UK4y1H7XT", "https://b23.tv/abc", "https://space.bilibili.com/123", "https://www.bilibili.com/video/foo", "http://www.bilibili.com/video/BV1UK4y1H7XT", "https://youtu.be/3O56g8KC6CM", "https://www.youtube.com/embed/3O56g8KC6CM", "https://www.youtube.com/watch?v=short", "https://www.youtube.com.evil.test/watch?v=3O56g8KC6CM"]) {
    assert.ok(check({ videos: [{ ...video, url }] }).some(e => /url 必须/.test(e)), url);
  }
  for (const key of ["title", "author", "description"]) assert.ok(check({ videos: [{ ...video, [key]: " " }] }).some(e => e.includes(key)));
  for (const videos of ["video", [null], ["video"]]) assert.ok(check({ videos }).length);
  assert.ok(check({ videos: [{ ...video, typo: "x" }] }).some(e => /未知字段/.test(e)));
});

test("完整组织归方覆盖默认分队和交火，数字与人物同步且不增加主要联盟展示", () => {
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [1, 3], emblem: 1 }, snapData.sides[1]] };
  const source = { ...snap, teams: [["1"], ["2", "3"]] };
  const st = statsOf(data, source, table, known);
  assert.deepEqual(bySide(st), { 甲方: [3, 101, 2], 乙方: [1, 200, 1], 第三方: [1, 0, 0] });
  assert.deepEqual([...st.sides[0].people].sort((a, b) => a - b), [42, 43]);
  assert.deepEqual(st.sides[0].alliances.map(o => o.id), [1]);
  assert.deepEqual(st.sides[0].emblemOrganization.id, 1);
  assert.deepEqual(orgIds(data), [1, 3, 2]);
  const corp = { ...snapData, sides: [snapData.sides[0], { name: "乙方", organizations: [2, 500], emblem: 2 }] };
  assert.ok(battleStats(corp, snap, known, table).sides[1].people.includes(42));
});

test("完整归方校验ID、跨方冲突和快照存在性", () => {
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [1, 3], emblem: 1 }, { name: "乙方", organizations: [2, 3] }] };
  assert.match(validateBattle(data, "正文", 0, known).join("\n"), /组织 3 同时归于/);
  const bad = { ...snapData, sides: [{ name: "甲方", organizations: [1, "3"] }, snapData.sides[1]] };
  assert.match(validateBattle(bad, "正文", 0, known).join("\n"), /organizations 必须/);
  const absent = { ...snapData, sides: [{ name: "甲方", organizations: [1, 9] }, snapData.sides[1]] };
  assert.match(checkSnapshot(absent, snap, known, table).join("\n"), /9.*不在战报/);
});

test("小规模非华人联盟不列出，完整参战统计仍保留", () => {
  const st = statsOf(snapData, snap, table, known);
  assert.deepEqual(st.sides[1].alliances.map(a => a.id), []);
  assert.deepEqual(st.sides[1].alliance_participation, [
    { id: 2, pilots: 1, loss: 200, loss_count: 1, corps: [600] },
    { id: 3, pilots: 1, loss: 1, loss_count: 1, corps: [700] },
  ]);
  assert.deepEqual(st.sides[1].corporation_affiliations, [
    { id: 600, alliance_ids: [2] }, { id: 700, alliance_ids: [3] },
  ]);
  assert.deepEqual(st.sides[2].alliances, []); // NPC 的联盟 0 不产生假联盟。
});

test("同盟军团被点名到两侧时必须报错，不能把分边计算结果当作事实", () => {
  const source = { ...snap, pilots: { 10: [500, 1], 11: [600, 1] }, losses: [[1, 10, 500, 1, 1e11], [2, 11, 600, 1, 2e11]], hits: [] };
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [500] }, { name: "乙方", organizations: [600] }] };
  const st = statsOf(data, source, table, known);
  assert.deepEqual(bySide(st), { 甲方: [1, 100, 1], 乙方: [1, 200, 1] });
  assert.deepEqual(st.sides[0].alliances.map(a => a.id), [1]);
  assert.deepEqual(st.sides[1].alliances, []);
  assert.deepEqual(st.sides[0].alliance_participation[0].corps, [500]);
  assert.deepEqual(st.sides[1].alliance_participation[0].corps, [600]);
  assert.match(checkSnapshot(data, source, known, table).join("\n"), /联盟 1.*所属军团跨方/);
  const corrected = { ...data, sides: [{ name: "甲方", organizations: [1, 500, 600] }, { name: "乙方", organizations: [2] }] };
  assert.ok(!checkSnapshot(corrected, source, known, table).some(e => /跨方|冲突/.test(e)));
});

test("同一军团的历史联盟变化与建筑损失保留在各自记录下", () => {
  const source = { ...snap, pilots: { 10: [500, 1] }, losses: [[1, 10, 500, 2, 1e11], [2, 0, 600, 3, 2e11]], hits: [] };
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [500, 600] }, { name: "乙方", organizations: [2] }] };
  const st = statsOf(data, source, table, known);
  assert.deepEqual(st.sides[0].corporation_affiliations, [{ id: 500, alliance_ids: [1, 2] }, { id: 600, alliance_ids: [3] }]);
  assert.deepEqual(st.sides[0].alliance_participation.map(a => [a.id, a.pilots, a.loss_count]), [[1, 1, 0], [3, 0, 1], [2, 0, 1]]);
  assert.deepEqual(st.sides[1].alliances, []); // 种子点名不冒充实际到场。
});

test("手填军团可登记有来源的当时联盟，未知和独立军团不凭当前归属回填", () => {
  const sides = [{ ...ok.sides[0], organizations: undefined, corps: [{ id: 500, pilots: 20, alliance_id: 3 }, { id: 600, pilots: 2, alliance_id: 0 }] }, ok.sides[1]];
  assert.deepEqual(check({ sides }), []);
  assert.deepEqual(statsOf({ ...ok, sides }, null, table, known).sides[0].alliances.map(a => a.id), [3]);
  assert.deepEqual(orgIds({ sides }), [500, 3, 600]);
  assert.match(withSide({ corps: [{ id: 500, alliance_id: -1 }] }).join("\n"), /alliance_id/);
});


test("自动联盟缺名保留类型与参与记录，抓取补齐后离线复用", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "battle-participation-"));
  try {
    for (const dir of ["src/people", "src/_data", "src/battles/example"]) mkdirSync(path.join(root, dir), { recursive: true });
    writeFileSync(path.join(root, "src/_data/entityNames.json"), JSON.stringify({ ...table, alliances: { 1: table.alliances[1], 2: table.alliances[2] } }));
    writeFileSync(path.join(root, "src/battles/example/example.md"), "正文\n");
    const config = { ...snapData, title: "自动联盟校验" };
    const save = br => writeFileSync(path.join(root, "src/battles/example/example.json"), stringifyBattleArchive({ battle: config, br }));
    save(snap);
    const skippedCalls = [];
    const skipped = await checkBattles(root, { lookupNames: async ids => { skippedCalls.push(ids); return []; } });
    assert.deepEqual(skippedCalls, []);
    assert.deepEqual(skipped.pendingAllianceIds, []);
    const source = { ...snap, pilots: { ...snap.pilots, ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [100 + i, [700, 3]])) } };
    save(source);
    const pending = await checkBattles(root);
    assert.deepEqual(pending.errors, []);
    assert.deepEqual(pending.pendingAllianceIds, [3]);
    const missingTable = { ...table, alliances: { 1: table.alliances[1], 2: table.alliances[2] } };
    const organization = statsOf(snapData, source, missingTable, known).sides[1].alliances.find(a => a.id === 3);
    assert.equal(organization.kind, "alliance");
    assert.equal(organization.name, "联盟 #3");
    const outage = await checkBattles(root, { lookupNames: async () => { throw new Error("503 maintenance"); } });
    assert.deepEqual(outage.errors, []);
    assert.deepEqual(outage.pendingAllianceIds, [3]);
    assert.match(outage.warnings.join("\n"), /503 maintenance/);
    const calls = [];
    const result = await checkBattles(root, { lookupNames: async ids => { calls.push(ids); return [{ id: 3, name: "Historical C", category: "alliance" }]; } });
    assert.deepEqual(calls, [[3]]);
    assert.deepEqual(result.errors, []);
    assert.equal(JSON.parse(readFileSync(path.join(root, "src/_data/entityNames.json"))).alliances[3].name, "Historical C");
    assert.deepEqual((await checkBattles(root)).errors, []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});


test("联盟展示与补名门槛：9人隐藏、10人保留、1人华人军团保留", () => {
  const source = { ...snap, pilots: Object.fromEntries([
    ...Array.from({ length: 9 }, (_, i) => [100 + i, [600, 2]]),
    ...Array.from({ length: 10 }, (_, i) => [200 + i, [700, 3]]),
    [10, [500, 1]],
  ]), losses: [], hits: [] };
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [1, 2, 3] }] };
  const st = statsOf(data, source, table, known);
  assert.deepEqual(st.sides[0].alliances.map(a => a.id), [3, 1]);
  assert.equal(st.sides[0].pilots, 20);
  assert.deepEqual(st.sides[0].alliance_participation.map(a => a.pilots), [10, 9, 1]);
});


test("归方只接受 organizations，战徽必须来自本方名单", () => {
  assert.match(withSide({ alliances: [1] }).join("\n"), /未知字段 "alliances"/);
  assert.match(withSide({ emblem: 2 }).join("\n"), /emblem 必须是本方 organizations/);
  assert.deepEqual(withSide({ emblem: 1 }), []);
  assert.match(withSide({ organizations: [1, 1] }).join("\n"), /organizations 不得重复/);
});


test("统一归方名单不把NPC和零散独立军团变成主要参战组织", () => {
  const names = { ...table, corporations: { ...table.corporations, 800: { name: "独立军团" }, 900: { name: "零散军团" }, 1000001: { name: "NPC军团" } } };
  const pilots = Object.fromEntries([
    [10, [500, 0]],
    ...Array.from({ length: 10 }, (_, i) => [100 + i, [800, 0]]),
    ...Array.from({ length: 9 }, (_, i) => [200 + i, [900, 0]]),
    ...Array.from({ length: 12 }, (_, i) => [300 + i, [1000001, 0]]),
  ]);
  const source = { ...snap, pilots, losses: [], hits: [] };
  const data = { ...snapData, sides: [{ name: "甲方", organizations: [500, 800, 900, 1000001] }, { name: "乙方", organizations: [2] }] };
  const st = statsOf(data, source, names, known);
  assert.deepEqual(st.sides[0].alliances.map(a => a.id), [800, 500]);
  assert.equal(st.sides[0].pilots, 32);
  assert.deepEqual(st.sides[0].independent_participation.map(c => [c.id, c.pilots]), [[1000001, 12], [800, 10], [900, 9], [500, 1]]);
});
