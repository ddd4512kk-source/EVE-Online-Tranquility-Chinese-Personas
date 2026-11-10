// 军团篇工作台：找候选、开页、汇线索、查缺口。只读写本地文件，联网快照仍走 corps:snapshot。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CORP_PLACEHOLDER as PLACEHOLDER, corpHasEnoughMembers, corpMembers, corpStatus } from './activity.mjs';
import { materialPath, readMaterial } from './material-document.mjs';

const CORPS = 'src/corps';
const NAMES = 'src/_data/entityNames.json';
export const EXCLUDED = 'docs/corps-excluded.json';
const NPC_ID_MAX = 2000000;
const CLUE_WIDTH = 480;
const ROSTER_MIN = 3;
const RECRUIT_WORDS = /招新|招人|招募|纳新|诚招|入团|recruit/i;
const CORPUS = [
  ['src/people', /\.md$|materials-.*\.json$/],
  ['src/battles', /\.(?:md|json)$/],
  ['docs/leads', /\.(?:md|json)$/],
  ['docs/sources', /\.(?:md|json)$/],
  ['docs/bilibili', /\.json$/],
  ['docs/tieba', /\.json$/],
  ['docs/corporations', /\.(?:md|json)$/],
];

export const HELP = `军团篇工作台
  npm run corps -- candidates          有现任列传人物、还没开页、也没排除的军团
  npm run corps -- open <军团ID>       开页骨架并标华人军团，之后跑 corps:snapshot
  npm run corps -- clues <短名…>       汇总一家军团的全仓线索；--todo 取全部待写，--limit N 改条数（默认 14），--also 别名,别名 加搜华人圈叫法
  npm run corps -- audit               逐家查门槛、待写、流水账、坏链与华人标记，有问题时退出码为 1`;

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const dirs = dir => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
  : [];

export function loadCorps(root) {
  const base = path.join(root, CORPS);
  return dirs(base).map(slug => ({
    slug,
    archive: readJson(path.join(base, slug, `${slug}.json`)),
    body: fs.readFileSync(path.join(base, slug, `${slug}.md`), 'utf8'),
    hasMaterials: fs.existsSync(materialPath(path.join(base, slug), slug)),
  }));
}

// 形状对齐站点数据，好直接用 corpMembers。
export function loadPeople(root) {
  const base = path.join(root, 'src/people');
  const people = [];
  for (const slug of dirs(base)) {
    if (slug.startsWith('_')) continue;
    const file = fs.readdirSync(path.join(base, slug)).find(name => /^\d+-id\.json$/.test(name));
    if (!file) continue;
    const record = readJson(path.join(base, slug, file));
    people.push({
      slug,
      characterName: record.name,
      name: record.person?.cn_name ?? record.name,
      data: { character_id: record.id, identity: record.identity, char: { history: record.history ?? [] } },
    });
  }
  return people;
}

const readExcluded = root => {
  const file = path.join(root, EXCLUDED);
  return fs.existsSync(file) ? readJson(file) : {};
};

// 门槛：有招新帖、有现任列传人物且活人够、活跃，占一条即可写；一条都没有不写。曾在团的人不算。
export function gateReasons({ recruitment, zkb, esi }, currentPeople) {
  const reasons = [];
  if (recruitment) reasons.push('招新帖');
  if (currentPeople > 0 && corpHasEnoughMembers(esi)) reasons.push('现任列传人物');
  if (corpStatus({ zkb, recruitment, esi }).state === 'active') reasons.push('活跃');
  return reasons;
}

const currentCount = (people, archive) => {
  const { ceo, current } = corpMembers(people, archive.corp.id, { ceoId: archive.esi?.ceo?.id });
  return ceo.length + current.length;
};

