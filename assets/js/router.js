/* ============================================================
   router.js —— 站内页面软切换
   目的：翻页时不重新加载整个文档，APlayer 的音频元素不会被销毁，
   音乐因此连续播放；背景与顶栏也不闪。
   - 只接管本站 .html 链接（文章页 ?id= 也在内）
   - 失败、跨域、下载链接、tags 跳转一律回退到整页跳转
   ============================================================ */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;

  function closeOverlays() {
    if (window.Site) {
      Site.closePalette();
      if (Site.closeDrawer) Site.closeDrawer();
    }
    const menu = document.getElementById('more-menu');
    if (menu) {
      menu.classList.remove('open');
      const btn = document.getElementById('more-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    const lb = document.getElementById('lightbox');
    if (lb) { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
  }

  function pageOf(url) {
    const file = (url.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (file === 'index.html' || file === '') return 'cover';
    if (file === 'post.html') return 'post';
    return file.replace(/\.html$/, '');
  }

  function applyDoc(doc, url) {
    const next = doc.getElementById('main');
    const current = document.getElementById('main');
    if (!next || !current) return false;

    const imported = document.importNode(next, true);
    current.replaceWith(imported);

    const bodyClass = doc.body ? doc.body.className : '';
    document.body.className = bodyClass;
    document.body.dataset.page = doc.body ? (doc.body.dataset.page || '') : '';

    if (doc.title) document.title = doc.title;
    const desc = doc.querySelector('meta[name="description"]');
    const mine = document.querySelector('meta[name="description"]');
    if (desc && mine) mine.setAttribute('content', desc.getAttribute('content') || '');

    if (window.Site && Site.setCurrent) Site.setCurrent(pageOf(url));
    if (window.Site && Site.applyTimePhase) Site.applyTimePhase();

    // 标题栏与主题色跟随页面
    const tc = doc.querySelector('meta[name="theme-color"]');
    if (tc && document.querySelector('meta[name="theme-color"]')) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', tc.getAttribute('content') || '#FAFAF8');
    }

    if (window.SiteRender) SiteRender.init();
    if (window.SitePost) SitePost.init();
    return true;
  }

  async function go(href, opts) {
    const push = !(opts && opts.replace);
    let url;
    try { url = new URL(href, location.href); } catch (e) { location.href = href; return; }
    if (url.origin !== location.origin) { location.href = url.href; return; }

    if (busy) return;
    busy = true;
    document.documentElement.classList.add('is-routing');

    try {
      const res = await fetch(url.href, { credentials: 'same-origin', headers: { 'X-Router': '1' } });
      if (!res.ok) throw new Error('http ' + res.status);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (!doc.getElementById('main')) throw new Error('no main');

      if (!push) {
        // popstate：浏览器已经改过地址，只换内容
      } else {
        try { history.replaceState(Object.assign({}, history.state, { scroll: window.scrollY }), ''); } catch (e) { }
        history.pushState({ scroll: 0 }, '', url.href);
      }

      const swap = () => {
        closeOverlays();
        const ok = applyDoc(doc, url);
        if (!ok) throw new Error('swap failed');
        window.scrollTo(0, 0);
      };

      if (document.startViewTransition && !REDUCED && !document.hidden) {
        let swapped = false;
        const runSwap = () => { swap(); swapped = true; };
        const vt = document.startViewTransition(runSwap);
        vt.finished.catch(() => { });
        vt.ready.catch(() => { });
        vt.updateCallbackDone.catch(() => { });
        try { await vt.finished; } catch (e) { /* transition aborted：下面兜底 */ }
        if (!swapped) runSwap();
      } else {
        swap();
      }
      document.documentElement.classList.remove('is-routing');
      busy = false;
    } catch (err) {
      document.documentElement.classList.remove('is-routing');
      busy = false;
      location.href = url.href;
    }
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download')) return;

    let url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    const file = (url.pathname.split('/').pop() || '').toLowerCase();
    if (!/\.html$/.test(file) && !/\/$/.test(url.pathname)) return;
    if (file === 'tags.html') return; // 让跳转页自己走整页

    e.preventDefault();
    go(url.href);
  });

  window.addEventListener('popstate', (e) => {
    go(location.href, { replace: true });
  });

  window.Site = window.Site || {};
  Site.go = go;
  Site.currentPage = () => pageOf(new URL(location.href));
})();
