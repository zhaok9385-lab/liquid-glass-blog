/* ============================================================
   液态玻璃博客 · 音乐胶囊
   基于 GitHub 开源组件 APlayer（MIT）+ 网易云外链音源。
   APlayer 原生提供播放/切歌/进度拖动，本文件只做装配与皮肤。
   ============================================================ */

(function () {
  'use strict';

  const mount = document.getElementById('aplayer-mount');
  if (!mount || typeof APlayer === 'undefined') return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 渐变封面（SVG data URI，避免额外图片请求） */
  const svgCover = (c1, c2, letter) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>' +
    '</linearGradient></defs>' +
    '<rect width="120" height="120" fill="url(#g)"/>' +
    '<text x="60" y="78" font-size="50" font-family="Georgia,serif" fill="rgba(255,255,255,.92)" text-anchor="middle">' + letter + '</text>' +
    '</svg>');

  const NETEASE = 'https://music.163.com/song/media/outer/url?id=';
  const songs = [
    { name: 'Sacred Play Secret Place', artist: 'Matryoshka', url: NETEASE + '501468000.mp3',
      cover: 'https://p1.music.126.net/NcB0KW6bKs83cmO-OTT1fw==/109951163013755204.jpg?param=200y200', theme: '#8ea6e8' },
    { name: 'Chance', artist: 'Aspyer & Kyle Reynolds & Carly Jay', url: NETEASE + '3361261235.mp3',
      cover: 'https://p1.music.126.net/qL52CKbT2IWsMjINPeJS0w==/109951172914541771.jpg?param=200y200', theme: '#f6c3a4' },
    { name: '7 Years (LUCI Remix)', artist: 'LUCI feat. Lukas Graham', url: NETEASE + '415085035.mp3',
      cover: 'https://p1.music.126.net/hWVoIwaXGhMMV_YsQLbA2w==/18293674463254293.jpg?param=200y200', theme: '#d49ec2' },
    { name: "I'll Be Gone (feat. Katie McConnell)", artist: 'Axero & Katie McConnell', url: NETEASE + '1398909708.mp3',
      cover: 'https://p1.music.126.net/eMmDPNPca7GbMY20ZmovFA==/109951164445994451.jpg?param=200y200', theme: '#f2a984' },
    { name: 'I Hate U I Love U', artist: 'gnash & Olivia O’Brien', url: NETEASE + '1428038045.mp3',
      cover: 'https://p1.music.126.net/pgu1m5hMCH0leJqT_GTC-g==/109951164766037268.jpg?param=200y200', theme: '#a19ae4' },
  ];

  /* ---------- 初始化 APlayer（fixed 模式：收起为唱片圆钮，展开为播放卡） ---------- */
  const ap = new APlayer({
    container: mount,
    fixed: true,
    mini: true,
    listFolded: true,
    listMaxHeight: 180,
    autoplay: false,
    loop: 'all',
    order: 'list',
    preload: 'metadata',
    volume: 0.75,
    audio: songs,
  });
  window.__ap = ap;

  /* ---------- 播放状态记忆：刷新 / 整页跳转后回到上一首与进度 ---------- */
  const MKEY = 'lg-music-state';
  let savedState = null;
  try { savedState = JSON.parse(sessionStorage.getItem(MKEY)); } catch (e) { }
  if (savedState && typeof savedState.index === 'number' && savedState.index >= 0 && savedState.index < songs.length) {
    if (savedState.index > 0) ap.list.switch(savedState.index);
    const restoreTime = typeof savedState.time === 'number' ? savedState.time : 0;
    const applyTime = () => {
      try {
        if (!restoreTime || !isFinite(ap.audio.duration)) return;
        ap.audio.currentTime = Math.max(0, Math.min(restoreTime, ap.audio.duration - 0.5));
      } catch (e) { }
    };
    ap.audio.addEventListener('loadedmetadata', applyTime, { once: true });
    if (ap.audio.readyState >= 1) setTimeout(applyTime, 0);
    if (savedState.playing) {
      const p = ap.play();
      if (p && p.catch) p.catch(() => { });
    }
  }
  let lastMusicSave = 0;
  function saveMusicState() {
    try {
      sessionStorage.setItem(MKEY, JSON.stringify({
        index: ap.list.index || 0,
        time: Math.round((ap.audio.currentTime || 0) * 10) / 10,
        playing: !ap.audio.paused,
      }));
    } catch (e) { }
  }
  ap.audio.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (now - lastMusicSave < 1500) return;
    lastMusicSave = now;
    saveMusicState();
  });
  ap.on('play', saveMusicState);
  ap.on('pause', saveMusicState);
  window.addEventListener('beforeunload', saveMusicState);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveMusicState(); });

  /* ---------- 切歌提示浮标 ---------- */
  let toastTimer = null;
  function showToast(text) {
    let t = document.getElementById('mc-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'mc-toast';
      t.className = 'mc-toast';
      document.body.appendChild(t);
    }
    t.textContent = '♪ ' + text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  /* ---------- 封面音符按钮联动 ---------- */
  const splashBtn = document.getElementById('splash-music');
  function syncSplash() {
    if (splashBtn) splashBtn.classList.toggle('playing', !ap.audio.paused);
    const root = document.querySelector('.aplayer');
    if (root) root.classList.toggle('ap-spin-on', !ap.audio.paused);
  }
  ap.on('play', syncSplash);
  ap.on('pause', syncSplash);

  if (splashBtn) splashBtn.addEventListener('click', () => ap.toggle());

  /* ---------- 切歌 / 错误处理 ---------- */
  function currentSong() { return songs[ap.list.index] || songs[0]; }

  let errorSkips = 0;
  ap.audio.addEventListener('error', () => {
    const code = ap.audio.error ? ap.audio.error.code : 0;
    if (code === 1) return; // ABORTED：切歌时的正常中断，不是真错误
    errorSkips += 1;
    if (errorSkips >= songs.length) { showToast('歌曲暂时都无法播放（版权限制）'); return; }
    showToast(currentSong().name + ' · 暂不可用，切换下一首');
    setTimeout(() => ap.skipForward(), 700);
  });

  ['skipForward', 'skipBack'].forEach((method) => {
    const orig = ap[method].bind(ap);
    ap[method] = function () {
      const r = orig();
      showToast(currentSong().name);
      return r;
    };
  });

  /* ---------- 验证接口 ---------- */
  window.__music = {
    playing: () => !ap.audio.paused,
    currentTime: () => Math.round(ap.audio.currentTime * 10) / 10,
    duration: () => Math.round((ap.audio.duration || 0) * 10) / 10,
    track: () => { const t = document.querySelector('.aplayer-title'); return t ? t.textContent : songs[0].name; },
    seek: (s) => ap.seek(s),
    next: () => ap.skipForward(),
    prev: () => ap.skipBack(),
  };

  /* 默认收起为圆形唱片（点唱片播放/暂停，小圆钮展开播放卡） */
  requestAnimationFrame(() => {
    const root = document.querySelector('.aplayer');
    if (root) root.classList.add('aplayer-narrow');
  });

  /* 进入网页自动播放：
     1) 加载后立即尝试（浏览器允许 / 有播放记录时直接响）；
     2) 被拦截时在首次点击 / 按键的瞬间自动开始（手势激活后跨页面不断）。 */
  let autoPlaying = false;
  let musicEverStarted = false;   // 音乐成功开播过一次后，自动播放职责即完成
  ap.on('play', () => { autoPlaying = true; musicEverStarted = true; });
  ap.on('pause', () => { autoPlaying = false; });
  function tryAutoPlay(e) {
    if (autoPlaying || musicEverStarted || !window.__ap) return;
    if (e && e.target && e.target.closest && e.target.closest('.aplayer, #splash-music')) return;  // 播放器上的点击交给其自身逻辑
    ap.play();
    setTimeout(() => { if (ap.audio.paused) ap.pause(); }, 600);   // 被拦截：回滚 UI 状态
  }
  tryAutoPlay();
  window.addEventListener('pointerdown', tryAutoPlay, { passive: true });
  window.addEventListener('keydown', () => tryAutoPlay(null));

  /* 唱片中心：自定义播放/暂停按钮（随状态切换图标） */
  const pic = document.querySelector('.aplayer-pic');
  if (pic && !pic.querySelector('.mp-toggle')) {
    const b = document.createElement('button');
    b.className = 'mp-toggle';
    b.setAttribute('aria-label', '播放 / 暂停');
    b.innerHTML =
      '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 5.8v12.4L19 12z"/></svg>' +
      '<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>';
    b.addEventListener('click', (e) => { e.stopPropagation(); ap.toggle(); });
    pic.appendChild(b);
  }
})();
