import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseMaterial, planMaterialMigration, projectMaterial, serializeMaterial, validateMaterial } from './material-document.mjs';

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.mjs', '.js', '.njk', '.html', '.yml', '.yaml', '.txt']);
const SKIP_DIRECTORIES = new Set(['.git', '.cache', 'node_modules', '_site', 'tests', 'test']);
const hash = content => crypto.createHash('sha256').update(content).digest('hex');

function normalized(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function eligibleTextFiles(root, directory = root) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const file = path.join(directory, entry.name);
    const relative = normalized(root, file);
    if (entry.isDirectory()) return SKIP_DIRECTORIES.has(entry.name.toLowerCase()) || relative === 'docs/reviews'
      ? [] : eligibleTextFiles(root, file);
    if (!entry.isFile() || !TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) || entry.name.includes('.test.')) return [];
    if (relative === 'docs/corporations/origins.json' || relative.startsWith('docs/reviews/')
      || ['scripts/material-document.mjs', 'scripts/migrate-materials.mjs'].includes(relative)) return [];
    return [file];
  });
}

function replaceReferences(content, file, entries, root) {
  let updated = content;
  let count = 0;
  const currentDirectory = path.dirname(normalized(root, file));
  for (const entry of entries) {
    const source = entry.source;
    const target = entry.target;
    const relativeSource = path.relative(currentDirectory, source).split(path.sep).join('/');
    const relativeTarget = path.relative(currentDirectory, target).split(path.sep).join('/');
    const forms = [[source, target], [source.replaceAll('/', '\\'), target.replaceAll('/', '\\')], [relativeSource, relativeTarget]];
    if (path.dirname(source) === currentDirectory) {
      forms.push([path.basename(source), path.basename(target)]);
    }
    for (const [from, to] of forms) {
      if (!from || from === to) continue;
      const before = updated;
      updated = updated.split(from).join(to);
      if (updated !== before) count++;
    }
  }
  return { content: updated, count };
}

function referencePlan(root, entries) {
  const migrated = new Set(entries.map(entry => normalized(root, entry.source)));
  const references = [];
  for (const file of eligibleTextFiles(root)) {
    const relative = normalized(root, file);
    if (migrated.has(relative)) continue;
    const original = fs.readFileSync(file, 'utf8');
    const result = replaceReferences(original, file, entries.map(entry => ({
      source: normalized(root, entry.source), target: normalized(root, entry.target),
    })), root);
    if (result.content !== original) references.push({ file, path: relative, original, updated: result.content, count: result.count });
  }
  return references;
}

function updatedEntryJson(root, entry, entries) {
  const originalMarkdown = fs.readFileSync(entry.source, 'utf8');
  const originalDocument = parseMaterial(originalMarkdown);
  const mapping = entries.map(item => ({ source: normalized(root, item.source), target: normalized(root, item.target) }));
  const rewritten = replaceReferences(originalMarkdown, entry.source, mapping, root).content;
  const document = parseMaterial(rewritten);
  if (document.sections.length !== originalDocument.sections.length
    || document.sections.some((section, index) => section.level !== originalDocument.sections[index].level)) {
    throw new Error(`${entry.source}：引用改写改变了素材分节结构`);
  }
  document.title = originalDocument.title || path.basename(entry.source, path.extname(entry.source));
  document.sections.forEach((section, index) => { section.id = originalDocument.sections[index].id; });
  const json = serializeMaterial(document, normalized(root, entry.target));
  const parsed = JSON.parse(json);
  const errors = validateMaterial(parsed, normalized(root, entry.target));
  if (errors.length) throw new Error(errors.join('\n'));
  if (projectMaterial(parsed, entry.target) !== rewritten) throw new Error(`${entry.source}：引用改写后往返校验不一致`);
  return json;
}

function uniqueBackupDirectory(root) {
  const base = path.join(root, '.cache', 'material-migration-backups');
  const stem = new Date().toISOString().replace(/[:.]/g, '-');
  let directory = path.join(base, stem), suffix = 2;
  while (fs.existsSync(directory)) directory = path.join(base, `${stem}-${suffix++}`);
  return directory;
}

function copyToBackup(root, backup, file) {
  const destination = path.join(backup, normalized(root, file));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination);
}

