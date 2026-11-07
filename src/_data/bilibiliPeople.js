import fs from 'node:fs';
import path from 'node:path';
import { personUpzhu, upzhuText } from '../../scripts/activity.mjs';

// 从 docs/bilibili/*.json 汇总已确认人物的高播 EVE 视频数量，判定是否挂 UP 主标记。
export default function () {
  const dir = path.resolve(import.meta.dirname, '../../docs/bilibili');
  if (!fs.existsSync(dir)) return {};
  const byPerson = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!/^\d+\.json$/.test(file)) continue;
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const slug = data?.identity?.state === 'confirmed' ? data.identity.person : '';
    if (!slug) continue;
    if (!byPerson.has(slug)) byPerson.set(slug, []);
    byPerson.get(slug).push(data);
  }
  const result = {};
  for (const [slug, profiles] of byPerson) {
    const up = personUpzhu(profiles, slug);
    if (up.upzhu) result[slug] = { ...up, label: upzhuText(up) };
  }
  return result;
}