export function listCandidates(root) {
  const have = new Set(loadCorps(root).map(corp => corp.archive.corp.id));
  const excluded = readExcluded(root);
  const names = readJson(path.join(root, NAMES)).corporations;
  const tally = new Map();
  for (const person of loadPeople(root)) {
    const history = person.data.char.history;
    for (const id of new Set(history.map(stint => stint.corporation_id))) {
      const row = tally.get(id) ?? { id, current: 0, all: 0 };
      row.all += 1;
      if (history.some(stint => stint.corporation_id === id && !stint.end)) row.current += 1;
      tally.set(id, row);
    }
  }
  return [...tally.values()]
    .filter(({ id }) => id > NPC_ID_MAX && !have.has(id) && !excluded[id])
    .map(row => ({ ...row, name: names[row.id]?.name ?? '', ticker: names[row.id]?.ticker ?? '', chinese: Boolean(names[row.id]?.chinese) }))
    .filter(row => row.current > 0)
    .sort((a, b) => b.current - a.current || b.all - a.all);
}

export function slugFor(name, id, taken) {
  const base = name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30).replace(/-$/, '');
  const slug = base || `corp-${id}`;
  return taken.has(slug) ? `${slug}-${id}` : slug;
}

export function openCorp(root, id) {
  if (!Number.isInteger(id)) throw new Error('open 需要军团 ID');
  const corps = loadCorps(root);
  if (corps.some(corp => corp.archive.corp.id === id)) throw new Error(`军团 ${id} 已有页面`);
  const excluded = readExcluded(root)[id];
  if (excluded) throw new Error(`军团 ${id} 已排除：${excluded.reason}。确实变了就先改 ${EXCLUDED}`);
  const namesFile = path.join(root, NAMES);
  const names = readJson(namesFile);
  const name = names.corporations[id]?.name;
  if (!name) throw new Error(`entityNames 里没有军团 ${id}，先 npm run fetch`);
  const slug = slugFor(name, id, new Set(corps.map(corp => corp.slug)));
  const dir = path.join(root, CORPS, slug);
  fs.mkdirSync(dir, { recursive: true });
  writeJson(path.join(dir, `${slug}.json`), {
    corp: { id, cn_name: name, epithet: '待定', style: 'tycoon', ratings: { pvp: 50, shenren: 20, influence: 30 } },
  });
  fs.writeFileSync(path.join(dir, `${slug}.md`), `${PLACEHOLDER}\n`);
  fs.writeFileSync(path.join(dir, `materials-${slug}.json`), JSON.stringify({
    version: 1, type: 'material', title: name,
    sections: [{ id: 'overview', heading: name, level: 1, content: `军团 ID ${id}。快照见同名 JSON。\n` }],
  }, null, 2) + '\n');
  names.corporations[id].chinese = true;
  writeJson(namesFile, names);
  return `已开页 ${slug}，接着：npm run corps:snapshot -- ${slug}`;
}

