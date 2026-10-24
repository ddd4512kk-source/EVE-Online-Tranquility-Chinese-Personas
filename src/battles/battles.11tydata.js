import { statSync } from "node:fs";
import path from "node:path";
import { battleArchiveFile, readBattleDocument } from "../../scripts/battle-archive.mjs";
import { emblemSides } from "../../scripts/battle-emblem.mjs";
import { FIELDS, peopleIndex, statsOf, tierOf, toYmd, visibleSides } from "../../scripts/battles.mjs";
import { readNames } from "../../scripts/character-snapshot.mjs";

// 字段校验在 scripts/check-battles.mjs（构建前运行），这里只算展示用的字段。
// 人数、损失、华人军团与人物：有同名 JSON 的 br 快照 从快照算，否则照 battle 手填（statsOf）
// Eleventy 先用代理数据试跑计算字段（数组只剩空位），所以统计直接读文件，不读 d 里的代理字段
const cache = new Map();
const srcDir = path.resolve(import.meta.dirname, "..");
// 收录号与列传 alts 里的小号 → 收录号；全站联盟、军团名称表。每次构建读一遍（serve 时改了要重启）
let people, names;
function documentOf(d) {
  const file = d.page.inputPath;
  const key = file + statSync(file).mtimeMs + statSync(battleArchiveFile(path.dirname(file))).mtimeMs;
  // 同一次构建里各计算字段共用一份；serve 时改了文件换新键重算
  if (!cache.has(key)) {
    people ??= peopleIndex(path.join(srcDir, "people"));
    names ??= readNames(path.dirname(srcDir));
    const document = readBattleDocument(file);
    cache.set(key, { data: document.data, content: document.content, stats: statsOf(document.data, document.archive.br, names, people) });
  }
  return cache.get(key);
}

const stats = d => documentOf(d).stats;

export default {
  layout: "battle.njk",
  eleventyComputed: {
    ...Object.fromEntries(Object.keys(FIELDS).map(key => [key, d => documentOf(d).data[key]])),
    // 网址用目录短名
    permalink: (d) => `/battles/${d.page.fileSlug}/`,
    startYmd: (d) => toYmd(d.start),
    endYmd: (d) => (d.end == null ? null : toYmd(d.end)),
    lossTotal: (d) => stats(d).total_loss,
    pilotsTotal: (d) => stats(d).pilots,
    sidesView: (d) => visibleSides(stats(d).sides),
    emblem: (d) => emblemSides(visibleSides(stats(d).sides)),
    // 联盟、军团链接用的 ID：快照战役取本场战报里的（老联盟名可能已被新联盟占用）
    tier: (d) => tierOf(stats(d).total_loss),
    // 人物页反链：参战的已收录人物，加上正文点名链接的人（传录像的、评论的、没进战报的）。
    // 正文链接按 /p/<ID>/ 认，小号落到本人；改正文即自动跟上，不靠手填。
    peopleIds: (d) => {
      const { stats, content } = documentOf(d);
      const linked = [...String(content).matchAll(/\/p\/(\d+)\//g)].map((m) => people.get(Number(m[1])) ?? Number(m[1]));
      return [...new Set([...stats.sides.flatMap((s) => s.people ?? []), ...linked])];
    },
    lossSources: (d) => [d.loss_source].flat(),
    // 目录筛选用：规模档位在前，再接手写标签
    labels: (d) => [tierOf(stats(d).total_loss)?.name, ...(d.tags ?? [])].filter(Boolean),
    displayName: (d) => d.title,
    pageTitle: (d) => d.title,
    pageDescription: (d) => d.epithet || `${d.title}：${tierOf(stats(d).total_loss)?.name ?? ""}战役`,
  },
};
