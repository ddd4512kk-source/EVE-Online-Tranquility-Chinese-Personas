import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { readPersonDocument } from "./person-document.mjs";

function fixture(t) {
  const directory = mkdtempSync(path.join(tmpdir(), "person-document-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, "person.md"), json = path.join(directory, "42-id.json");
  const put = (record = { id: 42, person: {} }, body = "正文\n\n::: 评\n锐评\n:::\n") => {
    writeFileSync(file, body);
    writeFileSync(json, JSON.stringify(record));
    return readPersonDocument(file);
  };
  return { directory, file, json, put };
}

test("人物配置来自唯一 JSON，正文原样保留，主号 ID 只维护一次", t => {
  const { put } = fixture(t);
  const person = { cn_name: "人物", aliases: ["外号"], epithet: "锐评", tags: ["00区"] };
  const document = put({ id: 42, name: "Pilot", person });
  assert.deepEqual(document.data, { character_id: 42, ...person });
  assert.equal(document.content, "正文\n\n::: 评\n锐评\n:::\n");
  assert.equal(document.archive.name, "Pilot");
});

test("拒绝丢失、损坏、多份档案与 ID 不匹配，不能悄悄读错收录号", t => {
  const { file, json, directory, put } = fixture(t);
  put();
  rmSync(json);
  assert.throws(() => readPersonDocument(file), /有且仅有/);
  writeFileSync(json, "{");
  assert.throws(() => readPersonDocument(file), /42-id.json/);
  assert.throws(() => put({ id: 43, person: {} }), /文件名一致/);
  put();
  writeFileSync(path.join(directory, "43-id.json"), "{}");
  assert.throws(() => readPersonDocument(file), /有且仅有/);
});

test("拒绝旧 front matter、拼错字段及错误字段类型", t => {
  const { put } = fixture(t);
  assert.throws(() => put(undefined, "---\ncharacter_id: 42\n---\n正文"), /front matter/);
  for (const person of [null, [], { cn_name: 42 }, { epithet: [] }, { aliases: [""] }, { tags: "00区" }, { tags: ["a/b"] }, { tags: [42] }, { character_id: 42 }, { updated: "2026-01-01" }, { typo: true }]) {
    assert.throws(() => put({ id: 42, person }));
  }
});

test("别称与小号分开登记，大小写不同也不重复冒充别称", t => {
  const { put } = fixture(t);
  const record = { id: 42, identity: { alts: [{ id: 12, name: "Alt Pilot" }] }, person: { aliases: ["外号"] } };
  assert.deepEqual(put(record).data.aliases, ["外号"]);
  assert.throws(() => put({ ...record, person: { aliases: ["alt pilot"] } }), /别称不能重复登记小号/);
});
