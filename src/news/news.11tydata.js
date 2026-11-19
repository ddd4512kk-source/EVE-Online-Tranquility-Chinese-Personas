import { newsCategory, newsExcerpt, newsPageUrl, TRANSLATIONS } from '../../scripts/news.mjs';

// 字段在页面 front matter（格式见 scripts/news.mjs），这里只算展示字段。
export default {
  layout: 'news.njk',
  eleventyComputed: {
    permalink: d => `/news/${d.page.fileSlug}/`,
    pageTitle: d => d.title,
    // 不叫 category：front matter 的 category 是手工指定分类的键。
    newsCat: d => newsCategory(d),
    excerpt: d => newsExcerpt(d.page?.rawInput),
    pageDescription: d => newsExcerpt(d.page?.rawInput, 120) || d.titleEn,
    translationLabel: d => TRANSLATIONS[d.translation],
    sourceZh: d => (d.translation === 'official' ? newsPageUrl(d.page.fileSlug, 'zh') : null),
    year: d => String(d.published).slice(0, 4),
  },
};
