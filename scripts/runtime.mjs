// 在路径解析、读取缓存和联网之前给出可操作的环境错误。
export function runtimeProblem(version = process.versions.node) {
  const [major, minor] = version.replace(/^v/, '').split('.').map(Number);
  return major >= 24 || major === 22 && minor >= 13 || major === 20 && minor >= 19
    ? null
    : `当前 Node ${version}；本仓库需要 Node 20.19+、22.13+ 或 24+（不支持 21.x、23.x；.nvmrc 与 CI 使用 22）。代理应先选择已安装的兼容 Node，并在后续命令中沿用其 PATH；不要绕过画像工具或重复运行失败命令。`;
}

const problem = runtimeProblem();
if (problem) {
  console.error(problem);
  process.exit(1);
}
