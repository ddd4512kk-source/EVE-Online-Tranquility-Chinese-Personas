import { initTagCollapse, pauseOffscreen, shuffled } from './directory-utils.js';

// 军团目录：文字筛选 ∧ 状态单选 ∧ 区域单选 ∧ 联盟单选（同步 ?f= ?s= ?z= ?a= ?sort=）+ 默认按武德排名（武德相同按 zKB 近期榜），可切含神量、肉度（损失÷击杀）、创立正序/倒序、随机。
// 默认只看活跃且招新中的；读者输入文字或选区域、联盟而没动过状态时，自动放开到全部，免得搜不到沉寂军团。
(() => {
  const list = document.getElementById('corp-cards');
  if (!list) return;
  const cards = [...list.children]; // 构建时已按创立时间正序
  const rankOf = c => Number(c.dataset.rank) || Infinity; // 没上榜的垫底
  const byRank = [...cards].sort((a, b) => rankOf(a) - rankOf(b));
  const byMetric = key => [...cards].sort((a, b) => Number(b.dataset[key]) - Number(a.dataset[key]) || rankOf(a) - rankOf(b));
  const metricLists = {
    rank: byRank,
    pvp: byMetric('pvp'),
    shenren: byMetric('shenren'),
    tank: byMetric('tank'),
  };

  const input = document.getElementById('filter');
  const shuffleBtn = document.getElementById('shuffle');
  const status = document.getElementById('filter-status');
  const stateChips = [...document.querySelectorAll('[data-state]')];
  const sortChips = [...document.querySelectorAll('[data-sort]')];
  const zoneChips = [...document.querySelectorAll('.corp-filters [data-zone]')];
  const allianceChips = [...document.querySelectorAll('.corp-filters [data-alliance]')];
  const defaultState = stateChips.some(b => b.dataset.state === 'recruiting') ? 'recruiting' : 'all';
  let chosenState = null; // null = 读者没动过状态
  let zone = '';
  let alliance = '';
  let mode = 'pvp';
  let reversed = false; // 再点一次当前排序：逆序（由低到高）

  const press = (chips, isOn) => {
    for (const b of chips) {
      if (!b) continue;
      b.classList.toggle('is-active', isOn(b));
      b.setAttribute('aria-pressed', String(isOn(b)));
    }
  };

  function syncUrl(text) {
    const u = new URL(location.href);
    const sortParam = ['shenren', 'tank'].includes(mode) || (reversed && mode in metricLists) ? mode : '';
    for (const [key, value] of [['f', text], ['s', chosenState], ['z', zone], ['a', alliance], ['sort', sortParam], ['rev', reversed ? '1' : '']]) {
      if (value) u.searchParams.set(key, value);
      else u.searchParams.delete(key);
    }
    history.replaceState(history.state, '', u);
  }

  function render() {
    const text = input.value.trim();
    const terms = text.toLowerCase().split(/\s+/).filter(Boolean);
    const state = chosenState ?? (terms.length || zone || alliance ? 'all' : defaultState);
    press(stateChips, b => b.dataset.state === state);
    press(zoneChips, b => b.dataset.zone === zone);
    press(allianceChips, b => b.dataset.alliance === alliance);

    let shown = 0;
    for (const c of cards) {
      c.hidden = !(terms.every(t => c.dataset.key.includes(t))
        && (state === 'all' || c.dataset.group === state)
        && (!zone || c.dataset.zones.split(' ').includes(zone))
        && (!alliance || c.dataset.alliance === alliance));
      if (!c.hidden) shown++;
    }
    const note = stateChips.find(b => b.dataset.state === state)?.dataset.note;
    status.hidden = false;
    status.textContent = shown ? `${note ? `${note}，` : ''}共 ${shown} 家。` : '目录里没有匹配的军团。试试全文搜索？';
    syncUrl(text);
  }

  const place = items => items.forEach(c => list.appendChild(c));
  function setMode(nextMode) {
    mode = nextMode;
    if (shuffleBtn) {
      shuffleBtn.classList.toggle('is-active', mode === 'shuffle');
      shuffleBtn.setAttribute('aria-pressed', String(mode === 'shuffle'));
    }
    press(sortChips, b => b.dataset.sort === mode);
    for (const b of sortChips) {
      const arrow = b.dataset.sort === mode && reversed ? '↑' : '↓';
      b.textContent = b.textContent.replace(/[↓↑]$/, arrow);
    }
    syncUrl(input.value.trim());
  }

  input.addEventListener('input', render);
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      reversed = false;
      setMode('shuffle');
      place(shuffled(cards));
    });
  }
  for (const b of sortChips) {
    b.addEventListener('click', () => {
      const key = b.dataset.sort;
      reversed = mode === key && !reversed;
      setMode(key);
      const items = metricLists[key] ?? metricLists.pvp;
      place(reversed ? [...items].reverse() : items);
    });
  }
  for (const b of stateChips) {
    b.addEventListener('click', () => {
      chosenState = b.dataset.state;
      render();
    });
  }
  for (const b of zoneChips) {
    b.addEventListener('click', () => {
      zone = b.dataset.zone === zone ? '' : b.dataset.zone;
      render();
    });
  }
  for (const b of allianceChips) {
    b.addEventListener('click', () => {
      alliance = b.dataset.alliance === alliance ? '' : b.dataset.alliance;
      render();
    });
  }

  const params = new URLSearchParams(location.search);
  input.value = params.get('f') ?? '';
  if (stateChips.some(b => b.dataset.state === params.get('s'))) chosenState = params.get('s');
  if (zoneChips.some(b => b.dataset.zone === params.get('z'))) zone = params.get('z');
  if (allianceChips.some(b => b.dataset.alliance === params.get('a'))) alliance = params.get('a');
  const initialSort = params.get('sort');
  const initialMode = metricLists[initialSort] ? initialSort : 'pvp';
  reversed = params.get('rev') === '1';
  place(reversed ? [...metricLists[initialMode]].reverse() : metricLists[initialMode]);
  setMode(initialMode);
  render();
  list.classList.remove('is-default');
  pauseOffscreen(cards);
  document.querySelectorAll('.corp-filters .tag-wrap').forEach(initTagCollapse);
})();
