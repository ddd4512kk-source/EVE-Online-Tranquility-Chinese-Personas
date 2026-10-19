// 战役目录：时间（新↔旧）、损失、随机排序 + 标签单选筛选（同步 ?t=）。无 JS 时按时间倒序照常可读。
(() => {
  const list = document.getElementById("battle-rows");
  if (!list) return;
  const rows = [...list.children]; // 构建时已按开打日期倒序
  const orderBtn = document.getElementById("b-order");
  const lossBtn = document.getElementById("b-loss");
  const shuffleBtn = document.getElementById("shuffle");
  const tagBar = document.querySelector(".tag-bar");
  const status = document.getElementById("filter-status");
  let mode = "date";
  let newestFirst = true;
  let activeTag = "";

  function setMode(m) {
    mode = m;
    for (const [btn, on] of [[orderBtn, m === "date"], [lossBtn, m === "loss"], [shuffleBtn, m === "shuffle"]]) {
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", String(on));
    }
  }
  const place = (items) => items.forEach((r) => list.appendChild(r));

  orderBtn.addEventListener("click", () => {
    if (mode === "date") newestFirst = !newestFirst;
    setMode("date");
    orderBtn.textContent = newestFirst ? "时间 ↓" : "时间 ↑";
    place(newestFirst ? rows : [...rows].reverse());
  });
  lossBtn.addEventListener("click", () => {
    setMode("loss");
    place([...rows].sort((a, b) => b.dataset.loss - a.dataset.loss));
  });
  shuffleBtn.addEventListener("click", () => {
    const items = [...rows];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setMode("shuffle");
    place(items);
  });

  function setTag(tag) {
    activeTag = tag;
    for (const b of tagBar?.children ?? []) {
      const on = b.dataset.tag === tag;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    }
    let shown = 0;
    for (const r of rows) {
      r.hidden = !!tag && !r.dataset.tags.includes(`|${tag}|`);
      if (!r.hidden) shown++;
    }
    status.hidden = !tag;
    status.textContent = `标签「${tag}」共 ${shown} 场。`;
    const u = new URL(location.href);
    if (tag) u.searchParams.set("t", tag);
    else u.searchParams.delete("t");
    history.replaceState(history.state, "", u);
  }
  tagBar?.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) setTag(b.dataset.tag === activeTag ? "" : b.dataset.tag);
  });

  // 标签栏沿用列传目录：默认一行，展开后显示全部。
  const tagWrap = document.querySelector(".tag-wrap");
  const tagMore = document.querySelector(".tag-more");
  let tagsOpen = false;
  function layoutTags() {
    if (!tagWrap || !tagMore) return;
    tagWrap.classList.add("is-collapsed");
    const overflow = tagBar.scrollHeight > tagBar.clientHeight + 2;
    tagWrap.classList.toggle("is-collapsed", overflow && !tagsOpen);
    tagMore.hidden = !overflow && !tagsOpen;
    tagMore.textContent = tagsOpen ? "收起 ▴" : "展开 ▾";
    tagMore.setAttribute("aria-expanded", String(tagsOpen));
  }
  tagMore?.addEventListener("click", () => {
    tagsOpen = !tagsOpen;
    layoutTags();
  });
  addEventListener("resize", layoutTags);

  const t = new URLSearchParams(location.search).get("t");
  if (t && [...(tagBar?.children ?? [])].some((b) => b.dataset.tag === t)) setTag(t);
  layoutTags();
  const act = tagBar?.querySelector(".chip.is-active");
  if (act && tagWrap?.classList.contains("is-collapsed") && act.offsetTop - tagBar.offsetTop > tagBar.clientHeight) {
    tagsOpen = true;
    layoutTags();
  }
})();
