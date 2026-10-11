// 首页名录：即时筛选 + 创号正序/倒序、最近更新、随机排序。无 JS 时页面照常可读。
// 目录是一整块连续网格；每年第一张“可见”卡片挂年份签，筛选或换序后重新计算。
// 筛选 = 文字筛选 ∧ 标签筛选（标签栏单选，再点一次取消）。
(() => {
  const roster = document.getElementById("roster");
  const input = document.getElementById("filter");
  const orderBtn = document.getElementById("order");
  const shuffleBtn = document.getElementById("shuffle");
  const recentBtn = document.getElementById("recent");
  const status = document.getElementById("filter-status");
  const tagBar = document.querySelector(".tag-bar");
  let activeTag = "";
  if (!roster) return;

  const cards = [...roster.querySelectorAll(".card")];

  // 给每年第一张可见卡片加 year-start
  function markYears() {
    let prev = null;
    for (const c of roster.children) {
      c.classList.remove("year-start");
      if (c.hidden || mode !== "birth") continue;
      const y = c.dataset.year;
      if (y !== prev) {
        c.classList.add("year-start");
        prev = y;
      }
    }
  }

  function applyFilter() {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const c of cards) {
      const ok =
        terms.every((t) => c.dataset.key.includes(t)) &&
        (!activeTag || c.dataset.tags.includes(`|${activeTag}|`));
      c.hidden = !ok;
      if (ok) shown++;
    }
    markYears();
    status.hidden = terms.length === 0 && !activeTag;
    status.textContent = shown
      ? `${activeTag ? `标签「${activeTag}」` : ""}找到 ${shown} 人。`
      : "名录里没有匹配的人。试试全文搜索？";
    // 让“全文搜索”带上当前关键词
    const full = document.querySelector(".toolbar-full");
    if (full) {
      const u = new URL(full.href, location.href);
      if (input.value.trim()) u.searchParams.set("q", input.value.trim());
      else u.searchParams.delete("q");
      full.href = u.toString();
    }
  }

  // 排序：cards 保持构建时的创号升序，按当前模式重排 DOM
  // mode：birth（创号时间）| recent（最近更新在前）| shuffle；只有 birth 挂年份签
  let descending = false;
  let mode = "birth";
  function placeCards(list) {
    for (const c of list) roster.appendChild(c);
    markYears();
  }

  function toggleOrder() {
    // 其他模式下点创号按钮：回到按创号排序，方向不变
    if (mode !== "birth") setMode("birth");
    else descending = !descending;
    orderBtn.setAttribute("aria-pressed", String(descending));
    orderBtn.textContent = descending ? "创号 ↓" : "创号 ↑";
    placeCards(descending ? [...cards].reverse() : cards);
  }

  // 最近更新的在前；同一次提交更新的保持创号顺序
  function sortRecent() {
    setMode("recent");
    placeCards([...cards].sort((a, b) => Date.parse(b.dataset.updated) - Date.parse(a.dataset.updated)));
  }

  // 每点一次重新洗牌
  function shuffle() {
    const list = [...cards];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setMode("shuffle");
    placeCards(list);
  }

  function setMode(m) {
    mode = m;
    roster.classList.toggle("is-shuffled", m !== "birth");
    shuffleBtn.classList.toggle("is-active", m === "shuffle");
    shuffleBtn.setAttribute("aria-pressed", String(m === "shuffle"));
    recentBtn?.classList.toggle("is-active", m === "recent");
    recentBtn?.setAttribute("aria-pressed", String(m === "recent"));
    orderBtn.classList.toggle("is-dimmed", m !== "birth");
  }

  function setTag(tag) {
    activeTag = tag;
    for (const b of tagBar?.children ?? []) {
      const on = b.dataset.tag === tag;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    }
  }

  // 筛选词（?f=）与标签（?t=）写进网址，从列传页返回或分享链接时能还原
  function syncUrl() {
    const u = new URL(location.href);
    const v = input.value.trim();
    if (v) u.searchParams.set("f", v);
    else u.searchParams.delete("f");
    if (activeTag) u.searchParams.set("t", activeTag);
    else u.searchParams.delete("t");
    history.replaceState(history.state, "", u);
  }

  input.addEventListener("input", () => {
    applyFilter();
    syncUrl();
  });
  orderBtn.addEventListener("click", toggleOrder);
  shuffleBtn.addEventListener("click", shuffle);
  recentBtn?.addEventListener("click", sortRecent);
  tagBar?.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    setTag(b.dataset.tag === activeTag ? "" : b.dataset.tag);
    applyFilter();
    syncUrl();
  });

  // 标签栏折叠：默认只露一行；放得下就不显示“展开”
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

  const params = new URLSearchParams(location.search);
  if (params.get("f")) input.value = params.get("f");
  const t = params.get("t");
  if (t && [...(tagBar?.children ?? [])].some((b) => b.dataset.tag === t)) setTag(t);
  // 网址带的标签若在折叠行之外，自动展开让人看到
  layoutTags();
  const act = tagBar?.querySelector(".chip.is-active");
  if (act && tagWrap?.classList.contains("is-collapsed") && act.offsetTop - tagBar.offsetTop > tagBar.clientHeight) {
    tagsOpen = true;
    layoutTags();
  }
  if (input.value || activeTag) applyFilter();
})();
