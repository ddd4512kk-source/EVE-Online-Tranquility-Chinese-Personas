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
