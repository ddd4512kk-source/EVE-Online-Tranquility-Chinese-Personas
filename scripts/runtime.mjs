// 在路径解析、读取缓存和联网之前给出可操作的环境错误。
export function runtimeProblem(version = process.versions.node) {
  const [major, minor] = version.replace(/^v/, '').split('.').map(Number);
  return major > 21 || major === 21 && minor >= 2 || major === 20 && minor >= 11
    ? null
    : `当前 Node ${version}；本仓库需要 Node 20.11+（21.x 需 21.2+；.nvmrc 与 CI 使用 22）。代理应先选择已安装的兼容 Node，并在后续命令中沿用其 PATH；不要绕过画像工具或重复运行失败命令。`;
}

const problem = runtimeProblem();
if (problem) {
  console.error(problem);
  process.exit(1);
}
