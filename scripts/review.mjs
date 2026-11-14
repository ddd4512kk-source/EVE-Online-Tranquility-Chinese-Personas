// Offline review worklists. Source files remain authoritative; only human decisions are saved.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readPersonDocument } from './person-document.mjs';
import { maintainerProcessErrors, materialPath, materialReferences, readMaterial } from './material-document.mjs';

const REGISTRY = 'docs/review-features.json';
const RECEIPTS = 'docs/reviews';
const STATES = ['reviewed', 'needs-work', 'blocked'];
const ANGLES = ['处境', '动机', '分量', '反差', '反应与后果', '落点'];
const HELP = `离线增量复查；无参数只报数量，不输出全站正文。
  npm run review -- list --feature combat --recent 30 --max-blocks 2 --limit 10
  npm run review -- card person:短名 --feature combat
  npm run review -- read person:短名 --file material --from 20 --lines 25
  npm run review -- impact --feature combat --since HEAD --limit 10
  npm run review -- verify person:短名 person:另一短名 --feature combat
  npm run review -- mark person:短名 --feature combat --status needs-work --note 具体缺口 --evidence 相对文件路径
  npm run review -- template person:短名 --feature writing-depth [--out .cache/review/文件.json] [--force yes] [--sources yes] [--anchors no]
  npm run review -- accept --feature combat --change tighten|relax
  npm run review -- check
list：--kind person|battle --signal 信号 --state unreviewed|stale|reviewed|needs-work|blocked
      --recent N（首次加入历史，未提交新篇优先） --max-blocks N --limit 1..20 --offset N
impact：--since Git引用（含已暂存、未暂存和未跟踪文件），或重复 --files 相对路径；可按 --state 筛选
card：只返回结构、命中摘录与证据入口；read 单次最多80行，不自动读取视频或联网。
mark：仅在人工核读后使用；--evidence 可重复。配置必查项的feature逐项登记，默认读取 template 草稿并在登记后删除，另存的用 --assessment 仓库内JSON路径。
template：生成状态留空的 assessment 草稿、校验约束与可用证据锚点；锚点默认只列本人正文和素材，--sources yes 另列共享来源，--anchors no 不列锚点（同一人第二项复用第一项的）。有旧结论时沿用说明，列出失效证据和登记后变动的输入。草稿已存在时不覆盖，只重报说明；--force yes 重新生成。输出须完整读取。
verify：指定本次交付对象；未审、失效或缺项均以非零状态退出，不以关键词或料块数代替复查。
accept：规则或实现改动后声明；tighten 提升严格度并使旧结论失效，relax 只登记新指纹。未声明时 template／mark／verify 拒绝执行。
check：核对全部功能的规则声明及已删对象的残留记录。
详情：docs/review-workflow.md。信号不是漏项定论，互链和构建通过不是调查完成。
`;
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
const materialCandidate = file => /(?:^|\/)materials-[^/]+\.json$/.test(file)
 || /^docs\/(?:sources|leads|corporations\/notes)\/.+\.json$/.test(file);
