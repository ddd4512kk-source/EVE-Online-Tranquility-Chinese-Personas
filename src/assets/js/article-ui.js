// 长文阅读增强：小分页（Tabs）交互、右侧目录（TOC）滚动高亮、锚点自动展开折叠／切换分页。
// 无 JS 时小分页全部展开可读、折叠块原生可用、目录链接直接跳转。
(function () {
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(group => {
      const tabs = [...group.querySelectorAll(':scope > .tabs-bar .tabs-tab')];
      const panels = [...group.querySelectorAll(':scope > .tabs-panels > .tabs-panel')];
      if (!tabs.length || tabs.length !== panels.length) return;

      const activate = (index, focus) => {
        tabs.forEach((btn, i) => {
          const active = i === index;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
          btn.tabIndex = active ? 0 : -1;
          panels[i].classList.toggle('is-active', active);
          panels[i].hidden = !active;
        });
        if (focus) tabs[index].focus();
      };

      group.classList.add('is-enhanced');
      activate(0, false);

      tabs.forEach((btn, idx) => {
        btn.addEventListener('click', () => activate(idx, false));
        btn.addEventListener('keydown', e => {
          let next = idx;
          if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') next = 0;
          else if (e.key === 'End') next = tabs.length - 1;
          else return;
          e.preventDefault();
          activate(next, true);
        });
      });

      group._activatePanel = panel => {
        const idx = panels.indexOf(panel);
        if (idx >= 0) activate(idx, false);
      };
    });
  }

  function revealTarget(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    let cur = el;
    while (cur && cur !== document.body) {
      if (cur.tagName === 'DETAILS' && !cur.open) cur.open = true;
      if (cur.classList && cur.classList.contains('tabs-panel')) {
        const group = cur.closest('[data-tabs]');
        if (group && group._activatePanel) group._activatePanel(cur);
      }
      cur = cur.parentElement;
    }
  }

  function initToc() {
    const toc = document.querySelector('.article-toc');
    if (!toc) return;
    const box = toc.querySelector('.toc-box');
    const nav = toc.querySelector('.toc-nav');
    const links = [...toc.querySelectorAll('.toc-list a[href^="#"]')];
    if (!links.length) return;

    const pairs = links
      .map(link => {
        const id = link.getAttribute('href').slice(1);
        const heading = document.getElementById(id);
        return heading ? { id, link, heading } : null;
      })
      .filter(Boolean);
    if (!pairs.length) return;

    const header = document.querySelector('.site-header');
    const desktopQuery = window.matchMedia('(min-width: 1120px)');
    const syncOpen = () => {
      if (box && desktopQuery.matches) box.open = true;
    };
    syncOpen();
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', syncOpen);

    let activeId = '';
    // 点击目录后锁定高亮，直到用户真正手动滚动；防止点击自身触发的 scroll 或页底章节滚不到顶时跳回上一节
    let lockedId = '';
    let settledY = 0;
    let settleTimer = 0;
    let settling = false;
    let imgGuardUntil = 0;

    const scrollNavToLink = link => {
      if (!desktopQuery.matches || !nav || !link) return;
      const nr = nav.getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      const pad = 10;
      if (lr.top < nr.top + pad) {
        nav.scrollTop -= nr.top + pad - lr.top;
      } else if (lr.bottom > nr.bottom - pad) {
        nav.scrollTop += lr.bottom - (nr.bottom - pad);
      }
    };

    const setActive = id => {
      if (!id || id === activeId) return;
      activeId = id;
      let activeLink = null;
      for (const p of pairs) {
        const on = p.id === id;
        p.link.classList.toggle('is-active', on);
        if (on) {
          p.link.setAttribute('aria-current', 'location');
          activeLink = p.link;
        } else {
          p.link.removeAttribute('aria-current');
        }
      }
      scrollNavToLink(activeLink);
    };

    const unlock = () => {
      lockedId = '';
      settling = false;
      imgGuardUntil = 0;
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = 0;
      }
    };

    const getSpyOffset = () => {
      const headerBottom = header ? header.getBoundingClientRect().bottom : 56;
      return headerBottom + 56;
    };

    const updateActive = () => {
      if (lockedId) {
        if (!settling && Math.abs(window.scrollY - settledY) > 48) {
          unlock();
        } else {
          setActive(lockedId);
          return;
        }
      }
      const offset = getSpyOffset();
      let current = pairs[0].id;
      for (const p of pairs) {
        if (p.heading.getBoundingClientRect().top <= offset) current = p.id;
        else break;
      }
      setActive(current);
    };

    links.forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        revealTarget(id);
        lockedId = id;
        settling = true;
        imgGuardUntil = Date.now() + 1500;
        setActive(id);
        if (!desktopQuery.matches && box) box.open = false;
        if (history.replaceState) history.replaceState(null, '', `#${id}`);
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          settledY = window.scrollY;
          settling = false;
        }, 120);
      });
    });

    // 跳转后若上方懒加载图片刚载入把目标标题顶偏，在用户尚未手动滚动前自动对齐一次
    document.addEventListener('load', e => {
      if (!lockedId || Date.now() > imgGuardUntil) return;
      if (!e.target || e.target.tagName !== 'IMG') return;
      const target = document.getElementById(lockedId);
      if (!target) return;
      const top = target.getBoundingClientRect().top;
      if (Math.abs(top - 80) > 64) {
        settling = true;
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        settledY = window.scrollY;
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          settledY = window.scrollY;
          settling = false;
        }, 120);
      }
    }, true);

    // 用户任何主动滚动意图立即解除点击锁定，恢复实时追踪
    window.addEventListener('wheel', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', e => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) {
        unlock();
      }
    });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateActive();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateActive();
  }

  initTabs();
  initToc();

  if (location.hash) revealTarget(decodeURIComponent(location.hash.slice(1)));
  window.addEventListener('hashchange', () => {
    if (location.hash) revealTarget(decodeURIComponent(location.hash.slice(1)));
  });
})();
