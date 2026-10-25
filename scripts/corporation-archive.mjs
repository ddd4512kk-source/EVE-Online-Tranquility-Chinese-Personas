// 军团与历史榜单的离线读取；没有刷新、抓取或自动升级人工结论的入口。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readAllIdentities } from './person-identity.mjs';

export const DIRECTORY = 'docs/corporations';
const ID = /^[1-9]\d*$/;
const SCOPES = ['all-time', 'recent', 'monthly', 'monitor-monthly'];
const fold = value => String(value).normalize('NFKC').toLowerCase();
const files = (root, directory) => fs.existsSync(path.join(root, directory)) ? fs.readdirSync(path.join(root, directory)).sort() : [];
const load = (root, file) => {
  try { return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); }
  catch (error) { throw new Error(`${file}：${error.message}`); }
};
const HELP = `离线查询军团档案、固定历史 Top 100 与共享角色调查记录。

用法：npm run corporations -- <命令> [对象] [选项]
  list [关键词]            按军团名、ID、角色名或已知昵称定位军团
  show <军团ID>            军团简介、来源、榜单覆盖与缺口，不倾倒整榜
  members <组织ID>         分页读取榜单及角色已有调查；联盟加 --alliance
  character <角色ID>       跨军团复用名片、旧判断、材料与当前正式人物身份
  source <来源key>         分页读取历史原表，未定军团ID也保留原行
  check                    校验结构、关联、来源和本地引用；全程离线

选项：--scope monthly / all-time / recent / monitor-monthly，--period YYYY-MM，
      --limit 10（最多100），--offset 0，--alliance（仅 show / members）
榜单目标固定 Top 100；limit 只控制查询分页，不改变调查范围。
已有 all-time 只作固定 hint，不刷新；缺失档案与第51—100名调查留待另行处理。
取得、名片记录、身份、故事、归档与入文不互相推定；旧结论不覆盖正式人物身份。

示例：
  npm run corporations -- list 宽带山
  npm run corporations -- show 98626718
  npm run corporations -- members 98626718 --scope monthly --period 2026-09
  npm run corporations -- character 2120638286
  npm run corporations -- members 99009082 --alliance --scope monthly --period 2021-09
  npm run corporations -- source activity-2022-01
`;

function page(records, { limit = 10, offset = 0 } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset) || offset < 0) throw new Error('limit 必须为1—100的整数，offset 必须为非负整数');
  return { total: records.length, offset, limit, records: records.slice(offset, offset + limit) };
}

export function readOrganizations(root, { alliance = false } = {}) {
  const directory = alliance ? `${DIRECTORY}/alliances` : DIRECTORY;
  return files(root, directory).filter(file => /^\d+\.json$/.test(file)).map(file => ({
    ...load(root, `${directory}/${file}`), archive: `${directory}/${file}`,
  }));
}

export function characterArchivePath(id) {
  if (!ID.test(String(id))) throw new Error('角色ID必须是正整数字符串');
  return `${DIRECTORY}/characters/${String(id).slice(-2).padStart(2, '0')}.json`;
}

export function readCharacters(root, ids) {
  const directory = `${DIRECTORY}/characters`;
  const selected = ids === undefined ? files(root, directory).filter(file => file.endsWith('.json')).map(file => `${directory}/${file}`)
    : [...new Set(ids.map(characterArchivePath))].filter(file => fs.existsSync(path.join(root, file)));
  const records = {};
  for (const file of selected) {
    if (!/^\d{2}\.json$/.test(path.basename(file))) throw new Error(`${file}：角色分片文件名须为00—99`);
    const archive = load(root, file);
    if (archive.version !== 1 || !archive.records || typeof archive.records !== 'object' || Array.isArray(archive.records)) throw new Error(`${file}：版本或角色记录格式错误`);
    for (const [id, record] of Object.entries(archive.records)) {
      if (!ID.test(id) || record?.id !== id || characterArchivePath(id) !== file) throw new Error(`${file}：角色 ${id} 的ID或分片归属错误`);
      if (ids === undefined || ids.includes(id)) records[id] = record;
    }
  }
  return records;
}

