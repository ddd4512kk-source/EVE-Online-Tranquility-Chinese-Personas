// 每场一个同名 JSON：battle 是人工配置，br 是可刷新快照。
import { readFileSync, writeFileSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { stringifySnapshot } from "./battle-report.mjs";

export const battleArchiveFile = dir => path.join(dir, `${path.basename(dir)}.json`);

export function readBattleArchive(dir) {
  const file = battleArchiveFile(dir);
  let archive;
  try { archive = JSON.parse(readFileSync(file, "utf8")); }
  catch (error) { throw new Error(`${file}：${error.code === "ENOENT" ? "缺少战役 JSON" : error.message}`); }
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
  if (!object(archive) || Object.keys(archive).some(key => !["battle", "br"].includes(key)) || !object(archive.battle) || !(archive.br === null || object(archive.br))) {
    throw new Error(`${file}：必须是 { battle: 配置对象, br: 快照对象或 null }`);
  }
  for (const side of Array.isArray(archive.battle.sides) ? archive.battle.sides : []) {
    if (side && Object.hasOwn(side, "alliances")) throw new Error(`${file}：sides 已统一为 organizations，战徽单独写 emblem`);
  }
  return archive;
}

export function readBattleDocument(file) {
  const parsed = matter(readFileSync(file, "utf8"));
  if (Object.keys(parsed.data).length) throw new Error(`${file}：战役字段统一放入同名 JSON 的 battle，不在 front matter 重复维护`);
  const archive = readBattleArchive(path.dirname(file));
  return { ...parsed, data: archive.battle, archive };
}

export function stringifyBattleArchive(archive) {
  const battle = JSON.stringify(archive.battle, null, 2).replaceAll("\n", "\n  ");
  const br = archive.br === null ? "null" : stringifySnapshot(archive.br).trimEnd().replaceAll("\n", "\n  ");
  return `{\n  "battle": ${battle},\n  "br": ${br}\n}\n`;
}

// 重新读整份档案后只替换 br；不把调用方较早读到的分方写回去。
export function writeBattleSnapshot(dir, snapshot) {
  const archive = readBattleArchive(dir);
  const file = battleArchiveFile(dir), temporary = `${file}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, stringifyBattleArchive({ ...archive, br: snapshot }));
    renameSync(temporary, file);
  } finally { rmSync(temporary, { force: true }); }
}
