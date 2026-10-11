import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// 取材 HTTP 请求：单次运行限额、按站串行、遇拦截停止；跨工具预算由任务统一记录。
export function createRequestGuard({ fetchImpl = (...args) => fetch(...args), now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), limit = 30, isBlocked = () => false, stop = () => {} } = {}) {
  let count = 0, queue = Promise.resolve();
  const hosts = new Map();
  return function request(url, init = {}) {
    const job = queue.then(async () => {
      const host = new URL(url).hostname;
      const site = host.endsWith('bilibili.com') ? 'bilibili.com' : host;
      const state = hosts.get(site) || { count: 0, last: null, stopped: false };
      hosts.set(site, state);
      if (state.stopped || isBlocked(site)) throw new Error(`HTTP 403/429 或挑战后停止：${site}`);
      if (count >= limit || site === 'evewho.com' && state.count >= 8) throw new Error('请求预算已用尽；保留未查缺口');
      const gap = site === 'evewho.com' ? 6000 : site === 'esi.evetech.net' ? 1000 : 2000;
      if (state.last !== null) await sleep(Math.max(0, gap - (now() - state.last)));
      state.last = now(); state.count++; count++;
      const response = await fetchImpl(url, { ...init, signal: init.signal || AbortSignal.timeout(30000) });
      if ([403, 429, 412].includes(response.status)) {
        state.stopped = true; stop(site);
        throw new Error(`HTTP ${response.status}：本轮停止 ${site}，不重试`);
      }
      if (response.headers?.get?.('content-type')?.includes('text/html') && response.clone) {
        const body = await response.clone().text();
        if (/Just a moment|cf-chl-|访问过于频繁|安全验证/.test(body)) {
          state.stopped = true; stop(site);
          throw new Error(`HTTP 403 挑战页：本轮停止 ${site}`);
        }
      }
      return response;
    });
    queue = job.catch(() => {});
    return job;
  };
}
const file = process.env.RESEARCH_STATE_FILE || path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.cache/research-cooldown.json');
function cooldowns() {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return {}; }
}
export function markResearchHostStopped(site) {
  const states = cooldowns(); states[site] = Date.now() + 30 * 60000;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(states));
}
export const researchFetch = createRequestGuard({
  isBlocked: site => (cooldowns()[site] || 0) > Date.now(),
  stop: markResearchHostStopped,
});
