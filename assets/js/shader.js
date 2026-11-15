/* ============================================================
   液态玻璃博客 · WebGL 极光背景
   域扭曲 fBm 着色器；鼠标辉光、滚动视差、明暗主题色温同步。
   WebGL 不可用时自动回退为静态 CSS 渐变。
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('aurora');
  if (!canvas) return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false, depth: false, stencil: false })
      || canvas.getContext('experimental-webgl');
  } catch (e) { gl = null; }

  if (!gl) {
    document.documentElement.classList.add('no-webgl'); // CSS 提供静态渐变兜底
    canvas.remove();
    return;
  }

  const VERT = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }',
  ].join('\n');

  const FRAG = [
    'precision highp float;',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform vec2  uMouse;',
    'uniform float uLight;',
    'uniform float uScroll;',

    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',

    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),',
    '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
    '}',

    'float fbm(vec2 p){',
    '  float v = 0.0, a = 0.5;',
    '  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }',
    '  return v;',
    '}',

    'void main(){',
    '  float mn = min(uRes.x, uRes.y);',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / mn;',
    '  vec2 mo = (uMouse - 0.5 * uRes) / mn;',
    '  float t = uTime * 0.042;',
    '  uv.y += uScroll * 0.42;',                       // 滚动视差：极光缓缓上涌
    '  uv *= 1.35;',

    '  vec2 q = vec2(fbm(uv * 1.35 + t), fbm(uv * 1.35 + vec2(5.2, 1.3) - t * 0.7));',
    '  vec2 r = vec2(fbm(uv * 1.35 + 2.2 * q + vec2(1.7, 9.2) + t * 0.9),',
    '                fbm(uv * 1.35 + 2.2 * q + vec2(8.3, 2.8) - t * 0.5));',
    '  float f = fbm(uv * 1.35 + 2.5 * r);',

    // 明暗双色板：暗 = 墨蓝夜湖（钢青/黛紫/灰梅/琥珀）；亮 = 晴空柔光（长春蓝/湖青/霞橙/鎏金）
    '  vec3 vio  = mix(vec3(0.140, 0.150, 0.310), vec3(0.672, 0.700, 0.910), uLight);',
    '  vec3 cya  = mix(vec3(0.085, 0.225, 0.315), vec3(0.635, 0.820, 0.885), uLight);',
    '  vec3 mag  = mix(vec3(0.250, 0.165, 0.270), vec3(0.940, 0.780, 0.720), uLight);',
    '  vec3 amb  = mix(vec3(0.560, 0.380, 0.160), vec3(0.980, 0.820, 0.560), uLight);',

    // 透明 blob 模式：只输出柔光色斑（alpha 叠加在照片/底色之上）
    '  float w1 = smoothstep(0.22, 0.85, f) * 0.60;',
    '  float w2 = smoothstep(0.35, 0.95, length(q)) * 0.42;',
    '  float w3 = smoothstep(0.55, 1.00, r.y) * 0.30;',
    '  float flow = w1 + w2 + w3;',
    '  vec3 col = (vio * w1 + cya * w2 + mag * w3) / max(flow, 0.0001);',

    // Stripe 式漂移色心：4 个光斑随时间游走，位置被 fBm 场扭出流体边缘
    '  vec2 pw = uv + 0.55 * (q - 0.5) + 0.40 * (r - 0.5);',
    '  vec2 cA = vec2(0.55 * sin(t * 1.10),        0.38 * cos(t * 0.83));',
    '  vec2 cB = vec2(0.60 * cos(t * 0.63 + 2.1),  0.42 * sin(t * 0.91 + 1.7));',
    '  vec2 cC = vec2(0.50 * sin(t * 0.77 + 4.0),  0.45 * cos(t * 0.59 + 3.2));',
    '  vec2 cD = vec2(0.45 * cos(t * 1.02 + 5.5),  0.36 * sin(t * 0.68 + 0.6));',
    '  float bA = exp(-dot(pw - cA, pw - cA) * 2.6);',
    '  float bB = exp(-dot(pw - cB, pw - cB) * 3.0);',
    '  float bC = exp(-dot(pw - cC, pw - cC) * 2.8);',
    '  float bD = exp(-dot(pw - cD, pw - cD) * 3.4);',
    '  float bw = bA + bB + bC + bD;',
    '  vec3 blobCol = (cya * 1.15 * bA + vio * 1.20 * bB + mag * 1.15 * bC + amb * bD) / max(bw, 0.0001);',
    '  float btotal = smoothstep(0.06, 0.92, bw);',
    '  col = mix(col, blobCol, 0.68 * btotal);',

    '  float md = length(uv - mo);',                    // 鼠标辉光：光向指尖聚拢
    '  float glow = exp(-md * 3.4) * 0.30 * (1.0 - uLight * 0.4);',
    '  col += mix(cya, vio, 0.5) * glow * 1.6;',

    '  float a = clamp(flow + glow + 0.95 * btotal, 0.0, 1.0) * 0.84;',
    '  gl_FragColor = vec4(col, a);',
    '}',
  ].join('\n');

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[aurora] shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { document.documentElement.classList.add('no-webgl'); canvas.remove(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    document.documentElement.classList.add('no-webgl'); canvas.remove(); return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {
    res: gl.getUniformLocation(prog, 'uRes'),
    time: gl.getUniformLocation(prog, 'uTime'),
    mouse: gl.getUniformLocation(prog, 'uMouse'),
    light: gl.getUniformLocation(prog, 'uLight'),
    scroll: gl.getUniformLocation(prog, 'uScroll'),
  };

  // ---- 状态 -------------------------------------------------------------
  const state = {
    w: 0, h: 0,
    mouse: { x: 0, y: 0 },        // 目标（物理像素，y 向下）
    smooth: { x: 0, y: 0 },       // 平滑后
    light: 0,                     // 0 暗 1 亮（平滑过渡）
    lightTarget: 0,
    scroll: 0,
    t0: performance.now(),
    running: true,
  };

  // 初始鼠标放屏幕中心，避免开场辉光从 (0,0) 扫过来
  state.smooth.x = state.mouse.x = window.innerWidth / 2;
  state.smooth.y = state.mouse.y = window.innerHeight / 2;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * 0.6; // 低分辨率渲染，CSS 放大
    state.w = Math.max(1, Math.floor(window.innerWidth * dpr));
    state.h = Math.max(1, Math.floor(window.innerHeight * dpr));
    canvas.width = state.w; canvas.height = state.h;
    gl.viewport(0, 0, state.w, state.h);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', function (e) {
    state.mouse.x = e.clientX; state.mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    state.scroll = Math.min(1, window.scrollY / max);
  }, { passive: true });

  // 主题切换时由 main.js 调用
  window.__setAuroraLight = function (isLight) { state.lightTarget = isLight ? 1 : 0; };

  // 页面隐藏时 rAF 会被浏览器挂起；恢复时校准时间起点，避免极光「跳帧」
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) state.t0 = performance.now() - elapsed;
  });

  function frame(now) {
    if (!state.running) { return; }
    // 平滑
    state.smooth.x += (state.mouse.x - state.smooth.x) * 0.045;
    state.smooth.y += (state.mouse.y - state.smooth.y) * 0.045;
    state.light += (state.lightTarget - state.light) * 0.05;

    gl.uniform2f(U.res, state.w, state.h);
    gl.uniform1f(U.time, (now - state.t0) / 1000);
    gl.uniform2f(U.mouse, state.smooth.x * (state.w / window.innerWidth),
      state.h - state.smooth.y * (state.h / window.innerHeight)); // 转 y 向上
    gl.uniform1f(U.light, state.light);
    gl.uniform1f(U.scroll, state.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let elapsed = 0;
  let rafId = 0;
  function loop(now) {
    frame(now);
    elapsed = now - state.t0;
    rafId = requestAnimationFrame(loop);
  }
  function requestFrame() { rafId = requestAnimationFrame(loop); }

  if (REDUCED) {
    // 减弱动效：只渲染一帧静态极光
    gl.uniform2f(U.res, state.w, state.h);
    gl.uniform1f(U.time, 20.0);
    gl.uniform2f(U.mouse, state.w * 0.5, state.h * 0.5);
    gl.uniform1f(U.light, state.light);
    gl.uniform1f(U.scroll, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.__setAuroraLight = function (isLight) {
      state.lightTarget = isLight ? 1 : 0;
      gl.uniform1f(U.light, isLight ? 1 : 0);
      gl.uniform2f(U.res, state.w, state.h);
      gl.uniform1f(U.time, 20.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    return;
  }

  requestFrame();
})();
