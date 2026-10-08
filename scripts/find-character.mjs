// 由角色名（或 EveWho / zKillboard 链接）查角色 ID，并显示是否已有列传。
//
//   npm run find -- "Water Sky"
//   npm run find -- https://evewho.com/character/1996305710

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const PEOPLE_DIR = path.join(ROOT, "src/people");
const USER_AGENT =
  "EVE-Online-Tranquility-Chinese-Personas (+https://github.com/ddd4512kk-source/EVE-Online-Tranquility-Chinese-Personas)";

const input = process.argv.slice(2).join(" ").trim();
if (!input) {
  console.error('用法：npm run find -- "角色名"  或  npm run find -- <EveWho/zKillboard 链接>');
  process.exit(1);
}

async function existing() {
  const map = new Map();
  for (const entry of await fs.readdir(PEOPLE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const file = `${entry.name}/${entry.name}.md`;
    const { data } = matter(await fs.readFile(path.join(PEOPLE_DIR, file), "utf8"));
    map.set(Number(data.character_id), file);
  }
  return map;
}

let id = Number(input.match(/character\/(\d+)/)?.[1] ?? (/^\d+$/.test(input) ? input : NaN));
let name = null;

if (!id) {
  const res = await fetch("https://esi.evetech.net/latest/universe/ids/", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT },
    body: JSON.stringify([input]),
  });
  const hit = res.ok ? (await res.json()).characters?.[0] : null;
  if (!hit) {
    console.error(`找不到名为 "${input}" 的角色（角色名须完全一致，大小写不限）。`);
    process.exit(1);
  }
  ({ id, name } = hit);
}

const file = (await existing()).get(id);
console.log(`角色 ID：${id}${name ? `（${name}）` : ""}`);
console.log(`EveWho：https://evewho.com/character/${id}`);
console.log(file ? `已有列传：src/people/${file}` : "尚无列传。");
