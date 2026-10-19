// 内容板块：页眉导航按此顺序列出。新增板块 = 在这里加一项 + 建 src/<目录>/ 与对应集合。
// collection：eleventy.config.js 里的集合名；集合为空时不进导航（板块搭好、还没写内容时不露空页）。
export default [
  { name: "列传", url: "/", collection: "people" },
  { name: "战役", url: "/battles/", collection: "battles" },
];
