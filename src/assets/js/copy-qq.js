// 军团页招新群号一键复制：带 data-copy 的按钮。无 JS 时群号照常可读，按钮保持隐藏。
// 先在点击当下同步走选区复制：剪贴板接口在部分浏览器里会等权限而迟迟不返回；选区复制不可用时才用它。
const copy = async text => {
  const area = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
  area.style.cssText = 'position:fixed;top:0;opacity:0';
  document.body.append(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  area.remove();
  if (ok) return true;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

for (const button of document.querySelectorAll('button[data-copy]')) {
  const label = button.querySelector('.corp-qq-act');
  button.hidden = false;
  if (label) label.hidden = false;
  let timer;
  button.addEventListener('click', async () => {
    const ok = await copy(button.dataset.copy);
    if (!label) return;
    label.textContent = ok ? '已复制 ✓' : '复制失败';
    button.classList.toggle('is-copied', ok);
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = '复制';
      button.classList.remove('is-copied');
    }, 1600);
  });
}
