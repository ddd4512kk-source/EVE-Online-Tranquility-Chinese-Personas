import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const IGNORED = new Set(['.git', 'node_modules', '_site', '.cache']);
const INSTRUCTIONS = new Set(['AGENTS.md', 'CLAUDE.md']);

async function files(directory, relative = '', accept = () => true) {
  let entries;
  try { entries = await readdir(path.join(directory, relative), { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const result = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.posix.join(relative, entry.name);
    if (entry.isDirectory() && !IGNORED.has(entry.name)) result.push(...await files(directory, file, accept));
    else if (entry.isFile() && accept(entry.name)) result.push(file);
  }
  return result;
}

async function pairs(root) {
  const instructions = await files(root, '', name => INSTRUCTIONS.has(name));
  const directories = new Set(['', ...instructions.map(file => path.posix.dirname(file) === '.' ? '' : path.posix.dirname(file))]);
  const result = [...directories].sort().map(dir => [path.posix.join(dir, 'AGENTS.md'), path.posix.join(dir, 'CLAUDE.md')]);
  const [codex, claude] = await Promise.all(['.agents/skills', '.claude/skills'].map(dir => files(path.join(root, dir))));
  for (const file of [...new Set([...codex, ...claude])].sort()) {
    result.push([path.posix.join('.agents/skills', file), path.posix.join('.claude/skills', file)]);
  }
  return result;
}

// 同步只从权威源复制；孤立的 Claude 文件留给检查报错，不静默删除。
export async function syncInstructions(root) {
  const changed = [];
  for (const [source, target] of await pairs(root)) {
    let body;
    try { body = await readFile(path.join(root, source)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    let existing;
    try { existing = await readFile(path.join(root, target)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing?.equals(body)) continue;
    await mkdir(path.dirname(path.join(root, target)), { recursive: true });
    await writeFile(path.join(root, target), body);
    changed.push(target);
  }
  return changed;
}

export async function checkInstructions(root) {
  const errors = [];
  const sizes = new Map();
  for (const [first, second] of await pairs(root)) {
    const buffers = await Promise.all([first, second].map(async file => {
      try { return await readFile(path.join(root, file)); }
      catch (error) { if (error.code === 'ENOENT') { errors.push(`缺少指令副本：${file}`); return null; } throw error; }
    }));
    if (buffers.every(Boolean) && !buffers[0].equals(buffers[1])) errors.push(`指令副本不一致：${first} / ${second}`);
    const body = buffers[0];
    if (!body) continue;
    if (path.posix.basename(first) !== 'AGENTS.md') continue;
    sizes.set(path.posix.dirname(first), body.length);
    const content = body.toString('utf8');
    if (content.trimEnd().split('\n').length > 100) errors.push(`指令超过 100 行，请拆到专题文档：${first}`);
    // 指令中的实际链接必须可定位；代码示例与外部 URL 不作为本地路径。
    const prose = content.replace(/```[^\n]*\n[\s\S]*?```/g, '');
    for (const [, link] of prose.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      if (/^[a-z][a-z0-9+.-]*:|^#|^\/\//i.test(link)) continue;
      const target = link.split('#')[0];
      if (!target) continue;
      try { await access(path.resolve(root, path.posix.dirname(first), target)); }
      catch (error) {
        if (error.code === 'ENOENT') errors.push(`指令引用不存在：${first} -> ${link}`);
        else throw error;
      }
    }
  }
  for (const directory of sizes.keys()) {
    let current = directory, bytes = 0;
    while (true) {
      bytes += sizes.get(current) ?? 0;
      if (current === '.') break;
      current = path.posix.dirname(current);
    }
    if (bytes > 32 * 1024) errors.push(`指令路径超过 32 KiB：${directory}`);
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await import('./runtime.mjs');
    const args = process.argv.slice(2);
    if (args.length > 1 || args.length === 1 && args[0] !== '--sync') throw new Error('用法：node scripts/check-instructions.mjs [--sync]');
    const root = fileURLToPath(new URL('../', import.meta.url));
    if (args[0] === '--sync') console.log(`已同步 ${JSON.stringify(await syncInstructions(root))}`);
    const errors = await checkInstructions(root);
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('分层指令、技能副本与本地引用通过。');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
