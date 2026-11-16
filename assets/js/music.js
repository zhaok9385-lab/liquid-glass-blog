/* ============================================================
   音乐胶囊 · 自定义播放条
   引擎仍是开源 APlayer（MIT），但界面换成左侧的玻璃小胶囊：
   封面会转、标题会走、波形会跳；点开列表可切歌。
   APlayer 自带的 fixed UI 由 CSS 隐藏，只保留音频与列表能力。
   ============================================================ */

(function () {
  'use strict';

  const mount = document.getElementById('aplayer-mount');
  if (!mount || typeof APlayer === 'undefined') return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- 引擎 ---------- */
  const ap = new APlayer({
    container: mount,
    fixed: false,
    mini: false,
    listFolded: true,
    autoplay: false,
    loop: 'all',
    order: 'list',
    preload: 'metadata',
    volume: 0.75,
    audio: songs,
  });
  window.__ap = ap;

  /* ---------- 自定义胶囊 ---------- */
  const dock = document.createElement('section');
  dock.className = 'music-dock';
  dock.id = 'music-dock';
  dock.setAttribute('aria-label', '音乐播放器');
  dock.innerHTML =
    '<button class="md-art" id="md-art" type="button" aria-label="播放 / 暂停">' +
      '<img alt="" id="md-cover">' +
      '<span class="md-ring"></span>' +
      '<span class="md-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '</button>' +
    '<div class="md-body">' +
      '<div class="md-line"><span class="md-title" id="md-title">—</span></div>' +
      '<div class="md-artist"><span class="md-artist-name" id="md-artist"></span><span class="md-time" id="md-time">0:00</span></div>' +
      '<div class="md-bar" id="md-bar" role="slider" aria-label="播放进度" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="md-fill"></i></div>' +
    '</div>' +
    '<div class="md-ctrl">' +
      '<button class="md-btn" id="md-prev" type="button" aria-label="上一首"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM19 5v14L9.5 12z"/></svg></button>' +
      '<button class="md-btn md-play" id="md-play" type="button" aria-label="播放 / 暂停">' +
        '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.4 5.4v13.2L19 12z"/></svg>' +
        '<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.6 5.4h3.2v13.2H7.6zM13.2 5.4h3.2v13.2h-3.2z"/></svg>' +
      '</button>' +
      '<button class="md-btn" id="md-next" type="button" aria-label="下一首"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 5h2v14h-2zM5 5v14l9.5-7z"/></svg></button>' +
      '<button class="md-btn" id="md-list-btn" type="button" aria-label="播放列表" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M4 12h10M4 17h7"/><circle cx="18" cy="16.5" r="2"/><path d="M20 16.5V9l-3 .8"/></svg></button>' +
    '</div>' +
    '<div class="md-list" id="md-list" hidden></div>' +
    '<button class="md-min" id="md-min" type="button" aria-label="收起播放器" title="收起播放器">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
    '</button>';
  document.body.appendChild(dock);

  const el = {
    art: dock.querySelector('#md-art'),
    cover: dock.querySelector('#md-cover'),
    title: dock.querySelector('#md-title'),
    artist: dock.querySelector('#md-artist'),
    time: dock.querySelector('#md-time'),
    bar: dock.querySelector('#md-bar'),
    fill: dock.querySelector('#md-fill'),
    play: dock.querySelector('#md-play'),
    prev: dock.querySelector('#md-prev'),
    next: dock.querySelector('#md-next'),
    listBtn: dock.querySelector('#md-list-btn'),
    list: dock.querySelector('#md-list'),
    min: dock.querySelector('#md-min'),
  };

  /* ---------- 收起 / 展开：收成一个唱片圆钮 ---------- */
  const MINK = 'lg-music-min';
  function setMin(min) {
    dock.classList.toggle('is-min', min);
    el.min.setAttribute('aria-label', min ? '展开播放器' : '收起播放器');
    el.min.title = min ? '展开播放器' : '收起播放器';
    el.art.setAttribute('aria-label', min ? '展开播放器' : (ap.audio.paused ? '播放' : '暂停'));
    el.art.title = min ? '展开播放器' : '';
    if (min) {
      el.list.hidden = true;
      el.listBtn.setAttribute('aria-expanded', 'false');
    }
    try { localStorage.setItem(MINK, min ? '1' : ''); } catch (e) { }
  }
  el.min.addEventListener('click', (e) => {
    e.stopPropagation();
    setMin(!dock.classList.contains('is-min'));
  });
  dock.addEventListener('click', () => {
    if (dock.classList.contains('is-min')) setMin(false);
  });

  function current() { return songs[ap.list.index] || songs[0]; }

  function paintList() {
    el.list.innerHTML = songs.map((s, i) =>
      '<button class="md-item' + (i === ap.list.index ? ' on' : '') + '" type="button" data-i="' + i + '">' +
        '<span class="md-no">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="md-it"><b>' + s.name + '</b><small>' + s.artist + '</small></span>' +
        '<span class="md-eq sm" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '</button>').join('');
  }

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function syncMeta() {
    const s = current();
    el.title.textContent = s.name;
    el.artist.textContent = s.artist;
    el.cover.src = s.cover;
    el.cover.onerror = () => { el.cover.removeAttribute('src'); };
    dock.style.setProperty('--md-theme', s.theme || '#8ea6e8');
    paintList();
    scrollList();
  }

  function scrollList() {
    if (el.list.hidden) return;
    const on = el.list.querySelector('.md-item.on');
    if (on) on.scrollIntoView({ block: 'nearest' });
  }

  let raf = null;
  function syncProgress() {
    const d = ap.audio.duration || 0, t = ap.audio.currentTime || 0;
    const pct = d ? Math.min(100, (t / d) * 100) : 0;
    el.fill.style.width = pct.toFixed(2) + '%';
    el.time.textContent = fmt(t);
    el.bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    if (!ap.audio.paused) raf = requestAnimationFrame(syncProgress);
  }

  function syncPlaying() {
    const playing = !ap.audio.paused;
    dock.classList.toggle('playing', playing);
    el.play.classList.toggle('is-on', playing);
    el.play.setAttribute('aria-label', playing ? '暂停' : '播放');
    if (!dock.classList.contains('is-min')) el.art.setAttribute('aria-label', playing ? '暂停' : '播放');
    if (playing) { cancelAnimationFrame(raf); syncProgress(); }
  }

  el.play.addEventListener('click', () => ap.toggle());
  el.art.addEventListener('click', () => {
    if (dock.classList.contains('is-min')) { setMin(false); return; }
    ap.toggle();
  });
  el.prev.addEventListener('click', () => ap.skipBack());
  el.next.addEventListener('click', () => ap.skipForward());

  el.listBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = el.list.hidden;
    el.list.hidden = !open;
    el.listBtn.setAttribute('aria-expanded', String(open));
    if (open) scrollList();
  });
  el.list.addEventListener('click', (e) => {
    const item = e.target.closest('.md-item');
    if (!item) return;
    const i = Number(item.dataset.i);
    ap.list.switch(i);
    syncMeta();
    ap.play();
    saveState();
    el.list.hidden = true;
    el.listBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (e) => {
    if (dock.contains(e.target)) return;
    el.list.hidden = true;
    el.listBtn.setAttribute('aria-expanded', 'false');
  });

  function seekTo(clientX) {
    const rect = el.bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (isFinite(ap.audio.duration)) ap.seek(ratio * ap.audio.duration);
  }
  el.bar.addEventListener('click', (e) => seekTo(e.clientX));
  el.bar.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const d = ap.audio.duration || 0;
    ap.seek(Math.max(0, Math.min(d, (ap.audio.currentTime || 0) + (e.key === 'ArrowRight' ? 5 : -5))));
  });

  ap.on('play', syncPlaying);
  ap.on('pause', syncPlaying);
  ap.on('listswitch', syncMeta);
  ap.audio.addEventListener('timeupdate', () => {
    if (ap.audio.paused) syncProgress();
  });
  ap.audio.addEventListener('loadedmetadata', syncProgress);

  /* ---------- 状态记忆 ---------- */
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
  let lastSave = 0;
  function saveState() {
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
    if (now - lastSave < 1500) return;
    lastSave = now;
    saveState();
  });
  ap.on('play', saveState);
  ap.on('pause', saveState);
  window.addEventListener('beforeunload', saveState);
  window.addEventListener('pagehide', saveState);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveState(); });

  /* ---------- 切歌提示 ---------- */
  let toastTimer = null;
  function toast(text) {
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
    toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
  }

  /* ---------- 错误跳过 ---------- */
  let errorSkips = 0;
  ap.audio.addEventListener('error', () => {
    const code = ap.audio.error ? ap.audio.error.code : 0;
    if (code === 1) return;
    errorSkips += 1;
    if (errorSkips >= songs.length) { toast('歌曲暂时都无法播放（版权限制）'); return; }
    toast(current().name + ' · 暂不可用，切换下一首');
    setTimeout(() => ap.skipForward(), 700);
  });
  ['skipForward', 'skipBack'].forEach((method) => {
    const orig = ap[method].bind(ap);
    ap[method] = function () {
      const r = orig();
      syncMeta();
      saveState();
      toast(current().name);
      return r;
    };
  });

  /* ---------- 封面音符按钮（router 换页后依然有效） ---------- */
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('#splash-music')) return;
    e.preventDefault();
    ap.toggle();
  });
  function syncSplash() {
    const b = document.getElementById('splash-music');
    if (b) b.classList.toggle('playing', !ap.audio.paused);
  }
  ap.on('play', syncSplash);
  ap.on('pause', syncSplash);

  /* ---------- 接口 ---------- */
  window.__music = {
    playing: () => !ap.audio.paused,
    currentTime: () => Math.round(ap.audio.currentTime * 10) / 10,
    duration: () => Math.round((ap.audio.duration || 0) * 10) / 10,
    track: () => current().name,
    seek: (s) => ap.seek(s),
    next: () => ap.skipForward(),
    prev: () => ap.skipBack(),
  };

  syncMeta();
  syncPlaying();
  syncProgress();
  try { if (localStorage.getItem(MINK) === '1') setMin(true); } catch (e) { }

  /* 自动播放：先试一次，被浏览器拦下就在第一次点击/按键时补上 */
  let autoPlaying = false;
  let everStarted = false;
  ap.on('play', () => { autoPlaying = true; everStarted = true; });
  ap.on('pause', () => { autoPlaying = false; });
  function tryAutoPlay(e) {
    if (autoPlaying || everStarted || !window.__ap) return;
    if (e && e.target && e.target.closest && e.target.closest('#music-dock, #splash-music')) return;
    ap.play();
    setTimeout(() => { if (ap.audio.paused) ap.pause(); }, 600);
  }
  tryAutoPlay();
  window.addEventListener('pointerdown', tryAutoPlay, { passive: true });
  window.addEventListener('keydown', () => tryAutoPlay(null));

  /* 首页动画：封面上不显示胶囊，由按钮接管 */
  if (REDUCED) dock.classList.add('no-motion');
})();
