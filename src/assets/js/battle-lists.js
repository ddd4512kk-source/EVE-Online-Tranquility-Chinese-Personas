// 战役详情页交互：各方名单超过一行时独立折叠，超过 3 部的视频视角默认收起为抽屉；无 JS 时全部可读。
(() => {
  for (const wrap of document.querySelectorAll('.battle-list-wrap')) {
    const list = wrap.querySelector('.battle-list');
    const button = wrap.querySelector('button');
    if (!list || !button) continue;
    let open = false;
    function layout() {
      button.hidden = true;
      wrap.classList.add('is-collapsed');
      const overflow = list.scrollHeight > list.clientHeight + 2;
      button.hidden = !overflow;
      wrap.classList.toggle('is-collapsed', overflow && !open);
      button.textContent = open ? '收起 ▴' : '展开 ▾';
      button.setAttribute('aria-expanded', String(open && overflow));
      // 裁切区域里的链接也退出键盘焦点序列，展开后恢复。
      const baseTop = list.firstElementChild?.offsetTop ?? 0;
      for (const item of list.children) {
        item.inert = overflow && !open && item.offsetTop - baseTop >= list.clientHeight;
      }
    }
    button.addEventListener('click', () => {
      open = !open;
      layout();
    });
    new ResizeObserver(layout).observe(wrap);
    layout();
  }

  const videoMore = document.getElementById('battle-videos-more');
  const videoToggle = document.getElementById('battle-videos-toggle');
  if (videoMore && videoToggle) {
    const count = videoToggle.dataset.count;
    let expanded = false;
    const syncVideos = () => {
      videoMore.hidden = !expanded;
      videoToggle.hidden = false;
      videoToggle.setAttribute('aria-expanded', String(expanded));
      videoToggle.textContent = expanded ? '收起其余视角视频 ▴' : `展开其余 ${count} 部视角视频 ▾`;
    };
    videoToggle.addEventListener('click', () => {
      expanded = !expanded;
      syncVideos();
    });
    syncVideos();
  }
})();
