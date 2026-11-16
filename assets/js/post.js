/* ============================================================
   post.js —— 文章页：正文、目录、进度、代码复制、上下篇、评论位
   可被 router 重复调用（每次重建正文，并撤销上一轮的滚动监听）
   ============================================================ */
(function () {
  'use strict';

  let ctrl = null;
  let lastId = null;

  function renderPost() {
    const root = document.getElementById('post-root');
    if (!root || typeof POSTS === 'undefined') return;

    const id = new URLSearchParams(location.search).get('id');
    if (ctrl) ctrl.abort();
    ctrl = new AbortController();
    const signal = ctrl.signal;

    const idx = POSTS.findIndex((p) => p.id === id);
    const post = POSTS[idx];

    if (!post) {
      root.innerHTML =
        '<div class="page-head" style="border-bottom:0;padding-bottom:0">' +
          '<h1>404 · 这页还没写</h1>' +
          '<p>没有找到文章 <code>' + (id || '') + '</code>。它可能还在草稿里。</p>' +
          '<div style="margin-top:28px"><a class="btn btn-primary" href="home.html">回到博客</a></div>' +
        '</div>';
      document.title = '404 · ' + (typeof SITE !== 'undefined' ? SITE.name : 'Tom');
      return;
    }

    document.title = post.title + ' · ' + (typeof SITE !== 'undefined' ? SITE.name : 'Tom');

    const tagHTML = (post.tags || []).map((t) =>
      '<span class="tag">' + DataUtil.tag(t).label + '</span>').join('');
    const words = DataUtil.wordCount(post);

    const headings = [];
    post.content.replace(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g, (m, lv, hid, txt) => {
      headings.push({ id: hid, text: txt.replace(/<[^>]+>/g, ''), level: Number(lv) });
      return m;
    });

    const tocHTML = headings.length
      ? '<nav class="toc" aria-label="目录"><h4>目录</h4><ul>' +
        headings.map((h) =>
          '<li><a href="#' + h.id + '" class="toc-link' + (h.level === 3 ? ' sub' : '') + '">' + h.text + '</a></li>'
        ).join('') + '</ul></nav>'
      : '';

    const prev = POSTS[idx - 1];
    const next = POSTS[idx + 1];
    const pn = (p, dir, cls) => p
      ? '<a href="post.html?id=' + encodeURIComponent(p.id) + '" class="' + cls + '"><span class="k">' + dir + '</span><span class="t">' + p.title + '</span></a>'
      : '<span></span>';

    root.innerHTML =
      '<header class="article-head"><div class="wrap">' +
        '<a class="back" href="home.html">← 全部文章</a>' +
        '<h1 class="article-title">' + post.title + '</h1>' +
        '<div class="article-meta">' +
          '<span>' + DataUtil.fmtDate(post.date) + '</span>' +
          '<span>' + post.minutes + ' 分钟阅读</span>' +
          '<span>' + words + ' 字</span>' +
          '<span style="display:flex;gap:6px;flex-wrap:wrap">' + tagHTML + '</span>' +
        '</div>' +
      '</div></header>' +
      '<div class="wrap"><div class="article-layout">' +
        '<article class="prose" id="post-body">' + post.content +
          '<div class="prevnext">' + pn(prev, '← 上一篇', 'prev') + pn(next, '下一篇 →', 'next') + '</div>' +
          '<section id="comments" style="margin-top:56px;padding-top:32px;border-top:1px solid var(--line)">' +
            '<h2 style="font-size:17px;margin:0 0 12px">评论</h2>' +
            '<div id="giscus-mount"></div>' +
          '</section>' +
        '</article>' +
        tocHTML +
      '</div></div>';

    /* 代码复制 */
    root.querySelectorAll('#post-body pre').forEach((pre) => {
      const code = pre.querySelector('code');
      if (!code) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = '复制';
      btn.addEventListener('click', () => {
        const text = code.textContent;
        const done = (ok) => {
          btn.textContent = ok ? '已复制' : '复制失败';
          setTimeout(() => { btn.textContent = '复制'; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
        } else { done(false); }
      });
      pre.appendChild(btn);
    });

    /* 阅读进度 */
    const bar = document.getElementById('progress');
    const body = document.getElementById('post-body');
    const onScroll = () => {
      if (!bar || !body) return;
      const start = body.getBoundingClientRect().top + window.scrollY - 88;
      const total = Math.max(1, body.offsetHeight - window.innerHeight + 88);
      const pct = Math.min(1, Math.max(0, (window.scrollY - start) / total));
      bar.style.width = (pct * 100).toFixed(1) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    onScroll();

    /* 目录高亮：以视口上部为基准找当前小节 */
    const links = Array.from(root.querySelectorAll('.toc-link'));
    const marks = headings
      .map((h) => ({ id: h.id, el: document.getElementById(h.id) }))
      .filter((h) => h.el);
    let lastActive = '';
    const spy = () => {
      if (!links.length) return;
      const line = 150;
      let active = marks.length ? marks[0].id : '';
      marks.forEach((m) => {
        if (m.el.getBoundingClientRect().top <= line) active = m.id;
      });
      if (active === lastActive) return;
      lastActive = active;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
    };
    window.addEventListener('scroll', spy, { passive: true, signal });
    spy();

    /* 评论：Giscus 未配置时的引导 */
    const box = document.getElementById('giscus-mount');
    const cfg = (typeof GISCUS !== 'undefined') ? GISCUS : null;
    if (box && cfg && cfg.repo && cfg.repoId) {
      const s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      Object.entries({
        'data-repo': cfg.repo,
        'data-repo-id': cfg.repoId,
        'data-category': cfg.category || 'Comments',
        'data-category-id': cfg.categoryId || '',
        'data-mapping': cfg.mapping || 'pathname',
        'data-strict': '1',
        'data-reactions-enabled': '1',
        'data-input-position': 'bottom',
        'data-theme': document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark_dimmed' : 'light',
        'data-lang': 'zh-CN',
        'data-loading': 'lazy',
      }).forEach(([k, v]) => s.setAttribute(k, v));
      box.appendChild(s);
    } else if (box) {
      box.innerHTML =
        '<p style="color:var(--text-2);font-size:15px;line-height:1.8;max-width:60ch">' +
        '评论还没接通（在 <code style="font-family:var(--mono);font-size:.9em">data.js</code> 的 GISCUS 里填上仓库信息即可启用 Giscus）。' +
        '现在也可以先去 <a href="messages.html">留言板</a> 说一句。</p>';
    }

    lastId = id;
  }

  function init() {
    const root = document.getElementById('post-root');
    if (!root) return;
    const id = new URLSearchParams(location.search).get('id');
    if (root.childElementCount && id === lastId) return;
    renderPost();
  }

  window.SitePost = { render: renderPost, init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