function identityIndex(root) {
  const identities = new Map();
  if (!fs.existsSync(path.join(root, 'src/people'))) return identities;
  for (const person of readAllIdentities(root).values()) {
    for (const id of [person.character_id, ...person.alts.map(alt => alt.id)]) {
      identities.set(String(id), { person: person.slug, character_id: person.character_id,
        material: fs.existsSync(path.join(root, `src/people/${person.slug}/materials-${person.slug}.md`)) ? `src/people/${person.slug}/materials-${person.slug}.md` : null });
    }
  }
  return identities;
}

function rankingSummary(ranking) {
  const { entries, ...metadata } = ranking;
  return { ...metadata, stored: entries.length };
}

export function organizationSummary(organization) {
  const { rankings, ...metadata } = organization;
  return { ...metadata, rankings: rankings.map(rankingSummary) };
}

export function findOrganizations(root, query = '') {
  const needle = fold(query), organizations = readOrganizations(root);
  if (!needle) return organizations.map(organizationSummary);
  const exact = organizations.filter(organization => [organization.id, ...organization.names].some(name => fold(name) === needle));
  if (exact.length) return exact.map(organizationSummary);
  const characters = readCharacters(root);
  return organizations.map(organization => {
    const names = [organization.id, ...organization.names].map(fold);
    if (!needle || names.includes(needle)) return { organization, relevance: 0 };
    if (names.some(name => name.includes(needle))) return { organization, relevance: 1 };
    if (fold(JSON.stringify(organizationSummary(organization))).includes(needle)) return { organization, relevance: 2 };
    const ids = new Set([
      ...organization.rankings.flatMap(ranking => ranking.entries.map(entry => entry.character_id)),
      ...organization.account_groups.flatMap(group => group.character_ids),
    ]);
    const related = [...ids].some(id => fold(JSON.stringify(characters[id] ?? { character_id: id })).includes(needle));
    return { organization, relevance: related ? 3 : null };
  }).filter(result => result.relevance !== null)
    .sort((a, b) => a.relevance - b.relevance).map(result => organizationSummary(result.organization));
}

export function characterDetails(root, id) {
  id = String(id);
  const character = readCharacters(root, [id])[id];
  if (!character) throw new Error(`角色 ${id} 尚无军团调查记录`);
  const appearances = [], groups = [];
  for (const alliance of [false, true]) {
    for (const organization of readOrganizations(root, { alliance })) {
      for (const ranking of organization.rankings) {
        for (const entry of ranking.entries.filter(entry => entry.character_id === id)) {
          appearances.push({ organization_id: organization.id, kind: organization.kind, scope: ranking.scope, period: ranking.period, ...entry, source: ranking.source });
        }
      }
      for (const group of organization.account_groups.filter(group => group.character_ids.includes(id))) {
        groups.push({ organization_id: organization.id, ...group });
      }
    }
  }
  return { ...character, current_identity: identityIndex(root).get(id) ?? null, groups, appearances };
}

export function rankingMembers(root, id, { scope, period, alliance = false, ...pagination } = {}) {
  const organization = readOrganizations(root, { alliance }).find(record => record.id === id);
  if (!organization) throw new Error(`组织 ${id} 尚无档案`);
  const rankings = organization.rankings.filter(ranking => (!scope || ranking.scope === scope) && (!period || ranking.period === period));
  const selected = page(rankings.flatMap(ranking => ranking.entries.map(entry => ({
    scope: ranking.scope, period: ranking.period, ...entry,
  }))), pagination);
  const characters = readCharacters(root, selected.records.map(entry => entry.character_id)), identities = identityIndex(root);
  return { organization_id: id, rankings: rankings.map(rankingSummary), ...selected,
    records: selected.records.map(entry => ({ ...entry, character: characters[entry.character_id], current_identity: identities.get(entry.character_id) ?? null })) };
}

