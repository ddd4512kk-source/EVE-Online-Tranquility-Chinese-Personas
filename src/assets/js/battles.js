import { initTagCollapse, shuffled } from './directory-utils.js';

// 战役目录：文字检索（?f=）∧ 标签单选（?t=）+ 时间（新↔旧）、损失、随机排序。
// 时间排序下保留年份分章头，并动态把被夹成单数结尾的非史诗卡片撑满整行，杜绝半行空白。
(() => {
  const list = document.getElementById('battle-rows');
  if (!list) return;
  const rows = [...list.querySelectorAll('.battle-row')];
  const yearHeads = new Map([...list.querySelectorAll('.battle-year')].map(h => [h.dataset.year, h]));
  const searchInput = document.getElementById('b-search');
  const orderBtn = document.getElementById('b-order');
  const lossBtn = document.getElementById('b-loss');
  const shuffleBtn = document.getElementById('shuffle');
  const filterBtn = document.getElementById('b-filter');
  const drawer = document.getElementById('battle-filters');
  const status = document.getElementById('filter-status');
  const fullLink = document.querySelector('.toolbar-full');
  const tagButtons = [...document.querySelectorAll('[data-tag]')];
  const quickTags = new Set([...document.querySelectorAll('.battle-quick-bar [data-tag]')].map(b => b.dataset.tag));

  let mode = 'date';
  let newestFirst = true;
  let activeTag = '';
  let drawerInit = false;

  function setMode(nextMode) {
    mode = nextMode;
    for (const [btn, on] of [[orderBtn, mode === 'date'], [lossBtn, mode === 'loss']]) {
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    }
  }

  function syncFilterBtn() {
    const hasDrawerTag = activeTag && !quickTags.has(activeTag);
    filterBtn.textContent = `${hasDrawerTag ? `筛选：${activeTag}` : '更多筛选'} ${drawer.hidden ? '▾' : '▴'}`;
    filterBtn.classList.toggle('is-active', Boolean(hasDrawerTag));
    filterBtn.setAttribute('aria-expanded', String(!drawer.hidden));
  }

  function syncGridBalance() {
    const yearCounts = new Map();
    for (const r of rows) {
      if (!r.hidden) yearCounts.set(r.dataset.year, (yearCounts.get(r.dataset.year) ?? 0) + 1);
    }
    for (const [year, head] of yearHeads) {
      const count = yearCounts.get(year) ?? 0;
      head.hidden = mode !== 'date' || count === 0;
      const badge = head.querySelector('small');
      if (badge) badge.textContent = `${count} 场`;
    }

    let run = [];
    const flushRun = () => {
      if (run.length % 2 === 1) run[run.length - 1].classList.add('is-solo');
      run = [];
    };
    for (const el of list.children) {
      if (el.hidden) continue;
      if (el.classList.contains('battle-year') || el.classList.contains('battle-row-epic')) {
        flushRun();
      } else if (el.classList.contains('battle-row')) {
        el.classList.remove('is-solo');
        run.push(el);
      }
    }
    flushRun();
  }

  function place(items) {
    const frag = document.createDocumentFragment();
    if (mode === 'date') {
      const seenYears = new Set();
      for (const r of items) {
        if (!seenYears.has(r.dataset.year)) {
          seenYears.add(r.dataset.year);
          const head = yearHeads.get(r.dataset.year);
          if (head) frag.appendChild(head);
        }
        frag.appendChild(r);
      }
    } else {
      for (const head of yearHeads.values()) {
        head.hidden = true;
        frag.appendChild(head);
      }
      for (const r of items) frag.appendChild(r);
    }
    list.appendChild(frag);
    syncGridBalance();
  }

  function applyFilter() {
    const text = searchInput.value.trim();
    const terms = text.toLowerCase().split(/\s+/).filter(Boolean);

    for (const b of tagButtons) {
      const on = b.dataset.tag === activeTag;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    }
    syncFilterBtn();

    let shown = 0;
    for (const r of rows) {
      r.hidden = !((!activeTag || r.dataset.tags.includes(`|${activeTag}|`))
        && terms.every(t => r.dataset.key.includes(t)));
      if (!r.hidden) shown++;
    }
    syncGridBalance();

    if (activeTag || terms.length) {
      status.hidden = false;
      const parts = [];
      if (activeTag) parts.push(`标签「${activeTag}」`);
      if (text) parts.push(`检索“${text}”`);
      status.textContent = shown ? `${parts.join(' · ')}：共 ${shown} 场。` : '目录里没有匹配的战役。试试全文搜索？';
    } else {
      status.hidden = true;
    }

    if (fullLink) {
      const fu = new URL(fullLink.href, location.href);
      if (text) fu.searchParams.set('q', text);
      else fu.searchParams.delete('q');
      fullLink.href = fu.toString();
    }

    const u = new URL(location.href);
    if (activeTag) u.searchParams.set('t', activeTag);
    else u.searchParams.delete('t');
    if (text) u.searchParams.set('f', text);
    else u.searchParams.delete('f');
    history.replaceState(history.state, '', u);
  }

  orderBtn.addEventListener('click', () => {
    if (mode === 'date') newestFirst = !newestFirst;
    setMode('date');
    orderBtn.textContent = newestFirst ? '时间 ↓' : '时间 ↑';
    place(newestFirst ? rows : [...rows].reverse());
  });
  lossBtn.addEventListener('click', () => {
    setMode('loss');
    place([...rows].sort((a, b) => Number(b.dataset.loss) - Number(a.dataset.loss)));
  });
  shuffleBtn.addEventListener('click', () => {
    setMode('shuffle');
    place(shuffled(rows));
  });

  filterBtn.addEventListener('click', () => {
    drawer.hidden = !drawer.hidden;
    syncFilterBtn();
    if (drawerInit || drawer.hidden) return;
    drawerInit = true;
    drawer.querySelectorAll('.tag-wrap').forEach(initTagCollapse);
  });

  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-tag]');
    if (!b) return;
    activeTag = b.dataset.tag === activeTag ? '' : b.dataset.tag;
    applyFilter();
  });
  searchInput.addEventListener('input', applyFilter);

  const params = new URLSearchParams(location.search);
  const initialText = params.get('f') ?? '';
  const initialTag = params.get('t') ?? '';
  if (initialText) searchInput.value = initialText;
  if (initialTag && (tagButtons.some(b => b.dataset.tag === initialTag) || rows.some(r => r.dataset.tags.includes(`|${initialTag}|`)))) {
    activeTag = initialTag;
  }
  if (initialText || activeTag) applyFilter();
})();
