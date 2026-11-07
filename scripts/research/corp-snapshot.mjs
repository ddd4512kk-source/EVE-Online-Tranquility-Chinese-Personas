// 把 ESI 军团资料与 zKillboard 战绩写进军团档案的 esi、zkb，人工字段不动（武德 ratings.pvp 除外，按最近排名换算）。
// node scripts/research/corp-snapshot.mjs <短名…|--all> [--esi-only]
// --esi-only 只刷新 ESI，不请求 zKillboard。
import fs from 'node:fs';
import path from 'node:path';
import { decodeCorpDescription, pvpFromRank, describesInviteOnly, describesRecruiting, qqGroupFromDescription, zoneKeysFromLabels } from '../activity.mjs';
import { createRequestGuard } from './request-guard.mjs';

const root = path.resolve(import.meta.dirname, '../../src/corps');
const args = process.argv.slice(2);
const esiOnly = args.includes('--esi-only');
const named = args.filter(arg => !arg.startsWith('--'));
if (!named.length && !args.includes('--all')) {
  console.error('用法：node scripts/research/corp-snapshot.mjs <短名…|--all> [--esi-only]');
  process.exit(2);
}
const slugs = args.includes('--all')
  ? fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
  : named;
const today = new Date().toISOString().slice(0, 10);
// 每家最多 4 次请求：军团、CEO、联盟、zKB。
const request = createRequestGuard({ limit: slugs.length * 4 });
const headers = { 'User-Agent': 'EVE persona research yichen.hu2@gmail.com' };

async function json(url) {
  const response = await request(url, { headers });
  if (!response.ok) throw new Error(`取数失败：HTTP ${response.status} ${url}`);
  return response.json();
}

const esi = pathname => json(`https://esi.evetech.net/latest${pathname}?datasource=tranquility`);

async function snapshot(id) {
  const corp = await esi(`/corporations/${id}/`);
  // ceo_id 为 1 表示军团已无 CEO，ESI 查不到该角色。
  const ceo = corp.ceo_id > 1 ? await esi(`/characters/${corp.ceo_id}/`) : { name: '无' };
  const alliance = corp.alliance_id ? await esi(`/alliances/${corp.alliance_id}/`) : null;
  const esiPart = {
    esi: {
      name: corp.name,
      ticker: corp.ticker,
      member_count: corp.member_count,
      ceo: { id: corp.ceo_id, name: ceo.name },
      alliance: alliance ? { id: corp.alliance_id, name: alliance.name, ticker: alliance.ticker } : null,
      date_founded: corp.date_founded?.slice(0, 10) ?? '',
      open_recruiting: describesRecruiting(decodeCorpDescription(corp.description)),
      invite_only: describesInviteOnly(decodeCorpDescription(corp.description)),
      qq: qqGroupFromDescription(decodeCorpDescription(corp.description)),
      as_of: today,
    },
  };
  if (esiOnly) return esiPart;
  const stats = await json(`https://zkillboard.com/api/stats/corporationID/${id}/`);
  const months = Object.keys(stats?.months ?? {}).sort();
  return {
    ...esiPart,
    zkb: {
      kills: stats?.shipsDestroyed ?? 0,
      lost: stats?.shipsLost ?? 0,
      isk_destroyed: Math.round(stats?.iskDestroyed ?? 0),
      rank: stats?.rankings?.alltime?.all?.ranks?.overall ?? null,
      rank_recent: stats?.rankings?.recent?.all?.ranks?.overall ?? null,
      zones: zoneKeysFromLabels(stats?.labels),
      zones_recent: zoneKeysFromLabels(stats?.recentLabels),
      last_active: months.at(-1)?.replace(/^(\d{4})(\d{2})$/, '$1-$2') ?? '',
      as_of: today,
    },
  };
}

for (const slug of slugs) {
  const file = path.join(root, slug, `${slug}.json`);
  if (!fs.existsSync(file)) throw new Error(`没有军团档案：${file}`);
  const archive = JSON.parse(fs.readFileSync(file, 'utf8'));
  const next = { ...archive, ...await snapshot(archive.corp.id) };
  // 武德由 zKB 最近排名换算，不手填。
  if (next.zkb) next.corp = { ...next.corp, ratings: { ...next.corp.ratings, pvp: pvpFromRank(next.zkb.rank_recent) } };
  fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`${slug}：快照已写入`);
}
