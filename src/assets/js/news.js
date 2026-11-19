// 天书目录：分类默认全选，点一下取消或恢复；文字筛选同步 ?f=，未全选时同步可重复的 ?t=（列出仍显示的分类）；无 JS 时全部可读。
const list = document.getElementById('news-list');
const entries = [...(list?.querySelectorAll('.news-entry') ?? [])];
const months = [...(list?.querySelectorAll('.news-month') ?? [])];
const years = [...document.querySelectorAll('.news-years a[data-year]')];
const chips = [...document.querySelectorAll('#news-cats .chip')];
const input = document.getElementById('filter');
const status = document.getElementById('filter-status');

const known = chips.map(c => c.dataset.cat);
const params = new URLSearchParams(location.search);
const wanted = params.getAll('t').filter(t => known.includes(t));
const cats = new Set(wanted.length ? wanted : known);
if (input) input.value = params.get('f') ?? '';

function apply() {
  const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shownMonths = new Set();
  let count = 0;
  for (const entry of entries) {
    const ok = cats.has(entry.dataset.cat) && words.every(w => entry.dataset.key.includes(w));
    entry.hidden = !ok;
    if (ok) {
      count++;
      shownMonths.add(entry.dataset.month);
    }
  }
  for (const m of months) m.hidden = !shownMonths.has(m.dataset.month);
  const shownYears = new Set([...shownMonths].map(m => m.slice(0, 4)));
  for (const y of years) y.hidden = !shownYears.has(y.dataset.year);
  for (const chip of chips) {
    const on = cats.has(chip.dataset.cat);
    chip.classList.toggle('is-active', on);
    chip.setAttribute('aria-pressed', String(on));
  }
  const all = cats.size === known.length;
  const filtered = !all || words.length;
  status.hidden = !filtered;
  status.textContent = filtered ? `共 ${count} 卷` : '';

  const url = new URL(location.href);
  url.searchParams.delete('t');
  if (!all) for (const t of known) if (cats.has(t)) url.searchParams.append('t', t);
  if (input.value.trim()) url.searchParams.set('f', input.value.trim()); else url.searchParams.delete('f');
  history.replaceState(null, '', url);
}

if (list && input && status) {
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const t = chip.dataset.cat;
      if (!cats.delete(t)) cats.add(t);
      apply();
    });
  }
  input.addEventListener('input', apply);
  // 年份锚点在该年第一个月标题上；筛选后那个月可能被藏起，改跳到该年第一个可见月份
  for (const y of years) {
    y.addEventListener('click', e => {
      const m = months.find(h => !h.hidden && h.dataset.month.startsWith(y.dataset.year));
      if (m) {
        e.preventDefault();
        m.scrollIntoView();
      }
    });
  }
  apply();
}