function collectCorpus(root) {
  const texts = new Map();
  const walk = (dir, pattern) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file, pattern);
      else if (pattern.test(entry.name)) {
        const relative = path.relative(root, file).replaceAll('\\', '/');
        const materialArea = /^src\/(?:people|battles)\/[^/]+\/materials-[^/]+\.json$/.test(relative)
          || /^docs\/(?:leads|sources|corporations\/notes)\/.+\.json$/.test(relative);
        if (materialArea) {
          const document = JSON.parse(fs.readFileSync(file, 'utf8'));
          if (document?.type !== 'material') {
            if (relative.startsWith('src/')) throw new Error(`${relative}：materials JSON 须为 material 文档`);
            return;
          }
          texts.set(relative, readMaterial(file));
        } else texts.set(relative, fs.readFileSync(file, 'utf8'));
      }
    }
  };
  for (const [dir, pattern] of CORPUS) if (fs.existsSync(path.join(root, dir))) walk(path.join(root, dir), pattern);
  return texts;
}

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function cluePatterns(root, { corp, esi }, also = []) {
  const terms = new Set([...(esi?.name?.length >= 5 ? [esi.name] : []), ...also]);
  // cn_name 开页时默认抄英文名，起了中文名才多一个搜索词。
  if (/\p{Script=Han}/u.test(corp.cn_name ?? '')) terms.add(corp.cn_name);
  const archive = path.join(root, 'docs/corporations', `${corp.id}.json`);
  if (fs.existsSync(archive)) {
    for (const name of readJson(archive).names ?? []) if (name.length >= 2 && !/^[A-Za-z0-9. ]{1,3}$/.test(name)) terms.add(name);
  }
  const patterns = [...terms].map(term => new RegExp(escapeRegExp(term), 'i'));
  // 三字母代号容易撞词，只认带括号的；四字母以上正文里常裸写。
  if (esi?.ticker?.length >= 4) patterns.push(new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(esi.ticker)}(?![A-Za-z0-9])`));
  else if (esi?.ticker?.length === 3) patterns.push(new RegExp(`[[【(]${escapeRegExp(esi.ticker)}[\\]】)]`));
  return patterns;
}

const stintText = stints => stints.map(stint => `${stint.start.slice(0, 7)}~${stint.end ? stint.end.slice(0, 7) : '今'}`).join(',');

function peopleLines(people, corpId) {
  return people
    .map(person => ({ person, stints: person.data.char.history.filter(stint => stint.corporation_id === corpId) }))
    .filter(({ stints }) => stints.length)
    .map(({ person, stints }) => `${person.name}(${person.data.character_id}) ${stintText(stints)}`);
}

// 素材和角色表排后面：正文与来源里的说法通常更成段。
const clueRank = file => /materials-/.test(file) ? 2 : /corporations\/characters/.test(file) ? 3 : 0;

export function cluesFor(root, { archive, slug }, { texts, people, limit, also }) {
  const patterns = cluePatterns(root, archive, also);
  const hits = [];
  const recruits = [];
  for (const [file, text] of texts) {
    for (const line of text.split('\n')) {
      const at = patterns.map(pattern => line.search(pattern)).find(index => index >= 0);
      if (at === undefined) continue;
      hits.push({ file, text: line.slice(Math.max(0, at - 220), at + 260).slice(0, CLUE_WIDTH) });
      if (RECRUIT_WORDS.test(line)) recruits.push(file);
    }
    if (file.startsWith('docs/tieba/') && patterns.some(pattern => pattern.test(text)) && RECRUIT_WORDS.test(text)) recruits.push(file);
  }
  hits.sort((a, b) => clueRank(a.file) - clueRank(b.file));
  const seen = new Set();
  const picked = hits.filter(hit => {
    const key = hit.text.slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
  const { corp, esi, zkb, recruitment } = archive;
  const threads = [...new Set(recruits.filter(file => file.startsWith('docs/tieba/')))]
    .map(file => { const thread = JSON.parse(texts.get(file)); return `${thread.url} ${thread.title}`; });
  return [
    `# ${slug} | ${corp.id} | ${esi?.name} [${esi?.ticker}] | 立团 ${esi?.date_founded} | CEO ${esi?.ceo?.name} | 联盟 ${esi?.alliance?.name ?? '无'} | ${esi?.member_count} 人 | 击杀 ${zkb?.kills} | 最近 ${zkb?.last_active} | 招新 ${recruitment?.last_seen ?? '-'}`,
    `列传：${peopleLines(people, corp.id).join('；') || '无'}`,
    `招新帖候选：${threads.join('；') || '无'}`,
    `线索 ${hits.length} 条，列 ${picked.length} 条：`,
    ...picked.map(hit => `@${hit.file}\n${hit.text}`),
  ].join('\n');
}

// 一段里点名三人以上、又挂三个以上年份，就是“谁哪年到哪年在团里”的名单，页面本来就自动列。
export function isRosterParagraph(paragraph) {
  const links = paragraph.match(/\]\(\.\.\/\.\.\/p\/\d+\/\)/g)?.length ?? 0;
  const years = paragraph.match(/\d{4} 年/g)?.length ?? 0;
  return links >= ROSTER_MIN && years >= ROSTER_MIN;
}

