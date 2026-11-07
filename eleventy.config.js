import { groupBattleTags } from './scripts/battle-tags.mjs';
import markdownItContainer from 'markdown-it-container';
import fs from 'node:fs';
import path from 'node:path';
import { glossaryEntries, glossaryLinks } from './scripts/glossary.mjs';
import { corpAlliance, corpAllianceChips, corpBattles, corpKey, corpMembers, corpsOfPerson, corpUnwritten, corpZoneChips, groupCorps, killCount, statusChips } from './scripts/activity.mjs';
import { formatIsk } from './scripts/battles.mjs';
import { identityNames } from './scripts/person-identity.mjs';

// 所有日期按 EVE 时间（UTC）显示
const pad = n => String(n).padStart(2, '0');
const utc = iso => (iso ? new Date(iso) : null);

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData('glossaryEntries', glossaryEntries);
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' }, {
    filter: ['**/*', '!**/AGENTS.md', '!**/CLAUDE.md'],
  });
  eleventyConfig.ignores.add('**/AGENTS.md');
  eleventyConfig.ignores.add('**/CLAUDE.md');
  // Service Worker 必须放在站点根目录，才能管到全站的头像与字体
  eleventyConfig.addPassthroughCopy({ 'src/sw.js': 'sw.js' });
  for (const person of fs.readdirSync('src/people', { withFileTypes: true })) {
    if (!person.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join('src/people', person.name))) {
      const match = file.match(/^portrait-(\d+)\.jpg$/);
      if (match) {
        eleventyConfig.addPassthroughCopy({
          [`src/people/${person.name}/${file}`]: `portraits/${match[1]}.jpg`,
        });
      }
    }
  }
  eleventyConfig.ignores.add('src/people/*/materials-*.md');
  eleventyConfig.ignores.add('src/people/_*.md');
  eleventyConfig.ignores.add('src/battles/*/materials-*.md');
  eleventyConfig.ignores.add('src/battles/_*/**');
  eleventyConfig.ignores.add('src/battles/*/_*.md');
  eleventyConfig.ignores.add('src/corps/*/materials-*.md');

  eleventyConfig.amendLibrary('md', md => {
    // 中文写作不手动折行：单个换行即换行（聊天记录可逐行书写）
    md.set({ breaks: true });
    // ::: 评 … ::: —— 锐评块，渲染为“朱批”
    md.use(markdownItContainer, '评', {
      render: (tokens, idx) =>
        tokens[idx].nesting === 1
          ? '<aside class="zhupi"><span class="zhupi-mark" data-pagefind-ignore>评曰</span>\n'
          : '</aside>\n',
    });
    // ::: 红料 [标题] … :::（正面）与 ::: 黑料 [标题] … :::（负面），每块一条
    for (const [kind, cls] of [['红料', 'liao-hong'], ['黑料', 'liao-hei']]) {
      const re = new RegExp(`^${kind}(?:\\s+(.*))?$`);
      md.use(markdownItContainer, kind, {
        validate: params => re.test(params.trim()),
        render: (tokens, idx) => {
          if (tokens[idx].nesting !== 1) return '</section>\n';
          const title = tokens[idx].info.trim().match(re)[1];
          return (
            `<section class="liao ${cls}"><h3 class="liao-head"><span class="liao-badge" data-pagefind-ignore>${kind[0]}</span>` +
            (title ? md.utils.escapeHtml(title) : kind) +
            '</h3>\n'
          );
        },
      });
    }
    md.use(glossaryLinks);
    // 任何导向外部的链接，均在新窗口或新标签页打开
    const defaultLinkOpen = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const href = tokens[idx].attrGet('href');
      if (href && /^https?:\/\//i.test(href)) {
        tokens[idx].attrSet('target', '_blank');
        const existingRel = tokens[idx].attrGet('rel') || '';
        const rels = new Set(existingRel.split(/\s+/).filter(Boolean));
        rels.add('noopener');
        rels.add('noreferrer');
        tokens[idx].attrSet('rel', Array.from(rels).join(' '));
      }
      return defaultLinkOpen(tokens, idx, options, env, self);
    };
  });

  // 列传集合：按主角色创号时间升序
  eleventyConfig.addCollection('people', api => {
    const people = api.getFilteredByGlob('src/people/*/*.md');
    for (const p of people) {
      if (!p.data.char) {
        throw new Error(
          `${p.inputPath}：没有角色 ${p.data.character_id} 的缓存数据，请先运行 npm run fetch`,
        );
      }
    }
    return people.sort(
      (a, b) =>
        Date.parse(a.data.char.birthday) - Date.parse(b.data.char.birthday) ||
        a.data.character_id - b.data.character_id,
    );
  });

  // 战役集合：按开打日期倒序（最近的在前）
  eleventyConfig.addCollection('battles', api =>
    api
      .getFilteredByGlob('src/battles/*/*.md')
      .sort((a, b) => b.data.startYmd.localeCompare(a.data.startYmd) || a.data.title.localeCompare(b.data.title, 'zh')),
  );

  // 军团集合：按创立日期升序，老团在前
  eleventyConfig.addCollection('corps', api =>
    api
      .getFilteredByGlob('src/corps/*/*.md')
      .filter(item => !corpUnwritten(item.rawInput))
      .sort((a, b) => a.data.esi.date_founded.localeCompare(b.data.esi.date_founded)),
  );

  // 四个分类独立展示，联盟含本场全部参战记录。
  eleventyConfig.addCollection('battleTagGroups', api => groupBattleTags(api.getFilteredByGlob('src/battles/*/*.md')));

  // 目录按年份分段，并标记被史诗或年份边界夹成单数结尾的中大型卡片，避免双栏出现半行空白。
  eleventyConfig.addFilter('battleDirectoryRows', battles => {
    const list = battles ?? [];
    const yearCounts = new Map();
    for (const b of list) {
      const y = b.data.startYear;
      yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
    }
    return list.map((battle, i) => {
      const year = battle.data.startYear;
      const prevYear = i > 0 ? list[i - 1].data.startYear : null;
      const next = list[i + 1];
      const isEpic = battle.data.tier?.key === 'epic';
      const runEnds = !next || next.data.startYear !== year || next.data.tier?.key === 'epic';
      let runLen = 0;
      if (!isEpic && runEnds) {
        for (let j = i; j >= 0 && list[j].data.startYear === year && list[j].data.tier?.key !== 'epic'; j--) {
          runLen++;
        }
      }
      return {
        battle,
        yearHeader: year !== prevYear ? { year, count: yearCounts.get(year) } : null,
        isSolo: runLen % 2 === 1,
      };
    });
  });

  // 标签 → 人物列表（保持创号时间顺序）
  eleventyConfig.addCollection('tagMap', api => {
    const map = new Map();
    const people = api
      .getFilteredByGlob('src/people/*/*.md')
      .filter(p => p.data.char)
      .sort((a, b) => Date.parse(a.data.char.birthday) - Date.parse(b.data.char.birthday));
    for (const p of people) {
      for (const t of p.data.labels ?? []) {
        if (!map.has(t)) map.set(t, []);
        map.get(t).push(p);
      }
    }
    return [...map]
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, 'zh'));
  });

  eleventyConfig.addFilter('ymd', iso => {
    const d = utc(iso);
    return d ? `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` : '';
  });
  eleventyConfig.addFilter('ym', iso => {
    const d = utc(iso);
    return d ? `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}` : '';
  });
  eleventyConfig.addFilter('json', v => JSON.stringify(v));
  eleventyConfig.addFilter('isk', formatIsk);
  // 分方人数、损失金额与计数，目录和详情不省略缺项。
  // 跨板块互链：某人参与过的战役、按角色 ID 找列传
  // 双向：战役参战名单或正文点名了此人，或此人列传正文链到该战役页
  eleventyConfig.addFilter('battlesOf', (battles, id, bio = '') =>
    (battles ?? []).filter(b => b.data.peopleIds?.includes(Number(id)) || String(bio).includes(`/battles/${b.page.fileSlug}/`)),
  );
  eleventyConfig.addFilter('personById', (people, id) =>
    people.find(p => p.data.character_id === Number(id)),
  );
  eleventyConfig.addFilter('statusChips', statusChips);
  eleventyConfig.addFilter('groupCorps', groupCorps);
  eleventyConfig.addFilter('corpAlliance', corpAlliance);
  eleventyConfig.addFilter('corpAllianceChips', corpAllianceChips);
  eleventyConfig.addFilter('corpKey', corpKey);
  eleventyConfig.addFilter('corpZoneChips', corpZoneChips);
  eleventyConfig.addFilter('killCount', killCount);
  eleventyConfig.addFilter('corpBattles', corpBattles);
  eleventyConfig.addFilter('corpMembers', (people, id, ceoId, linkedIds) => corpMembers(people, id, { ceoId, linkedIds }));
  eleventyConfig.addFilter('corpsOfPerson', corpsOfPerson);
  eleventyConfig.addFilter('glossaryUsed', content =>
    glossaryEntries.filter(entry => String(content).includes(`data-glossary-id="${entry.id}"`)),
  );
  // 供首页即时筛选用的检索串
  eleventyConfig.addFilter('searchKey', d =>
    [d.cn_name, d.char?.name, ...(d.aliases ?? []), ...identityNames(d.identity), ...(d.labels ?? []), d.epithet]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  );

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    // GitHub Pages 项目站点挂在 /<仓库名>/ 下，由 CI 通过环境变量传入
    pathPrefix: process.env.PATH_PREFIX || '/',
    // Markdown 正文不经过模板引擎，作者写 {{ }} 之类字符不会出错
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
  };
}
