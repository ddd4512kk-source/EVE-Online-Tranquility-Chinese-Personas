#!/usr/bin/env node
// 天书工作台：把官方新闻（官方中文版或本站译文）写成 src/news/<短名>.md，并校验全部页面。
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  articleMeta, fetchArticle, newsDocument, officialChinese, parseNewsUrl, splitTitle, validateNews,
} from './news.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEWS_DIR = path.join(ROOT, 'src', 'news');
const INSTRUCTION_FILES = new Set(['AGENTS.md', 'CLAUDE.md']);

const HELP = `用法：npm run news -- <命令>

  official <英文链接> [--force]
      官网有中文版时直接抓取写成页面（translation: official）；没有时退出码 3，需走翻译。
  add <英文链接> --file <中文.md> [--translation site|official] [--force]
      用一篇中文 Markdown（首行“# 标题”）写成页面，元数据取自英文原文；默认 translation: site。
  import <目录> --registry <登记.jsonl> [--force]
      批量导入官方中文 Markdown：登记表每行含 local_path 与 url（中文页链接），按文件名匹配。
  check
      校验 src/news/ 下全部页面。

已存在的页面默认不覆盖，加 --force 才重写（保留手工指定的 category）。`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') out.force = true;
    else if (a.startsWith('--')) {
      if (i + 1 >= argv.length) throw new Error(`${a} 缺少取值`);
      out[a.slice(2)] = argv[++i];
    } else out._.push(a);
  }
  return out;
}

const pageFile = slug => path.join(NEWS_DIR, `${slug}.md`);

function slugOf(url) {
  const parsed = parseNewsUrl(url);
  if (!parsed) throw new Error(`不是 eveonline.com 新闻链接：${url}`);
  return parsed.slug;
}

/** 写页面；已存在且未加 --force 时跳过。返回 written / skipped。 */
function writePage(slug, data, body, force) {
  const file = pageFile(slug);
  if (existsSync(file)) {
    if (!force) return 'skipped';
    const old = matter(readFileSync(file, 'utf8')).data;
    if (old.category) data = { ...data, category: old.category };
    if (old.toc !== undefined) data = { ...data, toc: old.toc };
    if (old.tocDepth !== undefined) data = { ...data, tocDepth: old.tocDepth };
  }
  const errors = validateNews(data, body, slug);
  if (errors.length) throw new Error(errors.join('\n'));
  mkdirSync(NEWS_DIR, { recursive: true });
  writeFileSync(file, newsDocument(data, body), 'utf8');
  return 'written';
}

async function englishMeta(slug) {
  const en = await fetchArticle(slug, 'en');
  if (!en) throw new Error(`${slug}：英文原文不存在或页面中没有文章对象`);
  return articleMeta(slug, en);
}

async function cmdOfficial(args) {
  const slug = slugOf(args._[1] ?? '');
  const zh = officialChinese(await fetchArticle(slug, 'zh'));
  if (!zh) {
    console.log(JSON.stringify({ slug, status: 'no_official_chinese' }));
    return 3;
  }
  const meta = await englishMeta(slug);
  const status = writePage(slug, { title: zh.title, ...meta, translation: 'official' }, zh.body, args.force);
  console.log(JSON.stringify({ slug, status, file: path.relative(ROOT, pageFile(slug)) }));
  return 0;
}

async function cmdAdd(args) {
  const slug = slugOf(args._[1] ?? '');
  if (!args.file) throw new Error('add 需要 --file <中文.md>');
  const translation = args.translation ?? 'site';
  const { title, body } = splitTitle(readFileSync(args.file, 'utf8'));
  if (!title) throw new Error(`${args.file}：首行必须是“# 中文标题”`);
  const meta = await englishMeta(slug);
  const status = writePage(slug, { title, ...meta, translation }, body, args.force);
  console.log(JSON.stringify({ slug, status, file: path.relative(ROOT, pageFile(slug)) }));
  return 0;
}

async function cmdImport(args) {
  const dir = args._[1];
  if (!dir || !args.registry) throw new Error('import 需要 <目录> 与 --registry <登记.jsonl>');
  const urls = new Map();
  for (const line of readFileSync(args.registry, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    if (row.local_path && row.url) urls.set(path.basename(row.local_path), row.url);
  }
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  const result = { written: 0, skipped: 0, failed: [] };
  let next = 0;
  const worker = async () => {
    while (next < files.length) {
      const name = files[next++];
      try {
        const url = urls.get(name);
        if (!url) throw new Error('登记表中没有链接');
        const slug = slugOf(url);
        if (existsSync(pageFile(slug)) && !args.force) {
          result.skipped++;
          continue;
        }
        const { title, body } = splitTitle(readFileSync(path.join(dir, name), 'utf8'));
        if (!title) throw new Error('首行不是“# 标题”');
        const meta = await englishMeta(slug);
        result[writePage(slug, { title, ...meta, translation: 'official' }, body, args.force)]++;
      } catch (error) {
        result.failed.push(`${name}：${error.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(JSON.stringify(result, null, 2));
  return result.failed.length ? 1 : 0;
}

function cmdCheck() {
  if (!existsSync(NEWS_DIR)) return 0;
  const errors = [];
  let count = 0;
  for (const name of readdirSync(NEWS_DIR).filter(f => f.endsWith('.md') && !INSTRUCTION_FILES.has(f))) {
    count++;
    const { data, content } = matter(readFileSync(path.join(NEWS_DIR, name), 'utf8'));
    errors.push(...validateNews(data, content, name.replace(/\.md$/, '')));
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    return 1;
  }
  console.log(`天书 ${count} 篇校验通过`);
  return 0;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const commands = { official: cmdOfficial, add: cmdAdd, import: cmdImport, check: cmdCheck };
  const run = commands[args._[0]];
  if (!run) {
    console.log(HELP);
    return args._[0] ? 2 : 0;
  }
  return run(args);
}

main().then(code => { process.exitCode = code; }, error => {
  console.error(error.message);
  process.exitCode = 2;
});
