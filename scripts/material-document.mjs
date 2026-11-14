import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HEADING = /^( {0,3})(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*(?:\r?\n|$)/;
const ANCHOR = /<a\s+id=["']([^"']+)["'][^>]*>\s*<\/a>/i;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const MAINTAINER_PROCESS_MENTION = /(?:由|按|经)?维护者(?:核对|明确|亦)?(?:确认|指认|补正|指示|拍板|选择|提供|要求|指定)/u;

export function maintainerProcessErrors(text, label = '') {
  if (typeof text !== 'string') return [];
  const match = text.match(MAINTAINER_PROCESS_MENTION);
  return match ? [`${label}不得记录“${match[0]}”等维护者对话或裁定过程`] : [];
}

function slugify(value) {
  return value.normalize('NFKC').toLowerCase().trim()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function headingText(line) {
  return line.match(HEADING)?.[3].replace(/[ \t]+#+[ \t]*$/, '').trim() ?? '';
}

export function validateMaterial(document, file = '<material>') {
  const errors = [];
  if (!document || typeof document !== 'object' || Array.isArray(document)) errors.push('根值必须是对象');
  else {
    if (document.version !== 1) errors.push('version 必须为 1');
    if (document.type !== 'material') errors.push('type 必须为 material');
    if (typeof document.title !== 'string') errors.push('title 必须为字符串');
    else errors.push(...maintainerProcessErrors(document.title, 'title '));
    if (!Array.isArray(document.sections)) errors.push('sections 必须为数组');
    else {
      const ids = new Set();
      document.sections.forEach((section, index) => {
        const where = `sections[${index}]`;
        if (!section || typeof section !== 'object' || Array.isArray(section)) {
          errors.push(`${where} 必须为对象`);
          return;
        }
        if (typeof section.id !== 'string' || !section.id.trim()) errors.push(`${where}.id 必须为非空字符串`);
        else if (ids.has(section.id)) errors.push(`${where}.id 重复：${section.id}`);
        else ids.add(section.id);
        if (typeof section.heading !== 'string') errors.push(`${where}.heading 必须为字符串`);
        else errors.push(...maintainerProcessErrors(section.heading, `${where}.heading `));
        if (!Number.isInteger(section.level) || section.level < 0 || section.level > 6) errors.push(`${where}.level 必须为 0 到 6 的整数`);
        if (typeof section.content !== 'string') errors.push(`${where}.content 必须为字符串`);
        else errors.push(...maintainerProcessErrors(section.content, `${where}.content `));
        if (section.heading_line !== undefined) {
          if (typeof section.heading_line !== 'string' || !section.heading_line) errors.push(`${where}.heading_line 必须为非空字符串`);
          else {
            const parsed = section.heading_line.match(HEADING);
            if (!parsed || parsed[2].length !== section.level || headingText(section.heading_line) !== section.heading) errors.push(`${where}.heading_line 必须与 heading/level 一致`);
          }
        }
      });
    }
  }
  return errors.map(error => `${file}：${error}`);
}

export function parseMaterial(markdown, { title = '' } = {}) {
  if (typeof markdown !== 'string') throw new TypeError('Markdown 必须为字符串');
  const lines = markdown.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  const starts = [];
  let fence = null;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const fenceMatch = line.match(FENCE);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = { char: marker[0], length: marker.length };
      else if (marker[0] === fence.char && marker.length >= fence.length && new RegExp(`^ {0,3}${fence.char === '`' ? '`' : '~'}{${fence.length},}[ \\t]*(?:\\r?\\n|$)`).test(line)) fence = null;
      continue;
    }
    if (fence) continue;
    const match = line.match(HEADING);
    if (match) starts.push({ index, level: match[2].length, heading: headingText(lines[index]) });
  }
  const sections = [];
  const usedIds = new Set();
  const chunks = [];
  if (!starts.length) chunks.push({ start: 0, end: lines.length, level: 0, heading: '' });
  else {
    if (starts[0].index > 0) chunks.push({ start: 0, end: starts[0].index, level: 0, heading: '' });
    starts.forEach((header, index) => chunks.push({ start: header.index, end: starts[index + 1]?.index ?? lines.length, ...header }));
  }
  for (const chunk of chunks) {
    const rawHeadingLine = chunk.level ? lines[chunk.start] : '';
    const content = lines.slice(chunk.level ? chunk.start + 1 : chunk.start, chunk.end).join('');
    if (!content && !rawHeadingLine) continue;
    const heading = chunk.heading;
    const level = chunk.level;
    const explicit = content.match(ANCHOR)?.[1];
    const base = explicit || (heading ? slugify(heading) : `section-${sections.length + 1}`);
    let id = base, suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    const section = { id, heading, level, content };
    if (level && rawHeadingLine !== `${'#'.repeat(level)} ${heading}\n`) section.heading_line = rawHeadingLine;
    sections.push(section);
  }
  const firstHeading = sections.find(section => section.level > 0)?.heading;
  return { version: 1, type: 'material', title: title || firstHeading || '', sections };
}

export function projectMaterial(document, file = '<material>') {
  const errors = validateMaterial(document, file);
  if (errors.length) throw new Error(errors.join('\n'));
  return document.sections.map(section => `${section.level ? section.heading_line ?? `${'#'.repeat(section.level)} ${section.heading}\n` : ''}${section.content}`).join('');
}

export function materialText(document) {
  const errors = validateMaterial(document);
  if (errors.length) throw new Error(errors.join('\n'));
  return [document.title, projectMaterial(document)].join('\n');
}

export function materialReferences(document) {
  const errors = validateMaterial(document);
  if (errors.length) throw new Error(errors.join('\n'));
  const text = projectMaterial(document);
  return [...new Set([...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]))];
}

