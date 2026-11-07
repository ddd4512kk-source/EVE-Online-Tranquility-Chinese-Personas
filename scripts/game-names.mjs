// 游戏内专名校验核心：正文里的舰船、建筑、星系、星域英文名须写中文。
const NAME_PART = /[A-Za-z]*[a-z][A-Za-z]*$/;
const NAME_PART_AFTER = /^[A-Za-z]*[a-z]/;
const JOINER = "[ \\-·_.'’&]";

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 待查词表：术语表的舰船、建筑加星系、星域全表；英文原词 → 中文，同名的（如 Curse）两个中文都给。 */
export function gameNames(entries, systems, regions = {}) {
  const names = { ...regions, ...systems };
  for (const { term, meaning, kind } of entries) {
    if (!['ship', 'structure'].includes(kind) || !/^[A-Za-z]/.test(term)) continue;
    names[term] = names[term] && names[term] !== meaning ? `${meaning}／${names[term]}` : meaning;
  }
  return names;
}

/** 遮住不归本规则管的原文：链接地址、代码、引号、书名号；保持字符位置不变。 */
export function maskQuoted(line) {
  const blank = match => ' '.repeat(match.length);
  return line
    .replace(/\]\([^)]*\)/g, blank)
    .replace(/https?:\/\/\S+/g, blank)
    .replace(/`[^`]*`/g, blank)
    .replace(/“[^”]*”|‘[^’]*’|「[^」]*」|《[^》]*》/g, blank);
}

export function namePattern(names) {
  const alternatives = Object.keys(names).sort((a, b) => b.length - a.length).map(escapeRegExp).join('|');
  return new RegExp(`(?<![A-Za-z0-9_\\-])(?:${alternatives})(?![A-Za-z0-9_\\-])`, 'g');
}

/** 紧邻含小写字母的英文词时，这个词是多词专名的一部分（如军团名、角色名）；全大写缩写和数字不算。 */
function isPartOfLongerName(text, start, end) {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const joinedBefore = new RegExp(`${JOINER}$`).test(before) && NAME_PART.test(before.slice(0, -1));
  const joinedAfter = new RegExp(`^${JOINER}`).test(after) && NAME_PART_AFTER.test(after.slice(1));
  return joinedBefore || joinedAfter;
}

/** 列出正文里写成英文的专名；front matter 和引用块是原文，不查。 */
export function findEnglishNames(text, names, pattern = namePattern(names)) {
  const found = [];
  const lines = text.split(/\r?\n/);
  let inFrontMatter = lines[0] === '---';
  lines.forEach((line, index) => {
    if (inFrontMatter) {
      if (index > 0 && line === '---') inFrontMatter = false;
      return;
    }
    if (line.startsWith('>')) return;
    const masked = maskQuoted(line);
    for (const match of masked.matchAll(pattern)) {
      if (isPartOfLongerName(masked, match.index, match.index + match[0].length)) continue;
      found.push({ line: index + 1, term: match[0], zh: names[match[0]] });
    }
  });
  return found;
}

/** 例外只按文件登记，放过某文件的某词；文件里已没有这个词时算失效。 */
export function applyExceptions(file, found, exceptions = {}) {
  const local = exceptions.files?.[file] ?? {};
  const kept = found.filter(item => !(item.term in local));
  const stale = Object.keys(local).filter(term => !found.some(item => item.term === term));
  return { kept, stale };
}

/** 每条例外都要写明原因。 */
export function validateExceptions(exceptions) {
  const errors = [];
  for (const [file, terms] of Object.entries(exceptions.files ?? {})) {
    for (const [term, reason] of Object.entries(terms)) {
      if (typeof reason !== 'string' || !reason.trim()) errors.push(`docs/game-name-exceptions.json：${file} 的 ${term} 缺原因`);
    }
  }
  return errors;
}
