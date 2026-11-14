import { initTagCollapse, pauseOffscreen, shuffled } from './directory-utils.js';

// 首页名录：文字筛选 ∧ 标签多选（同时满足所选全部标签；“全部”= 清空），
// 九宫格阵营：单格 CE／整列 L*／整行 *E，与文字、标签取交集。
// 排序：创号、更新、六维、随机，再点当前排序切换方向。同步 ?f= ?t=（可多个）?al= ?sort= ?rev=。无 JS 时页面照常可读。
(() => {
  const roster = document.getElementById('roster');
  if (!roster) return;
  const input = document.getElementById('filter');
  const shuffleBtn = document.getElementById('shuffle');
  const status = document.getElementById('filter-status');
  const tagChips = [...document.querySelectorAll('#tag-bar [data-tag]')];
  const sortChips = [...document.querySelectorAll('#roster-sorts [data-sort]')];
  const activeTags = new Set();
  const alignGroup = document.querySelector('.align-filter');
  const alignChips = [...document.querySelectorAll('.align-pick [data-al]')];
  const alignCurrent = document.getElementById('align-current');
  let alignSel = '';
  if (alignGroup) alignGroup.hidden = false;
  const alignOk = code => !alignSel || (!!code && [0, 1].every(i => alignSel[i] === '*' || alignSel[i] === code[i]));

  const cards = [...roster.querySelectorAll('.card')]; // 构建时已按创号升序
  pauseOffscreen(cards);
  const birth = new Map(cards.map((c, i) => [c, i]));
  // 阶位 EX=7 … E=1，待考=0；未评六维的人整卡视为待考
  const ranks = new Map(cards.map(c => [c, c.dataset.radar ? JSON.parse(c.dataset.radar) : {}]));
  const total = new Map(cards.map(c => [c, Object.values(ranks.get(c)).reduce((s, r) => s + r, 0)]));

  // 各排序的默认方向（首点）；reversed 表示再点后的反方向
  const sorters = {
    birth: () => cards,
    recent: () => [...cards].sort((a, b) => Date.parse(b.dataset.updated) - Date.parse(a.dataset.updated)),
  };
  // 六维：同档先比其余五维之和，再按创号；待考的不论方向都排最后
  for (const b of sortChips) {
    const axis = b.dataset.sort;
    if (axis in sorters) continue;
    sorters[axis] = rev => [...cards].sort((x, y) => {
      const rx = ranks.get(x)[axis] ?? 0;
      const ry = ranks.get(y)[axis] ?? 0;
      if (!rx !== !ry) return rx ? -1 : 1;
      const dir = rev ? 1 : -1;
      return dir * (rx - ry) || dir * ((total.get(x) - rx) - (total.get(y) - ry)) || birth.get(x) - birth.get(y);
    });
  }
  const birthArrow = rev => (rev ? '↓' : '↑');
  const otherArrow = rev => (rev ? '↑' : '↓');

  let mode = 'birth';
  let reversed = false;

  const press = (chips, isOn) => {
    for (const b of chips) {
      b.classList.toggle('is-active', isOn(b));
      b.setAttribute('aria-pressed', String(isOn(b)));
    }
  };

  function syncUrl() {
    const u = new URL(location.href);
    const sort = mode === 'birth' && !reversed ? '' : mode === 'shuffle' ? '' : mode;
    for (const [key, value] of [['f', input.value.trim()], ['al', alignSel], ['sort', sort], ['rev', sort && reversed ? '1' : '']]) {
      if (value) u.searchParams.set(key, value);
      else u.searchParams.delete(key);
    }
    u.searchParams.delete('t');
    for (const t of activeTags) u.searchParams.append('t', t);
    history.replaceState(history.state, '', u);
  }

  function applyFilter() {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const tags = [...activeTags];
    press(tagChips, b => (b.dataset.tag ? activeTags.has(b.dataset.tag) : !tags.length));
    const alignChip = alignChips.find(b => b.dataset.al === alignSel);
    for (const b of alignChips) {
      b.classList.toggle('is-on', b === alignChip);
      b.setAttribute('aria-pressed', String(b === alignChip));
    }
    if (alignCurrent) alignCurrent.textContent = alignChip?.dataset.label ?? '全部';
    alignGroup?.classList.toggle('is-filtered', !!alignSel);
    let shown = 0;
    for (const c of cards) {
      const ok = terms.every(t => c.dataset.key.includes(t)) && tags.every(t => c.dataset.tags.includes(`|${t}|`)) && alignOk(c.dataset.align);
      c.hidden = !ok;
      if (ok) shown++;
    }
    status.hidden = !terms.length && !tags.length && !alignSel;
    const conds = [alignSel && `阵营「${alignChip.dataset.label}」`, tags.length && `标签${tags.map(t => `「${t}」`).join('+')}`].filter(Boolean);
    status.textContent = shown
      ? `${conds.length ? `${conds.join('，')}：` : ''}找到 ${shown} 人。`
      : '名录里没有匹配的人。试试全文搜索？';
    syncUrl();
  }

  function sortBy(key, rev) {
    mode = key;
    reversed = rev;
    roster.classList.toggle('is-shuffled', !(key === 'birth' && !rev));
    if (key === 'shuffle') roster.append(...shuffled(cards));
    else {
      const list = sorters[key](rev);
      // 创号、更新直接倒排；六维自己处理方向，保证待考垫底
      roster.append(...(rev && (key === 'birth' || key === 'recent') ? [...list].reverse() : list));
    }
    press(sortChips, b => b.dataset.sort === key);
    shuffleBtn?.classList.toggle('is-active', key === 'shuffle');
    shuffleBtn?.setAttribute('aria-pressed', String(key === 'shuffle'));
    for (const b of sortChips) {
      const r = b.dataset.sort === key && rev;
      b.textContent = b.textContent.replace(/[↓↑]$/, b.dataset.sort === 'birth' ? birthArrow(r) : otherArrow(r));
    }
    syncUrl();
  }

  input.addEventListener('input', applyFilter);
  shuffleBtn?.addEventListener('click', () => sortBy('shuffle', false));
  for (const b of sortChips) {
    b.addEventListener('click', () => sortBy(b.dataset.sort, mode === b.dataset.sort && !reversed));
  }
  for (const b of tagChips) {
    b.addEventListener('click', () => {
      const t = b.dataset.tag;
      if (!t) activeTags.clear();
      else if (activeTags.has(t)) activeTags.delete(t);
      else activeTags.add(t);
      applyFilter();
    });
  }

  for (const b of alignChips) {
    b.addEventListener('click', () => {
      alignSel = b.dataset.al;
      b.closest('details').open = false;
      applyFilter();
    });
  }

  const params = new URLSearchParams(location.search);
  input.value = params.get('f') ?? '';
  for (const t of params.getAll('t')) if (tagChips.some(b => b.dataset.tag === t)) activeTags.add(t);
  const al = params.get('al');
  if (alignChips.some(b => b.dataset.al && b.dataset.al === al)) alignSel = al;
  const sort = params.get('sort');
  if (sort in sorters) sortBy(sort, params.get('rev') === '1');
  if (input.value || activeTags.size || alignSel) applyFilter();
  document.querySelectorAll('.roster-filters .tag-wrap').forEach(initTagCollapse);
})();
