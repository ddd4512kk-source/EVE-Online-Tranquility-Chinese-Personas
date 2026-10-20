// 返回洗牌后的副本，保留目录原始顺序，供切回时间排序使用。
export function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 两个目录共用：默认一行，溢出才显示开关；初始化前先恢复已选标签。
export function initTagCollapse(wrap) {
  const bar = wrap?.querySelector(".tag-bar");
  const button = wrap?.querySelector(".tag-more");
  if (!bar || !button) return;
  let open = false;

  function layout() {
    wrap.classList.add("is-collapsed");
    const overflow = bar.scrollHeight > bar.clientHeight + 2;
    wrap.classList.toggle("is-collapsed", overflow && !open);
    button.hidden = !overflow && !open;
    button.textContent = open ? "收起 ▴" : "展开 ▾";
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", () => {
    open = !open;
    layout();
  });
  addEventListener("resize", layout);
  layout();

  // URL 中选中的标签位于折叠行之外时，让它保持可见。
  const active = bar.querySelector(".chip.is-active");
  if (active && wrap.classList.contains("is-collapsed") && active.offsetTop - bar.offsetTop >= bar.clientHeight) {
    open = true;
    layout();
  }
}
