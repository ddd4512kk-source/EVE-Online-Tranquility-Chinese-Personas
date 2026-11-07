// 查军团今年击杀最多的月份有多少驾驶员上 KB，写进档案的 pilots。只查有招新群号的军团。
// node scripts/research/corp-pilots.mjs <短名…|--qq> [--refresh]
// 先看 docs/corporations 里存的今年月榜，榜上超过 10 人就不联网。其余 zKillboard 每家最多 2 次：统计 1 次，击杀最多的 1 个月 1 次；人头从 ESI 的 KM 数，数够就停。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpRecruitQq, RECRUIT_MIN_PILOTS } from '../activity.mjs';
import { createRequestGuard } from './request-guard.mjs';

const MONTHS_TO_CHECK = 1;
const MAILS_PER_MONTH = 40;
const headers = { 'User-Agent': 'EVE persona research yichen.hu2@gmail.com' };

// 今年击杀加损失最多的几个月，多的在前。
export const busiestMonths = (months, year, limit = MONTHS_TO_CHECK) => Object.entries(months ?? {})
  .filter(([key]) => key.startsWith(String(year)))
  .map(([key, month]) => ({ key, count: (month.shipsDestroyed ?? 0) + (month.shipsLost ?? 0) }))
  .sort((a, b) => b.count - a.count)
  .slice(0, limit)
  .map(({ key }) => key);

// zKB 标签 #:5+ 写着参与人数，大场面优先，人头数得快。
const mailSize = mail => Math.max(0, ...(mail.zkb?.labels ?? []).map(label => Number(label.match(/^#:(\d+)/)?.[1] ?? 0)));
export const largestMails = (mails, limit = MAILS_PER_MONTH) => [...mails].sort((a, b) => mailSize(b) - mailSize(a)).slice(0, limit);

export const corpPilotsOn = (killmail, corpId) => [killmail.victim, ...(killmail.attackers ?? [])]
  .filter(pilot => pilot?.corporation_id === corpId && pilot.character_id)
  .map(pilot => pilot.character_id);

async function peakPilots(json, corpId, year) {
  const stats = await json(`https://zkillboard.com/api/stats/corporationID/${corpId}/`);
  let peak = 0;
  let peakMonth = '';
  for (const key of busiestMonths(stats?.months, year)) {
    const list = await json(`https://zkillboard.com/api/kills/corporationID/${corpId}/year/${year}/month/${Number(key.slice(4))}/`);
    const pilots = new Set();
    for (const mail of largestMails(list)) {
      const killmail = await json(`https://esi.evetech.net/latest/killmails/${mail.killmail_id}/${mail.zkb.hash}/?datasource=tranquility`);
      for (const id of corpPilotsOn(killmail, corpId)) pilots.add(id);
      if (pilots.size > RECRUIT_MIN_PILOTS) break;
    }
    if (pilots.size > peak) {
      peak = pilots.size;
      peakMonth = `${key.slice(0, 4)}-${key.slice(4)}`;
    }
    if (peak > RECRUIT_MIN_PILOTS) break;
  }
  return { peak, month: peakMonth };
}

// 军团档案里存过的今年月榜，榜上有多少人就是那个月多少人上了 KB；够数就不用联网。
export function localMonthlyPeak(dir, corpId, year) {
  const file = path.join(dir, `${corpId}.json`);
  if (!fs.existsSync(file)) return { peak: 0, month: '' };
  const rankings = JSON.parse(fs.readFileSync(file, 'utf8')).rankings ?? [];
  return rankings
    .filter(item => item.scope === 'monthly' && item.period?.startsWith(String(year)))
    .map(item => ({ peak: item.entries?.length ?? 0, month: item.period }))
    .reduce((best, item) => (item.peak > best.peak ? item : best), { peak: 0, month: '' });
}

const corpsRoot = path.resolve(import.meta.dirname, '../../docs/corporations');

async function main() {
  const root = path.resolve(import.meta.dirname, '../../src/corps');
  const args = process.argv.slice(2);
  const refresh = args.includes('--refresh');
  const named = args.filter(arg => !arg.startsWith('--'));
  if (!named.length && !args.includes('--qq')) {
    console.error('用法：node scripts/research/corp-pilots.mjs <短名…|--qq> [--refresh]');
    process.exit(2);
  }
  const read = slug => JSON.parse(fs.readFileSync(path.join(root, slug, `${slug}.json`), 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  const year = Number(today.slice(0, 4));
  const slugs = named.length ? named : fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name)
    .filter(slug => corpRecruitQq(read(slug)));
  const request = createRequestGuard({ limit: slugs.length * (1 + MONTHS_TO_CHECK * (1 + MAILS_PER_MONTH)) });
  const json = async url => {
    const response = await request(url, { headers });
    if (!response.ok) throw new Error(`取数失败：HTTP ${response.status} ${url}`);
    return response.json();
  };
  for (const slug of slugs) {
    const archive = read(slug);
    if (archive.pilots?.year === year && !refresh) continue;
    // 今年一条 KB 都没有的不用问 zKB。
    const quiet = !archive.zkb?.last_active?.startsWith(String(year));
    let result = { peak: 0, month: '' };
    const local = localMonthlyPeak(corpsRoot, archive.corp.id, year);
    if (local.peak > RECRUIT_MIN_PILOTS) result = local;
    else if (!quiet) {
      try {
        result = await peakPilots(json, archive.corp.id, year);
      } catch (error) {
        if (error.name !== 'TimeoutError') throw error;
        console.error(`${slug}：请求超时，重跑时续查`);
        continue;
      }
    }
    archive.pilots = { year, ...result, as_of: today };
    fs.writeFileSync(path.join(root, slug, `${slug}.json`), `${JSON.stringify(archive, null, 2)}\n`);
    console.log(`${slug}：${result.peak}${result.peak > RECRUIT_MIN_PILOTS ? '+' : ''} 人 ${result.month}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
