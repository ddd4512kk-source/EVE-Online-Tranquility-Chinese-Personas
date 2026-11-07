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
