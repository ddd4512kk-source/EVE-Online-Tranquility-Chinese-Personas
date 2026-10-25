// Query existing TSV ledgers without loading thousands of unrelated rows into agent context.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HELP = `离线筛选现有 TSV 榜单或队列，不生成另一份状态表。

用法：npm run research:query -- <TSV路径> [关键词] [选项]
  --where <列=值> 可重复，所有条件同时成立；值精确匹配，可为空
  --limit <数量> 每页最多返回条数，默认 20，必须为正整数
  --offset <数量> 跳过的命中数，默认 0，必须为非负整数
  --help         显示帮助，不读取文件；须单独使用，无需 TSV 路径

关键词匹配任意列，忽略英文大小写；多个关键词参数合成一个含空格的短语。
输出 JSON：columns 为表头，rows 为原表行数，total 为命中数，records 为当前页。
需纯 JSON 时用 npm run --silent research:query -- ...。
所有字段均保留为字符串，包括 ID、空值及原状态，不重算或升级状态。
军团榜单与共享人物调查已迁至 docs/corporations/，用 npm run corporations -- --help 查询。
列名错误、列数不齐或无效参数会报错；复杂事件、判断理由与阅读范围回原素材读取。

示例：
  npm run research:query -- docs/leads/dc-br-candidates-2026-10-12.tsv --where character_id=2118339639 --limit 10
  npm run research:query -- docs/leads/dc-br-candidates-2026-10-12.tsv --where character_id=2115988005
  npm run research:query -- docs/leads/dc-br-candidates-2026-10-12.tsv "待查" --limit 5 --offset 5
`;

export function queryTable(file, { query = '', where = [], limit = 20, offset = 0 } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(offset) || offset < 0) throw new Error('limit 必须为正整数，offset 必须为非负整数');
  const lines = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  const columns = lines.shift().split('\t');
  if (new Set(columns).size !== columns.length || columns.some(c => !c)) throw new Error('TSV 表头不能为空或重复');
  const filters = where.map(expression => {
    const at = expression.indexOf('=');
    if (at < 1 || !columns.includes(expression.slice(0, at))) throw new Error(`未知列或无效条件：${expression}`);
    return [expression.slice(0, at), expression.slice(at + 1)];
  });
  const matched = [], needle = query.toLowerCase();
  let rows = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    const values = lines[i].split('\t');
    if (values.length !== columns.length) throw new Error(`第 ${i + 2} 行列数 ${values.length} 与表头 ${columns.length} 不符`);
    rows++;
    const row = Object.fromEntries(columns.map((column, at) => [column, values[at]]));
    if (filters.every(([column, value]) => row[column] === value) && (!needle || values.some(value => value.toLowerCase().includes(needle)))) matched.push(row);
  }
  // All values remain strings: IDs, empty fields, scope and recorded status are never inferred.
  return { file, columns, rows, total: matched.length, offset, limit, records: matched.slice(offset, offset + limit) };
}

export function run(args) {
  if (args.includes('--help')) {
    if (args.length !== 1) throw new Error('--help 须单独使用');
    return HELP;
  }
  const [file, ...rest] = args;
  if (!file || file.startsWith('--')) throw new Error('用法：query-table.mjs <TSV路径> [关键词] [--where 列=值] [--limit 20] [--offset 0]');
  const options = { where: [] }, query = [];
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (['--where', '--limit', '--offset'].includes(arg)) {
      const value = rest[++i];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} 缺少值`);
      if (arg === '--where') options.where.push(value);
      else options[arg.slice(2)] = Number(value);
    } else if (arg.startsWith('--')) throw new Error(`未知选项：${arg}`);
    else query.push(arg);
  }
  return queryTable(file, { ...options, query: query.join(' ') });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = run(process.argv.slice(2));
    console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
  }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
