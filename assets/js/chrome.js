/* ============================================================
   chrome.js —— 顶栏 / 页脚 / 主题 / 命令面板 / Toast
   10 个页面共用，避免同一段导航复制十遍导致走样。
   ============================================================ */
(function () {
  'use strict';

  const NAV = [
    { href: 'index.html', label: '封面' },
    { href: 'home.html', label: '博客' },
    { href: 'photos.html', label: '相册' },
    { href: 'books.html', label: '书架' },
    { href: 'about.html', label: '关于' },
  ];
  const MORE = [
    { href: 'notes.html', label: '碎片' },
    { href: 'archive.html', label: '归档' },
    { href: 'messages.html', label: '留言' },
    { href: 'lab.html', label: '实验室' },
  ];

  const current0 = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  let current = current0;
  const isBlog = (p) => p === 'post.html' || p === 'home.html';

  /* ---------- 顶栏 ---------- */
  const sunIcon = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6"/></svg>';
  const moonIcon = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 14.2A8.3 8.3 0 0 1 9.8 3.8a8.3 8.3 0 1 0 10.4 10.4z"/></svg>';

  const navHTML = NAV.map((item) => {
    const active = item.href === current || (item.href === 'home.html' && isBlog(current));
    return '<a href="' + item.href + '" data-href="' + item.href + '"' + (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
  }).join('');

  const moreHTML = MORE.map((item) =>
    '<a href="' + item.href + '">' + item.label + '</a>'
  ).join('');

  const header = document.createElement('header');
  header.className = 'topbar glass';
  header.id = 'site-topbar';
  header.innerHTML =
    '<div class="wrap">' +
      '<a class="brand" href="index.html">Tom<sup>®</sup></a>' +
      '<nav class="nav" aria-label="主导航">' + navHTML +
        '<div class="nav-more">' +
          '<button class="more-btn" id="more-btn" aria-expanded="false" aria-haspopup="true">更多' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
          '</button>' +
          '<div class="more-menu" id="more-menu" role="menu">' + moreHTML + '</div>' +
        '</div>' +
      '</nav>' +
      '<button class="icon-btn nav-toggle" id="nav-toggle" aria-label="打开菜单" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '</button>' +
      '<button class="icon-btn theme-toggle" id="theme-toggle" aria-label="切换明暗主题（快捷键 T）" title="切换主题（T）">' + sunIcon + moonIcon + '</button>' +
    '</div>';

  const mount = document.getElementById('site-header');
  if (mount) mount.replaceWith(header); else document.body.insertAdjacentElement('afterbegin', header);

  /* ---------- 背景氛围层（首页动态，其余页面静止） ---------- */
  const air = document.createElement('div');
  air.className = 'air-bg';
  air.setAttribute('aria-hidden', 'true');
  air.innerHTML = '<span class="air-blob a"></span><span class="air-blob b"></span><span class="air-blob c"></span><span class="air-grain"></span>';
  document.body.insertAdjacentElement('afterbegin', air);

  /* ---------- 页脚 ---------- */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<h5>关于本站</h5>' +
          '<p>一间安静的小屋：写代码、做设计、留一点光。零构建、零依赖，所有页面都是纯静态文件。</p>' +
        '</div>' +
        '<div>' +
          '<h5>页面</h5>' +
          '<div class="footer-links">' +
            '<a href="home.html">博客</a><a href="archive.html">归档</a><a href="notes.html">碎片</a>' +
            '<a href="books.html">书架</a><a href="photos.html">相册</a><a href="about.html">关于</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<h5>联系</h5>' +
          '<div class="footer-links">' +
            '<a href="feed.xml">RSS 订阅</a>' +
            '<a href="messages.html">留言板</a>' +
            '<a href="mailto:' + (typeof SITE !== 'undefined' ? SITE.email : '') + '">邮件</a>' +
            '<a href="https://github.com/zhaok9385-lab/liquid-glass-blog" target="_blank" rel="noopener">GitHub</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-base">' +
        '<span>© ' + new Date().getFullYear() + ' Tom · Keep Going, Never Stop</span>' +
        '<span>Bright Air · 纯静态 · 无追踪</span>' +
      '</div>' +
    '</div>';
  const fmount = document.getElementById('site-footer');
  if (fmount) fmount.replaceWith(footer); else document.body.appendChild(footer);

  /* ---------- 顶栏滚动收缩 ---------- */
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 更多菜单 ---------- */
  const moreBtn = header.querySelector('#more-btn');
  const moreMenu = header.querySelector('#more-menu');
  function closeMore() {
    moreMenu.classList.remove('open');
    moreBtn.setAttribute('aria-expanded', 'false');
  }
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = moreMenu.classList.toggle('open');
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', closeMore);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMore(); });

  /* ---------- 移动端抽屉菜单 ---------- */
  const navToggle = header.querySelector('#nav-toggle');
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.id = 'nav-drawer';
  drawer.innerHTML = NAV.concat(MORE).map((item) => {
    const active = item.href === current || (item.href === 'home.html' && isBlog(current));
    return '<a href="' + item.href + '" data-href="' + item.href + '"' + (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
  }).join('');
  document.body.appendChild(drawer);

  function closeDrawer() {
    drawer.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = drawer.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  drawer.addEventListener('click', closeDrawer);
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && !drawer.contains(e.target)) closeDrawer();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- 主题 ---------- */
  const root = document.documentElement;
  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    try { localStorage.setItem('lg-theme', mode); } catch (e) { }
  }
  const themeBtn = header.querySelector('#theme-toggle');
  themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Toast ---------- */
  let toastEl = null, toastTimer = null;
  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  /* ---------- 命令面板 ---------- */
  const PAGES = [{ href: 'home.html', label: '博客' }, { href: 'photos.html', label: '相册' },
    { href: 'books.html', label: '书架' }, { href: 'about.html', label: '关于' },
    { href: 'notes.html', label: '碎片' }, { href: 'archive.html', label: '归档' },
    { href: 'messages.html', label: '留言' }, { href: 'lab.html', label: '实验室' }];

  function buildIndex() {
    const items = [];
    if (typeof POSTS !== 'undefined') {
      POSTS.forEach((p) => items.push({ title: p.title, kind: '文章', href: 'post.html?id=' + p.id, sub: p.excerpt }));
    }
    PAGES.forEach((p) => items.push({ title: p.label, kind: '页面', href: p.href }));
    if (typeof NOTES !== 'undefined') {
      NOTES.forEach((n) => items.push({ title: n.text.slice(0, 40), kind: '碎片', href: 'notes.html' }));
    }
    if (typeof BOOKS !== 'undefined') {
      BOOKS.forEach((b) => items.push({ title: b.title, kind: '书', href: 'books.html' }));
    }
    return items;
  }

  let palette = null, paletteInput = null, paletteList = null, results = [], cursor = 0;
  function ensurePalette() {
    if (palette) return;
    const index = buildIndex();
    palette = document.createElement('div');
    palette.className = 'palette';
    palette.setAttribute('role', 'dialog');
    palette.setAttribute('aria-modal', 'true');
    palette.setAttribute('aria-label', '全站搜索');
    palette.innerHTML =
      '<div class="palette-box">' +
        '<input class="palette-input" type="search" placeholder="搜索文章、页面、书…" aria-label="搜索">' +
        '<div class="palette-list" role="listbox"></div>' +
      '</div>';
    document.body.appendChild(palette);
    paletteInput = palette.querySelector('.palette-input');
    paletteList = palette.querySelector('.palette-list');

    const render = (q) => {
      const term = q.trim().toLowerCase();
      results = (term ? index.filter((i) =>
        (i.title + ' ' + (i.sub || '') + ' ' + i.kind).toLowerCase().includes(term)
      ) : index).slice(0, 8);
      cursor = 0;
      if (!results.length) {
        paletteList.innerHTML = '<div class="palette-empty">没有找到相关内容</div>';
        return;
      }
      paletteList.innerHTML = results.map((r, i) =>
        '<a class="palette-item' + (i === 0 ? ' on' : '') + '" href="' + r.href + '" role="option">' +
          '<span>' + r.title + '</span><span class="kind">' + r.kind + '</span></a>'
      ).join('');
    };
    paletteInput.addEventListener('input', () => render(paletteInput.value));
    palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });
    palette.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closePalette(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        cursor = (cursor + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
        [...paletteList.querySelectorAll('.palette-item')].forEach((el, i) => el.classList.toggle('on', i === cursor));
      } else if (e.key === 'Enter' && results[cursor]) {
        location.href = results[cursor].href;
      }
    });
    render('');
  }
  function openPalette() {
    ensurePalette();
    palette.classList.add('open');
    paletteInput.value = '';
    paletteInput.dispatchEvent(new Event('input'));
    setTimeout(() => paletteInput.focus(), 60);
  }
  function closePalette() {
    if (palette) palette.classList.remove('open');
  }

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      openPalette();
    } else if (e.key === 'Escape') {
      closePalette();
    } else if (e.key === 't' && !typing && !e.metaKey && !e.ctrlKey) {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
  });

  /* ---------- 导出 ---------- */
  function setCurrent(file) {
    const norm = (s) => String(s || '').toLowerCase().replace(/\.html$/, '').replace(/^index$/, 'cover');
    current = norm(file);
    const mark = (scope) => {
      scope.querySelectorAll('a[data-href]').forEach((a) => {
        const on = norm(a.dataset.href) === current ||
          (norm(a.dataset.href) === 'home' && (current === 'post' || current === 'home'));
        if (on) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };
    mark(header);
    mark(drawer);
    document.body.classList.toggle('is-cover', current === 'cover');
  }

  window.Site = { toast, setTheme, openPalette, closePalette, setCurrent, closeDrawer };

  /* 支持 #search 深链直接打开搜索 */
  if (location.hash === '#search') setTimeout(openPalette, 80);
  window.addEventListener('hashchange', () => {
    if (location.hash === '#search') openPalette();
  });
})();
