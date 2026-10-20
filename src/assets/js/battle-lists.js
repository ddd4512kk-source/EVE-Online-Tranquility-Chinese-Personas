// 战役各方名单：超过一行才显示开关，各名单独立展开，窄屏变化时重新测量。
(() => {
  for (const wrap of document.querySelectorAll(".battle-list-wrap")) {
    const list = wrap.querySelector(".battle-list");
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
      // 裁切区域里的链接也退出键盘焦点序列，展开后恢复。
      for (const item of list.children) {
        item.inert = overflow && !open && item.offsetTop - list.firstElementChild.offsetTop >= list.clientHeight;
      }
    }
    button.addEventListener("click", () => {
      open = !open;
      layout();
    });
    new ResizeObserver(layout).observe(wrap);
    layout();
  }
})();
