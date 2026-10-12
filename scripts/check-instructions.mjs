import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

async function skills(directory, relative = '') {
  let entries;
  try { entries = await readdir(path.join(directory, relative), { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const entry of entries) {
    const file = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await skills(directory, file));
    else if (entry.name === 'SKILL.md') files.push(file);
  }
  return files;
}

export async function checkInstructions(root) {
  const errors = [];
  async function compare(first, second) {
    const buffers = await Promise.all([first, second].map(async file => {
      try { return await readFile(path.join(root, file)); }
      catch (error) { if (error.code === 'ENOENT') { errors.push(`缺少指令副本：${file}`); return null; } throw error; }
    }));
    if (buffers.every(Boolean) && !buffers[0].equals(buffers[1])) errors.push(`指令副本不一致：${first} / ${second}`);
  }
  await compare('AGENTS.md', 'CLAUDE.md');
  const [codex, claude] = await Promise.all(['.agents/skills', '.claude/skills'].map(dir => skills(path.join(root, dir))));
  for (const file of new Set([...codex, ...claude])) await compare(path.join('.agents/skills', file), path.join('.claude/skills', file));
  return errors;
}
