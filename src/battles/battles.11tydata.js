import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { peopleIndex, readSnapshot, statsOf, tierOf, toYmd } from "../../scripts/battles.mjs";
import { readNames } from "../../scripts/character-snapshot.mjs";

// 字段校验在 scripts/check-battles.mjs（构建前运行），这里只算展示用的字段。
// 人数、损失、华人军团与人物：有战报快照 br.json 从快照算，否则照 front matter 手填（statsOf）
// Eleventy 先用代理数据试跑计算字段（数组只剩空位），所以统计直接读文件，不读 d 里的 front matter
const cache = new Map();
const srcDir = path.resolve(import.meta.dirname, "..");
// 收录号与列传 alts 里的小号 → 收录号；全站联盟、军团名称表。每次构建读一遍（serve 时改了要重启）
let people, names;
function stats(d) {
  const file = d.page.inputPath;
  const text = readFileSync(file, "utf8");
  // 同一次构建里各计算字段共用一份；serve 时改了文件换新键重算
  const key = file + text;
  if (!cache.has(key)) {
    people ??= peopleIndex(path.join(srcDir, "people"));
    names ??= readNames(path.dirname(srcDir));
    cache.set(key, statsOf(matter(text).data, readSnapshot(path.dirname(file)), names, people));
  }
  return cache.get(key);
}

export default {
  layout: "battle.njk",
  eleventyComputed: {
    // 网址用目录短名
    permalink: (d) => `/battles/${d.page.fileSlug}/`,
    startYmd: (d) => toYmd(d.start),
    endYmd: (d) => (d.end == null ? null : toYmd(d.end)),
    lossTotal: (d) => stats(d).total_loss,
    pilotsTotal: (d) => stats(d).pilots,
    sidesView: (d) => stats(d).sides,
    // 联盟、军团链接用的 ID：快照战役取本场战报里的（老联盟名可能已被新联盟占用）
    tier: (d) => tierOf(stats(d).total_loss),
    peopleIds: (d) => stats(d).sides.flatMap((s) => s.people ?? []),
    lossSources: (d) => [d.loss_source].flat(),
    // 目录筛选用：规模档位在前，再接手写标签
    labels: (d) => [tierOf(stats(d).total_loss)?.name, ...(d.tags ?? [])].filter(Boolean),
    displayName: (d) => d.title,
    pageTitle: (d) => d.title,
    pageDescription: (d) => d.epithet || `${d.title}：${tierOf(stats(d).total_loss)?.name ?? ""}战役`,
  },
};
