// Offline review worklists. Source files remain authoritative; only human decisions are saved.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readPersonDocument } from './person-document.mjs';

const REGISTRY = 'docs/review-features.json';
const STATES = ['reviewed', 'needs-work', 'blocked'];
const HELP = `离线增量复查；无参数只报数量，不输出全站正文。
  npm run review -- list --feature combat --recent 30 --max-blocks 2 --limit 10
  npm run review -- card person:短名 --feature combat
  npm run review -- read person:短名 --file material --from 20 --lines 25
  npm run review -- impact --feature combat --since HEAD --limit 10
  npm run review -- verify person:短名 person:另一短名 --feature combat
  npm run review -- mark person:短名 --feature combat --status needs-work --note 具体缺口 --evidence 相对文件路径
list：--kind person|battle --signal 信号 --state unreviewed|stale|reviewed|needs-work|blocked
      --recent N（首次加入历史，未提交新篇优先） --max-blocks N --limit 1..20 --offset N
impact：--since Git引用（含已暂存、未暂存和未跟踪文件），或重复 --files 相对路径；可按 --state 筛选
card：只返回结构、命中摘录与证据入口；read 单次最多80行，不自动读取视频或联网。
mark：仅在人工核读后使用；--evidence 可重复。配置必查项的feature须用 --assessment 仓库内JSON路径逐项登记。
verify：指定本次交付对象；未审、失效或缺项均以非零状态退出，不以关键词或料块数代替复查。
详情：docs/review-workflow.md。信号不是漏项定论，互链和构建通过不是调查完成。
`;
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (root, file) => fs.existsSync(path.join(root, file));
const dirs = (root, dir) => exists(root, dir) ? fs.readdirSync(path.join(root, dir)).sort() : [];
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonical(item)])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const posix = file => file.split(path.sep).join('/');
const unique = values => [...new Set(values)];
function safeFile(root, file) {
  const base = file.split('#')[0];
  const rel = posix(path.relative(root, path.resolve(root, base)));
  if (!rel || rel.startsWith('../') || path.isAbsolute(rel)) throw new Error(`路径必须在仓库内：${file}`);
  if (exists(root, rel)) {
    const real = path.relative(fs.realpathSync(root), fs.realpathSync(path.join(root, rel)));
    if (real.startsWith('..') || path.isAbsolute(real)) throw new Error(`路径不能指向仓库外：${file}`);
  }
  return rel;
}
export function ruleText(root, spec) {
  const text = read(root, spec.file);
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
function sharedSources(root, file, seen = new Set()) {
  if (!file || seen.has(file)) return seen;
  seen.add(file);
  // Follow only archived shared sources, not people-to-people links or the whole research graph.
  for (const m of read(root, file).matchAll(/\]\(([^)]+)\)/g)) {
    let target = m[1].split('#')[0];
    if (!target || /^(?:[a-z]+:|\/)/i.test(target)) continue;
    target = posix(path.normalize(path.join(path.dirname(file), target)));
    if (target.startsWith('docs/sources/') && target.endsWith('.md') && exists(root, target)) sharedSources(root, safeFile(root, target), seen);
  }
  return seen;
}
export function inventory(root) {
  const { dates, available } = creationDates(root), records = [], owners = new Map();
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
      const material = `${folder}/materials-${slug}.md`;
      const text = read(root, body), record = {
        key: `${kind}:${slug}`, kind, slug, title: kind === 'person' ? archive.person.cn_name || archive.name : archive.battle.title,
        body, archiveFile: posix(path.relative(root, archiveFile)), material: exists(root, material) ? material : null,
        archive, text, blocks: (text.match(/^:::\s*(?:红料|黑料)(?:\s|$)/gm) ?? []).length,
        added: dates.get(body) ?? null, historyAvailable: available, battles: [],
      };
      record.sources = [...sharedSources(root, record.material)];
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
      // Only this person's rows affect their combat review, not every KM in a large battle.
      fingerprint: hash({ battle: battle.archive.battle, characters, pilots: characters.map(({ id }) => [id, br?.pilots?.[id]]), losses: (br?.losses ?? []).filter(row => characters.some(({ id }) => id === row[1])), mention: characters.some(c => c.via.includes('mention')) ? battle.text : null }),
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
  const receipts = exists(root, `docs/reviews/${name}.json`) ? JSON.parse(read(root, `docs/reviews/${name}.json`)) : {};
  if (!receipts || Array.isArray(receipts) || typeof receipts !== 'object') throw new Error('复查记录须为对象');
  for (const [key, receipt] of Object.entries(receipts)) {
    if (!/^(person|battle):[^/\\]+$/.test(key) || !receipt || !STATES.includes(receipt.status) || !receipt.note?.trim() || !Array.isArray(receipt.evidence) || !receipt.evidence.length || !Array.isArray(receipt.dependencies) || !/^[a-f0-9]{64}$/.test(receipt.inputs) || !/^[a-f0-9]{64}$/.test(receipt.rules)) throw new Error(`复查记录不完整：${key}`);
    for (const file of [...receipt.evidence, ...receipt.dependencies]) safeFile(root, file);
  }
  return { ...feature, name, pattern: new RegExp(feature.pattern, 'i'), ruleParts,
    ruleHash: hash({ engine: feature.eventReview ? 4 : feature.checks ? 3 : 2, feature, ruleParts, implementation }), receipts };
}
function inputValue(root, record, file) {
  if (record.scopedFiles?.[file]) return record.scopedFiles[file];
  if (!exists(root, file)) return null;
  const text = read(root, file);
  if (!file.endsWith('.json')) return text;
  const data = JSON.parse(text);
  if (file === record.archiveFile && record.kind === 'person') delete data.fetched_at;
  return data;
}
function inputs(root, record, evidence = []) {
  const files = unique([record.body, record.archiveFile, ...record.sources, ...Object.keys(record.scopedFiles ?? {}), ...(record.kind === 'battle' && record.material ? [record.material] : []), ...evidence.map(file => safeFile(root, file))]);
  return { files, fingerprint: hash({ files: files.sort().map(file => [file, inputValue(root, record, file)]), battles: record.battles.map(({ key, fingerprint }) => [key, fingerprint]) }) };
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
    for (const spec of item.evidence) {
      if (!spec || typeof spec.file !== 'string' || (!spec.heading && !spec.contains) || (spec.heading && spec.contains)) throw new Error(`${key} 的证据须指定 file 及 heading 或 contains`);
      const file = safeFile(root, spec.file);
      if (!exists(root, file)) throw new Error(`证据文件不存在：${file}`);
      const excerpt = ruleText(root, { ...spec, file });
      if (!excerpt.trim()) throw new Error(`${key} 的证据为空`);
      files.push(file);
    }
    if (key === 'narrative' && !item.evidence.some(spec => safeFile(root, spec.file) === record.body)) throw new Error('narrative 须指向本人的正文段落，素材不能代替入文验收');
  }
  if (feature.eventReview) files.push(...validateWriting(root, record, assessment));
  return unique(files);
}
function validateWriting(root, record, assessment) {
  const files = [], nonempty = value => typeof value === 'string' && value.trim();
  const anchor = (spec, body) => {
    if (!spec || typeof spec.file !== 'string' || Boolean(spec.heading) === Boolean(spec.contains)) throw new Error('事件证据须指定 file 及 heading 或 contains');
    const file = safeFile(root, spec.file);
    if (!exists(root, file)) throw new Error(`证据文件不存在：${file}`);
    if (body ? file !== record.body : file === record.body) throw new Error(body ? '发挥须定位本人正文' : '事件来源不能用正文自证');
    const excerpt = ruleText(root, { ...spec, file });
    if (!excerpt.split('\n').some(line => line.trim() && !/^(?:#{1,6}\s|:::)/.test(line))) throw new Error('事件证据不能只有标题');
    files.push(file);
  };
  for (const key of ['coverage', 'events', 'balance']) if (assessment[key]?.status !== 'reviewed') throw new Error(`写作复查 ${key} 须实际核读，不接受不适用`);
  if (!assessment.coverage.evidence.some(spec => spec.file !== record.body)) throw new Error('coverage 须对照素材，不能只读正文');
  if (!assessment.balance.evidence.some(spec => spec.file === record.body)) throw new Error('balance 须定位本人正文');
  const events = assessment.events.items;
  if (!Array.isArray(events)) throw new Error('events.items 须逐件登记事件；无重料也须明确说明');
  if (!events.some(event => event.weight === 'heavy') && !nonempty(assessment.events.noHeavyReason)) throw new Error('无重料须说明核读后的 noHeavyReason');
  const titles = new Set();
  for (const event of events) {
    if (!nonempty(event.title) || titles.has(event.title)) throw new Error('事件须有不重复的标题，同一事件不能拆块充数');
    titles.add(event.title);
    if (!['heavy', 'ordinary', 'light'].includes(event.weight) || !nonempty(event.reason) || !nonempty(event.note)) throw new Error('事件须说明分量依据与采用判断');
    anchor(event.source, false);
    if (!['expanded', 'brief', 'omitted'].includes(event.treatment)) throw new Error('事件须说明展开、简述或略过');
    if (event.treatment !== 'omitted') anchor(event.body, true);
    if (event.weight !== 'heavy') continue;
    if (event.treatment !== 'expanded' || event.verdict !== 'sufficient') throw new Error('重料未充分展开，不能标为 reviewed');
    const development = event.development;
    if (!Array.isArray(development)) throw new Error('重料须逐方向登记发挥与正文位置');
    const angles = new Set();
    for (const item of development) {
      if (!['处境', '动机', '分量', '反差', '反应与后果', '落点'].includes(item.angle) || angles.has(item.angle) || !nonempty(item.note)) throw new Error('发挥方向须有效、不重复并说明具体写法');
      angles.add(item.angle);
      anchor(item.evidence, true);
    }
    if (angles.size < 3 || !angles.has('反差') || !(angles.has('分量') || angles.has('反应与后果'))) throw new Error('重料须至少三个发挥方向，含反差及分量或反应与后果');
  }
  return files;
}
function assess(root, record, feature) {
  const receipt = feature.receipts[record.key];
  const source = inputs(root, record, receipt?.evidence);
  const stale = receipt && (receipt.inputs !== source.fingerprint || receipt.rules !== feature.ruleHash);
  const signals = [];
  const missing = missingChecks(feature, receipt);
  if (missing.length) signals.push('review-incomplete');
  if (feature.eventReview && feature.pattern.test(record.text + (record.material ? read(root, record.material) : ''))) signals.push('heavy-story-candidate');
  if (feature.name === 'combat' && record.kind === 'person' && record.battles.some(b => b.characters.some(c => c.via.some(v => ['pilot', 'loss', 'manual'].includes(v)))) && !feature.pattern.test(record.text)) signals.push('battle-without-narrative');
  if (feature.name === 'combat' && record.kind === 'person' && /FLEET\s+COMMANDER/i.test(record.text + (record.material ? read(root, record.material) : '')) && !(record.archive.person.tags ?? []).some(tag => ['FC', '著名FC'].includes(tag))) signals.push('command-without-tag');
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
  if (!['summary', 'list', 'card', 'read', 'impact', 'mark', 'verify'].includes(command)) throw new Error(`未知命令：${command}`);
  const allowed = { summary: [], list: ['feature', 'kind', 'recent', 'max-blocks', 'signal', 'state', 'limit', 'offset'], card: ['feature'], read: ['file', 'from', 'lines'], impact: ['feature', 'since', 'files', 'state', 'limit', 'offset'], mark: ['feature', 'status', 'note', 'evidence', 'assessment'], verify: ['feature'] }[command];
  for (let i = 0; i < rest.length; i++) {
    if (!rest[i].startsWith('--')) { positional.push(rest[i]); continue; }
    const key = rest[i].slice(2), value = rest[++i];
    if (!allowed.includes(key) || value === undefined || value.startsWith('--')) throw new Error(`无效参数：--${key}`);
    if (['files', 'evidence'].includes(key)) (options[key] ??= []).push(value);
    else if (options[key] !== undefined) throw new Error(`重复参数：--${key}`);
    else options[key] = value;
  }
  const one = ['card', 'read', 'mark'].includes(command);
  if (command === 'verify' ? !positional.length : positional.length !== (one ? 1 : 0)) throw new Error(one || command === 'verify' ? '须指定 person:短名 或 battle:短名' : '不接受位置参数');
  const records = suppliedRecords ?? inventory(root);
  if (command === 'summary') return { counts: Object.fromEntries(['person', 'battle'].map(kind => [kind, records.filter(r => r.kind === kind).length])), features: Object.keys(JSON.parse(read(root, REGISTRY))), warning: '目录与信号只用于筛选；不代表已核读或调查完成。' };
  const record = one ? records.find(r => r.key === positional[0]) : null;
  if (one && !record) throw new Error(`对象不存在：${positional[0]}`);
  if (command === 'read') {
    if (!['body', 'material'].includes(options.file)) throw new Error('--file 须为 body 或 material');
    const file = record[options.file];
    if (!file) throw new Error('此对象没有素材文件');
    const from = integer(options, 'from', 1, 1), count = integer(options, 'lines', 30, 1, 80), lines = read(root, file).split('\n');
    return { file, totalLines: lines.length, from, lines: lines.slice(from - 1, from - 1 + count).map((text, i) => ({ line: from + i, text })) };
  }
  const feature = loadFeature(root, options.feature ?? 'combat');
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
    const assessment = options.assessment ? JSON.parse(read(root, safeFile(root, options.assessment))) : undefined;
    const checkFiles = options.status === 'reviewed' && (assessment || Object.keys(feature.checks ?? {}).length) ? validateAssessment(root, feature, record, assessment) : [];
    if (assessment && options.status !== 'reviewed') throw new Error('未完成的复查用 note 和 evidence 记录缺口，不附已完成 assessment');
    const evidence = unique([...options.evidence, ...checkFiles]);
    const source = inputs(root, record, evidence);
    feature.receipts[record.key] = { status: options.status, note: options.note, evidence, ...(assessment ? { assessment } : {}),
      dependencies: unique([...source.files, ...record.battles.flatMap(b => [b.archive, b.body, b.material]).filter(Boolean)]),
      inputs: source.fingerprint, rules: feature.ruleHash };
    fs.mkdirSync(path.join(root, 'docs/reviews'), { recursive: true });
    fs.writeFileSync(path.join(root, `docs/reviews/${feature.name}.json`), JSON.stringify(Object.fromEntries(Object.entries(feature.receipts).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n');
    return { key: record.key, feature: feature.name, state: options.status };
  }
  if (command === 'card') {
    const { state, receipt, signals, missingChecks: missing } = assess(root, record, feature);
    return { ...summary(root, record, feature), feature: feature.name, state, signals,
      files: { body: record.body, archive: record.archiveFile, material: record.material },
      ...(record.kind === 'person' ? { id: record.archive.id, alts: { total: (record.archive.identity?.alts ?? []).length, records: (record.archive.identity?.alts ?? []).slice(0, 8).map(({ id, name, zkb }) => ({ id, name, zkb })) }, zkb: record.archive.identity?.zkb ?? null, tags: record.archive.person.tags } : {}),
      structure: { total: sections(record.text).length, records: sections(record.text).slice(0, 20) },
      bodyMatches: snippets(record.text, feature.pattern),
      materialStructure: record.material ? { total: sections(read(root, record.material)).length, records: sections(read(root, record.material)).slice(0, 20) } : null,
      materialMatches: record.material ? snippets(read(root, record.material), feature.pattern) : [],
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
      // Rule edits invalidate only changed selected sections. Without a receipt, surface candidates conservatively.
      const rulesChanged = files.includes(REGISTRY) || files.some(file => feature.rules.some(rule => rule.file === file) || (feature.implementation ?? []).includes(file));
      return codeChange || dependencies.some(file => files.includes(file)) || (rulesChanged && (!receipt || receipt.rules !== feature.ruleHash));
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
    if (!['battle-without-narrative', 'command-without-tag', 'few-blocks', 'no-material', 'no-saved-kb', 'review-incomplete', 'heavy-story-candidate'].includes(options.signal)) throw new Error('未知 signal');
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
  try { const result = run(path.resolve(import.meta.dirname, '..'), process.argv.slice(2)); console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
