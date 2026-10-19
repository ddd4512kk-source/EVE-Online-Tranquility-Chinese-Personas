// 正文 ::: 块校验：列传与战役共用。块必须成对、不能嵌套、只用已知类型。
export const BLOCK_KINDS = ["红料", "黑料", "评"];

export function validateBlocks(body, lineOffset = 0) {
  const errs = [];
  let depth = 0;
  body.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(/^:::\s*(\S.*)?$/);
    if (!m) return;
    if (m[1]) {
      const kind = m[1].split(/\s+/)[0];
      if (!BLOCK_KINDS.includes(kind)) errs.push(`第 ${i + 1 + lineOffset} 行：未知块类型 "::: ${kind}"（只能是 ${BLOCK_KINDS.join(" / ")}）`);
      if (depth > 0) errs.push(`第 ${i + 1 + lineOffset} 行：上一个 ::: 块还没有用单独一行 ::: 关闭`);
      depth++;
    } else if (depth === 0) {
      errs.push(`第 ${i + 1 + lineOffset} 行：多余的 ::: 关闭行`);
    } else {
      depth--;
    }
  });
  if (depth > 0) errs.push("有 ::: 块没有关闭（每个块结尾需要单独一行 :::）");
  return errs;
}

// gray-matter 解析结果对应的正文起始行偏移，报错行号按整个文件计
export const bodyLineOffset = (raw, content) => raw.slice(0, raw.length - content.length).split("\n").length - 1;
