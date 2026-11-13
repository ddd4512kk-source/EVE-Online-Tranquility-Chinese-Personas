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
  const shuffleBtn = document.getElementById('shuffle');
  const status = document.getElementById('filter-status');
  const tagButtons = [...document.querySelectorAll('.battle-filters [data-tag]')];

  let mode = 'date';
  let newestFirst = true;
  const activeTags = new Map(); // 维度 → 标签；不同维度取交集，同一维度单选

  function setMode(nextMode) {
    mode = nextMode;
    orderBtn.classList.toggle('is-active', mode === 'date');
    orderBtn.setAttribute('aria-pressed', String(mode === 'date'));
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
      const on = (activeTags.get(b.dataset.group) ?? '') === b.dataset.tag;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    }

    let shown = 0;
    for (const r of rows) {
      r.hidden = !([...activeTags.values()].every(t => r.dataset.tags.includes(`|${t}|`))
        && terms.every(t => r.dataset.key.includes(t)));
      if (!r.hidden) shown++;
    }
    syncGridBalance();

    if (activeTags.size || terms.length) {
      status.hidden = false;
      const parts = [];
      if (activeTags.size) parts.push(`标签「${[...activeTags.values()].join('」「')}」`);
      if (text) parts.push(`检索“${text}”`);
      status.textContent = shown ? `${parts.join(' · ')}：共 ${shown} 场。` : '目录里没有匹配的战役。试试全文搜索？';
    } else {
      status.hidden = true;
    }

    const u = new URL(location.href);
    u.searchParams.delete('t');
    for (const t of activeTags.values()) u.searchParams.append('t', t);
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
  shuffleBtn.addEventListener('click', () => {
    setMode('shuffle');
    place(shuffled(rows));
  });

  document.querySelectorAll('.battle-filters .tag-wrap').forEach(initTagCollapse);

  document.addEventListener('click', e => {
    const b = e.target.closest('.battle-filters button[data-tag]');
    if (!b) return;
    const { tag, group } = b.dataset;
    if (tag === '' || activeTags.get(group) === tag) activeTags.delete(group);
    else activeTags.set(group, tag);
    applyFilter();
  });
  searchInput.addEventListener('input', applyFilter);

  const params = new URLSearchParams(location.search);
  const initialText = params.get('f') ?? '';
  if (initialText) searchInput.value = initialText;
  for (const t of params.getAll('t')) {
    const btn = t && tagButtons.find(b => b.dataset.tag === t);
    if (btn) activeTags.set(btn.dataset.group, t);
    else if (t && rows.some(r => r.dataset.tags.includes(`|${t}|`))) activeTags.set(`其他:${t}`, t);
  }
  if (initialText || activeTags.size) applyFilter();
})();