export function auditCorp({ slug, archive, body, hasMaterials }, { people, personIds, personSlugs, slugs, names }) {
  const issues = [];
  const isPlaceholder = body.trim() === PLACEHOLDER;
  if (!gateReasons(archive, currentCount(people, archive)).length) issues.push('未达门槛');
  if (isPlaceholder) issues.push('待写');
  if (!isPlaceholder && archive.corp.epithet === '待定') issues.push('题词待定');
  if (!hasMaterials) issues.push('缺素材');
  if (!names[archive.corp.id]?.chinese) issues.push('缺华人标记');
  if (body.split(/\n\s*\n/).some(isRosterParagraph)) issues.push('流水账');
  for (const [, id] of body.matchAll(/\.\.\/\.\.\/p\/(\d+)\//g)) if (!personIds.has(Number(id))) issues.push(`坏人物链接 ${id}`);
  for (const [, target] of body.matchAll(/\]\(\.\.\/([a-z0-9-]+)\/\)/g)) if (!slugs.has(target)) issues.push(`坏军团链接 ${target}`);
  const prose = body.replace(/\]\([^)]*\)/g, ']');
  if (/\{\{[pc]:/.test(prose)) issues.push('未展开的写作占位');
  for (const [word] of prose.matchAll(/(?<![A-Za-z0-9-])[a-z0-9]+(?:-[a-z0-9]+)+(?![A-Za-z0-9-])/g)) if (personSlugs.has(word)) issues.push(`裸短名 ${word}`);
  return { slug, issues: [...new Set(issues)] };
}

export function auditAll(root) {
  const corps = loadCorps(root);
  const people = loadPeople(root);
  const context = {
    people,
    personIds: new Set(people.map(person => person.data.character_id)),
    // 角色名本身带连字符的可以照写，只抓漏展开的列传短名。
    personSlugs: new Set(people.filter(person => person.slug !== person.characterName?.toLowerCase()).map(person => person.slug)),
    slugs: new Set(corps.map(corp => corp.slug)),
    names: readJson(path.join(root, NAMES)).corporations,
  };
  return corps.map(corp => auditCorp(corp, context)).filter(row => row.issues.length);
}

export function run(root, args) {
  const [command, ...rest] = args;
  if (!command || command === '--help') return { output: HELP };
  if (command === 'candidates') {
    const rows = listCandidates(root);
    return { output: [`候选 ${rows.length} 家（ID 名称 [代号] 现任/曾任列传数 华人标记）`, ...rows.map(row => `${row.id} ${row.name} [${row.ticker}] ${row.current}/${row.all} ${row.chinese ? '华人' : '待判断'}`)].join('\n') };
  }
  if (command === 'open') return { output: openCorp(root, Number(rest[0])) };
  if (command === 'clues') {
    const limitAt = rest.indexOf('--limit');
    const limit = limitAt >= 0 ? Number(rest[limitAt + 1]) : 14;
    if (!Number.isInteger(limit) || limit < 1) throw new Error('--limit 须是正整数');
    const alsoAt = rest.indexOf('--also');
    const also = alsoAt >= 0 ? (rest[alsoAt + 1] ?? '').split(',').filter(Boolean) : [];
    if (alsoAt >= 0 && !also.length) throw new Error('--also 须给别名，逗号分隔');
    const valueAt = new Set([limitAt, alsoAt].filter(index => index >= 0).map(index => index + 1));
    const wanted = rest.filter((arg, index) => !arg.startsWith('--') && !valueAt.has(index));
    const corps = loadCorps(root);
    const targets = rest.includes('--todo') ? corps.filter(corp => corp.body.trim() === PLACEHOLDER) : wanted.map(slug => {
      const corp = corps.find(item => item.slug === slug);
      if (!corp) throw new Error(`没有军团：${slug}`);
      return corp;
    });
    if (!targets.length) throw new Error('clues 需要短名或 --todo');
    const context = { texts: collectCorpus(root), people: loadPeople(root), limit, also };
    return { output: targets.map(corp => cluesFor(root, corp, context)).join('\n\n') };
  }
  if (command === 'audit') {
    const rows = auditAll(root);
    const counts = {};
    for (const { issues } of rows) for (const issue of issues) { const kind = issue.split(' ')[0]; counts[kind] = (counts[kind] ?? 0) + 1; }
    const summary = Object.entries(counts).map(([kind, count]) => `${kind} ${count}`).join('，');
    return { output: rows.length ? [`有问题 ${rows.length} 家：${summary}`, ...rows.map(row => `${row.slug}：${row.issues.join('、')}`)].join('\n') : '军团篇没有缺口。', failed: rows.length > 0 };
  }
  throw new Error(`未知命令：${command}\n${HELP}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { output, failed } = run(path.resolve(import.meta.dirname, '..'), process.argv.slice(2));
    console.log(output);
    if (failed) process.exitCode = 1;
  }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