export function materialSection(document, id, file = '<material>') {
  const errors = validateMaterial(document, file);
  if (errors.length) throw new Error(errors.join('\n'));
  const section = document.sections.find(item => item.id === id || [...item.content.matchAll(/<a\s+id=["']([^"']+)["'][^>]*>/gi)].some(match => match[1] === id));
  if (!section) throw new Error(`${file}：找不到 section 或显式锚点 id ${id}`);
  return section;
}

export function sectionMarkdown(section) {
  return `${section.level ? section.heading_line ?? `${'#'.repeat(section.level)} ${section.heading}\n` : ''}${section.content}`;
}

export function materialPath(directory, slug) {
  const json = path.join(directory, `materials-${slug}.json`);
  const markdown = path.join(directory, `materials-${slug}.md`);
  return fs.existsSync(json) ? json : markdown;
}

export function readMaterial(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (path.extname(file).toLowerCase() !== '.json') return content;
  let document;
  try { document = JSON.parse(content); }
  catch (error) { throw new Error(`${file}：JSON 解析失败：${error.message}`); }
  return projectMaterial(document, file);
}

export function serializeMaterial(document, file = '<material>') {
  const errors = validateMaterial(document, file);
  if (errors.length) throw new Error(errors.join('\n'));
  return `${JSON.stringify(document, null, 2)}\n`;
}

function markdownFiles(directory, accept) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(file, accept);
    return entry.isFile() && accept(file) ? [file] : [];
  });
}

function migrationSources(root) {
  const files = [];
  for (const section of ['people', 'battles', 'corps']) {
    files.push(...markdownFiles(path.join(root, 'src', section), file => /^materials-.+\.md$/i.test(path.basename(file))));
  }
  for (const section of ['sources', 'leads', 'corporations/notes']) {
    files.push(...markdownFiles(path.join(root, 'docs', section), file =>
      file.toLowerCase().endsWith('.md') && !/^(readme|agents|claude)\.md$/i.test(path.basename(file))
      && path.basename(file).toLowerCase() !== 'low-credibility-sources.md'));
  }
  return [...new Set(files)].sort((a, b) => a.localeCompare(b));
}

