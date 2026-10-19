// 校验 src/battles/ 下的战役文件。npm run check 只读缓存、不联网；
// 加 --fetch（npm run fetch / build）时，点名的联盟、军团 ID 不在全站名称表 src/_data/entityNames.json 里的，向 ESI 查名字补进去；
// 战报快照 br.json 缺失或与 front matter 对不上时，重抓 br.evetools／killmail.app 战报。
import "./runtime.mjs";
import path from "node:path";
import { checkBattles } from "./battles.mjs";
import { brApiUrl, brSources, buildSnapshot } from "./battle-report.mjs";

const ESI = "https://esi.evetech.net/latest";
const USER_AGENT =
  "EVE-Online-Tranquility-Chinese-Personas (+https://github.com/ddd4512kk-source/EVE-Online-Tranquility-Chinese-Personas)";

async function getJson(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...init.headers },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`${url} 请求失败：${res.status} ${res.statusText}`);
  return res.json();
}

// 抓 loss_source 里各份 br.evetools／killmail.app 战报，按星系、时间窗精简成快照
async function fetchSnapshot(data) {
  const found = await getJson(`${ESI}/universe/ids/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data.systems),
  });
  const byName = new Map((found.systems ?? []).map((x) => [x.name.toLowerCase(), x.id]));
  const systemIds = data.systems.map((n) => byName.get(n.toLowerCase()));
  if (systemIds.some((id) => !id)) throw new Error(`ESI 查不到星系：${data.systems.filter((_, i) => !systemIds[i]).join("、")}`);
  const raws = [];
  for (const u of brSources(data)) {
    console.log(`抓取战报 ${u}`);
    raws.push(await getJson(brApiUrl(u)));
  }
  return buildSnapshot(data, raws, systemIds);
}

// ID → 名字（每次最多 1000 个）。一批里有一个 ID 无效 ESI 就整批 404，对半拆开重查，跳过无效的
async function lookupNames(ids) {
  const res = await fetch(`${ESI}/universe/names/`, {
    method: "POST",
    headers: { "User-Agent": USER_AGENT, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(ids),
    signal: AbortSignal.timeout(60_000),
  });
  if (res.ok) return res.json();
  if (res.status !== 404) throw new Error(`ESI 名称查询失败：${res.status} ${res.statusText}`);
  if (ids.length === 1) return [];
  const mid = ids.length >> 1;
  return [...(await lookupNames(ids.slice(0, mid))), ...(await lookupNames(ids.slice(mid)))];
}

const fetching = process.argv.includes("--fetch");
const { count, errors } = await checkBattles(path.resolve(import.meta.dirname, ".."), {
  fetchSnapshot: fetching ? fetchSnapshot : undefined,
  lookupNames: fetching ? lookupNames : undefined,
});
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`战役文件校验通过（${count} 场）。`);
