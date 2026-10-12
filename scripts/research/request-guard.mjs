import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function researchSite(host) {
  host = host.toLowerCase().replace(/\.+$/, '');
  for (const site of ['bilibili.com', 'tieba.baidu.com', 'evewho.com', 'zkillboard.com']) {
    if (host === site || host.endsWith('.' + site)) return site;
  }
  return host;
}

// 取材 HTTP 请求：单次运行限额、按站串行、遇拦截停止；跨工具预算由任务统一记录。
export function createRequestGuard({ fetchImpl = (...args) => fetch(...args), now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), limit = 30,
  isBlocked = site => researchHostStoppedUntil(site) > now(), stop = markResearchHostStopped } = {}) {
  let count = 0, queue = Promise.resolve();
  const hosts = new Map();
  return function request(url, init = {}) {
    const job = queue.then(async () => {
      const host = new URL(url).hostname;
      const site = researchSite(host);
      const state = hosts.get(site) || { count: 0, last: null, stopped: false };
      hosts.set(site, state);
      if (state.stopped || isBlocked(site)) throw new Error(`HTTP 403/429 或挑战后停止：${site}`);
      if (count >= limit || site === 'evewho.com' && state.count >= 8) throw new Error('请求预算已用尽；保留未查缺口');
      const gap = site === 'evewho.com' ? 6000 : site === 'esi.evetech.net' ? 1000 : 2000;
      if (state.last !== null) await sleep(Math.max(0, gap - (now() - state.last)));
      // 等待期间另一会话可能刚触发拦截；发送前再次检查共享状态。
      if (isBlocked(site)) throw new Error(`HTTP 403/429 或挑战后停止：${site}；本次未发送请求`);
      state.last = now(); state.count++; count++;
      const response = await fetchImpl(url, { ...init, signal: init.signal || AbortSignal.timeout(30000) });
      if ([403, 429, 412].includes(response.status)) {
        state.stopped = true; stop(site);
        throw new Error(`HTTP ${response.status}：${init.method || 'GET'} ${url}；本轮停止 ${site}，不重试。仅说明本次抓取失败`);
      }
      if (response.headers?.get?.('content-type')?.includes('text/html') && response.clone) {
        const body = await response.clone().text();
        if (/Just a moment|cf-chl-|访问过于频繁|安全验证/.test(body)) {
          state.stopped = true; stop(site);
          throw new Error(`HTTP ${response.status} 挑战页：${init.method || 'GET'} ${url}；本轮停止 ${site}`);
        }
      }
      return response;
    });
    queue = job.catch(() => {});
    return job;
  };
}
const file = process.env.RESEARCH_STATE_FILE || path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.cache/research-cooldown.json');

// 旧单文件仍可读；新停止事件各写一个文件，避免同时运行的会话相互覆盖。
export function createCooldownStore(stateFile = file, now = Date.now) {
  function readJson(filename, fallback) {
    try { return JSON.parse(fs.readFileSync(filename, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
  }
  function directory(site) {
    if (!/^[a-z0-9.-]+$/.test(site)) throw new Error('无效的取材站点');
    return path.join(stateFile + '.d', site);
  }
  return {
    until(host) {
      const site = researchSite(host);
      const legacy = readJson(stateFile, {});
      let until = Math.max(0, ...Object.entries(legacy).filter(([key]) => researchSite(key) === site).map(([, value]) => Number(value) || 0));
      const dir = directory(site);
      let entries;
      try { entries = fs.readdirSync(dir); }
      catch (error) { if (error.code === 'ENOENT') return until; throw error; }
      for (const entry of entries.filter(name => name.endsWith('.json'))) until = Math.max(until, Number(readJson(path.join(dir, entry), {}).until) || 0);
      return until;
    },
    stop(host) {
      const site = researchSite(host), dir = directory(site), at = now();
      fs.mkdirSync(dir, { recursive: true });
      const filename = path.join(dir, `${at}-${process.pid}-${Math.random().toString(16).slice(2)}.json`);
      const temporary = filename + '.tmp';
      fs.writeFileSync(temporary, JSON.stringify({ site, stopped_at: at, until: at + 30 * 60000 }));
      fs.renameSync(temporary, filename);
    },
  };
}
const sharedCooldowns = createCooldownStore();
export const markResearchHostStopped = site => sharedCooldowns.stop(site);
export const researchHostStoppedUntil = site => sharedCooldowns.until(site);
export const researchFetch = createRequestGuard({
  isBlocked: site => researchHostStoppedUntil(site) > Date.now(),
  stop: markResearchHostStopped,
});
