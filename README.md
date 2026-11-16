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
| **归档与标签** | 时间线归档、按标签聚合浏览；⌘K / Ctrl+K 命令面板全站跳转（`/` 也可呼出） |
| **碎片与书单** | 短笔记流、阅读清单（状态/星级筛选）、Now / Uses / Projects 关于页 |
| **玻璃实验室** | `/lab` 实时调节模糊、饱和、透明度、圆角、色相与高光，一键复制 CSS |
| **订阅与评论** | 真实 RSS / JSON Feed；Giscus（GitHub Discussions）评论，未配置时优雅回退到留言板 |
| **工程细节** | `prefers-reduced-motion` 全面适配、WebGL 不可用静态兜底、页面隐藏时暂停渲染、低分辨率渲染省电 |

## 📁 结构

```
liquid-glass-blog/
├── index.html          # 首页：风景 Hero / 数据条 / 资料栏 / 信息流 / 订阅
├── home.html           # 博客列表（与首页信息流共用数据）
├── post.html           # 文章页（?id=xxx 由 JS 渲染）
├── photos.html         # 相册
├── messages.html       # 留言板
├── archive.html        # 归档：按年份的时间线
├── tags.html           # 标签：按主题聚合（?tag=xxx）
├── notes.html          # 碎片笔记
├── books.html          # 书单
├── about.html          # Now / Uses / Projects
├── lab.html            # 玻璃参数实验室
├── feed.xml / feed.json # RSS 2.0 与 JSON Feed
├── favicon.svg
└── assets/
    ├── css/style.css   # 液态玻璃设计系统（令牌 → 配方 → 组件）
    ├── css/quiet-glass.css  # ★ Quiet Glass 静谧玻璃覆盖层（编辑式极简 × 克制玻璃）
    ├── img/
    │   ├── hero.jpg    # Hero 风景图（Unsplash 免费授权，可自行替换）
    │   └── books/      # 书单封面（真实出版物封面，本地文件）
    └── js/
        ├── data.js     # ★ 所有内容与站点元信息（改这里即可换内容）
        ├── shader.js   # WebGL 柔光着色器（页面底色）
        ├── main.js     # 磁吸 / 倾斜 / 主题 / 揭示 / 信息流渲染 / 空间转场
        ├── post.js     # 文章页渲染 / 进度 / TOC / 代码复制 / 评论
        ├── extra.js    # 更多菜单 / 命令面板 / 归档 / 标签 / 笔记 / 书单 / 实验室
        └── music.js    # APlayer 音乐卡片
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

1. **换内容**：编辑 `assets/js/data.js` —— `SITE`（名字/邮箱/链接/订阅接口）、`TAGS`（标签色）、`POSTS`（文章，`content` 为 HTML 字符串，支持 h2/h3/p/ul/blockquote/pre）、`NOTES`（碎片笔记）、`BOOKS`（书单，含 ISBN / 出版社 / 页数 / 封面路径）、`ABOUT`（Now / Uses / Projects）。
2. **换配色**：`assets/css/style.css` 顶部的 `:root` 令牌（`--accent` 三色系 + 玻璃透明度）；着色器色板在 `shader.js` 的 `FRAG` 中同步调整。
3. **换玻璃手感**：`.glass` 的 `blur(22px) saturate(1.7)` 与五层内阴影是核心配方，动它之前先备份。
4. **订阅**：在 `SITE.subscribeEndpoint` 填入 Buttondown / Formspree 等 POST 地址即可真实收集邮箱；留空则回退为 `mailto:` 邮件订阅。
5. **评论**：在 `data.js` 的 `GISCUS` 中填入 GitHub 仓库与分类信息（见 <https://giscus.app>）；未配置时文章页展示引导卡片。
6. **RSS**：`SITE.url` 换成部署域名后，记得同步 `feed.xml` / `feed.json` 中的绝对链接。
7. **书单封面**：`BOOKS[].cover` 默认指向 `assets/img/books/b*.jpg`；换书时把封面图放进该目录并更新 `cover`、`isbn`、`link` 即可，无需联网。

## 🎨 Quiet Glass 视觉改造（2026-11）

在原有「全站液态玻璃」之上叠加了 **Quiet Glass · 静谧玻璃** 设计层（`assets/css/quiet-glass.css`，在 style.css 之后加载，以覆盖方式工作，不改原有组件逻辑）。

设计方向：Editorial Minimalism × Liquid Glass × Natural Photography —— 玻璃只用于导航、播放器、搜索弹窗、悬浮控件；内容层保持轻盈纸面。

| 维度 | 规范 |
| --- | --- |
| 页面背景 | `#F6F5F1`（暖白）/ 暗色 `#161B26` |
| 主要文字 | `#202B45` 深蓝灰 |
| 辅助文字 | `#858B98` |
| 强调色 | `#8CA9C8` 低饱和浅蓝 |
| 玻璃背景 | `rgba(255,255,255,.55)`，blur 18px |
| 卡片圆角 | 18px（卡片）/ 22px（大面板） |
| 标题 | 衬线（Georgia / Noto Serif SC），去蓝紫渐变 |
| 正文行高 | 1.8 |

主要改动：
- 首页：诗句缩小降阴影、英文换衬线斜体、统计改轻量底栏、音乐播放器统一移至右下角悬浮控件。
- 博客首页：标题改为「记录技术，探索设计，创造有趣的事物。」深蓝灰衬线，去掉蓝紫渐变；统计改轻量信息行；个人介绍/定位/按钮整合。
- 文章列表：杂志式左右布局、18px 圆角、去厚重边框阴影、分类改纯文字标签、搜索框简化、侧栏个人介绍缩小。
- 相册：图片为主角、去厚重卡片包裹。
- 留言：内容优先，玻璃只用于输入框与交互控件。
- 归档 / 标签 / 笔记 / 书单 / 关于 / 实验室统一轻量化。

旧版文件备份在 `_backup/quiet-glass/`。

## 🧪 兼容性

- Chromium（Chrome / Edge）：完整体验，含 SVG 位移真折射透镜。
- Firefox / Safari：SVG 折射降级为模糊，其余功能一致（自动检测）。
- 触屏设备：自定义光标、磁吸、倾斜自动关闭；`prefers-reduced-motion` 用户获得静态极光。

## 📄 许可

仅供个人博客使用与魔改，随意取用。
