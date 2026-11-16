# Tom · 一个人的小屋

> 写代码、做设计、留一点光。

明亮通透的个人博客：纯静态 HTML + 原生 JS，零构建、零依赖、零追踪。
视觉语言是 **Bright Air（明亮通透玻璃）** —— 玻璃只出现在顶栏与封面，正文永远落在实底上。

---

## 页面

| 文件 | 作用 |
| --- | --- |
| `index.html` | 封面：全屏诗句 + 会缓慢呼吸的晨昏云海照片 + 统计条 + 音乐音符 |
| `home.html` | 首页：自我介绍、3 篇精选、全部文章（标签筛选 / 关键词搜索） |
| `post.html` | 文章页（`?id=xxx`）：720px 版心、粘性目录、阅读进度、代码复制、上下篇 |
| `archive.html` | 归档：时间线 / 按标签两个视图同页切换 |
| `notes.html` | 碎片：按年份归拢的短笔记 |
| `books.html` | 书架：按状态筛选，封面 + 一句短评 |
| `photos.html` | 相册：三列栅格 + 键盘可用的灯箱；支持本机上传、改名、删除 |
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
    ├── css/site.css             # 唯一样式表：令牌 → 基础 → 布局 → 组件（53.8 KB）
    ├── js/data.js               # 内容源：SITE / TAGS / POSTS / PHOTOS / NOTES / BOOKS / ABOUT / GISCUS
    ├── js/chrome.js             # 顶栏、页脚、主题、命令面板、抽屉菜单、氛围背景
    ├── js/render.js             # 首页 / 归档 / 碎片 / 书架 / 相册 / 留言 / 关于 / 实验室渲染
    ├── js/post.js               # 文章页：正文、目录高亮、进度、代码复制、评论位
    ├── js/router.js             # 站内软切换：换页不重载文档，音乐不断
    ├── js/music.js              # APlayer 引擎 + 左下角自定义音乐胶囊
    ├── vendor/APlayer.*         # 本地内置播放器（MIT，UI 已隐藏，只留音频能力）
    └── img/                     # cover-dawn / p1–p6 / books/b1–b8（hero.jpg 已停用）
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
- **软切换**：站内 `.html` 链接由 `router.js` 接管——抓取目标页、替换 `<main>`、更新标题与导航，不重建整个文档；因此正在播放的音乐不会被切断，`tags.html` 跳转页与外部链接仍走整页跳转。
- 移动端：导航收进抽屉，点顶栏左侧按钮展开；2 列布局。
- **音乐**：APlayer 引擎保留，界面换成左下角的深色玻璃胶囊（封面唱片 + 跳动波形 + 进度可拖动 + 列表可切歌）；胶囊上沿的圆钮可把整条收成一张 58px 唱片，再点唱片展开。宽度、高度、圆角、内边距与封面尺寸都有 0.44s 的过渡；收起时胶囊底立即透明、正文与控制区隐藏，只留下 58px 的深色圆盘 + 52px 唱片封面，因此在任何浏览器里都不会出现「圆扣在白胶囊上」。展开时先等宽度回到能放下文字，再显示正文，避免在 58px 的窄容器里挤压抖动；上一次收起留下的过渡锁也会在展开前解除。状态记在 `lg-music-min`，会话内记忆曲目与进度（`lg-music-state`）。封面页只留左下音符按钮，避免遮挡诗句。
- **相册**：上传自动压缩到长边 1440 / JPEG 0.82，存放在 localStorage 的 `lg-photos-v1`（上限约 4.2 MB），可改名、删除；照片不会上传到任何服务器。灯箱打开时顶栏与播放器自动让位，大图不会被压住。
- **背景**：封面是一张晨昏云海照片，做 42s 的缓慢推近 + 指针视差，再叠一条横穿柔光与细颗粒；内容页与首页按本地时间自动切换天空色——黎明偏粉、白天偏蓝、黄昏偏橙、夜里压成靛蓝，首页右侧的太阳/月亮也随之换色；夜里三团空气光也统一成冷色，避免上半页是夜、下半页还是黄昏。可用 `?time=day|dawn|dusk|night` 手动预览。首页即使不碰鼠标也会自己动：顶部两条光幕缓慢横穿、三团空气光漂移、太阳/月亮上下浮动、轨道上一颗小光点绕行；指针只是额外的一束跟随光，不是动效的来源。
- **版式细节**：不再使用竖排页码与巨大水印数字（用户反馈「模块的数字没有用」），改由首页光球、内容页轨道与每个模块的空气色来建立身份。

## 已知取舍

- CSS 62.4 KB、JS（不含 `data.js` 与 APlayer）约 **65 KB**，高于最初 30 KB 的预算：新增了软切换路由、自定义播放器界面、相册上传、两套背景系统、跟随光与极光/光球背景。gzip 后仍在十几 KB 量级，作为纯静态站点可接受，记录在此而非隐瞒。
- 封面照片 `assets/img/cover-dawn.jpg` 为本地压缩后的 1920×1080 JPEG（约 197 KB），首屏有 preload；`assets/img/hero.jpg` 已被替换，文件仍保留但无引用。
- 软切换依赖 `fetch` + `DOMParser`，因此站点必须通过 HTTP 打开（`file://` 下会退化成整页跳转，功能不受影响）。
- 相册上传占用浏览器 localStorage：单张压缩后约 200–400 KB，建议一次别超过十张。
- 旧版 `style.css` / `quiet-glass.css` / `main.js` / `extra.js` / `shader.js` 已移至 `_backup/old-glass/`（`.gitignore` 已忽略 `_backup/`），可随时取回。
- 文章正文里原本把「极光背景」当现状描述，已按方案 A 改为记录口吻（仅动必要的几句）。

## 部署

纯静态目录，直接拖进 GitHub Pages / Vercel / Netlify / Cloudflare Pages 即可。仓库：<https://github.com/zhaok9385-lab/liquid-glass-blog>（私有）。

## 许可

个人自用与魔改随意。