const isMaterialFile = (root, file) => {
  if (!materialCandidate(file) || !exists(root, file)) return false;
  const document = JSON.parse(read(root, file));
  if (document?.type !== 'material') return false;
  readMaterial(path.join(root, file));
  return true;
};
const documentText = (root, file) => isMaterialFile(root, file) ? readMaterial(path.join(root, file)) : read(root, file);
const exists = (root, file) => fs.existsSync(path.join(root, file));
const dirs = (root, dir) => exists(root, dir) ? fs.readdirSync(path.join(root, dir)).sort() : [];
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonical(item)])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const posix = file => file.split(path.sep).join('/');
const unique = values => [...new Set(values)];
function safeFile(root, file) {
  let base = file.split('#')[0];
  let absolute = path.resolve(root, base);
  const relFor = candidate => {
    const relative = posix(path.relative(root, candidate));
    if (!relative || relative.startsWith('../') || path.isAbsolute(relative)) throw new Error(`路径必须在仓库内：${file}`);
    if (exists(root, relative)) {
      const real = path.relative(fs.realpathSync(root), fs.realpathSync(path.join(root, relative)));
      if (real.startsWith('..') || path.isAbsolute(real)) throw new Error(`路径不能指向仓库外：${file}`);
    }
    return relative;
  };
  let rel = relFor(absolute);
  if (!exists(root, rel) && /\.md$/.test(base)) {
    const candidates = [base.replace(/\.md$/, '.json'), base.replace(/\.md$/, '-material.json')];
    for (const name of candidates) {
      const candidate = path.resolve(root, name), relative = relFor(candidate);
      if (exists(root, relative) && isMaterialFile(root, relative)) { base = name; absolute = candidate; rel = relative; break; }
    }
  }
  return rel;
}
export function ruleText(root, spec) {
  const text = documentText(root, spec.file);
  if (spec.contains) {
    const matches = text.split('\n').filter(line => line.includes(spec.contains));
    if (matches.length !== 1) throw new Error(`${spec.file}：规则定位必须唯一：${spec.contains}`);
    return matches[0];
  }
  if (!spec.heading) return text;
  const lines = text.split('\n'), at = lines.indexOf(spec.heading);
  if (at < 0) throw new Error(`${spec.file}：缺少规则节 ${spec.heading}`);
  const depth = spec.heading.match(/^#+/)[0].length;
  let end = at + 1;
  while (end < lines.length && !(lines[end].match(/^(#+) /)?.[1].length <= depth)) end++;
  return lines.slice(at, end).join('\n');
}
export function parseAdditionLog(log) {
  const dates = new Map();
  let date;
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) date = line.slice(1);
    else if (line && date) dates.set(line, date);
  }
  return dates;
}
function creationDates(root) {
  const dates = new Map();
  try {
    const log = execFileSync('git', ['log', '--diff-filter=A', '--format=@%cI', '--name-only', '--', 'src/people', 'src/battles'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 });
    return { dates: parseAdditionLog(log), available: true };
  } catch { return { dates, available: false }; }
}
function sections(text) {
  return text.split('\n').flatMap((line, i) => /^(#{1,6}\s|:::\s*\S)/.test(line) ? [{ line: i + 1, title: line.slice(0, 160) }] : []);
}
function snippets(text, pattern, limit = 6) {
  return text.split('\n').flatMap((line, i) => {
    const at = line.search(pattern);
    return at < 0 ? [] : [{ line: i + 1, excerpt: line.slice(Math.max(0, at - 70), Math.max(0, at - 70) + 320) }];
  }).slice(0, limit);
}
function sharedSources(root, file, seen = new Set(), dependencies = new Map()) {
  if (!file || seen.has(file)) return seen;
  seen.add(file);
  // 只跟随共享材料与作品档案，不沿人物互链展开整个调查图。
  if (!dependencies.has(file)) {
    const references = isMaterialFile(root, file) ? materialReferences(JSON.parse(read(root, file)))
      : [...read(root, file).matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
    const targets = [];
    for (const reference of references) {
      let target = reference.split('#')[0];
      if (!target || /^(?:[a-z]+:|\/)/i.test(target)) continue;
      target = posix(path.normalize(path.join(path.dirname(file), target)));
      if ((/^docs\/(?:sources|leads|corporations\/notes)\/.+\.(?:md|json)$/.test(target)
        || /^docs\/bilibili\/\d+\.json$/.test(target)) && exists(root, target)) targets.push(safeFile(root, target));
    }
    dependencies.set(file, unique(targets));
  }
  for (const target of dependencies.get(file)) sharedSources(root, target, seen, dependencies);
  return seen;
}
export function inventory(root) {
  const { dates, available } = creationDates(root), records = [], owners = new Map();
  // 同一轮查询复用来源解析，跨轮重新读取，避免共享事件被每个人反复解析。
  const sourceDependencies = new Map();
  const namesFile = 'src/_data/entityNames.json';
  const entityNames = exists(root, namesFile) ? JSON.parse(read(root, namesFile)) : null;
  for (const kind of ['person', 'battle']) {
    const directory = kind === 'person' ? 'src/people' : 'src/battles';
    for (const slug of dirs(root, directory)) {
      const folder = `${directory}/${slug}`, body = `${folder}/${slug}.md`;
      if (!exists(root, body)) continue;
      let archive, archiveFile;
      if (kind === 'person') ({ archive, archiveFile } = readPersonDocument(path.join(root, body)));
      else { archiveFile = path.join(root, `${folder}/${slug}.json`); archive = JSON.parse(fs.readFileSync(archiveFile, 'utf8')); }
      const selectedMaterial = materialPath(path.join(root, folder), slug);
      const materialPathRelative = posix(path.relative(root, selectedMaterial));
      const material = exists(root, materialPathRelative) ? materialPathRelative : null;
      const text = read(root, body), record = {
        key: `${kind}:${slug}`, kind, slug, title: kind === 'person' ? archive.person.cn_name || archive.name : archive.battle.title,
        body, archiveFile: posix(path.relative(root, archiveFile)), material,
        archive, text, materialText: material ? documentText(root, material) : '', blocks: (text.match(/^:::\s*(?:红料|黑料)(?:\s|$)/gm) ?? []).length,
        added: dates.get(body) ?? null, historyAvailable: available, battles: [],
      };
      record.sources = [...sharedSources(root, record.material, new Set(), sourceDependencies)];
      records.push(record);
      if (kind === 'person') for (const id of [archive.id, ...(archive.identity?.alts ?? []).map(alt => alt.id)]) {
        if (owners.has(id)) throw new Error(`角色 ${id} 重复对应：${owners.get(id).key} / ${record.key}`);
        owners.set(id, record);
      }
    }
  }
  for (const battle of records.filter(record => record.kind === 'battle')) {
    const br = battle.archive.br, ids = new Map();
    if (entityNames) {
      const organizations = unique([
        ...(battle.archive.battle.sides ?? []).flatMap(side => [...(side.organizations ?? []), ...(side.corps ?? []).map(c => c.id), ...(side.alliance_participation ?? []).map(a => a.id), side.emblem]),
        ...Object.values(br?.pilots ?? {}).flat(), ...(br?.losses ?? []).flatMap(row => row.slice(2, 4)),
      ].filter(id => Number.isSafeInteger(id) && id > 0)).sort((a, b) => a - b);
      battle.scopedFiles = { [namesFile]: organizations.map(id => [id, entityNames.corporations?.[id] ?? null, entityNames.alliances?.[id] ?? null]) };
    }
    const add = (id, via) => { if (owners.has(id)) { if (!ids.has(id)) ids.set(id, new Set()); ids.get(id).add(via); } };
    for (const id of Object.keys(br?.pilots ?? {})) add(Number(id), 'pilot');
    for (const [, id] of br?.losses ?? []) add(id, 'loss');
    for (const side of battle.archive.battle.sides ?? []) for (const id of side.people ?? []) add(id, 'manual');
    for (const match of battle.text.matchAll(/\/p\/(\d+)\//g)) add(Number(match[1]), 'mention');
    const matches = new Map();
    for (const [id, via] of ids) {
      const owner = owners.get(id);
      if (!matches.has(owner)) matches.set(owner, []);
      matches.get(owner).push({ id, via: [...via] });
    }
    for (const [person, characters] of matches) person.battles.push({
      key: battle.key, title: battle.title, start: battle.archive.battle.start, body: battle.body,
      archive: battle.archiveFile, material: battle.material, characters,
      // Only this person's rows and the paragraphs naming them affect their review, not every KM or sentence in a large battle.
      fingerprint: hash({ battle: battle.archive.battle, characters, pilots: characters.map(({ id }) => [id, br?.pilots?.[id]]), losses: (br?.losses ?? []).filter(row => characters.some(({ id }) => id === row[1])), mention: characters.some(c => c.via.includes('mention')) ? battle.text.split(/\n\s*\n/).filter(part => characters.some(({ id }) => part.includes(`/p/${id}/`))) : null }),
    });
  }
  return records;
}
function loadFeature(root, name) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error('feature 须为英文短名');
  const features = JSON.parse(read(root, REGISTRY));
  const feature = features[name];
  if (!feature) throw new Error(`未知 feature：${name}；可用 ${Object.keys(features).join(' / ')}`);
  if (!Array.isArray(feature.kinds) || !feature.kinds.length || feature.kinds.some(kind => !['person', 'battle'].includes(kind)) || typeof feature.pattern !== 'string' || !Array.isArray(feature.rules) || !feature.rules.length) throw new Error(`${name}：feature 配置不完整`);
  for (const spec of feature.rules) safeFile(root, spec.file);
  const ruleParts = feature.rules.map(spec => [spec, ruleText(root, spec)]);
  const implementation = (feature.implementation ?? []).map(file => [safeFile(root, file), read(root, safeFile(root, file))]);
  const { strictness = { level: 0, rules: null }, ...config } = feature;
  if (!Number.isSafeInteger(strictness.level) || strictness.level < 0 || (strictness.rules !== null && !/^[a-f0-9]{64}$/.test(strictness.rules))) throw new Error(`${name}：strictness 须含非负整数 level 与规则指纹`);
  const receipts = {};
  for (const kind of ['person', 'battle']) {
    const dir = `${RECEIPTS}/${name}/${kind}`;
    for (const file of dirs(root, dir)) {
      if (!file.endsWith('.json')) throw new Error(`复查记录须为 JSON：${dir}/${file}`);
      const key = `${kind}:${file.slice(0, -5)}`, receipt = JSON.parse(read(root, `${dir}/${file}`));
      if (!receipt || !STATES.includes(receipt.status) || !receipt.note?.trim() || !Array.isArray(receipt.evidence) || !receipt.evidence.length || !Array.isArray(receipt.dependencies) || !/^[a-f0-9]{64}$/.test(receipt.inputs) || !Number.isSafeInteger(receipt.level) || receipt.level < 0) throw new Error(`复查记录不完整：${dir}/${file}`);
      for (const f of [...receipt.evidence, ...receipt.dependencies]) safeFile(root, f);
      receipts[key] = receipt;
    }
  }
  // Rule edits only invalidate receipts after an explicit tighten; any unacknowledged edit blocks mark/verify.
  const ruleHash = hash({ engine: feature.eventReview ? 4 : feature.checks ? 3 : 2, feature: config, ruleParts, implementation });
  return { ...config, name, pattern: new RegExp(feature.pattern, 'i'), ruleParts, ruleHash,
    level: strictness.level, pending: strictness.rules !== ruleHash, receipts };
}
const receiptFile = (feature, key) => `${RECEIPTS}/${feature}/${key.replace(':', '/')}.json`;
const draftFile = (feature, record) => `.cache/review/${feature.name}-${record.slug}.json`;
// What validateAssessment and validateWriting enforce, stated once for template output.
const CONSTRAINTS = {
  common: [
    '每项 status 填 reviewed 或 not-applicable，note 写具体判断，evidence 至少一条',
    '证据为 {file, heading} 或 {file, contains}，二选一；contains 须在该文件中恰好命中一行',
    '文件须在仓库内；必需证据未取得或未读不能写 not-applicable',
  ],
  checks: ['narrative 至少一条证据指向本人正文'],
  writing: [
    'coverage、events、balance 都须 reviewed，不接受 not-applicable',
    'coverage 至少一条证据在正文以外（素材或来源）；balance 至少一条在本人正文',
    'events.items 逐件登记，标题不重复；没有 heavy 事件时填 noHeavyReason',
    'source 不能指向本人正文；treatment 非 omitted 时 body 须指向本人正文',
    '事件的 source、body 和发挥证据须命中正文句子，不能只命中 ## 标题或 ::: 块标题行；anchors 中的 contains 可直接用',
    `heavy 事件须 treatment=expanded、verdict=sufficient；development 至少三个不同方向，取自 ${ANGLES.join('、')}，含反差及分量或反应与后果，每条 evidence 指向本人正文`,
  ],
};
const pendingError = feature => new Error(`${feature.name} 的规则或实现已改动但未声明：收紧用 accept --feature ${feature.name} --change tighten（旧结论失效），放宽或措辞调整用 --change relax`);
// 六维与阵营是独立展示组件，改动不使人物复审记录过期。
export const PERSON_DISPLAY_FIELDS = ['radar', 'alignment'];
function inputValue(root, record, file) {
  if (record.scopedFiles?.[file]) return record.scopedFiles[file];
  if (!exists(root, file)) return null;
  const text = read(root, file);
  if (!file.endsWith('.json')) return text;
  const data = JSON.parse(text);
  if (file === record.archiveFile && record.kind === 'person') {
    delete data.fetched_at;
    for (const field of PERSON_DISPLAY_FIELDS) delete data.person?.[field];
  }
  return data;
}
export function inputs(root, record, evidence = []) {
  const files = unique([record.body, record.archiveFile, ...record.sources, ...Object.keys(record.scopedFiles ?? {}), ...(record.kind === 'battle' && record.material ? [record.material] : []), ...evidence.map(file => safeFile(root, file))]);
  const values = files.sort().map(file => [file, inputValue(root, record, file)]), battles = record.battles.map(({ key, fingerprint }) => [key, fingerprint]);
  // Per-part hashes only tell a re-review where to look; the whole fingerprint still decides staleness.
  const parts = Object.fromEntries([...values.map(([file, value]) => [file, hash(value)]), ...battles]);
  return { files, parts, fingerprint: hash({ files: values, battles }) };
}
function changedParts(receipt, source) {
  if (!receipt?.inputParts) return null;
  return unique([...Object.keys(receipt.inputParts), ...Object.keys(source.parts)]).filter(key => receipt.inputParts[key] !== source.parts[key]).sort();
}
function missingChecks(feature, receipt) {
  return Object.keys(feature.checks ?? {}).filter(key => !['reviewed', 'not-applicable'].includes(receipt?.assessment?.[key]?.status));
}
function validateAssessment(root, feature, record, assessment) {
  if (assessment === undefined) throw new Error(`缺少已完成的复查项：${Object.keys(feature.checks ?? {}).join('、')}；须提供 --assessment`);
  if (!assessment || typeof assessment !== 'object' || Array.isArray(assessment)) throw new Error('assessment 须为逐项判断对象');
  const required = Object.keys(feature.checks ?? {});
  const missing = missingChecks(feature, { assessment });
  if (missing.length) throw new Error(`缺少已完成的复查项：${missing.join('、')}`);
  const files = [];
  for (const [key, item] of Object.entries(assessment)) {
    if (!required.includes(key)) throw new Error(`未知复查项：${key}`);
    if (!item || !['reviewed', 'not-applicable'].includes(item.status) || typeof item.note !== 'string' || !item.note.trim() || !Array.isArray(item.evidence) || !item.evidence.length) throw new Error(`${key} 须有状态、判断及具体证据位置`);
    item.evidence.forEach((spec, i) => {
      const where = `${key}.evidence[${i}]`;
      if (!spec || typeof spec.file !== 'string' || (!spec.heading && !spec.contains) || (spec.heading && spec.contains)) throw new Error(`${where} 须指定 file 及 heading 或 contains`);
      const file = safeFile(root, spec.file);
      if (!exists(root, file)) throw new Error(`${where} 证据文件不存在：${file}`);
      if (!locate(root, { ...spec, file }, where).trim()) throw new Error(`${where} 的证据为空`);
      files.push(file);
    });
    if (key === 'narrative' && !item.evidence.some(spec => safeFile(root, spec.file) === record.body)) throw new Error('narrative 须指向本人的正文段落，素材不能代替入文验收');
  }
  if (feature.eventReview) files.push(...validateWriting(root, record, assessment));
  return unique(files);
}
// Evidence errors name the exact field so a draft can be fixed without rereading this script.
function locate(root, spec, where) {
  try { return ruleText(root, spec); } catch (error) { throw new Error(`${where}：${error.message}`); }
}
function validateWriting(root, record, assessment) {
  const files = [], nonempty = value => typeof value === 'string' && value.trim();
  const anchor = (spec, body, where) => {
    if (!spec || typeof spec.file !== 'string' || Boolean(spec.heading) === Boolean(spec.contains)) throw new Error(`${where} 须指定 file 及 heading 或 contains`);
    const file = safeFile(root, spec.file);
    if (!exists(root, file)) throw new Error(`${where} 证据文件不存在：${file}`);
    if (body ? file !== record.body : file === record.body) throw new Error(`${where}：${body ? '发挥须定位本人正文' : '事件来源不能用正文自证'}`);
    const excerpt = locate(root, { ...spec, file }, where);
    if (!excerpt.split('\n').some(line => line.trim() && !/^(?:#{1,6}\s|:::)/.test(line))) throw new Error(`${where}：事件证据不能只有标题（${spec.heading ?? spec.contains}）；改用该块正文里的一句，template 的 anchors 可直接用`);
    files.push(file);
  };
  for (const key of ['coverage', 'events', 'balance']) if (assessment[key]?.status !== 'reviewed') throw new Error(`写作复查 ${key} 须实际核读，不接受不适用`);
  if (!assessment.coverage.evidence.some(spec => spec.file !== record.body)) throw new Error('coverage 须对照素材，不能只读正文');
  if (!assessment.balance.evidence.some(spec => spec.file === record.body)) throw new Error('balance 须定位本人正文');
  const events = assessment.events.items;
  if (!Array.isArray(events)) throw new Error('events.items 须逐件登记事件；无重料也须明确说明');
  if (!events.some(event => event.weight === 'heavy') && !nonempty(assessment.events.noHeavyReason)) throw new Error('无重料须说明核读后的 noHeavyReason');
  const titles = new Set();
  events.forEach((event, i) => {
    const where = `events.items[${i}]`;
    if (!nonempty(event.title) || titles.has(event.title)) throw new Error(`${where}：事件须有不重复的标题，同一事件不能拆块充数`);
    titles.add(event.title);
    if (!['heavy', 'ordinary', 'light'].includes(event.weight) || !nonempty(event.reason) || !nonempty(event.note)) throw new Error(`${where}：事件须说明分量依据与采用判断`);
    anchor(event.source, false, `${where}.source`);
    if (!['expanded', 'brief', 'omitted'].includes(event.treatment)) throw new Error(`${where}：事件须说明展开、简述或略过`);
    if (event.treatment !== 'omitted') anchor(event.body, true, `${where}.body`);
    if (event.weight !== 'heavy') return;
    if (event.treatment !== 'expanded' || event.verdict !== 'sufficient') throw new Error(`${where}：重料未充分展开，不能标为 reviewed`);
    const development = event.development;
    if (!Array.isArray(development)) throw new Error(`${where}：重料须逐方向登记发挥与正文位置`);
    const angles = new Set();
    development.forEach((item, j) => {
      if (!ANGLES.includes(item.angle) || angles.has(item.angle) || !nonempty(item.note)) throw new Error(`${where}.development[${j}]：发挥方向须有效、不重复并说明具体写法`);
      angles.add(item.angle);
      anchor(item.evidence, true, `${where}.development[${j}].evidence`);
    });
    if (angles.size < 3 || !angles.has('反差') || !(angles.has('分量') || angles.has('反应与后果'))) throw new Error(`${where}：重料须至少三个发挥方向，含反差及分量或反应与后果`);
  });
  return files;
}
// Anchors that pass validation as-is: non-empty headings, plus the first prose line of the opening and of each ::: block.
function anchorsOf(root, file, limit = 30) {
  const lines = documentText(root, file).split('\n'), rows = [];
  const once = text => lines.filter(line => line.includes(text)).length === 1;
  const snippet = line => [12, 20, 32, 48, 80, Infinity].map(n => line.trim().slice(0, n)).find(once) ?? null;
  let opener = '开篇';
  lines.forEach((line, i) => {
    if (/^#{1,6}\s/.test(line)) {
      opener = null;
      if (lines.indexOf(line) === i && ruleText(root, { file, heading: line }).split('\n').slice(1).some(l => l.trim() && !/^(?:#{1,6}\s|:::)/.test(l))) rows.push({ file, heading: line });
    } else if (/^:::\s*\S/.test(line)) opener = line.slice(0, 60);
    else if (opener && line.trim() && !line.startsWith(':::')) {
      const contains = snippet(line);
      if (contains) rows.push({ label: opener, file, contains });
      opener = null;
    }
  });
  return { total: rows.length, records: rows.slice(0, limit) };
}
function brokenEvidence(root, assessment) {
  const specs = [];
  for (const [key, item] of Object.entries(assessment)) {
    (item?.evidence ?? []).forEach((spec, i) => specs.push([`${key}.evidence[${i}]`, spec]));
    (item?.items ?? []).forEach((event, i) => {
      for (const field of ['source', 'body']) if (event?.[field]) specs.push([`${key}.items[${i}].${field}`, event[field]]);
      (event?.development ?? []).forEach((item, j) => specs.push([`${key}.items[${i}].development[${j}].evidence`, item?.evidence]));
    });
  }
  return specs.filter(([, spec]) => {
    try { return !ruleText(root, { ...spec, file: safeFile(root, spec.file) }).trim(); } catch { return true; }
  }).map(([at]) => at);
}
function assess(root, record, feature) {
  const receipt = feature.receipts[record.key];
  const source = inputs(root, record, receipt?.evidence);
  const stale = receipt && (receipt.inputs !== source.fingerprint || receipt.level < feature.level);
  const signals = [];
  const missing = missingChecks(feature, receipt);
  if (missing.length) signals.push('review-incomplete');
  if (feature.eventReview && feature.pattern.test(record.text + record.materialText)) signals.push('heavy-story-candidate');
  if (feature.name === 'combat' && record.kind === 'person' && record.battles.some(b => b.characters.some(c => c.via.some(v => ['pilot', 'loss', 'manual'].includes(v)))) && !feature.pattern.test(record.text)) signals.push('battle-without-narrative');
  if (feature.name === 'combat' && record.kind === 'person' && (/zkillboard\.com\/character\//.test(record.text) || record.battles.some(b => b.characters.some(c => c.via.some(v => ['pilot', 'loss', 'manual'].includes(v))))) && ![...record.text.matchAll(/^:::\s*红料(.*)\n([\s\S]*?)^:::\s*$/gm)].some(([, title, body]) => feature.pattern.test(title) || /zkillboard\.com\/|battles\//.test(body))) signals.push('combat-without-block');
  if (feature.name === 'combat' && record.kind === 'person' && /FLEET\s+COMMANDER/i.test(record.text + record.materialText) && !(record.archive.person.tags ?? []).some(tag => ['FC', '著名FC'].includes(tag))) signals.push('command-without-tag');
  if (record.blocks <= 2) signals.push('few-blocks');
  if (!record.material) signals.push('no-material');
  if (record.kind === 'person' && !record.archive.identity?.zkb) signals.push('no-saved-kb');
  return { source, receipt, state: stale ? 'stale' : receipt?.status === 'reviewed' && missing.length ? 'needs-work' : receipt?.status ?? 'unreviewed', signals, missingChecks: missing };
}
function summary(root, record, feature) {
  const { state, signals } = assess(root, record, feature);
  return { key: record.key, title: record.title, added: record.added, ...(record.historyAvailable ? {} : { history: 'unavailable' }), blocks: record.blocks, battles: record.battles.length, state, signals };
}
const integer = (options, key, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const n = options[key] === undefined ? fallback : Number(options[key]);
  if (!Number.isSafeInteger(n) || n < min || n > max) throw new Error(`${key} 须为 ${min}..${max} 整数`);
  return n;
};
export function run(root, args, suppliedRecords) {
  if (args.includes('--help')) { if (args.length !== 1) throw new Error('--help 须单独使用'); return HELP; }
  const [command = 'summary', ...rest] = args, options = {}, positional = [];
  if (!['summary', 'list', 'card', 'read', 'impact', 'mark', 'template', 'verify', 'check', 'accept'].includes(command)) throw new Error(`未知命令：${command}`);
  const allowed = { summary: [], list: ['feature', 'kind', 'recent', 'max-blocks', 'signal', 'state', 'limit', 'offset'], card: ['feature'], read: ['file', 'from', 'lines'], impact: ['feature', 'since', 'files', 'state', 'limit', 'offset'], mark: ['feature', 'status', 'note', 'evidence', 'assessment'], template: ['feature', 'out', 'force', 'sources', 'anchors'], verify: ['feature'], check: [], accept: ['feature', 'change'] }[command];
  for (let i = 0; i < rest.length; i++) {
    if (!rest[i].startsWith('--')) { positional.push(rest[i]); continue; }
    const key = rest[i].slice(2), value = rest[++i];
    if (!allowed.includes(key) || value === undefined || value.startsWith('--')) throw new Error(`无效参数：--${key}`);
    if (['files', 'evidence'].includes(key)) (options[key] ??= []).push(value);
    else if (options[key] !== undefined) throw new Error(`重复参数：--${key}`);
    else options[key] = value;
  }
  const one = ['card', 'read', 'mark', 'template'].includes(command);
  if (command === 'verify' ? !positional.length : positional.length !== (one ? 1 : 0)) throw new Error(one || command === 'verify' ? '须指定 person:短名 或 battle:短名' : '不接受位置参数');
  if (command === 'accept') {
    if (!['tighten', 'relax'].includes(options.change)) throw new Error('accept 须提供 --feature 与 --change tighten|relax');
    const feature = loadFeature(root, options.feature ?? 'combat'), registry = JSON.parse(read(root, REGISTRY));
    if (!feature.pending) throw new Error(`${feature.name} 的规则未改动，无须声明`);
    const level = feature.level + (options.change === 'tighten' ? 1 : 0);
    registry[feature.name].strictness = { level, rules: feature.ruleHash };
    fs.writeFileSync(path.join(root, REGISTRY), JSON.stringify(registry, null, 2) + '\n');
    return { feature: feature.name, change: options.change, level };
  }
  const records = suppliedRecords ?? inventory(root);
  if (command === 'check') {
    const keys = new Set(records.map(r => r.key)), problems = [];
    for (const name of Object.keys(JSON.parse(read(root, REGISTRY)))) {
      const feature = loadFeature(root, name);
      if (feature.pending) problems.push(pendingError(feature).message);
      for (const [key, receipt] of Object.entries(feature.receipts)) {
        if (!keys.has(key)) problems.push(`对象已不存在，删除 ${receiptFile(name, key)}`);
        for (const message of maintainerProcessErrors(receipt?.note, `${receiptFile(name, key)} note `)) problems.push(message);
        for (const [item, entry] of Object.entries(receipt?.assessment ?? {})) {
          for (const message of maintainerProcessErrors(entry?.note, `${receiptFile(name, key)} assessment.${item}.note `)) problems.push(message);
        }
      }
    }
    if (problems.length) throw new Error(problems.join('\n'));
    return { valid: true };
  }
  if (command === 'summary') return { counts: Object.fromEntries(['person', 'battle'].map(kind => [kind, records.filter(r => r.kind === kind).length])), features: Object.keys(JSON.parse(read(root, REGISTRY))), warning: '目录与信号只用于筛选；不代表已核读或调查完成。' };
  const record = one ? records.find(r => r.key === positional[0]) : null;
  if (one && !record) throw new Error(`对象不存在：${positional[0]}`);
  if (command === 'read') {
    if (!['body', 'material'].includes(options.file)) throw new Error('--file 须为 body 或 material');
    const file = record[options.file];
    if (!file) throw new Error('此对象没有素材文件');
    const from = integer(options, 'from', 1, 1), count = integer(options, 'lines', 30, 1, 80), lines = options.file === 'material' ? documentText(root, file).split('\n') : read(root, file).split('\n');
    return { file, totalLines: lines.length, from, lines: lines.slice(from - 1, from - 1 + count).map((text, i) => ({ line: from + i, text })) };
  }
  const feature = loadFeature(root, options.feature ?? 'combat');
  if (feature.pending && ['verify', 'mark', 'template'].includes(command)) throw pendingError(feature);
  if (command === 'verify') {
    const rows = unique(positional).map(key => {
      const target = records.find(r => r.key === key);
      if (!target) throw new Error(`对象不存在：${key}`);
      if (!feature.kinds.includes(target.kind)) throw new Error(`${feature.name} 不适用于 ${target.kind}`);
      const result = assess(root, target, feature);
      if (result.state === 'reviewed' && result.receipt.assessment) validateAssessment(root, feature, target, result.receipt.assessment);
      return { key, state: result.state, missingChecks: result.missingChecks };
    });
    const failed = rows.filter(row => row.state !== 'reviewed');
    if (failed.length) throw new Error(`复查验收未通过：${failed.map(row => `${row.key}=${row.state}${row.missingChecks.length ? `（缺${row.missingChecks.join('、')}）` : ''}`).join('；')}`);
    return { feature: feature.name, verified: rows };
  }
  if (one && !feature.kinds.includes(record.kind)) throw new Error(`${feature.name} 不适用于 ${record.kind}`);
  if (command === 'mark') {
    if (!STATES.includes(options.status) || !options.note?.trim() || !options.evidence?.length) throw new Error('mark 须提供 --status、非空 --note 和至少一个 --evidence');
    for (const file of options.evidence) if (!exists(root, safeFile(root, file))) throw new Error(`证据文件不存在：${file}`);
    // A reviewed mark of a checked feature reads the template's own draft unless another file is named.
    const draft = draftFile(feature, record);
    const assessmentFile = options.assessment ? safeFile(root, options.assessment) : options.status === 'reviewed' && Object.keys(feature.checks ?? {}).length && exists(root, draft) ? draft : null;
    const assessment = assessmentFile ? JSON.parse(read(root, assessmentFile)) : undefined;
    const checkFiles = options.status === 'reviewed' && (assessment || Object.keys(feature.checks ?? {}).length) ? validateAssessment(root, feature, record, assessment) : [];
    if (assessment && options.status !== 'reviewed') throw new Error('未完成的复查用 note 和 evidence 记录缺口，不附已完成 assessment');
    const evidence = unique([...options.evidence, ...checkFiles]);
    const source = inputs(root, record, evidence);
    const receipt = { status: options.status, note: options.note, evidence, ...(assessment ? { assessment } : {}),
      dependencies: unique([...source.files, ...record.battles.flatMap(b => [b.archive, b.body, b.material]).filter(Boolean)]),
      inputs: source.fingerprint, inputParts: source.parts, level: feature.level };
    const file = path.join(root, receiptFile(feature.name, record.key));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(receipt, null, 2) + '\n');
    // The default draft is spent once its judgments are saved; the next template restarts from the receipt.
    if (assessmentFile === draft && options.status === 'reviewed') fs.rmSync(path.join(root, draft));
    return { key: record.key, feature: feature.name, state: options.status };
  }
  if (command === 'template') {
    const checks = Object.keys(feature.checks ?? {});
    if (!checks.length) throw new Error(`${feature.name} 没有逐项复查，直接用 mark --note --evidence 登记`);
    if (options.force !== undefined && options.force !== 'yes') throw new Error('--force 只接受 yes');
    if (options.sources !== undefined && options.sources !== 'yes') throw new Error('--sources 只接受 yes');
    if (options.anchors !== undefined && options.anchors !== 'no') throw new Error('--anchors 只接受 no');
    const out = safeFile(root, options.out ?? draftFile(feature, record));
    const { receipt, source } = assess(root, record, feature), previous = receipt?.assessment;
    const existing = exists(root, out) && !options.force;
    const blank = key => ({ status: '', note: '', evidence: [], ...(feature.eventReview && key === 'events' ? { items: [], noHeavyReason: '' } : {}) });
    // Earlier notes are kept as a starting point, but every status must be set again after rereading.
    const assessment = existing ? JSON.parse(read(root, out)) : Object.fromEntries(checks.map(key => [key, previous?.[key] ? { ...previous[key], status: '' } : blank(key)]));
    if (!existing) {
      fs.mkdirSync(path.dirname(path.join(root, out)), { recursive: true });
      fs.writeFileSync(path.join(root, out), JSON.stringify(assessment, null, 2) + '\n');
    }
    // Short guidance comes first and anchors last, so a clipped read still shows the rules.
    return { file: out, ...(existing ? { existing: true, hint: '草稿已存在，未覆盖；直接编辑，或加 --force yes 从现有结论重新生成' } : {}), reused: Boolean(previous),
      changedSinceReview: receipt ? changedParts(receipt, source) ?? '旧记录未存分项指纹，按全文重核' : null,
      ...(receipt && receipt.level < feature.level ? { ruleTightened: true } : {}),
      brokenEvidence: previous || existing ? brokenEvidence(root, assessment) : [],
      constraints: [...CONSTRAINTS.common, ...(feature.eventReview ? CONSTRAINTS.writing : CONSTRAINTS.checks)], checks: feature.checks,
      ...(feature.eventReview ? { eventShape: { title: '', weight: 'heavy|ordinary|light', reason: '', source: { file: '素材或来源', heading: '或 contains' }, treatment: 'expanded|brief|omitted', body: { file: record.body, contains: '' }, development: [{ angle: ANGLES.join('|'), note: '', evidence: { file: record.body, contains: '' } }], verdict: 'sufficient', note: '' } } : {}),
      next: `npm run review -- mark ${record.key} --feature ${feature.name} --status reviewed --note 总结 --evidence ${record.material ?? record.body}${out === draftFile(feature, record) ? '' : ` --assessment ${out}`}`,
      warning: '状态已清空；逐项核读后填写。锚点只保证能定位，不代表已核读或可直接采用。',
      ...(options.anchors === 'no' ? {} : { sharedSources: record.sources.filter(file => file !== record.material),
        anchors: Object.fromEntries(unique([record.body, record.material, ...(options.sources ? record.sources : [])].filter(Boolean)).map(file => [file, anchorsOf(root, file)])) }) };
  }
  if (command === 'card') {
    const { state, receipt, signals, missingChecks: missing } = assess(root, record, feature);
    return { ...summary(root, record, feature), feature: feature.name, state, signals,
      files: { body: record.body, archive: record.archiveFile, material: record.material },
      ...(record.kind === 'person' ? { id: record.archive.id, alts: { total: (record.archive.identity?.alts ?? []).length, records: (record.archive.identity?.alts ?? []).slice(0, 8).map(({ id, name, zkb }) => ({ id, name, zkb })) }, zkb: record.archive.identity?.zkb ?? null, tags: record.archive.person.tags } : {}),
      structure: { total: sections(record.text).length, records: sections(record.text).slice(0, 20) },
      bodyMatches: snippets(record.text, feature.pattern),
      materialStructure: record.material ? { total: sections(record.materialText).length, records: sections(record.materialText).slice(0, 20) } : null,
      materialMatches: record.material ? snippets(record.materialText, feature.pattern) : [],
      battles: { total: record.battles.length, records: record.battles.slice(0, 12).map(({ fingerprint, ...battle }) => battle) },
      sharedSources: record.sources.filter(file => file !== record.material),
      checks: feature.checks ?? {}, missingChecks: missing,
      review: receipt ? { status: receipt.status, note: receipt.note, evidence: receipt.evidence, assessment: receipt.assessment ?? null } : null };
  }
  let candidates = records.filter(r => feature.kinds.includes(r.kind));
  if (command === 'impact') {
    let files = options.files ?? [];
    if (options.since) {
      const output = execFileSync('git', ['diff', '--name-only', '-z', options.since, '--'], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
      const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
      files = [...files, ...output.split('\0').filter(Boolean), ...untracked.split('\0').filter(Boolean)];
    }
    if (!files.length) throw new Error('impact 须指定 --since 或 --files');
    files = unique(files.map(file => safeFile(root, file)));
    const codeChange = files.includes('scripts/review.mjs');
    candidates = candidates.filter(r => {
      const { source, receipt } = assess(root, r, feature);
      const dependencies = [...source.files, ...r.battles.flatMap(b => [b.archive, b.body, b.material]).filter(Boolean), ...(receipt?.dependencies ?? [])];
      // Undeclared rule edits surface every receipt so the change can be judged; declared ones only stale receipts.
      const rulesChanged = files.includes(REGISTRY) || files.some(file => feature.rules.some(rule => rule.file === file) || (feature.implementation ?? []).includes(file));
      return codeChange || dependencies.some(file => files.includes(file)) || (rulesChanged && (!receipt || feature.pending || receipt.level < feature.level));
    });
  }
  if (options.kind) {
    if (!['person', 'battle'].includes(options.kind)) throw new Error('kind 须为 person / battle');
    candidates = candidates.filter(r => r.kind === options.kind);
  }
  candidates.sort((a, b) => (b.added ?? (b.historyAvailable ? 'z' : '')).localeCompare(a.added ?? (a.historyAvailable ? 'z' : '')) || a.key.localeCompare(b.key));
  if (options.recent !== undefined) {
    if (candidates.some(r => !r.historyAvailable)) throw new Error('无 Git 加入历史，不能使用 --recent');
    candidates = candidates.slice(0, integer(options, 'recent', 30, 1));
  }
  if (options['max-blocks'] !== undefined) candidates = candidates.filter(r => r.blocks <= integer(options, 'max-blocks', 2));
  let rows = candidates.map(r => summary(root, r, feature));
  if (options.signal) {
    if (!['battle-without-narrative', 'combat-without-block', 'command-without-tag', 'few-blocks', 'no-material', 'no-saved-kb', 'review-incomplete', 'heavy-story-candidate'].includes(options.signal)) throw new Error('未知 signal');
    rows = rows.filter(r => r.signals.includes(options.signal));
  }
  if (options.state) {
    if (!['unreviewed', 'stale', ...STATES].includes(options.state)) throw new Error('未知 state');
    rows = rows.filter(r => r.state === options.state);
  }
  const limit = integer(options, 'limit', 10, 1, 20), offset = integer(options, 'offset', 0);
  return { feature: feature.name, total: rows.length, offset, limit, records: rows.slice(offset, offset + limit), warning: '关键词命中与快照关联仅是线索；未登记人工结论的一律 unreviewed。' };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const result = run(path.resolve(import.meta.dirname, '..'), process.argv.slice(2)); console.log(typeof result === 'string' ? result : JSON.stringify(result)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
