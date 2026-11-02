/* ============================================================
   液态玻璃博客 · 扩展模块
   导航「更多」、⌘K 快速跳转、归档 / 标签 / 笔记 / 书单 / 关于 / 实验室
   依赖 data.js 与 main.js（LG.util），首次加载与无刷新路由都会调用 initExtras()
   ============================================================ */

window.LG = window.LG || {};

(function () {
  'use strict';

  const U = window.LG.util || {};
  const esc = U.escHTML || ((s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const REDUCED = U.REDUCED || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     页面索引（⌘K 与「更多」菜单共用）
     --------------------------------------------------------- */
  const PAGES = [
    { name: '首页', href: 'index.html', hint: '封面 · 进入小屋', kw: 'home cover 换页' },
    { name: '博客', href: 'home.html', hint: '文章信息流', kw: 'blog posts 文章' },
    { name: '相册', href: 'photos.html', hint: '照片墙', kw: 'photos 图片' },
    { name: '留言板', href: 'messages.html', hint: '留言 · 点赞', kw: 'guestbook 留言' },
    { name: '归档', href: 'archive.html', hint: '全部文章 · 时间线', kw: 'archive 归档 时间' },
    { name: '标签', href: 'tags.html', hint: '按主题浏览', kw: 'tags 分类' },
    { name: '笔记', href: 'notes.html', hint: '碎片想法', kw: 'notes til 碎碎念' },
    { name: '书单', href: 'books.html', hint: '读过的书', kw: 'books library 阅读' },
    { name: '实验室', href: 'lab.html', hint: '玻璃参数调节器', kw: 'lab glass playground 实验' },
    { name: '关于', href: 'about.html', hint: 'Now · 工具 · 项目', kw: 'about now uses projects' },
  ];

  const MORE_PAGES = ['archive.html', 'tags.html', 'notes.html', 'books.html', 'lab.html', 'about.html'];

  /* ---------------------------------------------------------
     导航「更多」 + 快速跳转按钮 + 页脚补充链接
     --------------------------------------------------------- */
  function mountNav() {
    const nav = document.querySelector('.top-links');
    if (nav && !nav.querySelector('.nav-more')) {
      const wrap = document.createElement('div');
      wrap.className = 'nav-more';
      wrap.innerHTML =
        '<button class="more-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="更多页面"' +
        ' data-pages="' + MORE_PAGES.join(',') + '">' +
        '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>' +
        '  更多' +
        '  <svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6.5 4 4 4-4"/></svg>' +
        '</button>' +
        '<div class="nav-more-menu" role="menu">' +
        PAGES.slice(4).map((p) =>
          '<a role="menuitem" href="' + p.href + '"><span>' + p.name + '</span><em>' + p.hint + '</em></a>'
        ).join('') +
        '</div>';
      nav.appendChild(wrap);

      const btn = wrap.querySelector('.more-btn');
      const menu = wrap.querySelector('.nav-more-menu');
      const close = () => { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = !wrap.classList.contains('open');
        wrap.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
      menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
      if (window.LG.updateActiveNav) window.LG.updateActiveNav();
    }

    const topbar = document.querySelector('.topbar');
    const themeBtn = document.getElementById('theme-toggle');
    if (topbar && themeBtn && !document.getElementById('palette-btn')) {
      const b = document.createElement('button');
      b.className = 'icon-btn palette-btn';
      b.id = 'palette-btn';
      b.type = 'button';
      b.setAttribute('aria-label', '快速跳转（Ctrl 或 ⌘ + K）');
      b.title = '快速跳转（Ctrl/⌘ + K）';
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.4 4.4"/></svg>';
      topbar.insertBefore(b, themeBtn);
      b.addEventListener('click', () => openPalette());
    }

    const fnav = document.querySelector('.footer-links');
    if (fnav && !fnav.dataset.extended) {
      fnav.dataset.extended = '1';
      const extra = [
        ['归档', 'archive.html'],
        ['书单', 'books.html'],
        ['实验室', 'lab.html'],
        ['RSS', 'feed.xml'],
      ];
      extra.forEach(([label, href]) => {
        const existing = Array.prototype.find.call(fnav.querySelectorAll('a'), (a) => a.textContent.trim() === label);
        if (existing) {
          if (label === 'RSS' && (existing.getAttribute('href') === '#' || !existing.getAttribute('href'))) {
            existing.setAttribute('href', href);
            existing.setAttribute('data-no-vt', '');
          }
          return;
        }
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        if (href === 'feed.xml') a.setAttribute('data-no-vt', '');
        fnav.insertBefore(a, fnav.lastElementChild);
      });
    }
  }

  /* ---------------------------------------------------------
     快速跳转面板（⌘K / Ctrl+K / /）
     --------------------------------------------------------- */
  let paletteEls = null;
  let paletteItems = [];
  let paletteSource = [];
  let paletteIndex = 0;

  function buildPaletteItems() {
    const items = [];
    PAGES.forEach((p) => items.push({ type: '页面', title: p.name, sub: p.hint, href: p.href, key: p.name + p.hint + p.kw }));
    if (typeof POSTS !== 'undefined') {
      POSTS.forEach((p) => items.push({
        type: '文章', title: p.title, sub: p.date.replace(/-/g, ' / '), href: 'post.html?id=' + p.id,
        key: p.title + p.excerpt + p.tags.join(' '),
      }));
    }
    if (typeof TAGS !== 'undefined') {
      Object.keys(TAGS).forEach((t) => items.push({
        type: '标签', title: TAGS[t].label, sub: '按标签浏览', href: 'tags.html?tag=' + t, key: TAGS[t].label + ' ' + t,
      }));
    }
    return items;
  }

  function mountPalette() {
    if (paletteEls) return;
    const wrap = document.createElement('div');
    wrap.className = 'palette';
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="palette-box glass" role="dialog" aria-modal="true" aria-label="快速跳转">' +
      '  <div class="palette-head">' +
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.4 4.4"/></svg>' +
      '    <input id="palette-input" type="text" placeholder="搜索文章、页面或标签…" autocomplete="off" spellcheck="false">' +
      '    <kbd>Esc</kbd>' +
      '  </div>' +
      '  <div class="palette-list" id="palette-list" role="listbox"></div>' +
      '  <div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> 选择</span><span><kbd>↵</kbd> 打开</span><span><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> 呼出</span></div>' +
      '</div>';
    document.body.appendChild(wrap);

    const box = wrap.querySelector('.palette-box');
    const input = wrap.querySelector('#palette-input');
    const list = wrap.querySelector('#palette-list');

    wrap.addEventListener('click', (e) => { if (e.target === wrap) closePalette(); });
    input.addEventListener('input', () => renderPalette(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); movePalette(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); movePalette(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); openPaletteItem(paletteItems[paletteIndex]); }
    });
    list.addEventListener('click', (e) => {
      const row = e.target.closest('.palette-item');
      if (row) openPaletteItem(paletteItems[Number(row.dataset.index)]);
    });
    list.addEventListener('mousemove', (e) => {
      const row = e.target.closest('.palette-item');
      if (row && Number(row.dataset.index) !== paletteIndex) {
        paletteIndex = Number(row.dataset.index);
        highlightPalette();
      }
    });

    paletteSource = buildPaletteItems();
    paletteEls = { wrap, box, input, list };
  }

  function renderPalette(query) {
    const q = (query || '').trim().toLowerCase();
    paletteItems = paletteSource.filter((it) => !q || it.key.toLowerCase().indexOf(q) >= 0).slice(0, 24);
    paletteIndex = 0;
    paletteEls.list.innerHTML = paletteItems.length
      ? paletteItems.map((it, i) =>
        '<button class="palette-item' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" role="option">' +
        '<span class="pi-type">' + it.type + '</span>' +
        '<span class="pi-main"><b>' + esc(it.title) + '</b><em>' + esc(it.sub) + '</em></span>' +
        '<span class="pi-go">↵</span>' +
        '</button>').join('')
      : '<p class="palette-empty">没有找到匹配项，换个词试试。</p>';
  }

  function highlightPalette() {
    paletteEls.list.querySelectorAll('.palette-item').forEach((el) => {
      el.classList.toggle('active', Number(el.dataset.index) === paletteIndex);
    });
    const cur = paletteEls.list.querySelector('.palette-item.active');
    if (cur) cur.scrollIntoView({ block: 'nearest' });
  }

  function movePalette(dir) {
    const rows = paletteEls.list.querySelectorAll('.palette-item');
    if (!rows.length) return;
    paletteIndex = (paletteIndex + dir + rows.length) % rows.length;
    highlightPalette();
  }

  function openPaletteItem(item) {
    if (!item) return;
    closePalette();
    const a = document.createElement('a');
    a.href = item.href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function openPalette() {
    mountPalette();
    if (!paletteEls) return;
    paletteIndex = 0;
    paletteSource = buildPaletteItems();
    paletteEls.wrap.hidden = false;
    paletteEls.input.value = '';
    renderPalette('');
    requestAnimationFrame(() => {
      paletteEls.wrap.classList.add('on');
      paletteEls.input.focus();
    });
  }

  function closePalette() {
    if (!paletteEls || paletteEls.wrap.hidden) return;
    paletteEls.wrap.classList.remove('on');
    setTimeout(() => { if (paletteEls) paletteEls.wrap.hidden = true; }, REDUCED ? 0 : 180);
  }

  function bindPaletteShortcuts() {
    if (bindPaletteShortcuts.done) return;
    bindPaletteShortcuts.done = true;
    document.addEventListener('keydown', (e) => {
      const typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (paletteEls && !paletteEls.wrap.hidden) closePalette(); else openPalette();
        return;
      }
      if (e.key === 'Escape' && paletteEls && !paletteEls.wrap.hidden) closePalette();
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openPalette();
      }
    });
  }

  /* ---------------------------------------------------------
     页面：归档
     --------------------------------------------------------- */
  function initArchive(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';
    if (typeof POSTS === 'undefined') return;

    const posts = POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    const chars = POSTS.reduce((s, p) => s + DataUtil.wordCount(p), 0);
    const years = [];
    posts.forEach((p) => { const y = p.date.slice(0, 4); if (years.indexOf(y) < 0) years.push(y); });

    const groups = years.map((y) => {
      const list = posts.filter((p) => p.date.slice(0, 4) === y);
      return '<section class="arc-block">' +
        '<header class="arc-year"><h2>' + y + '</h2><span>' + list.length + ' 篇</span></header>' +
        '<ol class="arc-list">' +
        list.map((p) => {
          const tags = p.tags.map((t) => {
            const d = DataUtil.tag(t);
            return '<span class="arc-tag" style="--c:' + d.color + '">' + d.label + '</span>';
          }).join('');
          return '<li class="arc-item reveal">' +
            '<a class="arc-row" href="post.html?id=' + p.id + '">' +
            '<time class="arc-date">' + DataUtil.fmtShort(p.date) + '</time>' +
            '<span class="arc-dot" style="--c:' + p.accent + '"></span>' +
            '<span class="arc-main"><b>' + esc(p.title) + '</b><em>' + esc(p.excerpt) + '</em></span>' +
            '<span class="arc-side">' + tags + '<span class="arc-min">' + p.minutes + ' 分钟</span></span>' +
            '</a></li>';
        }).join('') +
        '</ol></section>';
    }).join('');

    root.innerHTML =
      '<header class="page-head reveal">' +
      '  <div class="sec-no">ARCHIVE / 全部文章</div>' +
      '  <h1 class="page-title">归档</h1>' +
      '  <p class="page-sub">一共 <b>' + POSTS.length + '</b> 篇文章，约 <b>' + (chars / 1000).toFixed(1) + 'k</b> 字，横跨 ' + years.length + ' 个年份。</p>' +
      '</header>' + groups;

    if (window.LG.armRevealsAll) window.LG.armRevealsAll();
  }

  /* ---------------------------------------------------------
     页面：标签
     --------------------------------------------------------- */
  function initTags(root) {
    if (typeof POSTS === 'undefined') return;
    const current = new URLSearchParams(location.search).get('tag') || '';
    const counts = {};
    POSTS.forEach((p) => p.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const tags = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    const cloud = '<a class="tag-chip' + (!current ? ' active' : '') + '" href="tags.html">全部<em>' + POSTS.length + '</em></a>' +
      tags.map((t) => {
        const d = DataUtil.tag(t);
        return '<a class="tag-chip' + (current === t ? ' active' : '') + '" style="--c:' + d.color + '" href="tags.html?tag=' + t + '">' +
          d.label + '<em>' + counts[t] + '</em></a>';
      }).join('');

    const list = (current ? POSTS.filter((p) => p.tags.indexOf(current) >= 0) : POSTS)
      .slice().sort((a, b) => (a.date < b.date ? 1 : -1));

    const rows = list.map((p) => {
      const d = DataUtil.tag(p.tags[0]);
      return '<a class="tag-post glass reveal" href="post.html?id=' + p.id + '" style="--a:' + p.accent + '">' +
        '<span class="tp-date">' + DataUtil.fmtShort(p.date) + '</span>' +
        '<span class="tp-main"><b>' + esc(p.title) + '</b><em>' + esc(p.excerpt) + '</em></span>' +
        '<span class="tp-tag" style="--c:' + d.color + '">' + d.label + '</span>' +
        '</a>';
    }).join('');

    root.innerHTML =
      '<header class="page-head reveal">' +
      '  <div class="sec-no">TAGS / 按主题浏览</div>' +
      '  <h1 class="page-title">' + (current ? esc(DataUtil.tag(current).label) : '标签') + '</h1>' +
      '  <p class="page-sub">' + tags.length + ' 个主题，' + POSTS.length + ' 篇文章。挑一个顺眼的开始吧。</p>' +
      '</header>' +
      '<div class="tag-cloud-wrap reveal">' + cloud + '</div>' +
      '<div class="tag-post-list">' + (rows || '<p class="empty-hint">这个标签下还没有文章。</p>') + '</div>';

    if (window.LG.armRevealsAll) window.LG.armRevealsAll();
  }

  /* ---------------------------------------------------------
     页面：笔记
     --------------------------------------------------------- */
  function initNotes(root) {
    if (typeof NOTES === 'undefined' || root.dataset.ready) return;
    root.dataset.ready = '1';
    const list = NOTES.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    root.innerHTML =
      '<header class="page-head reveal">' +
      '  <div class="sec-no">NOTES / 碎片与想法</div>' +
      '  <h1 class="page-title">笔记</h1>' +
      '  <p class="page-sub">不构成文章的短想法，' + list.length + ' 条，持续生长中。</p>' +
      '</header>' +
      '<ol class="notes-list">' +
      list.map((n) => {
        const d = DataUtil.tag(n.tag);
        return '<li class="note-item glass reveal">' +
          '<div class="note-head"><time>' + DataUtil.fmtDate(n.date) + '</time>' +
          '<span class="note-tag" style="--c:' + d.color + '">' + d.label + '</span></div>' +
          '<p class="note-text">' + esc(n.text) + '</p></li>';
      }).join('') +
      '</ol>';
    if (window.LG.armRevealsAll) window.LG.armRevealsAll();
  }

  /* ---------------------------------------------------------
     页面：书单
     --------------------------------------------------------- */
  function initBooks(root) {
    if (typeof BOOKS === 'undefined' || root.dataset.ready) return;
    root.dataset.ready = '1';
    const STATUS = { done: '读完了', reading: '在读', wish: '想读' };
    const chips = '<button class="filter-pill active" data-status="all">全部</button>' +
      Object.keys(STATUS).map((k) =>
        '<button class="filter-pill" data-status="' + k + '">' + STATUS[k] + '</button>').join('');

    function card(b) {
      const stars = b.rating ? '★'.repeat(b.rating) + '☆'.repeat(5 - b.rating) : '';
      return '<article class="book-card glass reveal" data-status="' + b.status + '">' +
        '<div class="book-cover" style="--bc:' + b.color + '"><b>' + esc(b.title) + '</b><span>' + esc(b.author) + '</span></div>' +
        '<div class="book-info">' +
        '  <h3>' + esc(b.title) + '</h3>' +
        '  <p class="book-meta">' + esc(b.author) + ' · ' + b.year + '</p>' +
        '  <p class="book-note">' + esc(b.note) + '</p>' +
        '  <div class="book-foot"><span class="book-status s-' + b.status + '">' + STATUS[b.status] + '</span>' +
        (stars ? '<span class="book-rate" title="' + b.rating + ' 星">' + stars + '</span>' : '') +
        '</div></div></article>';
    }

    root.innerHTML =
      '<header class="page-head reveal">' +
      '  <div class="sec-no">LIBRARY / 阅读清单</div>' +
      '  <h1 class="page-title">书单</h1>' +
      '  <p class="page-sub">读过的、在读的、想读的。' + BOOKS.length + ' 本，慢慢补。</p>' +
      '</header>' +
      '<div class="filter-row books-filter reveal">' + chips + '</div>' +
      '<div class="books-grid">' + BOOKS.map(card).join('') + '</div>' +
      '<p class="empty-hint books-empty" hidden>这个分类下还没有书。</p>';

    const grid = root.querySelector('.books-grid');
    const filter = root.querySelector('.books-filter');
    filter.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      filter.querySelectorAll('.filter-pill').forEach((b) => b.classList.toggle('active', b === btn));
      const s = btn.dataset.status;
      let shown = 0;
      grid.querySelectorAll('.book-card').forEach((c) => {
        const on = s === 'all' || c.dataset.status === s;
        c.hidden = !on;
        if (on) shown++;
      });
      root.querySelector('.books-empty').hidden = shown > 0;
    });
    if (window.LG.armRevealsAll) window.LG.armRevealsAll();
  }

  /* ---------------------------------------------------------
     页面：关于（Now / 工具 / 项目）
     --------------------------------------------------------- */
  function initAbout(root) {
    if (typeof ABOUT === 'undefined' || root.dataset.ready) return;
    root.dataset.ready = '1';
    const now = ABOUT.now.map((n) =>
      '<li><span class="now-label">' + esc(n.label) + '</span><p>' + esc(n.text) + '</p></li>').join('');
    const uses = ABOUT.uses.map((g) =>
      '<div class="uses-group"><h4>' + esc(g.group) + '</h4><ul>' +
      g.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul></div>').join('');
    const projects = ABOUT.projects.map((p) =>
      '<a class="project-card glass reveal" href="' + p.href + '">' +
      '<h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p>' +
      '<div class="project-stack">' + p.stack.map((s) => '<span>' + esc(s) + '</span>').join('') + '</div>' +
      '<span class="project-go">查看 →</span></a>').join('');

    root.innerHTML =
      '<header class="page-head reveal">' +
      '  <div class="sec-no">ABOUT / 关于这间小屋</div>' +
      '  <h1 class="page-title">关于</h1>' +
      '  <p class="page-sub">你好，我是 Tom。前端的、玻璃的、以及一些与代码无关的。</p>' +
      '</header>' +
      '<section class="about-block reveal"><h2 class="about-h">现在<em>Now</em></h2><ul class="now-list">' + now + '</ul></section>' +
      '<section class="about-block reveal"><h2 class="about-h">工具<em>Uses</em></h2><div class="uses-grid">' + uses + '</div></section>' +
      '<section class="about-block reveal"><h2 class="about-h">项目<em>Projects</em></h2><div class="projects-grid">' + projects + '</div></section>';
    if (window.LG.armRevealsAll) window.LG.armRevealsAll();
  }

  /* ---------------------------------------------------------
     页面：实验室（玻璃参数调节器）
     --------------------------------------------------------- */
  const LAB_PRESETS = {
    clear: { blur: 14, sat: 150, alpha: 0.16, radius: 26, hue: 210, sheen: 55 },
    frost: { blur: 30, sat: 190, alpha: 0.30, radius: 22, hue: 205, sheen: 85 },
    dream: { blur: 22, sat: 170, alpha: 0.24, radius: 34, hue: 280, sheen: 70 },
    deep: { blur: 8, sat: 130, alpha: 0.42, radius: 18, hue: 225, sheen: 40 },
  };

  function initLab(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';
    const stage = root.querySelector('.lab-glass');
    const codeEl = root.querySelector('.lab-code code');
    const controls = Array.from(root.querySelectorAll('input[type="range"]'));
    const state = Object.assign({}, LAB_PRESETS.clear);

    function render() {
      const v = state;
      const tint = 'hsla(' + v.hue + ', 90%, 62%, ' + (v.alpha * 0.35).toFixed(2) + ')';
      const style = [
        'background: linear-gradient(135deg, rgba(255,255,255,' + (v.alpha * 0.5).toFixed(2) + '), rgba(255,255,255,' + (v.alpha * 0.18).toFixed(2) + ') 55%, ' + tint + ');',
        'backdrop-filter: blur(' + v.blur + 'px) saturate(' + (v.sat / 100).toFixed(2) + ');',
        '-webkit-backdrop-filter: blur(' + v.blur + 'px) saturate(' + (v.sat / 100).toFixed(2) + ');',
        'border-radius: ' + v.radius + 'px;',
        'box-shadow: inset 0 1px 0 rgba(255,255,255,' + (0.25 + v.sheen / 200).toFixed(2) + '), 0 18px 50px rgba(20, 28, 60, 0.28);',
        'border: 1px solid rgba(255,255,255,' + (0.2 + v.sheen / 300).toFixed(2) + ');',
      ];
      stage.setAttribute('style', style.join(' '));
      const code = '.glass {\n' + style.map((l) => '  ' + l).join('\n') + '\n}';
      if (codeEl) codeEl.textContent = code;
      controls.forEach((c) => {
        const out = c.parentElement.querySelector('output');
        if (out) out.value = state[c.dataset.key] + (c.dataset.unit || '');
      });
    }

    controls.forEach((c) => {
      c.addEventListener('input', () => {
        state[c.dataset.key] = Number(c.value);
        render();
      });
    });

    root.querySelectorAll('.lab-presets button').forEach((b) => {
      b.addEventListener('click', () => {
        const p = LAB_PRESETS[b.dataset.preset];
        if (!p) return;
        Object.assign(state, p);
        controls.forEach((c) => { c.value = state[c.dataset.key]; });
        root.querySelectorAll('.lab-presets button').forEach((x) => x.classList.toggle('active', x === b));
        render();
      });
    });

    const copy = root.querySelector('.lab-copy');
    if (copy) {
      copy.addEventListener('click', () => {
        const text = codeEl ? codeEl.textContent : '';
        const done = () => {
          copy.textContent = '已复制 ✓';
          setTimeout(() => { copy.textContent = '复制 CSS'; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
        else done();
      });
    }

    const reset = root.querySelector('.lab-reset');
    if (reset) reset.addEventListener('click', () => {
      Object.assign(state, LAB_PRESETS.clear);
      controls.forEach((c) => { c.value = state[c.dataset.key]; });
      root.querySelectorAll('.lab-presets button').forEach((x) => x.classList.toggle('active', x.dataset.preset === 'clear'));
      render();
    });

    render();
  }

  /* ---------------------------------------------------------
     调度：每个页面加载 / 切换后调用
     --------------------------------------------------------- */
  window.LG.initExtras = function () {
    mountNav();
    mountPalette();
    bindPaletteShortcuts();

    const targets = [
      ['archive-root', initArchive],
      ['tags-root', initTags],
      ['notes-root', initNotes],
      ['books-root', initBooks],
      ['about-root', initAbout],
      ['lab-root', initLab],
    ];
    targets.forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) fn(el);
    });
  };

  if (document.readyState !== 'loading') window.LG.initExtras();
  else document.addEventListener('DOMContentLoaded', () => window.LG.initExtras());
})();
