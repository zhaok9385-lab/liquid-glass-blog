/* ============================================================
   液态玻璃博客 · 主交互 + 无刷新路由（完整重构版）
   组件化：window.LG.initXxx 由无刷新路由在换页后重新挂载。
   ============================================================ */

(function () {
  'use strict';

  const doc = document.documentElement;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';   // 每页从顶部开始，避免恢复旧滚动位
  window.LG = window.LG || {};

  const escHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lsGet = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) || fb; } catch (e) { return fb; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 配额满忽略 */ } };
  window.LG.util = { escHTML, lsGet, lsSet, REDUCED, FINE_POINTER };

  /* ---------- 主题 ---------- */
  const THEME_KEY = 'lg-theme';
  function applyTheme(mode, animate) {
    const run = () => {
      doc.setAttribute('data-theme', mode);
      if (window.__setAuroraLight) window.__setAuroraLight(mode === 'light');
      window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
    };
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) { }
    if (animate && !REDUCED && document.startViewTransition) document.startViewTransition(run);
    else run();
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { }
  const theme0 = savedTheme === 'dark' ? 'dark' : 'light';
  doc.setAttribute('data-theme', theme0);
  if (window.__setAuroraLight) window.__setAuroraLight(theme0 === 'light');

  const themeBtn = document.getElementById('theme-toggle');
  function toggleTheme() {
    applyTheme(doc.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
  }
  // 焦点在输入控件内时不触发全局快捷键
  function isTypingTarget(el) {
    if (!el || el.nodeType !== 1) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
    if (e.key === 't' || e.key === 'T') toggleTheme();
  });

  /* ---------- Loader（仅会话首次访问播放开场） ---------- */
  const loader = document.getElementById('loader');
  let firstVisit = true;
  try {
    firstVisit = !sessionStorage.getItem('lg-loader-seen');
    sessionStorage.setItem('lg-loader-seen', '1');
  } catch (e) { }
  if (loader && firstVisit) {
    const hide = () => {
      loader.classList.add('done');
      doc.classList.add('ready');
      setTimeout(() => { if (loader.parentNode) loader.remove(); }, 900);
    };
    if (document.readyState === 'complete') setTimeout(hide, 550);
    else window.addEventListener('load', () => setTimeout(hide, 350));
    setTimeout(hide, 2600);
  } else {
    if (loader) loader.remove();
    doc.classList.add('ready');
  }

  /* ---------- 磁吸元素 ---------- */
  const magnets = [];
  function collectMagnets() {
    magnets.length = 0;
    document.querySelectorAll('[data-magnetic]').forEach((el) => magnets.push({ el, x: 0, y: 0, tx: 0, ty: 0 }));
  }

  /* ---------- 倾斜卡片 ---------- */
  const tilts = [];
  function collectTilts() {
    tilts.length = 0;
    document.querySelectorAll('[data-tilt]').forEach((el) => tilts.push({ el, rx: 0, ry: 0, trx: 0, try_: 0 }));
  }

  if (FINE_POINTER && !REDUCED) {
    window.addEventListener('pointermove', (e) => {
      for (const m of magnets) {
        const r = m.el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const range = Math.max(r.width, r.height) * 0.85 + 34;
        if (Math.hypot(dx, dy) < range) { m.tx = dx * 0.28; m.ty = dy * 0.28; }
        else { m.tx = 0; m.ty = 0; }
      }
      for (const t of tilts) {
        const r = t.el.getBoundingClientRect();
        if (e.clientX < r.left - 60 || e.clientX > r.right + 60 || e.clientY < r.top - 60 || e.clientY > r.bottom + 60) { t.trx = 0; t.try_ = 0; continue; }
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        t.try_ = (px - 0.5) * 7;
        t.trx = (0.5 - py) * 7;
        t.el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        t.el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      }
    }, { passive: true });
  }

  function raf() {
    for (const m of magnets) {
      m.x = lerp(m.x, m.tx, 0.18); m.y = lerp(m.y, m.ty, 0.18);
      if (Math.abs(m.x) > 0.05 || Math.abs(m.y) > 0.05 || m.tx || m.ty) {
        m.el.style.transform = 'translate(' + m.x.toFixed(2) + 'px,' + m.y.toFixed(2) + 'px)';
      } else { m.el.style.transform = ''; }
    }
    for (const t of tilts) {
      t.rx = lerp(t.rx, t.trx, 0.12); t.ry = lerp(t.ry, t.try_, 0.12);
      if (Math.abs(t.rx) > 0.02 || Math.abs(t.ry) > 0.02 || t.trx || t.try_) {
        t.el.style.setProperty('--rx', t.rx.toFixed(2) + 'deg');
        t.el.style.setProperty('--ry', t.ry.toFixed(2) + 'deg');
      }
    }
    requestAnimationFrame(raf);
  }
  if (!REDUCED) requestAnimationFrame(raf);
  collectMagnets();
  collectTilts();

  /* ---------- 顶栏 / 背景幕布 / 封面视差 ---------- */
  const bgVeil = document.getElementById('bg-veil');
  const bgPhoto = document.querySelector('.bg-photo');
  const splashContent = document.querySelector('.splash-content');
  function onScroll() {
    const isSub = document.body.classList.contains('post-page') || document.body.classList.contains('sub-page');
    if (bgVeil) {
      const base = isSub ? 0.72 : 0;
      const maxV = isSub ? 0.88 : 0.94;
      const p = Math.min(1, window.scrollY / (window.innerHeight * 1.02));
      bgVeil.style.opacity = (base + p * (maxV - base)).toFixed(3);
    }
    if (bgPhoto && !document.body.classList.contains('cover-page')) {
      // 内容页照片已虚化为色场，视差收小并封顶，避免长时间阅读后露出边缘
      const dy = isSub ? Math.min(window.scrollY * 0.06, 48) : window.scrollY * 0.16;
      bgPhoto.style.transform = 'translateY(' + dy.toFixed(1) + 'px)';
    }
    if (splashContent) {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.85));
      splashContent.style.transform = 'translateY(' + (window.scrollY * 0.3).toFixed(1) + 'px)';
      splashContent.style.opacity = (1 - p * 0.9).toFixed(3);
    }
    // 文章页：向下阅读时淡出返回按钮，避免与顶栏交叠
    const backLink = document.querySelector('.back-link');
    if (backLink) backLink.classList.toggle('faded', window.scrollY > 90);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 顶栏当前页高亮 + 底部小胶囊指示器 ---------- */
  let navCapsuleReady = false;
  function pageKey(pathname) {
    const p = pathname.split('/').pop() || 'index.html';
    if (p === 'index.html') return 'index.html';
    if (p === 'home.html' || p === 'post.html') return 'home.html';   // 文章属于博客
    return p;                                                          // photos.html / messages.html
  }
  function updateActiveNav() {
    const links = document.querySelectorAll('.top-links a');
    const indicator = document.querySelector('.top-indicator');
    const moreBtn = document.querySelector('.more-btn');
    const cur = pageKey(location.pathname);
    let active = null;
    links.forEach((a) => {
      let key = null;
      try { key = pageKey(new URL(a.href, location.href).pathname); } catch (e) { }
      const on = key === cur;
      a.classList.toggle('active', on);
      if (on) { active = a; a.setAttribute('aria-current', 'page'); }
      else a.removeAttribute('aria-current');
    });
    // 归档 / 标签 / 笔记 / 书单 / 实验室 / 关于 统一归到「更多」下
    if (moreBtn) {
      const on = (moreBtn.dataset.pages || '').split(',').indexOf(cur) >= 0;
      moreBtn.classList.toggle('active', on);
      if (on) { active = moreBtn; moreBtn.setAttribute('aria-current', 'page'); }
      else moreBtn.removeAttribute('aria-current');
    }
    if (!indicator) return;
    if (!active) {
      indicator.style.opacity = '0';
      return;
    }
    const w = active.getBoundingClientRect().width;
    const navBox = document.querySelector('.top-links').getBoundingClientRect();
    const x = active.getBoundingClientRect().left - navBox.left;
    const instant = !navCapsuleReady;
    if (instant) indicator.style.transition = 'none';
    else indicator.style.transition = '';
    indicator.style.width = w + 'px';
    indicator.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    indicator.style.opacity = '1';
    if (instant) {
      void indicator.offsetWidth;
      indicator.style.transition = '';
      navCapsuleReady = true;
    }
  }
  window.LG.updateActiveNav = updateActiveNav;
  window.addEventListener('resize', updateActiveNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => updateActiveNav());
  setTimeout(updateActiveNav, 80);
  updateActiveNav();

  /* ---------- 滚动揭示 ---------- */
  let revealIO = null;
  function armReveals() {
    const els = Array.from(document.querySelectorAll('.reveal:not(.in)'));
    if (!('IntersectionObserver' in window) || REDUCED) { els.forEach((el) => el.classList.add('in')); return; }
    if (!revealIO) {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    els.forEach((el) => revealIO.observe(el));
  }
  armReveals();
  window.LG.armRevealsAll = armReveals;

  /* 全局轻量提示浮标 */
  let notifyTimer = null;
  window.LG.notify = function (text) {
    let t = document.getElementById('app-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'app-toast';
      t.className = 'app-toast';
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => t.classList.remove('show'), 2200);
  };
  window.LG.collectTilts = collectTilts;

  /* ============================================================
     组件：文章信息流
     ============================================================ */
  window.LG.initFeed = function () {
    const feedList = document.getElementById('feed-list');
    if (!feedList || typeof POSTS === 'undefined') return;
    const filterRow = document.getElementById('filter-row');
    const searchInput = document.getElementById('search-input');
    let activeTag = 'all';
    let query = '';
    const ARROW = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 8h11M9 3.5 13.5 8 9 12.5"/></svg>';
    const tagChip = (t) => {
      const d = DataUtil.tag(t);
      return '<i class="tag-pill" style="--c:' + d.color + '">' + d.label + '</i>';
    };
    const bigCard = (p, i) =>
      '<a class="post-card-big glass float-card reveal" data-tilt href="post.html?id=' + p.id + '" style="--a:' + p.accent + ';--bob-dur:10s;--d:' + (i * 80) + 'ms">' +
      '<div class="card-art"><span class="card-ghost">' + String(i + 1).padStart(2, '0') + '</span></div>' +
      '<div class="pcb-body">' +
      '<div class="card-meta">' + p.tags.map(tagChip).join('') + '<span class="meta-dot"></span><span>' + p.date.replace(/-/g, ' / ') + '</span><span class="meta-dot"></span><span>' + DataUtil.wordCount(p) + ' 字 · ' + p.minutes + ' min</span></div>' +
      '<h3 class="pcb-title">' + p.title + '</h3>' +
      '<p class="pcb-excerpt">' + p.excerpt + '</p>' +
      '<span class="card-more">阅读全文 ' + ARROW + '</span>' +
      '</div></a>';
    const smallCard = (p) =>
      '<a class="post-row-card glass" href="post.html?id=' + p.id + '" style="--a:' + p.accent + '">' +
      '<div class="card-art prc-thumb"></div>' +
      '<div class="prc-main"><h4>' + p.title + '</h4>' +
      '<div class="prc-meta">' + p.tags.map(tagChip).join('') + '<span class="meta-dot"></span>' + p.date.replace(/-/g, ' / ') + '<span class="meta-dot"></span>' + p.minutes + ' min</div></div>' +
      '<span class="row-arrow">' + ARROW + '</span>' +
      '</a>';
    function render() {
      const q = query.trim().toLowerCase();
      const list = POSTS.filter((p) =>
        (activeTag === 'all' || p.tags.indexOf(activeTag) >= 0) &&
        (!q || (p.title + p.excerpt).toLowerCase().indexOf(q) >= 0));
      let html = '';
      let lastYear = '';
      list.forEach((p, i) => {
        const y = p.date.slice(0, 4);
        if (y !== lastYear) { html += '<div class="year-chip glass-chip">' + y + '</div>'; lastYear = y; }
        html += (i === 0 && activeTag === 'all' && !q) ? bigCard(p, i) : smallCard(p);
      });
      feedList.innerHTML = html || '<p class="empty-hint">没有找到匹配的文章，换个关键词试试。</p>';
      collectTilts();
      armReveals();
    }
    if (filterRow) {
      const allTags = [];
      POSTS.forEach((p) => p.tags.forEach((t) => { if (allTags.indexOf(t) < 0) allTags.push(t); }));
      filterRow.innerHTML =
        '<button class="filter-pill active" data-tag="all">全部</button>' +
        allTags.map((t) => {
          const d = DataUtil.tag(t);
          return '<button class="filter-pill" data-tag="' + t + '" style="--c:' + d.color + '">' + d.label + '</button>';
        }).join('');
      filterRow.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        activeTag = btn.dataset.tag;
        filterRow.querySelectorAll('.filter-pill').forEach((b) => b.classList.toggle('active', b === btn));
        render();
      });
    }
    if (searchInput) searchInput.addEventListener('input', () => { query = searchInput.value; render(); });
    render();
  };

  /* ---------- 组件：统计 ---------- */
  window.LG.initStats = function () {
    const statPosts = document.getElementById('stat-posts');
    if (!statPosts || typeof POSTS === 'undefined') return;
    statPosts.textContent = POSTS.length;
    const chars = POSTS.reduce((s, p) => s + DataUtil.wordCount(p), 0);
    const statChars = document.getElementById('stat-chars');
    if (statChars) statChars.textContent = (chars / 1000).toFixed(1) + 'k';
    const statSince = document.getElementById('stat-since');
    if (statSince && typeof SITE !== 'undefined') statSince.textContent = SITE.start.slice(0, 7).replace('-', '.');
  };

  /* ---------- 组件：订阅 ---------- */
  window.LG.initSubscribe = function () {
    const subForm = document.getElementById('sub-form');
    if (!subForm || subForm.dataset.bound) return;
    subForm.dataset.bound = '1';
    const endpoint = (typeof SITE !== 'undefined' && SITE.subscribeEndpoint) || '';
    const note = document.getElementById('sub-note');
    const email = (typeof SITE !== 'undefined' && SITE.email) || '';
    if (!endpoint && note) {
      note.textContent = '当前走邮件订阅 —— 提交后会打开你的邮件客户端，发送即完成。';
    }
    subForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = subForm.querySelector('input');
      const btn = subForm.querySelector('button');
      if (!input.value || input.value.indexOf('@') < 0) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 500); return; }
      if (!endpoint) {
        const subject = encodeURIComponent('订阅更新 · ' + ((typeof SITE !== 'undefined' && SITE.name) || '博客'));
        const body = encodeURIComponent('请把我加入更新通知列表：' + input.value);
        window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        if (note) note.textContent = '已为你打开邮件客户端，发送后即完成订阅。';
        return;
      }
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = '提交中…';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: input.value }),
        });
        if (!res.ok) throw new Error(res.status);
        btn.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8.5 6 12l7.5-8"/></svg> 已加入列表';
        if (note) note.textContent = '订阅成功 —— 更新将第一时间送达 ' + input.value;
        input.disabled = true;
      } catch (err) {
        btn.disabled = false;
        btn.textContent = original;
        if (note) note.textContent = '提交失败，请稍后再试，或直接写邮件订阅。';
      }
    });
  };

  /* ---------- 组件：实时时钟 ---------- */
  window.LG.initClock = function () {
    const clockTime = document.getElementById('clock-time');
    if (!clockTime || clockTime.dataset.bound) return;
    clockTime.dataset.bound = '1';
    const clockDate = document.getElementById('clock-date');
    const tick = () => {
      const n = new Date();
      clockTime.textContent = n.toLocaleTimeString('zh-CN', { hour12: false });
      if (clockDate) clockDate.textContent = n.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
    };
    tick();
    setInterval(tick, 1000);
  };

  /* ---------- 组件：照片墙灯箱 ---------- */
  window.LG.initLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    const grid = document.getElementById('photo-grid');
    if (!lightbox || !grid || grid.dataset.lbBound) return;
    grid.dataset.lbBound = '1';
    const lbImg = document.getElementById('lb-img');
    const lbCap = document.getElementById('lb-cap');
    grid.addEventListener('click', (e) => {
      const img = e.target.closest('.photo-card img');
      if (!img) return;
      const fig = img.closest('figure');
      lbImg.src = img.src;
      lbCap.textContent = fig.querySelector('figcaption b').textContent + ' · ' + fig.querySelector('figcaption span').textContent;
      lightbox.hidden = false;
      requestAnimationFrame(() => lightbox.classList.add('on'));
      doc.classList.add('lb-open');
    });
    const closeLb = () => {
      lightbox.classList.remove('on');
      setTimeout(() => {
        lightbox.hidden = true;
        doc.classList.remove('lb-open');
        lbImg.removeAttribute('src');   // 释放大图内存，避免空 src 残留
      }, 340);
    };
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.lb-close')) closeLb();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  };

  /* ---------- 组件：留言板 ---------- */
  window.LG.initMessages = function () {
    const msgList = document.getElementById('msg-list');
    if (!msgList || msgList.dataset.bound) return;
    msgList.dataset.bound = '1';
    const MSG_KEY = 'lg-messages';
    const LIKE_KEY = 'lg-msg-likes';
    const AVA_COLORS = ['#7cc4e8', '#a19ae4', '#d49ec2', '#d9bd85', '#8fc7ab'];
    const seeds = [
      { id: 's1', name: '小鹿', text: '小屋好治愈，音乐一响就不想走了 ☕', time: '2026/10/28 21:04', likes: 12 },
      { id: 's2', name: '阿澈', text: '那篇液态玻璃的 CSS 配方直接抄走了，感谢分享！', time: '2026/09/15 14:37', likes: 9 },
      { id: 's3', name: 'Momo', text: '照片墙那张云海之上太绝了，求原图！', time: '2026/08/30 09:12', likes: 23 },
    ];
    function renderMsgs() {
      const mine = lsGet(MSG_KEY, []);
      const likes = lsGet(LIKE_KEY, {});
      const all = mine.concat(seeds);
      msgList.innerHTML = all.map((m) => {
        const c = AVA_COLORS[(m.name || '?').charCodeAt(0) % AVA_COLORS.length];
        const n = (m.likes || 0) + (likes[m.id] || 0);
        const time = m.ts ? (() => { const d = new Date(m.ts); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); })() : m.time;
        return '<div class="msg-item">' +
          '<span class="msg-ava" style="--c:' + c + '">' + escHTML((m.name || '?').slice(0, 1)) + '</span>' +
          '<div class="msg-body"><div class="msg-head"><b>' + escHTML(m.name) + '</b><span class="msg-time">' + time + '</span></div>' +
          '<p>' + escHTML(m.text) + '</p></div>' +
          '<button class="msg-like" data-id="' + m.id + '" type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 5 6.7 5c2 0 3.6 1.1 4.4 2.7l.9 1.8.9-1.8C13.7 6.1 15.3 5 17.3 5c3.1 0 5.2 3 4 6.3-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>' +
          n + '</button></div>';
      }).join('');
    }
    msgList.addEventListener('click', (e) => {
      const btn = e.target.closest('.msg-like');
      if (!btn) return;
      const likes = lsGet(LIKE_KEY, {});
      if (btn.classList.contains('liked')) { delete likes[btn.dataset.id]; btn.classList.remove('liked'); }
      else { likes[btn.dataset.id] = (likes[btn.dataset.id] || 0) + 1; btn.classList.add('liked'); }
      lsSet(LIKE_KEY, likes);
      renderMsgs();
    });
    document.getElementById('msg-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('msg-name');
      const textEl = document.getElementById('msg-text');
      const name = nameEl.value.trim() || '匿名的小玻璃';
      const text = textEl.value.trim();
      if (!text) { textEl.classList.add('shake'); setTimeout(() => textEl.classList.remove('shake'), 500); return; }
      const mine = lsGet(MSG_KEY, []);
      mine.unshift({ id: 'u' + Date.now(), name: name.slice(0, 12), text: text.slice(0, 120), ts: Date.now(), likes: 0 });
      lsSet(MSG_KEY, mine);
      textEl.value = '';
      renderMsgs();
      msgList.firstElementChild.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
    });
    renderMsgs();
  };

  /* ---------- 组件：照片墙（上传 + 本地持久化 + 删除） ---------- */
  window.LG.initPhotoUpload = function () {
    const grid = document.getElementById('photo-grid');
    if (!grid || grid.dataset.photoBound) return;
    grid.dataset.photoBound = '1';

    const KEY = 'lg-user-photos';
    const STATIC = (typeof PHOTOS !== 'undefined' && PHOTOS) || [];
    const cardHTML = (src, cap, date, uid) =>
      '<figure class="photo-card glass reveal in" data-tilt>' +
      '<div class="ph-wrap"><img src="' + src + '" alt="' + escHTML(cap) + '" loading="lazy">' +
      (uid ? '<button class="ph-del" data-del="' + uid + '" title="删除照片">&times;</button>' : '') +
      '</div>' +
      '<figcaption><b>' + escHTML(cap) + '</b><span>' + date + '</span></figcaption>' +
      '</figure>';

    function render() {
      const mine = lsGet(KEY, []);
      grid.innerHTML =
        mine.map((m) => cardHTML(m.src, m.cap, m.date, m.id)).join('') +
        STATIC.map((s2) => cardHTML(s2.src, s2.cap, s2.date, null)).join('');
      collectTilts();
    }

    /* 上传：标题行右侧按钮 → 读文件 → 压缩 → 存 localStorage */
    const uploadInput = document.getElementById('photo-input');
    if (uploadInput && !uploadInput.dataset.bound) {
      uploadInput.dataset.bound = '1';
      uploadInput.addEventListener('change', () => {
        if (!uploadInput.files || !uploadInput.files.length) return;
        const files = Array.from(uploadInput.files).slice(0, 6);
        let pending = files.length;
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const max = 1000;
              const scale = Math.min(1, max / Math.max(img.width, img.height));
              const c = document.createElement('canvas');
              c.width = Math.max(1, Math.round(img.width * scale));
              c.height = Math.max(1, Math.round(img.height * scale));
              c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
              const mine = lsGet(KEY, []);
              mine.unshift({ id: 'p' + Date.now() + ((Math.random() * 999) | 0), src: c.toDataURL('image/jpeg', 0.82), cap: '随手拍', date: '2026 / 11' });
              lsSet(KEY, mine);
              if (--pending <= 0) render();
            };
            img.onerror = () => { if (--pending <= 0) render(); };
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        });
        uploadInput.value = '';
      });
    }

    /* 删除（仅自己上传的） */
    grid.addEventListener('click', (e) => {
      const del = e.target.closest('[data-del]');
      if (!del) return;
      e.stopPropagation();
      lsSet(KEY, lsGet(KEY, []).filter((m) => m.id !== del.dataset.del));
      render();
    });

    render();
  };

  /* ---------- 组件：回到顶部 ---------- */
  const topBtn = document.getElementById('to-top');
  if (topBtn) {
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));
    window.addEventListener('scroll', () => topBtn.classList.toggle('show', window.scrollY > 800), { passive: true });
  }

  /* ---------- 页面装配 ---------- */
  window.LG.initIndexPage = function () {
    window.LG.initFeed();
    window.LG.initStats();
    window.LG.initSubscribe();
    window.LG.initClock();
    armReveals();
  };
  window.LG.initPhotosPage = function () {
    window.LG.initLightbox();
    window.LG.initPhotoUpload();
    armReveals();
  };
  window.LG.initMessagesPage = function () {
    window.LG.initMessages();
    armReveals();
  };

  /* ============================================================
     无刷新路由
     ============================================================ */
  const pageCache = new Map();
  function runEntrance() {
    const main = document.querySelector('main');
    if (main && !REDUCED) {
      main.style.animation = 'none';
      void main.offsetWidth;
      main.style.animation = '';
    }
    const hash = location.hash;
    let landing = 0;
    if (hash && hash.length > 1) {
      const target = document.getElementById(hash.slice(1));
      if (target) landing = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 96);
    }
    window.scrollTo({ top: landing, left: 0, behavior: 'instant' });
    onScroll();
    doc.classList.remove('vt-out');
  }
  function bootFor(bodyClass) {
    if (/post-page/.test(bodyClass)) { if (window.LG.initPost) window.LG.initPost(); if (window.LG.initExtras) window.LG.initExtras(); return; }
    if (/cover-page/.test(bodyClass)) { coverArmed = true; window.LG.initStats(); if (window.LG.initExtras) window.LG.initExtras(); return; }
    window.LG.initIndexPage();
    window.LG.initPhotosPage();
    window.LG.initMessagesPage();
    if (window.LG.initExtras) window.LG.initExtras();
  }
  async function spaRoute(url, push) {
    if (REDUCED) { location.href = url; return; }
    doc.classList.add('vt-out');
    const cleanUrl = url.split('#')[0];   // fetch/缓存一律不带 hash
    let swapped = false;
    try {
      await new Promise((r) => setTimeout(r, 380));
      let html = pageCache.get(cleanUrl);
      if (!html) {
        let res = null;
        for (let i = 0; i < 2 && !res; i++) {            // 网络抖动重试一次
          try { res = await fetch(cleanUrl); if (!res.ok) throw new Error(res.status); }
          catch (e) { res = null; if (i === 1) throw e; await new Promise((r) => setTimeout(r, 250)); }
        }
        html = await res.text();
        pageCache.set(cleanUrl, html);
      }
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const newMain = parsed.querySelector('main');
      if (!newMain) throw new Error('no main');
      document.title = parsed.title;
      document.body.className = parsed.body.className;
      const mainEl = document.querySelector('main');
      mainEl.className = newMain.className;      // 同步 main 类名（post-main 顶距等布局依赖它）
      mainEl.id = newMain.id;
      mainEl.innerHTML = newMain.innerHTML;
      if (push) history.pushState({}, '', url);
      swapped = true;
    } catch (err) {
      /* 换页失败：绝不整页刷新（那会重启音乐）—— 收幕回当前页并提示 */
      console.warn('[router] 换页失败：', err);
      doc.classList.remove('vt-out');
      if (window.LG.notify) window.LG.notify('页面加载失败，请稍后重试');
      return;
    }
    /* 组件初始化失败不应卡死页面 —— 已换页，照常收幕 */
    try {
      bootFor(document.body.className);
      collectMagnets();
      collectTilts();
      updateActiveNav();
    } catch (e) { console.warn('[router] init warning:', e); }
    runEntrance();
  }
  /* 兜底：无论任何路径，幕布 3 秒内必收 */
  setInterval(() => doc.classList.remove('vt-out'), 3000);

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-vt')) return;
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    let url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      if (url.hash && url.hash !== location.hash) return;
      if (!url.search && !url.hash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
        return;
      }
    }
    e.preventDefault();
    spaRoute(url.href, true);
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) doc.classList.remove('vt-out');
  });
  window.addEventListener('popstate', () => spaRoute(location.href, false));

  /* ---------- 封面页：滚轮 / 触摸 / 方向键 进入内容页 ---------- */
  let coverArmed = true;
  function coverEnter() {
    if (!coverArmed) return;
    coverArmed = false;
    spaRoute(new URL('home.html', location.href).href, true);
  }
  window.addEventListener('wheel', (e) => {
    if (!document.body.classList.contains('cover-page')) return;
    if (e.deltaY > 0) coverEnter();
  }, { passive: true });
  let touchY0 = null;
  window.addEventListener('touchstart', (e) => { touchY0 = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (!document.body.classList.contains('cover-page') || touchY0 === null) return;
    if (touchY0 - e.changedTouches[0].clientY > 60) coverEnter();
    touchY0 = null;
  }, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('cover-page')) return;
    if (isTypingTarget(e.target)) return;
    if (['ArrowDown', 'PageDown', ' '].indexOf(e.key) >= 0) { e.preventDefault(); coverEnter(); }
  });

  /* ---------- 首次装配 ---------- */
  bootFor(document.body.className);
})();
