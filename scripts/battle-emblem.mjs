import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const EMBLEM_DIR = path.resolve(import.meta.dirname, '../src/assets/emblems');

// 视频封面裁成的战役头图；与组织图标同目录，共用缓存。
export const coverSrc = slug => `/assets/emblems/cover-${slug}.webp`;

// 从封面正中取最大的 16:9 区域。
export function coverCrop(width, height) {
  const cropWidth = Math.min(width, Math.round(height * 16 / 9));
  const cropHeight = Math.min(height, Math.round(cropWidth * 9 / 16));
  return { left: Math.round((width - cropWidth) / 2), top: Math.round((height - cropHeight) / 2), width: cropWidth, height: cropHeight };
}

// 对阵战徽只取已点名的主要组织，不用当前归属推断历史参战。
export function emblemSides(sides) {
  return sides.filter((s) => s.name !== "第三方").slice(0, 4).map((s) => ({
    name: s.name,
    initials: [...s.name].slice(0, 2).join(""),
    logos: (s.emblemOrganization ? [s.emblemOrganization] : []).map((o) => ({
      ...o,
      src: `/assets/emblems/${o.kind}-${o.id}.png`,
    })),
  }));
}

// 联盟没上传徽标时 EVE 给的默认图（金色五角星）的 MD5，这类不当卡片底图。
const DEFAULT_ALLIANCE_LOGO = 'ba1d1c8d4b383b6fff6355687c5b0733';
const backdrops = new Map();

// 军团、人物卡片的联盟底图：徽标已缓存且不是默认图时给出路径，否则 null（无联盟、未取到或默认图都不显示）。
export function allianceBackdrop(id, dir = EMBLEM_DIR) {
  if (!id) return null;
  const file = path.join(dir, `alliance-${id}.png`);
  if (!backdrops.has(file)) {
    let custom = false;
    try {
      custom = createHash('md5').update(readFileSync(file)).digest('hex') !== DEFAULT_ALLIANCE_LOGO;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    backdrops.set(file, custom ? `/assets/emblems/alliance-${id}.png` : null);
  }
  return backdrops.get(file);
}