function localReference(root, value) {
  if (typeof value !== 'string' || !value) throw new Error('来源引用须为非空字符串');
  if (/^https:\/\//.test(value)) return;
  const file = value.split('#')[0];
  const absolute = path.resolve(root, file);
  if (!file.startsWith('docs/') && !file.startsWith('src/')) throw new Error(`本地引用须从仓库根目录起算：${value}`);
  if (!absolute.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(absolute)) throw new Error(`本地引用不存在：${value}`);
}

export function checkArchive(root) {
  if (fs.existsSync(path.join(root, `${DIRECTORY}/characters.json`))) throw new Error('旧角色总表 characters.json 已停用，请迁入 characters/00—99.json 分片');
  const organizations = [...readOrganizations(root), ...readOrganizations(root, { alliance: true })];
  const characters = readCharacters(root), seen = new Set();
  let entries = 0;
  const fail = message => { throw new Error(message); };
  for (const organization of organizations) {
    const label = organization.archive;
    const expectedKind = label.startsWith(`${DIRECTORY}/alliances/`) ? 'alliance' : 'corporation';
    if (organization.version !== 1 || typeof organization.id !== 'string' || !ID.test(organization.id) || organization.kind !== expectedKind) fail(`${label}：版本、ID或类型错误`);
    if (path.basename(label) !== `${organization.id}.json`) fail(`${label}：文件名与ID不符`);
    if (!Array.isArray(organization.names) || !organization.names.length || organization.names.some(name => typeof name !== 'string' || !name)) fail(`${label}：缺少已知名称`);
    for (const field of ['rankings', 'account_groups', 'observations', 'references']) if (!Array.isArray(organization[field])) fail(`${label}：${field}须为数组`);
    for (const reference of organization.references) localReference(root, reference);
    for (const observation of organization.observations) {
      localReference(root, observation.source);
      if (observation.period !== null && !/^\d{4}-(0[1-9]|1[0-2])$/.test(observation.period ?? '')) fail(`${label}：观察记录月份错误`);
    }
    for (const ranking of organization.rankings) {
      const key = `${organization.kind}:${organization.id}:${ranking.scope}:${ranking.period}`;
      if (seen.has(key)) fail(`${label}：榜单重复 ${key}`);
      seen.add(key);
      if (!SCOPES.includes(ranking.scope) || ranking.target !== 100 || ranking.refresh !== 'never' || ranking.purpose !== 'hint') fail(`${label}：榜单口径、Top 100或固定hint约束错误`);
      const monthly = ranking.scope.includes('monthly');
      if (monthly ? !/^\d{4}-(0[1-9]|1[0-2])$/.test(ranking.period ?? '') : ranking.period !== null) fail(`${label}：月份口径错误`);
      if (!Array.isArray(ranking.entries) || ranking.entries.length > 100) fail(`${label}：榜单须为至多100条的数组`);
      if (!ranking.acquisition || !['captured', 'partial', 'unknown'].includes(ranking.acquisition.state)) fail(`${label}：取得状态错误`);
      const available = ranking.acquisition.available_count;
      if (available !== null && (!Number.isSafeInteger(available) || available < ranking.entries.length)) fail(`${label}：来源数量错误`);
      if (ranking.acquisition.state === 'unknown' && ranking.entries.length) fail(`${label}：未知取得状态不能已有榜单记录`);
      if (!Array.isArray(ranking.references)) fail(`${label}：榜单引用须为数组`);
      const ranks = new Set(), ids = new Set();
      for (const entry of ranking.entries) {
        if (!Number.isSafeInteger(entry.rank) || entry.rank < 1 || entry.rank > 100 || ranks.has(entry.rank) || ids.has(entry.character_id)) fail(`${label}：名次或角色重复／越界`);
        if (typeof entry.character_id !== 'string' || !characters[entry.character_id]) fail(`${label}：角色 ${entry.character_id} 无共享记录`);
        if (typeof entry.kills !== 'string' || (entry.isk !== null && typeof entry.isk !== 'string')) fail(`${label}：历史数值须保留原始字符串`);
        ranks.add(entry.rank); ids.add(entry.character_id); entries++;
      }
      localReference(root, ranking.source);
      for (const reference of ranking.references) localReference(root, reference);
    }
    for (const group of organization.account_groups) {
      if (!group.label || !Array.isArray(group.character_ids) || new Set(group.character_ids).size !== group.character_ids.length) fail(`${label}：账号组昵称为空或角色重复`);
      for (const id of group.character_ids) if (!characters[id]) fail(`${label}：账号组角色 ${id} 无共享记录`);
      localReference(root, group.source);
    }
  }
  for (const [id, character] of Object.entries(characters)) {
    if (!ID.test(id) || character.id !== id || !Array.isArray(character.names) || !character.names.length || character.names.some(name => typeof name !== 'string' || !name)) fail(`共享角色 ${id}：ID或名字错误`);
    for (const field of ['labels', 'profiles', 'evidence']) if (!Array.isArray(character[field])) fail(`共享角色 ${id}：${field}须为数组`);
    if (!character.review || !['legacy', 'reviewed', 'partial', 'unread', 'excluded'].includes(character.review.state)) fail(`共享角色 ${id}：人工状态错误`);
    for (const field of ['findings', 'next_steps']) if (!Array.isArray(character.review[field])) fail(`共享角色 ${id}：review.${field}须为数组`);
    for (const ref of character.evidence) localReference(root, ref);
    for (const finding of character.review.findings) localReference(root, finding.source);
    for (const snapshot of character.profiles) localReference(root, snapshot.source);
    for (const next of character.review.next_steps) if (typeof next !== 'string' || !next) fail(`共享角色 ${id}：下一步为空`);
  }
  for (const file of files(root, `${DIRECTORY}/sources`).filter(file => file.endsWith('.json'))) {
    const source = load(root, `${DIRECTORY}/sources/${file}`);
    if (source.version !== 1 || !Array.isArray(source.records)) fail(`${file}：来源格式错误`);
    localReference(root, source.material);
    for (const record of source.records) if (record.resolved_corp_id && !organizations.some(organization => organization.id === record.resolved_corp_id)) fail(`${file}：历史行军团档案不存在`);
  }
  return { valid: true, corporations: organizations.filter(record => record.kind === 'corporation').length,
    alliances: organizations.filter(record => record.kind === 'alliance').length, characters: Object.keys(characters).length, ranking_entries: entries };
}

export function run(root, args) {
  if (args.includes('--help')) {
    if (args.length !== 1) throw new Error('--help 须单独使用');
    return HELP;
  }
  const [command, ...rest] = args, options = {}, positional = [];
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (['--limit', '--offset', '--scope', '--period'].includes(arg)) {
      const value = rest[++i];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg}缺少值`);
      options[arg.slice(2)] = ['--limit', '--offset'].includes(arg) ? Number(value) : value;
    } else if (arg === '--alliance') options.alliance = true;
    else if (arg.startsWith('--')) throw new Error(`未知选项：${arg}`);
    else positional.push(arg);
  }
  page([], options);
  if (options.scope && !SCOPES.includes(options.scope)) throw new Error('scope口径无效');
  if (options.period && !/^\d{4}-(0[1-9]|1[0-2])$/.test(options.period)) throw new Error('period须为YYYY-MM');
  const allowed = { list: ['limit', 'offset'], show: ['alliance'], members: ['limit', 'offset', 'scope', 'period', 'alliance'], character: [], source: ['limit', 'offset'], check: [] };
  if (!allowed[command]) throw new Error('请指定 list / show / members / character / source / check；用 --help 查看用法');
  for (const option of Object.keys(options)) if (!allowed[command].includes(option)) throw new Error(`${command}不支持选项 ${option}`);
  if (command === 'check') {
    if (positional.length) throw new Error('check不接受对象');
    return checkArchive(root);
  }
  if (command === 'list') return page(findOrganizations(root, positional.join(' ')), options);
  if (positional.length !== 1) throw new Error(`${command}须指定一个对象`);
  const [id] = positional;
  if (command === 'source') {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error('来源key只能含小写字母、数字与连字符');
    const { records, ...source } = load(root, `${DIRECTORY}/sources/${id}.json`);
    return { ...source, ...page(records, options) };
  }
  if (!ID.test(id)) throw new Error('组织／角色ID须为正整数字符串');
  if (command === 'character') return characterDetails(root, id);
  if (command === 'members') return rankingMembers(root, id, options);
  const organization = readOrganizations(root, options).find(record => record.id === id);
  if (!organization) throw new Error(`组织 ${id} 尚无档案`);
  return organizationSummary(organization);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = run(path.resolve(import.meta.dirname, '..'), process.argv.slice(2));
    console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
