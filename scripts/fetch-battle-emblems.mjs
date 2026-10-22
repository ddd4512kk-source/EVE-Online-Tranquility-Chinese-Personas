import { readdir, readFile, mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { readBattleDocument } from "./battle-archive.mjs";
import { emblemSides } from "./battle-emblem.mjs";
import { createRequestGuard } from "./research/request-guard.mjs";

const root = path.resolve(import.meta.dirname, "..");
const names = JSON.parse(await readFile(path.join(root, "src/_data/entityNames.json"), "utf8"));
const logos = new Map();
for (const dir of await readdir(path.join(root, "src/battles"), { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name.startsWith("_")) continue;
  const data = readBattleDocument(path.join(root, "src/battles", dir.name, `${dir.name}.md`)).data;
  const sides = (data.sides ?? []).map(s => ({ ...s, emblemOrganization: s.emblem ? {
    id: s.emblem, kind: names.alliances[s.emblem] ? "alliance" : "corporation",
  } : null }));
  for (const side of emblemSides(sides)) for (const logo of side.logos) logos.set(logo.src, logo);
}
// 每批至多 60 枚，只取缺失图标；遇拦截停止，已缓存图标不联网。
const request = createRequestGuard({ limit: 60 });
const signature = Buffer.from("89504e470d0a1a0a", "hex");
let fetched = 0;
for (const logo of logos.values()) {
  const file = path.join(root, "src", logo.src);
  try {
    const cached = await readFile(file);
    if (!cached.subarray(0, 8).equals(signature)) throw new Error(`图标不是 PNG：${file}`);
    continue;
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  const url = `https://images.evetech.net/${logo.kind === "alliance" ? "alliances" : "corporations"}/${logo.id}/logo?size=128`;
  const response = await request(url);
  if (!response.ok) throw new Error(`图标获取失败：HTTP ${response.status} ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.subarray(0, 8).equals(signature)) throw new Error(`图标响应不是 PNG：${url}`);
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, bytes);
  await rename(temp, file);
  fetched++;
}
console.log(`战徽图标齐全（${logos.size} 枚，本次补取 ${fetched} 枚）。`);
