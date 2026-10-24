// 把 zKillboard 战绩写进人物档案：收录号存 identity.zkb，小号存 alts[].zkb。
// node scripts/research/zkb-stats.mjs <短名…|--all> [--refresh]
// 默认只补缺失；--refresh 重取。zKillboard 限速，每个角色间隔约 1.1 秒。
import fs from "node:fs";
import path from "node:path";

const root = "src/people";
const args = process.argv.slice(2);
const refresh = args.includes("--refresh");
const all = args.includes("--all");
const slugs = all ? fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory()) : args.filter((a) => !a.startsWith("--"));
const today = new Date().toISOString().slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function stats(id) {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(`https://zkillboard.com/api/stats/characterID/${id}/`, { headers: { "User-Agent": "EVE persona research yichen.hu2@gmail.com" }, redirect: "follow" });
      const s = JSON.parse(await r.text());
      const months = Object.keys(s?.months ?? {}).sort();
      return { kills: s?.shipsDestroyed ?? 0, lost: s?.shipsLost ?? 0, isk_destroyed: Math.round(s?.iskDestroyed ?? 0), last_active: months.at(-1)?.replace(/^(\d{4})(\d{2})$/, "$1-$2") ?? "", as_of: today };
    } catch { await sleep(2000); }
  }
  throw new Error(`zKillboard 取数失败：${id}`);
}

for (const slug of slugs) {
  const dir = path.join(root, slug);
  const file = fs.existsSync(dir) && fs.readdirSync(dir).find((f) => f.endsWith("-id.json"));
  if (!file) { console.error(`没有档案：${slug}`); continue; }
  const fp = path.join(dir, file);
  const d = JSON.parse(fs.readFileSync(fp, "utf8"));
  const targets = [[d.identity, d.id], ...(d.identity.alts ?? []).map((a) => [a, a.id])];
  let n = 0;
  for (const [holder, id] of targets) {
    if (holder.zkb && !refresh) continue;
    holder.zkb = await stats(id);
    n++;
    await sleep(1100);
  }
  if (n) { fs.writeFileSync(fp, JSON.stringify(d, null, 2) + "\n"); console.log(`${slug}：写入 ${n} 个角色`); }
}
