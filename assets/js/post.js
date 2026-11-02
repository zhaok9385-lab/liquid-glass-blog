/* ============================================================
   液态玻璃博客 · 文章页组件
   ?id=xxx 渲染文章；阅读进度、TOC 高亮、上/下一篇、代码复制
   以组件形式挂载在 window.LG.initPost，无刷新路由换页后可重复调用。
   ============================================================ */

window.LG = window.LG || {};

window.LG.initPost = function () {
  'use strict';

  if (typeof POSTS === 'undefined') return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const idx = POSTS.findIndex((p) => p.id === id);
  const post = POSTS[idx];

  const root = document.getElementById('post-root');
  if (!root) return;

  /* 清理上一次挂载遗留的全局监听 */
  if (window.__postScroll) { window.removeEventListener('scroll', window.__postScroll); window.__postScroll = null; }
  if (window.__postSpy) { window.__postSpy.disconnect(); window.__postSpy = null; }

  /* 未找到文章 */
  if (!post) {
    root.innerHTML =
      '<div class="glass notfound reveal in">' +
      '<h1>404 · 这滴水还没落下</h1>' +
      '<p>没有找到文章 <code>' + (id || '') + '</code>，也许它还在折射的路上。</p>' +
      '<a class="btn btn-primary" href="index.html" data-magnetic>返回首页</a></div>';
    document.title = '404 · ' + (typeof SITE !== 'undefined' ? SITE.name : '博客');
    if (window.LG.armRevealsAll) window.LG.armRevealsAll();
    return;
  }

  const accent = post.accent;
  document.title = post.title + ' · ' + (typeof SITE !== 'undefined' ? SITE.name : '博客');
  document.documentElement.style.setProperty('--post-accent', accent);

  const tagsHTML = post.tags.map((t) => {
    const d = DataUtil.tag(t);
    return '<a class="tag-pill" href="home.html#posts" style="--c:' + d.color + '">' + d.label + '</a>';
  }).join('');

  const headings = [];
  post.content.replace(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g, function (m, hid, txt) {
    headings.push({ id: hid, text: txt });
    return m;
  });
  const tocHTML = headings.length
    ? '<nav class="toc glass" aria-label="目录"><div class="toc-title">目录</div>' +
      headings.map((h) => '<a class="toc-link" href="#' + h.id + '">' + h.text + '</a>').join('') +
      '</nav>'
    : '';

  const words = DataUtil.wordCount(post);
  const prev = POSTS[idx - 1];
  const next = POSTS[idx + 1];
  const pnCard = (p, dir) => p
    ? '<a class="pn-card glass" data-tilt href="post.html?id=' + p.id + '" style="--a:' + p.accent + '">' +
      '<span class="pn-dir">' + dir + '</span><h4>' + p.title + '</h4>' +
      '<span class="pn-date">' + p.date.replace(/-/g, ' / ') + '</span></a>'
    : '<span class="pn-card ghost"></span>';

  root.innerHTML =
    '<header class="post-hero">' +
    '  <a class="back-link glass-chip" href="home.html#posts">' +
    '    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M14 8H3M7 3.5 2.5 8 7 12.5"/></svg> 返回全部文章</a>' +
    '  <div class="post-tags">' + tagsHTML + '</div>' +
    '  <h1 class="post-title reveal in">' + post.title + '</h1>' +
    '  <div class="post-meta">' +
    '    <span>' + DataUtil.fmtDate(post.date) + '</span><em class="meta-dot"></em>' +
    '    <span>' + post.minutes + ' 分钟阅读</span><em class="meta-dot"></em>' +
    '    <span>' + words + ' 字</span>' +
    '  </div>' +
    '</header>' +
    '<div class="post-layout">' +
    '  <article class="post-sheet glass reveal in"><div class="prose">' + post.content + '</div></article>' +
    '  <aside class="post-aside">' + tocHTML +
    '    <a class="toc glass toc-cta" href="#top"><div class="toc-title">分享这篇</div>' +
    '      <div class="share-row">' +
    '        <button class="icon-btn" id="copy-link" title="复制链接"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.5 9.5a3 3 0 0 0 4.3.2l2.4-2.4a3 3 0 1 0-4.2-4.2l-1 1"/><path d="M9.5 6.5a3 3 0 0 0-4.3-.2l-2.4 2.4a3 3 0 1 0 4.2 4.2l1-1"/></svg></button>' +
    '      </div></a>' +
    '  </aside>' +
    '</div>' +
    '<div class="pn-grid">' + pnCard(prev, '← 上一篇') + pnCard(next, '下一篇 →') + '</div>';

  /* 代码块包装：mac 窗口头 + 复制按钮 */
  root.querySelectorAll('.prose pre').forEach(function (pre) {
    if (pre.parentElement.classList.contains('code-block')) return;
    const code = pre.querySelector('code');
    if (!code) return;
    const firstLine = (code.textContent.split('\n').find(function (l) { return l.trim(); }) || '');
    let lang = 'code';
    if (/float|vec[234]|uniform|void main/.test(firstLine)) lang = 'glsl';
    else if (/function|const |=&gt;|=>/.test(firstLine)) lang = 'javascript';
    else if (/[.#][\w-]+\s*\{|backdrop-filter|@media/.test(firstLine)) lang = 'css';
    else if (/&lt;|</.test(firstLine)) lang = 'html';

    const box = document.createElement('div');
    box.className = 'code-block';
    box.innerHTML =
      '<div class="code-head"><span class="code-dots"><i></i><i></i><i></i></span>' +
      '<span class="code-file">' + lang + '</span>' +
      '<button class="copy-btn" type="button">复制</button></div>';
    pre.parentNode.insertBefore(box, pre);
    box.appendChild(pre);

    const btn = box.querySelector('.copy-btn');
    btn.addEventListener('click', function () {
      const done = function () {
        btn.textContent = '已复制 ✓';
        setTimeout(function () { btn.textContent = '复制'; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code.textContent).then(done, done);
      } else { done(); }
    });
  });

  /* 阅读进度条（全局监听防重复） */
  const bar = document.getElementById('progress');
  const sheet = root.querySelector('.post-sheet');
  const onScroll = function () {
    if (!bar || !sheet) return;
    const r = sheet.getBoundingClientRect();
    const total = r.height - innerHeight * 0.6;
    const done = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / Math.max(1, total)));
    bar.style.transform = 'scaleX(' + done + ')';
  };
  window.__postScroll = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* TOC 高亮 */
  const tocLinks = Array.from(root.querySelectorAll('.toc-link'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    window.__postSpy = spy;
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) spy.observe(el);
    });
  }

  /* 复制链接 */
  const copyBtn = document.getElementById('copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const done = function () {
        copyBtn.classList.add('ok');
        setTimeout(function () { copyBtn.classList.remove('ok'); }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).then(done, done);
      } else { done(); }
    });
  }

  if (window.LG.collectTilts) window.LG.collectTilts();
};

window.LG.initPost();
