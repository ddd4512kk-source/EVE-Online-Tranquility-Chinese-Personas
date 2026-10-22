// Offline, on-demand material discovery. The filesystem and existing archives are the index.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPersonDocument } from './person-document.mjs';

export const HISTORY = 'docs/sources/material-index-legacy-2026-10-22.jsonl';
const KINDS = ['person', 'battle', 'source', 'lead', 'bilibili'];
const HELP = `离线定位已有材料；目录从正式档案按需生成，不另维护总表。

用法：npm run materials -- [关键词] [选项]
  --kind <类别>   person / battle / source / lead / bilibili
  --full-text     另搜素材正文；必须有关键词，返回首个命中行号和短摘记
  --limit <数量>  每页最多返回条数，默认 20，必须为正整数
  --offset <数量> 跳过的命中数，默认 0，必须为非负整数
  --history       只查冻结旧索引；必须有关键词，不与 --kind / --full-text 混用
  --help          显示帮助，不读取档案；须单独使用

关键词默认匹配名称、短名、别名、已登记小号／账号、ID及路径，忽略英文大小写。
多个关键词参数合成一个含空格的短语。无关键词且未指定类别时只报各类数量。
输出 JSON：counts 为分类数量，total 为命中总数，records 为当前页。
需纯 JSON 时用 npm run --silent materials -- ...。
人物取 <ID>-id.json，战役取同名 JSON 的 battle，来源／线索取 Markdown 标题与路径，
B站取 docs/bilibili/<UID>.json；素材不存在时 material 为 null，不补造路径。
结果只定位文件，不证明已经核读、事件成立或调查完成；沿 material 读取事件与依据。

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
const title = text => text.match(/^#\s+(.+)$/m)?.[1] ?? '';

export function collectMaterials(root) {
  const records = [];
  for (const slug of names(root, 'src/people')) {
    const directory = `src/people/${slug}`, body = `${directory}/${slug}.md`;
    if (!exists(root, body)) continue;
    const { archive, data, archiveFile } = readPersonDocument(path.join(root, body));
    const identity = archive.identity ?? {};
    records.push({ kind: 'person', slug, title: data.cn_name || archive.name || slug,
      character_id: archive.id, name: archive.name, aliases: data.aliases ?? [],
      alts: (identity.alts ?? []).map(({ id, name }) => ({ id, name })),
      accounts: identity.accounts ?? {},
      body, archive: path.relative(root, archiveFile).split(path.sep).join('/'),
      material: exists(root, `${directory}/materials-${slug}.md`) ? `${directory}/materials-${slug}.md` : null });
  }
  for (const slug of names(root, 'src/battles')) {
    const directory = `src/battles/${slug}`, body = `${directory}/${slug}.md`, archive = `${directory}/${slug}.json`;
    if (!exists(root, body) || !exists(root, archive)) continue;
    const { battle } = JSON.parse(read(root, archive));
    if (!battle) throw new Error(`${archive}：缺少 battle 配置`);
    records.push({ kind: 'battle', slug, title: battle.title, aliases: battle.aliases ?? [],
      start: battle.start, end: battle.end, systems: battle.systems ?? [], body, archive,
      material: exists(root, `${directory}/materials-${slug}.md`) ? `${directory}/materials-${slug}.md` : null });
  }
  for (const [directory, kind] of [['docs/sources', 'source'], ['docs/leads', 'lead']]) {
    for (const file of names(root, directory)) {
      if (!file.endsWith('.md')) continue;
      const material = `${directory}/${file}`;
      records.push({ kind, title: title(read(root, material)) || file, material });
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
  return records;
}

export function searchMaterials(root, { query = '', kind, fullText = false, history = false, limit = 20, offset = 0 } = {}) {
  if (kind && !KINDS.includes(kind)) throw new Error(`kind 必须是 ${KINDS.join(' / ')}`);
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(offset) || offset < 0) throw new Error('limit 必须为正整数，offset 必须为非负整数');
  if (history && !query.trim()) throw new Error('历史记录必须指定关键词，不能当作当前状态总表');
  if (fullText && !query.trim()) throw new Error('全文查询必须指定关键词');
  let records = history ? (exists(root, HISTORY) ? read(root, HISTORY).trim().split('\n').filter(Boolean).map(JSON.parse) : []) : collectMaterials(root);
  const counts = history ? { historical: records.length } : Object.fromEntries(KINDS.map(k => [k, records.filter(r => r.kind === k).length]));
  const needle = fold(query.trim());
  records = records.filter(record => {
    if (kind && record.kind !== kind) return false;
    if (!needle || fold(JSON.stringify(record)).includes(needle)) return true;
    if (!fullText || !record.material?.endsWith('.md') || !exists(root, record.material)) return false;
    const lines = read(root, record.material).split('\n');
    const at = lines.findIndex(line => fold(line).includes(needle));
    if (at < 0) return false;
    const line = lines[at];
    // Keep output bounded even when a material has a long prose line.
    const matchAt = Math.max(0, fold(line).indexOf(needle) - 80);
    record.match = { line: at + 1, excerpt: line.slice(matchAt, matchAt + 280) };
    return true;
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
