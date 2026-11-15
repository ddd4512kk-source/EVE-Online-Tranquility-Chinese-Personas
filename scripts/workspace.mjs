// 工作区布局：公开网站仓库为根，私有资料库克隆在 kb/。
// 工具、链接与登记一律用原仓库相对路径（逻辑路径，如 docs/leads/x.tsv、src/people/a/materials-a.json）；
// kb/ 内平放：去掉开头的 docs/ 或 src/，即 kb/leads/x.tsv、kb/people/a/materials-a.json。
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const KB = 'kb';
// 与 openspec/changes/split-private-materials/private-paths.txt 保持一致。
export const PRIVATE_DIRS = ['docs/leads/', 'docs/sources/', 'docs/tieba/', 'docs/bilibili/', 'docs/corporations/',
  'docs/reviews/', 'docs/combat-statistics/'];
export const PRIVATE_FILES = ['docs/pending-characters.md', 'docs/corps-excluded.json', 'docs/review-features.json',
  'docs/tieba-review-2026-10-10.md', 'docs/tieba-review-inventory-2026-10-10.tsv', 'docs/battle-review-2026-10-11.md',
  'docs/bilibili-uploaders.md', 'src/people/reisen-evil/alt-candidates.tsv',
  'src/people/remeleen/warbeacon-obe-2026-10-10.json.gz', 'scratch/xiaoshen-video-comments-replies.md'];
export const PRIVATE_PATTERN = /^src\/(people|battles|corps)\/([^/]+\/)?materials-[^/]*$/;

const posix = rel => rel.split(path.sep).join('/').replace(/^\.\//, '');

/** 仓库相对路径是否属于私有资料。目录本身（不带斜杠）也算。 */
export function isPrivate(rel) {
  const file = posix(rel);
  return PRIVATE_PATTERN.test(file) || PRIVATE_FILES.includes(file)
    || PRIVATE_DIRS.some(dir => file.startsWith(dir) || `${file}/` === dir);
}

const SRC_KINDS = new Set(['people', 'battles', 'corps']);
const KB_OWN = new Set(['.git', 'AGENTS.md', 'CLAUDE.md', 'README.md', '.gitignore', '.gitattributes']);

/** 逻辑路径 → kb/ 内路径：去掉开头的 docs/ 或 src/。 */
export function flatten(rel) {
  return posix(rel).replace(/^(?:docs|src)(?:\/|$)/, '');
}

/** kb/ 内路径 → 逻辑路径；kb 自身的说明文件与 .git 返回 null。 */
export function unflatten(kbRel) {
  const rel = posix(kbRel);
  const head = rel.split('/')[0];
  if (!rel || KB_OWN.has(head)) return null;
  if (SRC_KINDS.has(head)) return `src/${rel}`;
  if (head === 'scratch') return rel;
  return `docs/${rel}`;
}

const hasKb = root => fs.existsSync(path.join(root, KB));

/** 资料根：root/kb 存在时用它；否则退回 root（测试夹具、只有公开仓库时）。 */
export function kbRoot(root) {
  return hasKb(root) ? path.join(root, KB) : root;
}

/** 强制落到资料根，用于“对象目录在公开库、素材在私有库”的拼接，如 materialPath(kbPath(root, dir), slug)。 */
export function kbPath(root, rel = '') {
  return hasKb(root) ? path.join(root, KB, flatten(rel)) : path.join(root, rel);
}

/** 逻辑路径 → 绝对路径；私有路径落到 kb/ 的平放位置。 */
export function resolve(root, rel) {
  return isPrivate(rel) ? kbPath(root, rel) : path.join(root, rel);
}

/** 两个仓库同一逻辑目录的合并列表（按名去重、排序）；遍历时配合 resolve 读文件。 */
export function readdir(root, rel) {
  const seen = new Map();
  const dir = posix(rel).replace(/\/+$/, '');
  const add = (base, keep) => {
    if (!fs.existsSync(base)) return;
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      if (keep(entry.name) && !seen.has(entry.name)) seen.set(entry.name, entry);
    }
  };
  add(path.join(root, dir), name => !(name === KB && !dir));
  if (hasKb(root) && dir) {
    // kb/ 平放后多个逻辑目录共用 kb 根，只留逻辑上属于本目录的条目。
    const base = flatten(dir);
    add(path.join(root, KB, base), name => {
      const logical = unflatten(base ? `${base}/${name}` : name);
      return logical !== null && path.posix.dirname(logical) === dir;
    });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** 绝对路径 → 逻辑路径（kb/ 内文件还原 docs/、src/ 前缀），输出与迁移前一致。 */
export function relativeOf(root, absolute) {
  const rel = posix(path.relative(root, absolute));
  if (!rel.startsWith(`${KB}/`) || !hasKb(root)) return rel;
  return unflatten(rel.slice(KB.length + 1)) ?? rel;
}

/** 回流检查：公开仓库索引里不应出现私有路径或 kb/。不是 git 工作区时返回空。 */
export function trackedPrivateFiles(root) {
  let output;
  try { output = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { return []; }
  return output.split('\0').filter(file => file && (file === KB || file.startsWith(`${KB}/`) || isPrivate(file)));
}

/** 命令行入口用：工作区缺少私有资料库时明确报错，而不是静默返回空结果。 */
export function requireKb(root) {
  if (!fs.existsSync(path.join(root, KB))) {
    throw new Error(`缺少私有资料库：请把 Tranquility-Chinese-Personas-Knowledge-Base 克隆到 ${path.join(root, KB)}`);
  }
  return path.join(root, KB);
}
