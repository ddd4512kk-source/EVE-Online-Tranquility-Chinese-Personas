// 人物档案中的人工身份关系；与游戏快照共用文件，刷新时独立保留。所有操作均离线。
import "./runtime.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { characterFile } from "./character-snapshot.mjs";
import { readPersonDocument } from "./person-document.mjs";

const isId = (id) => Number.isSafeInteger(id) && id > 0;
const isUid = (uid) => typeof uid === "string" && /^[1-9]\d*$/.test(uid);
const object = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v) => typeof v === "string" && v.trim().length > 0;

export function readIdentity(directory, characterId) {
  const file = path.join(directory, characterFile(characterId));
  let identity, name;
  try {
    const record = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!object(record) || record.id !== characterId) throw new Error("档案 id 必须与列传收录号一致");
    identity = record.identity;
    name = record.name;
  } catch (error) {
    if (error.code === "ENOENT") return { character_id: characterId, alts: [], accounts: {} };
    throw new Error(`${file}：${error.message}`);
  }
  const errors = [];
  const fail = (message) => errors.push(`${file}：${message}`);
  const keys = (value, allowed, label) => {
    for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${label}未知字段 ${key}`);
  };
  const sources = (record, label) => {
    if (!Array.isArray(record.sources) || !record.sources.length) {
      fail(`${label}缺少 sources 身份依据`);
      return;
    }
    for (const source of record.sources) {
      if (!text(source)) { fail(`${label}来源必须是非空字符串`); continue; }
      if (source.startsWith("https://")) {
        try { const url = new URL(source); if (!url.hostname || url.username || url.password) throw new Error(); }
        catch { fail(`${label}来源链接无效`); }
        continue;
      }
      const local = path.resolve(directory, source.split("#")[0]);
      if (!local.startsWith(path.resolve(directory) + path.sep) || !fs.existsSync(local) || !fs.statSync(local).isFile()) {
        fail(`${label}素材来源不存在或越出人物目录：${source}`);
      }
    }
  };
  if (!object(identity)) throw new Error(`${file}：必须是 JSON 对象`);
  const zkb = (value, label) => {
    if (!object(value)) { fail(`${label}zkb 必须是对象`); return; }
    keys(value, ["kills", "lost", "isk_destroyed", "last_active", "as_of"], `${label}zkb `);
    for (const key of ["kills", "lost", "isk_destroyed"]) {
      if (!Number.isFinite(value[key]) || value[key] < 0) fail(`${label}zkb.${key} 必须是非负数`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.as_of ?? "")) fail(`${label}zkb.as_of 必须是 YYYY-MM-DD`);
    if (value.last_active !== undefined && !/^(\d{4}-\d{2})?$/.test(value.last_active)) fail(`${label}zkb.last_active 必须是 YYYY-MM 或空`);
  };
  keys(identity, ["version", "alts", "accounts", "zkb"], "identity");
  if (identity.zkb !== undefined) zkb(identity.zkb, "收录号");
  if (identity.version !== 1) fail("version 必须是 1");
  if (identity.alts !== undefined && !Array.isArray(identity.alts)) fail("alts 必须是对象列表");
  for (const alt of Array.isArray(identity.alts) ? identity.alts : []) {
    if (!object(alt)) { fail("alts 每项必须是对象"); continue; }
    keys(alt, ["id", "name", "sources", "basis", "zkb"], "小号");
    if (alt.basis !== undefined && !text(alt.basis)) fail(`小号 ${alt.id} basis 必须是非空字符串`);
    if (alt.zkb !== undefined) zkb(alt.zkb, `小号 ${alt.id} `);
    if (!isId(alt.id)) fail("小号 id 必须是正整数");
    if (!text(alt.name)) fail("小号 name 必填，必须是实际角色名");
    sources(alt, `小号 ${alt.id} `);
  }
  if (identity.accounts !== undefined && !object(identity.accounts)) fail("accounts 必须是对象");
  const accounts = object(identity.accounts) ? identity.accounts : {};
  keys(accounts, ["tieba"], "账号（B站归 docs/bilibili/<UID>.json，统一读取时自动关联）");
  if (accounts.tieba !== undefined && !Array.isArray(accounts.tieba)) fail("tieba 必须是账号列表");
  for (const account of Array.isArray(accounts.tieba) ? accounts.tieba : []) {
    if (!object(account)) { fail("贴吧账号必须是对象"); continue; }
    keys(account, ["uid", "name", "aliases", "portrait", "sources"], "贴吧账号");
    if (!text(account.name)) fail("贴吧账号 name 必须是非空字符串");
    if (account.uid !== undefined && !isUid(account.uid)) fail("贴吧 uid 必须是正整数字符串");
    if (account.portrait !== undefined && !text(account.portrait)) fail("贴吧 portrait 必须是非空字符串");
    if (account.aliases !== undefined && (!Array.isArray(account.aliases) || !account.aliases.every(text))) fail("贴吧 aliases 必须是非空字符串列表");
    sources(account, `贴吧 ${account.name} `);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return { ...identity, character_id: characterId, name, alts: identity.alts ?? [], accounts };
}

// 同一个收录号、小号或确定 UID 只能归一人；昵称不作为跨人去重键。
export function readIdentityDirectory(peopleDir, { bilibiliDir } = {}) {
  const records = new Map(), ids = new Map(), tieba = new Map();
  const claim = (table, key, slug, label) => {
    if (table.has(key)) throw new Error(`${slug}：${label} ${key} 重复归属（已在 ${table.get(key)}）`);
    table.set(key, slug);
  };
  for (const entry of fs.readdirSync(peopleDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const slug = entry.name, directory = path.join(peopleDir, slug);
    const file = path.join(directory, `${slug}.md`);
    if (!fs.existsSync(file)) continue;
    const { data } = readPersonDocument(file), characterId = data.character_id;
    const identity = readIdentity(directory, characterId);
    claim(ids, characterId, slug, "角色 ID");
    for (const alt of identity.alts) claim(ids, alt.id, slug, "角色 ID");
    for (const account of identity.accounts.tieba ?? []) {
      if (account.uid) claim(tieba, account.uid, slug, "贴吧 UID");
    }
    records.set(slug, { slug, ...identity });
  }
  if (bilibiliDir && fs.existsSync(bilibiliDir)) {
    for (const file of fs.readdirSync(bilibiliDir).filter((f) => /^\d+\.json$/.test(f))) {
      const profile = JSON.parse(fs.readFileSync(path.join(bilibiliDir, file), "utf8"));
      // 已认出账号、尚未立传的线索也可能是 confirmed；不把它强塞给某篇列传。
      if (profile.identity?.state !== "confirmed" || !profile.identity.person) continue;
      const person = records.get(profile.identity.person);
      if (!person) throw new Error(`${file}：B站已对应人物不存在：${profile.identity.person}`);
      if (!isUid(profile.uid) || file !== `${profile.uid}.json`) throw new Error(`${file}：B站 UID 与文件名不符`);
      (person.accounts.bilibili ??= []).push({
        uid: profile.uid, name: profile.name, url: profile.url,
        archive: `docs/bilibili/${file}`, sources: [profile.identity.material].filter(Boolean),
      });
    }
  }
  return records;
}

export function characterOwners(records) {
  return new Map([...records.values()].flatMap((p) => [p.character_id, ...p.alts.map((a) => a.id)].map((id) => [id, p.character_id])));
}

export function identityNames(identity) {
  return [...new Set([
    ...(identity?.alts ?? []).map((alt) => alt.name),
    ...Object.values(identity?.accounts ?? {}).flat().flatMap((account) => [account.name, ...(account.aliases ?? [])]),
  ].filter(Boolean))];
}

// 工具与网站都从此入口按人物取得跨平台身份，不生成另一份需手改的名单。
export function readAllIdentities(root) {
  return readIdentityDirectory(path.join(root, "src/people"), { bilibiliDir: path.join(root, "docs/bilibili") });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const records = [...readAllIdentities(path.resolve(import.meta.dirname, "..")).values()];
    const query = process.argv[2]?.toLowerCase();
    const found = query ? records.filter((p) => p.slug.toLowerCase() === query || p.name?.toLowerCase() === query
      || String(p.character_id) === query || p.alts.some((a) => String(a.id) === query || a.name?.toLowerCase() === query)
      || Object.values(p.accounts).flat().some((a) => a.uid === query || a.name.toLowerCase() === query || a.aliases?.some((n) => n.toLowerCase() === query))) : records;
    if (query && !found.length) throw new Error(`未找到身份档案：${query}`);
    console.log(JSON.stringify(found, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
