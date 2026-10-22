import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { readAllIdentities, readIdentity, readIdentityDirectory, characterOwners, identityNames } from "./person-identity.mjs";
import { characterFile } from "./character-snapshot.mjs";

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "identity-")), people = path.join(root, "src/people");
  mkdirSync(people, { recursive: true });
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (slug, id, identity = { version: 1 }, frontMatter = "") => {
    const dir = path.join(people, slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, `${slug}.md`), frontMatter ? `---\n${frontMatter}---\n正文` : "正文");
    writeFileSync(path.join(dir, "materials.md"), "已确认账号与角色对应的依据");
    writeFileSync(path.join(dir, characterFile(id)), JSON.stringify({ id, person: {}, identity }));
    return dir;
  };
  return { root, people, put };
}
const alt = (id) => ({ id, name: `Alt ${id}`, sources: ["materials.md"] });
const account = (uid, name = "名字") => ({ uid, name, sources: ["materials.md"] });

test("按新文件读取主小号，忽略草稿；没有额外身份关系也能读取", (t) => {
  const { people, put } = fixture(t);
  put("a", 42, { version: 1, alts: [alt(12), { ...alt(13), name: "别名" }] });
  put("b", 43);
  put("_draft", 99, { version: 1, alts: [alt(12)] });
  assert.deepEqual([...characterOwners(readIdentityDirectory(people))].sort((a, b) => a[0] - b[0]), [[12, 42], [13, 42], [42, 42], [43, 43]]);
});

test("重复小号、他人收录号与自己收录号均拒绝，不受目录顺序影响", (t) => {
  for (const [first, second] of [[12, 12], [43, 14], [14, 42], [42, 14]]) {
    const { people, put } = fixture(t);
    put("a", 42, { version: 1, alts: [alt(first)] });
    put("b", 43, { version: 1, alts: [alt(second)] });
    assert.throws(() => readIdentityDirectory(people), /重复归属/);
  }
});

test("同人重复小号与贴吧 UID 被拒绝；同名不同 UID 的账号允许", (t) => {
  const { people, put } = fixture(t);
  put("a", 42, { version: 1, accounts: { tieba: [account("123")] } });
  put("b", 43, { version: 1, accounts: { tieba: [account("456")] } });
  assert.equal(readIdentityDirectory(people).size, 2);
  put("b", 43, { version: 1, accounts: { tieba: [account("123")] } });
  assert.throws(() => readIdentityDirectory(people), /贴吧 UID.*重复归属/);
  put("b", 43, { version: 1, alts: [alt(12), alt(12)] });
  assert.throws(() => readIdentityDirectory(people), /角色 ID.*重复归属/);
});

test("字段错误、无效 ID、缺少或越界来源均报错", (t) => {
  const { put } = fixture(t);
  for (const identity of [null, { version: 2 }, { version: 1, typo: [] },
    { version: 1, alts: [alt("12")] }, { version: 1, alts: [alt(-1)] },
    { version: 1, alts: [{ id: 12, sources: ["materials.md"] }] },
    { version: 1, alts: [{ id: 12, name: "" }] },
    { version: 1, alts: [{ id: 12, name: "Alt" }] }, { version: 1, alts: [{ id: 12, name: "Alt", sources: ["missing.md"] }] },
    { version: 1, alts: [{ id: 12, name: "Alt", sources: ["../../outside.md"] }] },
    { version: 1, accounts: { tieba: [account(123)] } },
    { version: 1, accounts: { bilibili: [] } }]) {
    assert.throws(() => readIdentity(put("a", 42, identity), 42));
  }
});

test("搜索词自动包含小号名、平台账号名与旧名，去重且不要求再抄 aliases", () => {
  assert.deepEqual(identityNames({ alts: [{ name: "Small Pilot" }], accounts: {
    tieba: [{ name: "贴吧名", aliases: ["旧贴吧名"] }], bilibili: [{ name: "UP名" }, { name: "Small Pilot" }],
  } }), ["Small Pilot", "贴吧名", "旧贴吧名", "UP名"]);
  assert.deepEqual(identityNames(undefined), []);
});

test("损坏 JSON、主 ID 不匹配和旧 front matter 不能悄悄跳过", (t) => {
  const { people, put } = fixture(t), dir = put("a", 42);
  writeFileSync(path.join(dir, characterFile(42)), "{");
  assert.throws(() => readIdentity(dir, 42), /42-id\.json/);
  writeFileSync(path.join(dir, characterFile(42)), JSON.stringify({ id: 43, identity: { version: 1 } }));
  assert.throws(() => readIdentity(dir, 42), /收录号一致/);
  put("a", 42, { version: 1 }, "alts: [12]\n");
  assert.throws(() => readIdentityDirectory(people), /人物字段已迁至/);
});

test("已确认但 UID 未取得的贴吧账号可保留，不编 UID", (t) => {
  const { people, put } = fixture(t);
  put("a", 42, { version: 1, accounts: { tieba: [{ name: "本人自署", sources: ["materials.md"] }] } });
  assert.equal(readIdentityDirectory(people).get("a").accounts.tieba[0].uid, undefined);
});

test("B站只关联已确认且已立传的本人账号；候选、关联官号和未立传线索不混入", (t) => {
  const { root, put } = fixture(t);
  put("a", 42);
  const archive = path.join(root, "docs/bilibili");
  mkdirSync(archive, { recursive: true });
  const profile = (uid, state, person = "a") => writeFileSync(path.join(archive, `${uid}.json`), JSON.stringify({
    uid, name: "UP", url: `https://space.bilibili.com/${uid}/`, identity: { state, person, material: "src/people/a/materials.md" },
  }));
  profile("123", "confirmed"); profile("456", "candidate"); profile("789", "associated"); profile("999", "confirmed", null);
  const accounts = readAllIdentities(root).get("a").accounts.bilibili;
  assert.deepEqual(accounts.map((a) => a.uid), ["123"]);
  assert.equal(accounts[0].archive, "docs/bilibili/123.json");
  profile("123", "confirmed", "missing");
  assert.throws(() => readAllIdentities(root), /已对应人物不存在/);
});
