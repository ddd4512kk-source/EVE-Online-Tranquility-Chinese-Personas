// 人物正文只写 Markdown，展示配置与身份、快照共用 <ID>-id.json。
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { characterFile } from "./character-snapshot.mjs";

export const PERSON_FIELDS = ["cn_name", "aliases", "epithet", "tags"];
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const strings = value => Array.isArray(value) && value.every(item => typeof item === "string" && item.trim());

export function readPersonDocument(file) {
  const parsed = matter(readFileSync(file, "utf8"));
  if (Object.keys(parsed.data).length) throw new Error(`${file}：人物字段已迁至 <ID>-id.json，不在 front matter 重复维护`);
  const directory = path.dirname(file);
  const files = readdirSync(directory).filter(name => /^\d+-id\.json$/.test(name));
  if (files.length !== 1) throw new Error(`${directory}：必须有且仅有一份 <ID>-id.json 人物档案`);
  const archiveFile = path.join(directory, files[0]);
  let archive;
  try { archive = JSON.parse(readFileSync(archiveFile, "utf8")); }
  catch (error) { throw new Error(`${archiveFile}：${error.message}`); }
  if (!object(archive) || !Number.isSafeInteger(archive.id) || archive.id <= 0 || files[0] !== characterFile(archive.id)) {
    throw new Error(`${archiveFile}：档案 id 必须是正整数且与文件名一致`);
  }
  if (!object(archive.person)) throw new Error(`${archiveFile}：缺少 person 展示配置对象`);
  const errors = [];
  for (const key of Object.keys(archive.person)) if (!PERSON_FIELDS.includes(key)) errors.push(`person 未知字段 ${key}`);
  for (const key of ["cn_name", "epithet"]) {
    if (archive.person[key] !== undefined && typeof archive.person[key] !== "string") errors.push(`${key} 必须是字符串`);
  }
  for (const key of ["aliases", "tags"]) {
    if (archive.person[key] !== undefined && !strings(archive.person[key])) errors.push(`${key} 必须是非空字符串列表`);
  }
  if (Array.isArray(archive.person.tags) && archive.person.tags.some(tag => typeof tag === "string" && /[\/\\?#%]/.test(tag))) errors.push("标签里不能含 / \\ ? # % 字符");
  const altNames = new Set((Array.isArray(archive.identity?.alts) ? archive.identity.alts : []).map(alt => typeof alt?.name === "string" ? alt.name.toLowerCase() : null));
  if (Array.isArray(archive.person.aliases) && archive.person.aliases.some(alias => typeof alias === "string" && altNames.has(alias.toLowerCase()))) errors.push("aliases 别称不能重复登记小号正式名字，请只保留在 identity.alts");
  if (errors.length) throw new Error(errors.map(error => `${archiveFile}：${error}`).join("\n"));
  return { ...parsed, data: { character_id: archive.id, ...archive.person }, archive, archiveFile };
}
