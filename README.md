# Tom · 一个人的小屋

> 写代码、做设计、留一点光。

明亮通透的个人博客：纯静态 HTML + 原生 JS，零构建、零依赖、零追踪。
视觉语言是 **Bright Air（明亮通透玻璃）** —— 玻璃只出现在顶栏与封面，正文永远落在实底上。

---

## 页面

| 文件 | 作用 |
| --- | --- |
| `index.html` | 封面：全屏诗句 + 山雾照片 + 统计条 + 音乐音符 |
| `home.html` | 首页：自我介绍、3 篇精选、全部文章（标签筛选 / 关键词搜索） |
| `post.html` | 文章页（`?id=xxx`）：720px 版心、粘性目录、阅读进度、代码复制、上下篇 |
| `archive.html` | 归档：时间线 / 按标签两个视图同页切换 |
| `notes.html` | 碎片：按年份归拢的短笔记 |
| `books.html` | 书架：按状态筛选，封面 + 一句短评 |
| `photos.html` | 相册：三列栅格 + 键盘可用的灯箱 |
| `messages.html` | 留言：localStorage 本机存储，带校验与快捷键发送 |
| `about.html` | 关于：现在 / 工具 / 在做的东西 / 联系 |
| `lab.html` | 实验室：可调参的玻璃，一键复制 CSS |
| `tags.html` | 旧链接跳转页：`meta refresh` + `location.replace` 到归档 |

## 结构

```
.
├── index.html … lab.html        # 10 个页面 + tags.html 跳转
├── feed.xml / feed.json         # RSS 2.0 / JSON Feed
├── favicon.svg, serve.py        # 图标、本地无缓存开发服务器
├── docs/
│   ├── design-inspiration-4.md  # 第四轮审美调研（GitHub 开源生态）
│   └── new-site-plan.md         # 本次重构的方案与施工记录
└── assets/
    ├── css/site.css             # 唯一样式表：令牌 → 基础 → 布局 → 组件（44.5 KB）
    ├── js/data.js               # 内容源：SITE / TAGS / POSTS / PHOTOS / NOTES / BOOKS / ABOUT / GISCUS
    ├── js/chrome.js             # 顶栏、页脚、主题、命令面板、抽屉菜单、Toast
    ├── js/render.js             # 首页 / 归档 / 碎片 / 书架 / 相册 / 留言 / 关于 / 实验室渲染
    ├── js/post.js               # 文章页：正文、目录高亮、进度、代码复制、评论位
    ├── js/music.js              # APlayer 装配（保留原有播放逻辑与状态记忆）
    ├── vendor/APlayer.*         # 本地内置播放器（MIT）
    └── img/                     # hero / cover / p1–p6 / books/b1–b8
```

## 运行

```bash
python serve.py          # http://127.0.0.1:8123，带 no-cache 头
```

也可以 `python -m http.server 8123` 或任意静态服务器；不依赖网络（音乐封面除外）。

## 设计系统要点

- **令牌**：浅色 `bg #FAFAF8 / text #17181A / accent #2F5D8A`；暗色 `#0F1115 / #E9EAEC / #8FB4DD`。
- **字体**：系统字体栈（Inter / PingFang SC / HarmonyOS Sans SC），长标题用 Noto Serif SC / Georgia，数字与代码用 JetBrains Mono / Consolas。
- **玻璃（唯一配方）**：`rgba(255,255,255,.74)` + `blur(16px) saturate(1.6)` + 发丝边 + 顶部内高光 + 两级阴影；带 `@supports not (backdrop-filter)` 实底回退与 `prefers-reduced-transparency` 分支。不做折射、不做 SVG 位移、不做着色器。
- **动效**：hover 160ms / 展开 240ms / 抽屉 320ms，统一 `cubic-bezier(.2,.7,.3,1)`；只动 `transform` 与 `opacity`；`prefers-reduced-motion` 下只保留 80ms 变化。
- **无障碍**：跳转链接、`aria-current`、`aria-pressed`、`aria-expanded`、可见 `:focus-visible`、表单错误文本、灯箱键盘左右切换、打印样式。

## 交互

- `Ctrl/⌘ + K` 或 `/`：全站命令面板（文章 / 页面 / 碎片 / 书），`#search` 深链可直接打开。
- `T`：切换明暗；状态写在 localStorage 的 `lg-theme`，各页 `<head>` 内置预置脚本防闪烁。
- 移动端：导航收进抽屉，点顶栏左侧按钮展开；2 列布局。
- 音乐：APlayer 固定右下角（收起为圆形唱片），会话内记忆曲目与进度（`lg-music-state`）；封面页只留左下音符按钮，避免遮挡诗句。

## 已知取舍

- JS（不含 `data.js` 与 APlayer）实测约 **44 KB**，高于方案里 30 KB 的预算；原因是各页渲染集中在 `render.js`。gzip 后约 10 KB，作为纯静态站点可接受，记录在此而非隐瞒。
- 旧版 `style.css` / `quiet-glass.css` / `main.js` / `extra.js` / `shader.js` 已移至 `_backup/old-glass/`（`.gitignore` 已忽略 `_backup/`），可随时取回。
- 文章正文里原本把「极光背景」当现状描述，已按方案 A 改为记录口吻（仅动必要的几句）。

## 部署

纯静态目录，直接拖进 GitHub Pages / Vercel / Netlify / Cloudflare Pages 即可。仓库：<https://github.com/zhaok9385-lab/liquid-glass-blog>（私有）。

## 许可

个人自用与魔改随意。
