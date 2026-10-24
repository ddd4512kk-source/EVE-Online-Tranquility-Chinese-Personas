// 小号过多时只显示两行，其余折叠；无 JS 时全部可读。
(() => {
  const wrap = document.querySelector(".bio-alts-wrap");
  if (!wrap) return;
  const list = wrap.querySelector(".bio-alts");
  const button = wrap.querySelector("button");
  let open = false;
  function layout() {
    button.hidden = true;
    wrap.classList.add("is-collapsed");
    const overflow = list.scrollHeight > list.clientHeight + 2;
    button.hidden = !overflow;
    wrap.classList.toggle("is-collapsed", overflow && !open);
    button.textContent = open ? "收起 ▴" : "展开 ▾";
    button.setAttribute("aria-expanded", String(open && overflow));
    for (const a of list.querySelectorAll("a")) {
      a.inert = overflow && !open && a.offsetTop >= list.clientHeight;
    }
  }
  button.addEventListener("click", () => {
    open = !open;
    layout();
  });
  new ResizeObserver(layout).observe(wrap);
  layout();
})();