export async function applyMigration(root, plan, manifestPath, expectedReferences) {
  if (plan.errors.length) throw new Error(`往返校验失败 ${plan.errors.length} 项；未写入或删除文件`);
  if (plan.conflicts.length) throw new Error(`目标路径冲突 ${plan.conflicts.length} 项；未写入或删除文件：${plan.conflicts.join(', ')}`);
  for (const entry of plan.entries) {
    const current = fs.readFileSync(entry.source, 'utf8');
    if (hash(current) !== entry.sha256) throw new Error(`${entry.source}：dry-run 后源素材发生变化，拒绝迁移`);
    if (fs.existsSync(entry.target)) throw new Error(`${entry.target}：目标已存在，拒绝覆盖`);
  }
  const references = expectedReferences ?? referencePlan(root, plan.entries);
  for (const reference of references) {
    if (hash(fs.readFileSync(reference.file, 'utf8')) !== hash(reference.original)) {
      throw new Error(`${reference.path}：dry-run 后引用文件发生变化，拒绝迁移`);
    }
  }
  const backup = uniqueBackupDirectory(root);
  fs.mkdirSync(backup, { recursive: true });
  const filesToBackup = [...plan.entries.map(entry => entry.source), ...references.map(reference => reference.file)];
  for (const file of filesToBackup) copyToBackup(root, backup, file);
  if (manifestPath && fs.existsSync(manifestPath)) copyToBackup(root, backup, manifestPath);
  const created = [];
  try {
    for (const entry of plan.entries) {
      fs.mkdirSync(path.dirname(entry.target), { recursive: true });
      fs.writeFileSync(entry.target, updatedEntryJson(root, entry, plan.entries), { encoding: 'utf8', flag: 'wx' });
      created.push(entry.target);
    }
    for (const reference of references) fs.writeFileSync(reference.file, reference.updated, 'utf8');
    for (const entry of plan.entries) fs.unlinkSync(entry.source);
  } catch (error) {
    for (const file of filesToBackup) {
      const backupFile = path.join(backup, normalized(root, file));
      if (fs.existsSync(backupFile)) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.copyFileSync(backupFile, file);
      }
    }
    for (const file of created) if (fs.existsSync(file)) fs.unlinkSync(file);
    throw new Error(`迁移失败，已从备份恢复原文件（${normalized(root, backup)}）：${error.message}`);
  }
  return { backup: normalized(root, backup), created: created.length, updatedFiles: references.length, updatedReferences: references.reduce((sum, item) => sum + item.count, 0), removed: plan.entries.length };
}

export function run(root, args = []) {
  if (args.length && !(args.length === 1 && ['--dry-run', '--apply'].includes(args[0]))) {
    throw new Error('用法：node scripts/migrate-materials.mjs [--dry-run | --apply]');
  }
  const plan = planMaterialMigration(root);
  const references = referencePlan(root, plan.entries);
  const entries = plan.entries.map(entry => ({
    source: normalized(root, entry.source), target: normalized(root, entry.target), bytes: entry.bytes, sha256: entry.sha256,
  }));
  const result = {
    mode: args[0] === '--apply' ? 'apply' : 'dry-run',
    count: plan.entries.length,
    corporationsNotes: plan.corporationsNotes,
    conflicts: plan.conflicts,
    errors: plan.errors,
    references: references.map(({ path: file, count }) => ({ file, replacements: count })),
    referenceFileCount: references.length,
    referenceReplacementCount: references.reduce((sum, item) => sum + item.count, 0),
    entries,
  };
  Object.defineProperties(result, {
    plan: { value: plan },
    referenceUpdates: { value: references },
  });
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(import.meta.dirname, '..');
    const result = run(root, process.argv.slice(2));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const manifest = path.join(root, '.cache', `material-migration-${timestamp}.json`);
    fs.mkdirSync(path.dirname(manifest), { recursive: true });
    fs.writeFileSync(manifest, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    let applied = null;
    if (result.mode === 'apply') applied = await applyMigration(root, result.plan, manifest, result.referenceUpdates);
    console.log(JSON.stringify({ mode: result.mode, count: result.count, corporationsNotes: result.corporationsNotes,
      conflictCount: result.conflicts.length, roundtripFailureCount: result.errors.length,
      referenceFileCount: result.referenceFileCount, referenceReplacementCount: result.referenceReplacementCount,
      manifest: normalized(root, manifest), ...(applied ? { applied } : {}) }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