function hash(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function walkJson(directory) {
  return markdownFiles(directory, file => file.toLowerCase().endsWith('.json'));
}

export function checkMaterials(root) {
  const targets = [
    path.join(root, 'src', 'people'), path.join(root, 'src', 'battles'), path.join(root, 'src', 'corps'),
    path.join(root, 'docs', 'sources'), path.join(root, 'docs', 'leads'), path.join(root, 'docs', 'corporations', 'notes'),
  ];
  const errors = [];
  for (const file of migrationSources(root)) errors.push(`${path.relative(root, file)}：叙述材料使用 JSON，请迁移后移除旧 Markdown 材料`);
  let checked = 0;
  for (const directory of targets) {
    for (const file of walkJson(directory)) {
      let document;
      const isMaterialPath = /^materials-.+\.json$/i.test(path.basename(file));
      try { document = JSON.parse(fs.readFileSync(file, 'utf8')); }
      catch (error) {
        errors.push(`${path.relative(root, file)}：JSON 解析失败：${error.message}`);
        continue;
      }
      const inCorporationNotes = file.toLowerCase().includes(`${path.join('docs', 'corporations', 'notes')}${path.sep}`.toLowerCase());
      if (!isMaterialPath && !inCorporationNotes && document?.type !== 'material' && !Object.hasOwn(document ?? {}, 'sections')) continue;
      checked++;
      errors.push(...validateMaterial(document, path.relative(root, file)));
    }
  }
  for (const file of walkJson(path.join(root, 'docs', 'reviews'))) {
    let raw;
    try { raw = fs.readFileSync(file, 'utf8'); }
    catch { continue; }
    errors.push(...maintainerProcessErrors(raw, `${path.relative(root, file)} `));
  }
  return { checked, errors };
}

export function planMaterialMigration(root) {
  const errors = [];
  const entries = migrationSources(root).flatMap(source => {
    const markdown = fs.readFileSync(source, 'utf8');
    const relative = path.relative(root, source).split(path.sep).join('/');
    const target = relative === 'docs/sources/hed-gp-incident-2023.md'
      ? path.join(path.dirname(source), 'hed-gp-incident-2023-material.json')
      : source.replace(/\.md$/i, '.json');
    try {
      const document = parseMaterial(markdown);
      if (!document.title) document.title = path.basename(source, path.extname(source));
      const json = serializeMaterial(document, path.relative(root, target));
      if (projectMaterial(JSON.parse(json), target) !== markdown) throw new Error('素材往返校验不一致');
      return [{ source, target, bytes: Buffer.byteLength(markdown), sha256: hash(markdown), json }];
    } catch (error) {
      errors.push({ source: path.relative(root, source).split(path.sep).join('/'), message: error.message });
      return [];
    }
  });
  const targets = new Set();
  const conflicts = entries.flatMap(entry => {
    const relative = path.relative(root, entry.target).split(path.sep).join('/');
    const duplicate = targets.has(relative);
    targets.add(relative);
    return duplicate || fs.existsSync(entry.target) ? [relative] : [];
  });
  const notes = path.join(root, 'docs', 'corporations', 'notes');
  const corporationsNotes = markdownFiles(notes, file => file.toLowerCase().endsWith('.md') && !/^(readme|agents|claude)\.md$/i.test(path.basename(file))).length;
  return { entries, corporationsNotes, conflicts: [...new Set(conflicts)], errors };
}

function runCli(args, root) {
  const [command, file, sectionId, ...extra] = args;
  if (extra.length) throw new Error('参数过多');
  if (command === 'check' && !file) {
    const result = checkMaterials(root);
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    return `通过：已校验 ${result.checked} 份素材 JSON。`;
  }
  if (command === 'show' && file) {
    const absolute = path.resolve(root, file);
    const document = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    const errors = validateMaterial(document, file);
    if (errors.length) throw new Error(errors.join('\n'));
    if (sectionId === undefined) return readMaterial(absolute);
    const section = materialSection(document, sectionId, file);
    return sectionMarkdown(section);
  }
  if (command === 'migrate' && !file) {
    const { entries, corporationsNotes, conflicts, errors } = planMaterialMigration(root);
    return JSON.stringify({ mode: 'dry-run', count: entries.length, corporationsNotes, conflicts, errors,
      entries: entries.map(({ source, target, bytes, sha256 }) => ({ source: path.relative(root, source).split(path.sep).join('/'), target: path.relative(root, target).split(path.sep).join('/'), bytes, sha256 })) }, null, 2);
  }
  throw new Error('用法：node scripts/material-document.mjs check | show <path> [section-id] | migrate');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(runCli(process.argv.slice(2), path.resolve(import.meta.dirname, '..'))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
