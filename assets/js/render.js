/* ============================================================
   render.js —— 各页面内容渲染
   页面在 <body data-page="home|archive|notes|books|photos|messages|about|lab|cover">
   ============================================================ */
(function () {
  'use strict';

  const page = document.body.dataset.page || '';
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const fmt = (iso) => DataUtil.fmtDate(iso);
  const shortDate = (iso) => iso.slice(5).replace('-', ' / ');
  const tagLabel = (t) => DataUtil.tag(t).label;

  const tagHTML = (tags) => (tags || []).map((t) =>
    '<span class="tag">' + esc(tagLabel(t)) + '</span>').join('');

  /* ---------- 封面 ---------- */
  function initCover() {
    const posts = (typeof POSTS !== 'undefined') ? POSTS.length : 0;
    const chars = (typeof POSTS !== 'undefined')
      ? POSTS.reduce((sum, p) => sum + DataUtil.wordCount(p), 0) : 0;
    const since = (typeof SITE !== 'undefined') ? SITE.start : '2026-05-01';
    const days = DataUtil.daysSince(since);
    const y = since.slice(0, 4), m = since.slice(5, 7);
    const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
    set('#stat-posts', posts);
    set('#stat-chars', chars.toLocaleString('en-US'));
    set('#stat-since', y + '.' + m);
    set('#stat-days', days);

    const cta = $('#cover-enter');
    const cover = $('.cover');
    if (cta) cta.addEventListener('click', (e) => {
      e.preventDefault();
      location.href = 'home.html';
    });
    if (cover) {
      cover.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        location.href = 'home.html';
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'ArrowDown') location.href = 'home.html';
    });
  }

  /* ---------- 首页 ---------- */
  function initHome() {
    const featuredBox = $('#featured');
    if (featuredBox) {
      const picks = POSTS.filter((p) => p.featured).slice(0, 3);
      const list = (picks.length ? picks : POSTS.slice(0, 3));
      featuredBox.innerHTML = list.map((p) =>
        '<a class="feature-card" href="post.html?id=' + encodeURIComponent(p.id) + '">' +
          '<span class="meta">' + esc(fmt(p.date)) + ' · ' + p.minutes + ' 分钟</span>' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.excerpt) + '</p>' +
        '</a>').join('');
    }

    const chipsBox = $('#filter-chips');
    const listBox = $('#post-list');
    const searchInput = $('#post-search');
    const countEl = $('#post-count');
    if (!listBox) return;

    let activeTag = 'all';
    let q = '';

    const usedTags = Object.keys(TAGS).filter((t) => POSTS.some((p) => (p.tags || []).includes(t)));
    if (chipsBox) {
      chipsBox.innerHTML =
        '<button class="chip" data-tag="all" aria-pressed="true">全部</button>' +
        usedTags.map((t) =>
          '<button class="chip" data-tag="' + t + '" aria-pressed="false">' + esc(tagLabel(t)) + '</button>'
        ).join('');
      chipsBox.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        activeTag = chip.dataset.tag;
        $$('.chip', chipsBox).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        draw();
      });
    }

    if (searchInput) {
      let timer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => { q = searchInput.value.trim().toLowerCase(); draw(); }, 200);
      });
    }

    function draw() {
      let items = POSTS.slice();
      if (activeTag !== 'all') items = items.filter((p) => (p.tags || []).includes(activeTag));
      if (q) {
        items = items.filter((p) =>
          (p.title + ' ' + p.excerpt + ' ' + (p.tags || []).map(tagLabel).join(' ')).toLowerCase().includes(q)
        );
      }
      if (countEl) countEl.textContent = items.length;
      if (!items.length) {
        listBox.innerHTML = '<div class="empty">没有匹配的文章，换个关键词试试。</div>';
        return;
      }
      listBox.innerHTML = items.map((p) =>
        '<a class="post-card" href="post.html?id=' + encodeURIComponent(p.id) + '">' +
          '<div class="post-date">' + esc(fmt(p.date)) + '</div>' +
          '<div class="post-body">' +
            '<h3 class="post-title">' + esc(p.title) + '</h3>' +
            '<p class="post-excerpt">' + esc(p.excerpt) + '</p>' +
            '<div class="post-foot">' +
              tagHTML(p.tags) +
              '<span class="post-time">' + p.minutes + ' min</span>' +
              '<svg class="post-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>' +
            '</div>' +
          '</div>' +
        '</a>').join('');
    }
    draw();
  }

  /* ---------- 归档 ---------- */
  function initArchive() {
    const timeline = $('#arc-timeline');
    const cloud = $('#arc-tags');
    const tabs = $$('.tab');
    if (!timeline) return;

    const groups = {};
    POSTS.forEach((p) => {
      const y = p.date.slice(0, 4);
      (groups[y] = groups[y] || []).push(p);
    });
    timeline.innerHTML = Object.keys(groups).sort((a, b) => b - a).map((y) => {
      const rows = groups[y].sort((a, b) => b.date.localeCompare(a.date)).map((p) =>
        '<a class="year-row" href="post.html?id=' + encodeURIComponent(p.id) + '">' +
          '<span class="d">' + esc(shortDate(p.date)) + '</span>' +
          '<span class="t">' + esc(p.title) + '</span>' +
          '<span class="tags">' + tagHTML(p.tags) + '</span>' +
        '</a>').join('');
      return '<div class="year-block"><div class="year-head"><h2>' + y + '</h2><span>' + groups[y].length + ' 篇</span></div>' + rows + '</div>';
    }).join('');

    if (cloud) {
      cloud.innerHTML = Object.keys(TAGS).map((t) => {
        const items = POSTS.filter((p) => (p.tags || []).includes(t));
        if (!items.length) return '';
        return '<div class="tag-cloud-row">' +
          '<h3>' + esc(tagLabel(t)) + '<small>' + items.length + ' 篇</small></h3>' +
          '<div class="tag-cloud-list">' +
          items.map((p) => '<a href="post.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + '</a>').join('') +
          '</div></div>';
      }).join('');
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      const mode = tab.dataset.tab;
      $('#arc-timeline-wrap').hidden = mode !== 'time';
      $('#arc-tags-wrap').hidden = mode !== 'tags';
    }));
  }

  /* ---------- 碎片 ---------- */
  function initNotes() {
    const box = $('#note-list');
    if (!box) return;
    const groups = {};
    NOTES.forEach((n) => {
      const y = n.date.slice(0, 4);
      (groups[y] = groups[y] || []).push(n);
    });
    box.innerHTML = Object.keys(groups).sort((a, b) => b - a).map((y) =>
      '<div class="note-year">' + y + '</div>' +
      groups[y].sort((a, b) => b.date.localeCompare(a.date)).map((n) =>
        '<div class="note">' +
          '<div class="note-date">' + esc(shortDate(n.date)) + '</div>' +
          '<div class="note-body">' + esc(n.text) +
            (n.tag ? '<div><span class="tag">' + esc(tagLabel(n.tag)) + '</span></div>' : '') +
          '</div>' +
        '</div>').join('')
    ).join('');
  }

  /* ---------- 书架 ---------- */
  function initBooks() {
    const box = $('#book-list');
    if (!box) return;
    const filterBox = $('#book-filter');
    const STATUS = {
      done: { label: '已读完', cls: 'done' },
      reading: { label: '在读', cls: 'reading' },
      wish: { label: '想读', cls: 'todo' },
      todo: { label: '想读', cls: 'todo' },
    };
    let status = 'all';

    const counts = { all: BOOKS.length };
    BOOKS.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });

    if (filterBox) {
      filterBox.innerHTML = [['all', '全部'], ['reading', '在读'], ['done', '已读完'], ['wish', '想读']]
        .filter(([k]) => k === 'all' || counts[k])
        .map(([k, label]) =>
          '<button class="chip" data-status="' + k + '" aria-pressed="' + (k === 'all') + '">' + label +
          (counts[k] ? ' <span style="opacity:.55">' + counts[k] + '</span>' : '') + '</button>'
        ).join('');
      filterBox.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        status = chip.dataset.status;
        $$('.chip', filterBox).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        draw();
      });
    }

    function draw() {
      const items = status === 'all' ? BOOKS : BOOKS.filter((b) => b.status === status);      if (!items.length) { box.innerHTML = '<div class="empty">这个状态还没有书。</div>'; return; }
      box.innerHTML = items.map((b) => {
        const st = STATUS[b.status] || STATUS.todo;
        const stars = b.rating ? '<span class="stars">' + '★'.repeat(b.rating) + '☆'.repeat(Math.max(0, 5 - b.rating)) + '</span>' : '';
        return '<div class="book-row">' +
          '<a class="book-cover" href="' + esc(b.link || '#') + '" target="_blank" rel="noopener" aria-label="' + esc(b.title) + '">' +
            '<img src="' + esc(b.cover) + '" alt="《' + esc(b.title) + '》封面" loading="lazy" width="92" height="138">' +
          '</a>' +
          '<div>' +
            '<div class="book-title">' + esc(b.title) + '</div>' +
            (b.subtitle ? '<p class="book-sub">' + esc(b.subtitle) + '</p>' : '') +
            '<div class="book-meta">' +
              '<span>' + esc(b.author) + '</span>' +
              '<span>' + esc(b.year) + '</span>' +
              '<span class="status ' + st.cls + '">' + st.label + '</span>' +
              stars +
            '</div>' +
            (b.note ? '<p class="book-note">' + esc(b.note) + '</p>' : '') +
          '</div>' +
        '</div>';
      }).join('');
    }
    draw();
  }

  /* ---------- 相册 ---------- */
  function initPhotos() {
    const grid = $('#photo-grid');
    if (!grid) return;
    const photos = (typeof PHOTOS !== 'undefined') ? PHOTOS : [];
    grid.innerHTML = photos.map((p, i) =>
      '<a class="photo-card" href="' + esc(p.src) + '" data-index="' + i + '" aria-label="查看大图：' + esc(p.cap) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.cap) + '" loading="' + (i < 3 ? 'eager' : 'lazy') + '">' +
        '<figcaption><span class="cap-t">' + esc(p.cap) + '</span><span>' + esc(p.date) + '</span></figcaption>' +
      '</a>').join('');

    const lb = $('#lightbox');
    const lbImg = $('#lb-img');
    const lbCap = $('#lb-cap');
    if (!lb) return;
    let idx = 0;

    function open(i) {
      idx = (i + photos.length) % photos.length;
      lbImg.src = photos[idx].src;
      lbImg.alt = photos[idx].cap;
      lbCap.textContent = photos[idx].cap + ' · ' + photos[idx].date;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
    }

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.photo-card');
      if (!card) return;
      e.preventDefault();
      open(Number(card.dataset.index));
    });
    $('#lb-close').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') open(idx + 1);
      if (e.key === 'ArrowLeft') open(idx - 1);
    });
  }

  /* ---------- 留言 ---------- */
  function initMessages() {
    const list = $('#msg-list');
    const form = $('#msg-form');
    if (!list) return;
    const KEY = 'lg-messages-v2';

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
    }
    function save(items) {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { }
    }
    function draw() {
      const items = load();
      if (!items.length) {
        list.innerHTML = '<div class="empty">还没有留言。第一条就留给你了。</div>';
        return;
      }
      list.innerHTML = items.slice().reverse().map((m) =>
        '<div class="msg"><div class="msg-head"><span class="msg-name">' + esc(m.name) + '</span>' +
        '<span class="msg-time">' + esc(m.time) + '</span></div>' +
        '<div class="msg-text">' + esc(m.text) + '</div></div>'
      ).join('');
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.elements.name.value.trim();
        const text = form.elements.text.value.trim();
        const nameErr = $('#err-name');
        const textErr = $('#err-text');
        nameErr.textContent = name ? '' : '请留一个称呼。';
        textErr.textContent = text ? '' : '写点什么再发送吧。';
        if (!name || !text) return;
        const items = load();
        const now = new Date();
        items.push({
          name: name.slice(0, 20),
          text: text.slice(0, 500),
          time: now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0'),
        });
        save(items);
        form.reset();
        draw();
        if (window.Site) Site.toast('留言已保存在本机');
      });
    }
    draw();
  }

  /* ---------- 关于 ---------- */
  function initAbout() {
    const nowBox = $('#about-now');
    if (nowBox) {
      nowBox.innerHTML = ABOUT.now.map((row) =>
        '<div class="dl-row"><dt>' + esc(row.label) + '</dt><dd>' + esc(row.text) + '</dd></div>'
      ).join('');
    }
    const usesBox = $('#about-uses');
    if (usesBox) {
      usesBox.innerHTML = ABOUT.uses.map((g) =>
        '<div class="uses-group"><h3>' + esc(g.group) + '</h3><ul>' +
        g.items.map((i) => '<li>' + esc(i) + '</li>').join('') +
        '</ul></div>').join('');
    }
    const projBox = $('#about-projects');
    if (projBox) {
      projBox.innerHTML = ABOUT.projects.map((p) =>
        '<div class="project-card"><h3><a href="' + esc(p.href) + '">' + esc(p.name) + '</a></h3>' +
        '<p>' + esc(p.desc) + '</p>' +
        '<div class="stack-row">' + p.stack.map((s) => '<span class="tag">' + esc(s) + '</span>').join('') + '</div></div>'
      ).join('');
    }
  }

  /* ---------- 实验室 ---------- */
  function initLab() {
    const preview = $('#lab-preview');
    if (!preview) return;
    const out = $('#lab-code');
    const ctrls = {
      blur: { el: $('#c-blur'), val: $('#v-blur'), unit: 'px', def: 16 },
      saturate: { el: $('#c-saturate'), val: $('#v-saturate'), unit: '%', def: 160 },
      opacity: { el: $('#c-opacity'), val: $('#v-opacity'), unit: '%', def: 72 },
      radius: { el: $('#c-radius'), val: $('#v-radius'), unit: 'px', def: 22 },
      hi: { el: $('#c-hi'), val: $('#v-hi'), unit: '%', def: 60 },
    };
    const get = (k) => Number(ctrls[k].el.value);

    function apply() {
      const blur = get('blur'), sat = get('saturate') / 100, op = get('opacity') / 100,
        r = get('radius'), hi = get('hi') / 100;
      preview.style.borderRadius = r + 'px';
      preview.style.background = 'rgba(255,255,255,' + op + ')';
      preview.style.backdropFilter = 'blur(' + blur + 'px) saturate(' + sat + ')';
      preview.style.webkitBackdropFilter = 'blur(' + blur + 'px) saturate(' + sat + ')';
      preview.style.boxShadow =
        'inset 0 1px 0 rgba(255,255,255,' + hi + '), 0 1px 2px rgba(16,24,40,.04), 0 12px 32px rgba(16,24,40,.08)';
      Object.keys(ctrls).forEach((k) => {
        if (ctrls[k].val) ctrls[k].val.textContent = get(k) + ctrls[k].unit;
      });
      if (out) {
        out.textContent =
          '.glass {\n' +
          '  border-radius: ' + r + 'px;\n' +
          '  background: rgba(255, 255, 255, ' + op + ');\n' +
          '  backdrop-filter: blur(' + blur + 'px) saturate(' + sat + ');\n' +
          '  box-shadow:\n' +
          '    inset 0 1px 0 rgba(255, 255, 255, ' + hi + '),\n' +
          '    0 1px 2px rgba(16, 24, 40, .04),\n' +
          '    0 12px 32px rgba(16, 24, 40, .08);\n' +
          '}';
      }
    }
    Object.keys(ctrls).forEach((k) => ctrls[k].el.addEventListener('input', apply));
    const copyBtn = $('#lab-copy');
    if (copyBtn) copyBtn.addEventListener('click', () => {
      const text = out.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(() => window.Site && Site.toast('CSS 已复制'))
        .catch(() => window.Site && Site.toast('复制失败，请手动选中'));
    });
    const resetBtn = $('#lab-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      Object.keys(ctrls).forEach((k) => { ctrls[k].el.value = ctrls[k].def; });
      apply();
    });
    apply();
  }

  /* ---------- 分发 ---------- */
  const MAP = {
    cover: initCover,
    home: initHome,
    archive: initArchive,
    notes: initNotes,
    books: initBooks,
    photos: initPhotos,
    messages: initMessages,
    about: initAbout,
    lab: initLab,
  };
  if (MAP[page]) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', MAP[page]);
    else MAP[page]();
  }
})();
