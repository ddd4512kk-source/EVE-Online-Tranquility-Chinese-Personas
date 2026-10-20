import { initTagCollapse, shuffled } from "./directory-utils.js";

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
    setMode("shuffle");
    place(shuffled(rows));
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

  const t = new URLSearchParams(location.search).get("t");
  if (t && [...(tagBar?.children ?? [])].some((b) => b.dataset.tag === t)) setTag(t);
  initTagCollapse(document.querySelector(".tag-wrap"));

})();
