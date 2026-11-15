import fs from 'node:fs';
import path from 'node:path';
import { upzhuText } from '../../scripts/activity.mjs';

// UP 主标记读公开派生文件 bilibili-public.json（由 scripts/bilibili-public.mjs 从私有 B站档案生成）。
export default function () {
  const file = path.resolve(import.meta.dirname, 'bilibili-public.json');
  if (!fs.existsSync(file)) return {};
  const result = {};
  for (const [slug, entry] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) {
    if (!entry.upzhu) continue;
    const up = { upzhu: true, count: entry.upzhu };
    result[slug] = { ...up, label: upzhuText(up) };
  }
  return result;
}
