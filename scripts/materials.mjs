// Offline, on-demand material discovery. The filesystem and existing archives are the index.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPersonDocument } from './person-document.mjs';
import { readOrganizations, readCharacters, characterArchivePath } from './corporation-archive.mjs';
import { materialPath, readMaterial, validateMaterial } from './material-document.mjs';

export const HISTORY = 'docs/sources/material-index-legacy-2026-10-22.jsonl';
const KINDS = ['person', 'battle', 'source', 'lead', 'bilibili', 'corporation', 'character'];
const HELP = `离线定位已有材料；目录从正式档案按需生成，不另维护总表。

用法：npm run materials -- [关键词] [选项]
  --kind <类别>   person / battle / source / lead / bilibili / corporation / character
  --full-text     另搜素材正文与B站作品摘要；必须有关键词，返回命中位置和短摘记
  --limit <数量>  每页最多返回条数，默认 20，必须为正整数
  --offset <数量> 跳过的命中数，默认 0，必须为非负整数
  --history       只查冻结旧索引；必须有关键词，不与 --kind / --full-text 混用
  --help          显示帮助，不读取档案；须单独使用

关键词默认匹配名称、短名、别名、已登记小号／账号、ID、路径及B站作品标题／key，忽略英文大小写。
多个关键词参数合成一个含空格的短语。无关键词且未指定类别时只报各类数量。
输出 JSON：counts 为分类数量，total 为命中总数，records 为当前页。
需纯 JSON 时用 npm run --silent materials -- ...。
人物取 <ID>-id.json，战役取同名 JSON 的 battle，来源／线索取 Markdown 标题与路径，
B站取 docs/bilibili/<UID>.json；军团与共享角色取 docs/corporations/。
军团榜单只作固定线索，旧阅读记录不覆盖当前人物身份；素材不存在时 material 为 null。
结果只定位文件，不证明已经核读、事件成立或调查完成；沿 material 读事件整合，沿 archive 与作品key读B站摘要。

示例：
  npm run materials -- "七喜"
  npm run materials -- "2113823279"
  npm run materials -- "FWST" --kind battle
  npm run materials -- "代驾" --full-text --limit 5
  npm run materials -- --kind lead --limit 10 --offset 10
  npm run materials -- "凯撒" --history --limit 5

历史档案：${HISTORY}
旧索引非空行保留原文、原行号、所属标题与仓库路径引用，不再更新或混入普通查询。
只在追溯旧备注／别名时按词查询，再回正式文件核对；不要整份加载或续写完成日志。
冻结旧状态不能覆盖当前身份、收录或阅读状态。
`;
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (root, file) => fs.existsSync(path.join(root, file));
const names = (root, dir) => exists(root, dir) ? fs.readdirSync(path.join(root, dir)).sort() : [];
const fold = value => String(value).normalize('NFKC').toLowerCase();
const title = text => text.match(/^#{1,6}\s+(.+)$/m)?.[1] ?? '';
const markdownFiles = (root, directory) => names(root, directory).flatMap(name => {
  const file = `${directory}/${name}`;
  if (fs.statSync(path.join(root, file)).isDirectory()) return markdownFiles(root, file);
  if (file.endsWith('.md')) return [file];
  if (!file.endsWith('.json')) return [];
  const data = JSON.parse(read(root, file));
  if (data?.type !== 'material') {
    if (/materials-[^/]+\.json$/.test(file)) readMaterial(path.join(root, file));
    return [];
  }
  const errors = validateMaterial(data, file);
  if (errors.length) readMaterial(path.join(root, file));
  return [file];
});

const materialExists = (root, directory, slug) => {
  const absolute = materialPath(path.join(root, directory), slug);
  return fs.existsSync(absolute) ? path.relative(root, absolute).split(path.sep).join('/') : null;
};
const materialTitle = (root, file) => file.endsWith('.json') ? JSON.parse(read(root, file)).title : title(readMaterial(path.join(root, file)));

export function collectMaterials(root) {
  const records = [];
  for (const slug of names(root, 'src/people')) {
    const directory = `src/people/${slug}`, body = `${directory}/${slug}.md`;
    if (!exists(root, body)) continue;
    const { archive, data, archiveFile } = readPersonDocument(path.join(root, body));
    const identity = archive.identity ?? {};
    const material = materialExists(root, directory, slug);
    records.push({ kind: 'person', slug, title: data.cn_name || archive.name || slug,
      character_id: archive.id, name: archive.name, aliases: data.aliases ?? [],
      alts: (identity.alts ?? []).map(({ id, name }) => ({ id, name })),
      accounts: identity.accounts ?? {},
      body, archive: path.relative(root, archiveFile).split(path.sep).join('/'),
      material, material_title: material ? materialTitle(root, material) : null });
  }
  for (const slug of names(root, 'src/battles')) {
    const directory = `src/battles/${slug}`, body = `${directory}/${slug}.md`, archive = `${directory}/${slug}.json`;
    if (!exists(root, body) || !exists(root, archive)) continue;
    const { battle } = JSON.parse(read(root, archive));
    if (!battle) throw new Error(`${archive}：缺少 battle 配置`);
    const material = materialExists(root, directory, slug);
    records.push({ kind: 'battle', slug, title: battle.title, aliases: battle.aliases ?? [],
      start: battle.start, end: battle.end, systems: battle.systems ?? [], body, archive,
      material, material_title: material ? materialTitle(root, material) : null });
  }
  for (const [directory, kind] of [['docs/sources', 'source'], ['docs/leads', 'lead'], ['docs/corporations/notes', 'source']]) {
    for (const material of markdownFiles(root, directory)) {
      records.push({ kind, title: materialTitle(root, material) || path.basename(material), material });
    }
  }
  const people = new Map(records.filter(record => record.kind === 'person').map(record => [record.slug, record]));
  for (const file of names(root, 'docs/bilibili').filter(name => /^\d+\.json$/.test(name))) {
    const archive = `docs/bilibili/${file}`, profile = JSON.parse(read(root, archive));
    const person = profile.identity?.state === 'confirmed' ? people.get(profile.identity.person) : null;
    records.push({ kind: 'bilibili', uid: profile.uid, title: profile.name,
      identity_state: profile.identity?.state, label: profile.identity?.label, person: profile.identity?.person,
      ...(person ? { person_title: person.title, character_id: person.character_id, person_aliases: person.aliases } : {}),
      material: profile.identity?.material ?? null, archive });
  }
  const identities = new Map();
  for (const person of people.values()) {
    for (const id of [person.character_id, ...person.alts.map(alt => alt.id)]) identities.set(String(id), person);
  }
  for (const organization of readOrganizations(root)) {
    records.push({ kind: 'corporation', corporation_id: organization.id, title: organization.names[0],
      aliases: organization.names.slice(1), labels: organization.account_groups.map(group => group.label), archive: organization.archive,
      material: organization.references.find(reference => /\.md$|\.json$/.test(reference)) ?? null });
  }
  for (const character of Object.values(readCharacters(root))) {
    const person = identities.get(character.id);
    const material = person?.material ?? character.evidence[0]?.split('#')[0] ?? null;
    records.push({ kind: 'character', character_id: character.id, title: character.names[0], aliases: character.names.slice(1),
      labels: character.labels, titles: [...new Set(character.profiles.map(profile => profile.title).filter(Boolean))],
      person: person?.slug ?? null, archive: characterArchivePath(character.id),
      material: material && exists(root, material) ? material : null });
  }
  return records;
}

const excerpt = (text, needle) => {
  const start = Math.max(0, fold(text).indexOf(needle) - 80);
  return text.slice(start, start + 280);
};

function matchingText(value, needle, field = '') {
  if (typeof value === 'string') return fold(value).includes(needle) ? { field, excerpt: excerpt(value, needle) } : null;
  if (!value || typeof value !== 'object') return null;
  for (const [key, child] of Object.entries(value)) {
    const found = matchingText(child, needle, field ? `${field}.${key}` : key);
    if (found) return found;
  }
  return null;
}

function workMatches(root, archive, needle, fullText) {
  const profile = JSON.parse(read(root, archive));
  return [...(profile.videos ?? []), ...(profile.posts ?? [])].flatMap(work => {
    const found = matchingText(fullText ? work : { bvid: work.bvid, key: work.key, title: work.title, url: work.url }, needle);
    return found ? [{ archive, key: work.bvid ?? work.key, url: work.url, ...found }] : [];
  });
}

export function searchMaterials(root, { query = '', kind, fullText = false, history = false, limit = 20, offset = 0 } = {}) {
  if (kind && !KINDS.includes(kind)) throw new Error(`kind 必须是 ${KINDS.join(' / ')}`);
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(offset) || offset < 0) throw new Error('limit 必须为正整数，offset 必须为非负整数');
  if (history && !query.trim()) throw new Error('历史记录必须指定关键词，不能当作当前状态总表');
  if (fullText && !query.trim()) throw new Error('全文查询必须指定关键词');
  let records = history ? (exists(root, HISTORY) ? read(root, HISTORY).trim().split('\n').filter(Boolean).map(JSON.parse) : []) : collectMaterials(root);
  const counts = history ? { historical: records.length } : Object.fromEntries(KINDS.map(k => [k, records.filter(r => r.kind === k).length]));
  const needle = fold(query.trim());
  const archives = records.filter(record => record.kind === 'bilibili').map(record => record.archive);
  const matches = new Map();
  const findWorks = archive => {
    if (!matches.has(archive)) matches.set(archive, workMatches(root, archive, needle, fullText));
    return matches.get(archive);
  };
  records = records.filter(record => {
    if (kind && record.kind !== kind) return false;
    if (!needle || fold(JSON.stringify(record)).includes(needle)) return true;
    if (record.kind === 'bilibili') {
      const found = findWorks(record.archive)[0];
      if (found) { record.match = found; return true; }
    }
    if (!fullText || !record.material || !exists(root, record.material)) return false;
    const text = readMaterial(path.join(root, record.material)), lines = text.split('\n');
    const at = lines.findIndex(line => fold(line).includes(needle));
    if (at >= 0) {
      record.match = { line: at + 1, excerpt: excerpt(lines[at], needle) };
      return true;
    }
    // 摘记迁入JSON后，沿素材内的作品引用查询，保留人物与战役原有的全文召回。
    for (const archive of archives) {
      const found = findWorks(archive).find(work => text.includes(work.key.startsWith('BV') ? work.key : work.url));
      if (found) { record.match = found; return true; }
    }
    return false;
  });
  return { ...(history ? { historical: true, warning: '冻结旧索引；只作检索线索，当前身份、收录和阅读状态须核正式档案。' } : {}),
    counts, total: records.length, offset, limit,
    records: query.trim() || kind ? records.slice(offset, offset + limit) : [] };
}

export function run(root, args) {
  if (args.includes('--help')) {
    if (args.length !== 1) throw new Error('--help 须单独使用');
    return HELP;
  }
  const options = {}, query = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (['--kind', '--limit', '--offset'].includes(arg)) {
      const value = args[++i];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} 缺少值`);
      options[arg.slice(2)] = arg === '--kind' ? value : Number(value);
    } else if (arg === '--full-text') options.fullText = true;
    else if (arg === '--history') options.history = true;
    else if (arg.startsWith('--')) throw new Error(`未知选项：${arg}`);
    else query.push(arg);
  }
  if (options.history && (options.kind || options.fullText)) throw new Error('--history 不与 --kind / --full-text 混用');
  return searchMaterials(root, { ...options, query: query.join(' ') });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = run(path.resolve(import.meta.dirname, '..'), process.argv.slice(2));
    console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
  }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
