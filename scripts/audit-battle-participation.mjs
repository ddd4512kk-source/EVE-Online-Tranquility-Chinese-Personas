// 只读本场快照与名称缓存；统计归方与页面使用同一个入口。
import "./runtime.mjs";
import { readdirSync } from "node:fs";
import path from "node:path";
import { readBattleDocument } from "./battle-archive.mjs";
import { peopleIndex, readSnapshot, statsOf, usesSnapshot } from "./battles.mjs";
import { readNames } from "./character-snapshot.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "src/battles");
const names = readNames(root), people = peopleIndex(path.join(root, "src/people"));
const battles = [];
const pending = new Set();
for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const folder = path.join(dir, entry.name);
  const data = readBattleDocument(path.join(folder, `${entry.name}.md`)).data;
  const stats = statsOf(data, readSnapshot(folder), names, people);
  const sides = stats.sides.map(side => ({
    name: side.name,
    alliances: side.alliances.map(org => {
      if (org.kind === "alliance" && !names.alliances[org.id]?.name) pending.add(org.id);
      return { ...org, ...side.alliance_participation?.find(a => a.id === org.id) };
    }),
    corporation_affiliations: side.corporation_affiliations ?? null,
  }));
  battles.push({ slug: entry.name, basis: usesSnapshot(data) ? "snapshot" : "manual", sides });
}
console.log(JSON.stringify({ pendingAllianceIds: [...pending].sort((a, b) => a - b), battles }, null, 2));
