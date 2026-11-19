import { corpRecruitQq, corpStatus, corpUnwritten, corpZones } from '../../scripts/activity.mjs';
import { allianceBackdrop } from '../../scripts/battle-emblem.mjs';
import { CORP_RATING_DIMENSIONS } from '../../scripts/corps.mjs';

// 配置与快照在同名 JSON（Eleventy 目录数据自动读入），这里只算展示字段。
export default {
  layout: 'corp.njk',
  eleventyComputed: {
    permalink: d => (corpUnwritten(d.page?.rawInput) ? false : `/corps/${d.page.fileSlug}/`),
    displayName: d => d.corp?.cn_name,
    pageTitle: d => `${d.corp?.cn_name}军团志`,
    pageDescription: d => d.corp?.epithet,
    styleKey: d => d.corp?.style ?? 'tycoon',
    ratingDimensions: () => CORP_RATING_DIMENSIONS,
    status: d => corpStatus(d),
    recruitQq: d => corpRecruitQq(d),
    zones: d => corpZones({ corp: d.corp, zkb: d.zkb }),
    // 正文点名的人物，小号也认，归到本人交给 corpMembers。
    linkedPeople: d => [...String(d.page?.rawInput ?? '').matchAll(/\/p\/(\d+)\//g)].map(m => Number(m[1])),
    emblemSrc: d => `/assets/emblems/corporation-${d.corp?.id}.png`,
    allianceBackdrop: d => allianceBackdrop(d.esi?.alliance?.id),
  },
};
