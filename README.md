# LIQUID·GLASS —— 液态玻璃个人博客

> 以玻璃，折射思想。Refract your thoughts through liquid glass.

一个零依赖、零构建、零图片的液态玻璃（Liquid Glass）风格个人博客。
极光来自一段 WebGL 着色器，玻璃来自一段 CSS，所有视觉都是实时计算的。

![tech](https://img.shields.io/badge/依赖-0-brightgreen) ![size](https://img.shields.io/badge/体积-~50KB_JS+CSS-blue) ![build](https://img.shields.io/badge/构建-不需要-orange)

---

## ✨ 亮点

| 技术 | 说明 |
| --- | --- |
| **WebGL 极光背景** | 域扭曲 fBm（Domain Warping）着色器；鼠标辉光、滚动视差、明暗主题色温同步渐变 |
| **液态玻璃配方** | `backdrop-filter` 多层内阴影高光 + 增饱和，边缘 specular 勾勒玻璃厚度 |
| **真折射透镜** | `feTurbulence + feDisplacementMap` SVG 位移贴图参与 `backdrop-filter`（Chromium），其他浏览器优雅降级为普通模糊 |
| **玻璃光标** | 实心光点 + 弹簧插值玻璃圆环，悬停交互元素时膨胀 |
| **磁吸按钮 / 倾斜卡片** | 指针感应区平移、`rotateX/Y` 3D 倾斜、`--mx/--my` 驱动的扫光 |
| **明暗双主题** | 一键切换（快捷键 `T`），着色器色温与 CSS 令牌同步过渡；localStorage 记忆 |
| **阅读体验** | 顶部阅读进度条、粘性 TOC 高亮联动、mac 风格代码块 + 一键复制、上/下一篇 |
| **工程细节** | `prefers-reduced-motion` 全面适配、WebGL 不可用静态兜底、页面隐藏时暂停渲染、低分辨率渲染省电 |

## 📁 结构

```
liquid-glass-blog/
├── index.html          # 首页：风景 Hero / 数据条 / 资料栏 / 信息流 / 订阅
├── post.html           # 文章页（?id=xxx 由 JS 渲染）
├── favicon.svg
└── assets/
    ├── css/style.css   # 液态玻璃设计系统（令牌 → 配方 → 组件）
    ├── img/hero.jpg    # Hero 风景图（Unsplash 免费授权，可自行替换）
    └── js/
        ├── data.js     # ★ 所有文章内容与站点元信息（改这里即可换内容）
        ├── shader.js   # WebGL 柔光着色器（页面底色）
        ├── main.js     # 磁吸 / 倾斜 / 主题 / 揭示 / 信息流渲染 / 空间转场
        └── post.js     # 文章页渲染 / 进度 / TOC / 代码复制
```

## 🚀 运行

任何静态服务器都可以（直接双击 index.html 也能打开，但推荐走 HTTP）：

```bash
cd liquid-glass-blog
python -m http.server 8123
# 或 npx serve .
```

打开 <http://127.0.0.1:8123>

## 🌍 部署

纯静态目录，拖进 **GitHub Pages / Vercel / Netlify / Cloudflare Pages** 任一平台即可，无需任何配置。

## ✏️ 定制

1. **换内容**：编辑 `assets/js/data.js` —— `SITE`（名字/邮箱/链接）、`TAGS`（标签色）、`POSTS`（文章，`content` 为 HTML 字符串，支持 h2/h3/p/ul/blockquote/pre）。
2. **换配色**：`assets/css/style.css` 顶部的 `:root` 令牌（`--accent` 三色系 + 玻璃透明度）；着色器色板在 `shader.js` 的 `FRAG` 中同步调整。
3. **换玻璃手感**：`.glass` 的 `blur(22px) saturate(1.7)` 与五层内阴影是核心配方，动它之前先备份。

## 🧪 兼容性

- Chromium（Chrome / Edge）：完整体验，含 SVG 位移真折射透镜。
- Firefox / Safari：SVG 折射降级为模糊，其余功能一致（自动检测）。
- 触屏设备：自定义光标、磁吸、倾斜自动关闭；`prefers-reduced-motion` 用户获得静态极光。

## 📄 许可

仅供个人博客使用与魔改，随意取用。
