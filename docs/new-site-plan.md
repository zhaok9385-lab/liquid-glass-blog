# 新站方案 · Bright Air（明亮通透玻璃）

> 状态：**待确认**。确认后按第八节的四个批次施工。
> 目标：把现有「全屏极光 + 液态玻璃 + 仪式感封面」的站点，重做成**内容优先、明亮通透、玻璃只做点缀**的新站。技术形态保持纯静态 HTML + 原生 JS，GitHub Pages 零配置可托管。

---

## 一、为什么换，换掉什么

现有站点的问题不是不好看，而是**视觉压过了内容**：

| 现状 | 问题 | 新站做法 |
| --- | --- | --- |
| 全屏 WebGL 极光 + 颗粒 + 幕布 + 加载动画 | 每次进站先看 1–2 秒特效；背景比文字更抢眼 | 去掉极光与加载器，背景改为近白纸面 + 极淡的顶光渐变 |
| 自定义光标、磁吸按钮、3D 倾斜卡片 | 交互成本高，且与"安静阅读"冲突 | 全部移除，只保留 hover/focus 的即时反馈 |
| 玻璃铺满全站（导航、卡片、播放器、弹窗） | 玻璃多了就没有"光学焦点"，且正文对比度随背景波动 | 玻璃只给**导航条**和**首屏一处**；正文永远落在实底 |
| 11 个页面、双首页（封面 + 博客）、独立标签页 | 信息架构重复，入口分散 | 10 页，首页即内容页，标签并入归档的筛选视图 |
| 2457 行 style.css + 919 行覆盖层 | 两套样式互相覆盖，改一处怕崩另一处 | 单一 `site.css`，令牌 → 基础 → 布局 → 组件，一层到底 |

**保留**：内容（13 篇文章 / 5 条碎片 / 8 本书 / 5 张照片 / 关于）、品牌名 Tom、明暗双主题、阅读进度、TOC、命令面板、RSS、留言板、玻璃实验室（改成明亮参数版）。

---

## 二、站点地图（10 页 + 2 个跳转页）

> 已确认：**保留全屏封面页**、**保留音乐播放器**、**保留旧链接跳转**。

| # | 文件 | 页面 | 职责 | 主要模块 |
| --- | --- | --- | --- | --- |
| 1 | `index.html` | 封面 | 全屏诗句 + 明亮柔光底 + 「进入小屋」+ 站点统计 + 音乐按钮 | Cover、Poem、CTA、Stats |
| 2 | `home.html` | 首页 | 一句话身份 + 精选 3 篇 + 文章流（标签筛选 + 搜索） | Hero、Featured、PostList、FilterBar |
| 3 | `post.html` | 文章详情 | `?id=` 渲染；正文 + 右侧 TOC + 上/下篇 + 评论/留言回退 | Prose、TOC、Progress、PrevNext |
| 4 | `notes.html` | 碎片 | 短笔记流，按年月分组 | NoteItem、YearGroup |
| 5 | `archive.html` | 归档 | 时间线视图 + 标签聚合视图（同页切换） | TabSwitch、YearList、TagCloud |
| 6 | `books.html` | 书架 | 8 本书，状态筛选（在读/读完/想读）+ 星级 | BookRow、StatusFilter |
| 7 | `photos.html` | 相册 | 5 张图，4:3 统一比例，点开灯箱 | PhotoGrid、Lightbox |
| 8 | `messages.html` | 留言 | 留言列表 + 表单（本地存储演示，可接 Giscus） | MessageList、Form |
| 9 | `about.html` | 关于 | Now / Uses / Projects / 站点说明（技术栈与设计取向） | Prose、DefinitionList |
| 10 | `lab.html` | 实验室 | 玻璃参数调节（模糊/饱和/透明度/圆角/高光），一键复制 CSS | Slider×5、Preview、Copy |
| — | `tags.html` | 跳转页 | 1KB，跳到 `archive.html` 的标签视图 | meta refresh |
| — | `home-old.html` | 跳转页 | 仅在需要时使用；`home.html` 已复用旧地址，无需额外跳转 | — |

### 旧 → 新 映射

| 旧页面 | 新归属 |
| --- | --- |
| `index.html`（封面） | 保留，改为明亮版封面（去 WebGL 极光，改照片 + 柔光幕布） |
| `home.html`（博客列表） | 升级为首页（身份 + 精选 + 文章流一体） |
| `tags.html` | 并入 `archive.html` 的「按标签」视图；`tags.html` 保留为跳转页 |
| `post.html` / `notes.html` / `books.html` / `photos.html` / `messages.html` / `about.html` / `lab.html` | 保留，重做视觉 |
| `feed.xml` / `feed.json` | 保留，改站点描述与链接 |

---

## 三、导航与信息层级

```
顶栏（吸顶，玻璃，1 行）
├─ 左：Tom®  ·  右侧：封面 / 博客 / 相册 / 书架 / 关于  ·  更多 ▾（碎片、归档、留言、实验室）  ·  主题切换
└─ 快捷键：/ 或 ⌘K 呼出命令面板；T 切主题
```

- 一级入口**最多 5 个**，其余进「更多」，避免顶栏拥挤。
- 页脚三列：站点说明 / 页面索引 / 订阅与联系（RSS、GitHub、邮箱）。
- 音乐播放器保留，但收在右下角悬浮胶囊里（点击展开面板），不与导航争位置。
- URL 约定：全部 `.html`，参数用查询串（`?id=`、`?tag=`），不做 History API 路由，保证双击文件也能跑。

---

## 四、视觉系统

### 4.1 色彩（明暗两套令牌）

| 令牌 | 浅色 | 暗色 | 用途 |
| --- | --- | --- | --- |
| `--bg` | `#FAFAF8` | `#0F1115` | 页面底 |
| `--surface` | `#FFFFFF` | `#15181D` | 卡片/内容面 |
| `--text` | `#17181A` | `#E9EAEC` | 正文与标题 |
| `--text-2` | `#5F6368` | `#A6AAB1` | 次级文字 |
| `--text-3` | `#8B9096` | `#70747C` | 元信息、日期 |
| `--line` | `#E7E6E2` | `#252A31` | 分隔线、描边 |
| `--accent` | `#2F5D8A` | `#8FB4DD` | 链接、选中、进度 |
| `--accent-weak` | `#EDF2F7` | `#1A2430` | 强调底色（标签、选中态） |

单一强调色，不用渐变做标题。所有正文对比度 ≥ 4.5:1（`--text` 对 `--bg` 约 15:1，`--accent` 对白约 6.4:1）。

### 4.2 字体与字号

| 角色 | 字体栈 | 说明 |
| --- | --- | --- |
| 正文/界面 | `Inter, "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", system-ui` | 零外链，系统字体优先 |
| 长文标题（可选衬线） | `"Noto Serif SC", "Songti SC", Georgia, serif` | 只用于文章页 H1 与首页大标题，增添书卷气 |
| 数字/代码 | `"JetBrains Mono", ui-monospace, Consolas, monospace` | 日期、阅读时长、代码块 |

字号阶梯（固定值，不用流体缩放，避免小屏抖动）：`12 / 13 / 14 / 16 / 18 / 20 / 24 / 30 / 40 / 52`。
正文 16px 起（中文 17px），行高 1.8；标题行高 1.25；段间距 = 1 行。

**行长**：中文正文 `max-width: 38em`（约 38 字/行），西文 `68ch`；文章页整体版心 720px。

### 4.3 间距 / 圆角 / 阴影

- 间距阶梯：`4 8 12 16 20 24 32 40 56 72 96 120`，段间用 24/32，区块间用 72/96。
- 圆角：`10`（chip）/`14`（输入）/`18`（卡片）/`22`（面板）/`999`（胶囊）。
- 阴影只有两级：`0 1px 2px rgba(16,24,40,.04)`、`0 12px 32px rgba(16,24,40,.08)`。**不用发光**。

### 4.4 玻璃配方（只两层）

```css
/* 全站唯一配方：导航条 + 首屏一处 */
.glass {
  background: rgba(255,255,255,.72);              /* 有厚度的实底，不是 0.1 的透明 */
  backdrop-filter: blur(16px) saturate(1.6);
  border: 1px solid rgba(255,255,255,.55);        /* hairline */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.6),           /* 顶部内高光 */
    0 1px 2px rgba(16,24,40,.04),
    0 12px 32px rgba(16,24,40,.06);
}

@supports not ((backdrop-filter: blur(1px))) {
  .glass { background: rgba(250,250,248,.94); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--bg); backdrop-filter: none; }
}
```

暗色版：`rgba(21,24,29,.72)`，hairline 改 `rgba(255,255,255,.08)`，内高光降到 `.18`。

**不做折射**：不做 SVG 位移、不做着色器。明亮方向的质感来自"留白 + 细线 + 一级阴影"，折射只在 `lab.html` 里作为可玩参数提供示例代码。

### 4.5 图像

- 相册统一 4:3 裁切、圆角 18、无边框；悬停 `scale(1.02)` + 200ms。
- 文章内图片最大宽 100%，高 DPI 用 `srcset`（现有图片不重压缩）。
- 所有图片必须写 `alt` 与 `width/height`，避免布局位移。

---

## 五、组件清单（含状态）

| 组件 | 状态 | 要点 |
| --- | --- | --- |
| TopNav | 默认 / 滚动收缩（高度 64→56）/ 更多菜单展开 | 4+1 结构；`aria-current` 标记当前页 |
| Hero | 仅首页 | 姓名 + 一句话 + 2 个 CTA（读文章 / 关于我）+ 站点统计小字 |
| PostCard | 默认 / hover / focus-visible | 日期 + 标题 + 摘要 + 标签 + 时长；hover 上移 2px |
| TagChip | 默认 / 选中 / 禁用 | 选中用 `--accent-weak` 底 + `--accent` 字 |
| FilterBar | 关键词 + 标签 + 排序 | 输入 200ms 防抖，无结果给空状态文案 |
| TOC | 默认 / 当前节高亮 | 右侧 240px 粘性；窄屏折叠为"目录"按钮 |
| Prose | h2/h3/p/ul/blockquote/code/table/img | 代码块 mac 三色点 + 复制按钮；引用左侧 2px 线 |
| PhotoGrid / Lightbox | 默认 / hover / 打开 | 灯箱支持 Esc、左右键、点击遮罩关闭 |
| BookRow | 在读 / 读完 / 想读 / 星级 | 封面 3:4，状态用 chip，星级用 ★ 字符 |
| MessageForm | 空 / 校验失败 / 成功 | 本地存储；字段：昵称、正文、可选邮箱 |
| CommandPalette | 关闭 / 空查询 / 有结果 | ⌘K 或 `/` 呼出；结果 8 条上限，方向键选择 |
| Footer | — | 三列，移动端堆叠 |

---

## 六、动效与交互规范

- 时长：hover 160ms、展开 240ms、抽屉 320ms；缓动统一 `cubic-bezier(.2,.7,.3,1)`。
- 只对 `transform` / `opacity` 做动画，不动 `width/height/top`。
- 首屏不做入场动画；滚动揭示只在文章列表用一次淡入（IntersectionObserver，`threshold: .15`）。
- `prefers-reduced-motion: reduce` 时：全部位移/缩放取消，仅保留透明度过渡 80ms。
- 键盘：Tab 顺序与视觉顺序一致；`:focus-visible` 2px 环 + 2px offset；Esc 关闭所有浮层。

---

## 七、技术方案

### 7.1 目录结构（重构后）

```
liquid-glass-blog/
├── index.html  home.html  post.html  notes.html  archive.html
├── books.html  photos.html  messages.html  about.html  lab.html
├── tags.html                        # 兼容跳转页（→ archive.html）
├── feed.xml  feed.json  favicon.svg  serve.py  README.md
├── assets/
│   ├── css/site.css                 # 唯一样式表（目标 ≤ 55KB）
│   ├── js/data.js                   # 内容源，字段基本不变
│   ├── js/chrome.js                 # 顶栏/页脚/主题切换统一注入
│   ├── js/render.js                 # 首页/列表/归档/书架/相册渲染
│   ├── js/post.js                   # 文章渲染/TOC/代码复制
│   ├── js/music.js                  # APlayer 胶囊播放器（保留）
│   ├── js/cover.js                  # 封面柔光与进站交互（最终并入 chrome.js / render.js）
│   ├── vendor/APlayer.*             # 保留
│   └── img/…                        # 现有图片全部保留
└── docs/                            # 设计调研与本站方案（不入构建）
```

**删除**：`assets/css/style.css`、`assets/css/quiet-glass.css`、`js/shader.js`、`js/extra.js`、`js/main.js`、`_backup/`（本地保留，不入库）。

### 7.2 数据契约

`data.js` 保留现有 `SITE / TAGS / POSTS / PHOTOS / NOTES / BOOKS / ABOUT / GISCUS`，新增三个可选字段：

- `POSTS[].featured`（布尔）——首页精选
- `POSTS[].cover`（可选）——列表卡封面
- `SITE.tagline`（字符串）——新站一句话

渲染全部在前端完成（与现在一致），页面 HTML 只留容器与 `data-*` 钩子。

### 7.3 性能预算

| 指标 | 目标 | 现状 |
| --- | --- | --- |
| CSS | ≤ 55KB | 93 + 36 KB |
| JS（不含 data 与 APlayer） | ≤ 30KB | ~50KB |
| 外部网络请求 | 0（APlayer 已本地内置） | 图标外链 |
| 首屏字体 | 系统字体，0 请求 | 同 |
| Lighthouse 性能（本地） | ≥ 90 | 未测 |

### 7.4 可访问性

- 语义标签（`header/nav/main/article/aside/footer`）+ 跳转链接「跳到正文」。
- 所有图标按钮有 `aria-label`；装饰性 SVG `aria-hidden`。
- 表单有 `label` 与错误提示的 `aria-describedby`。
- 颜色不作为唯一状态标识（选中态同时有底色与字重变化）。

---

## 八、施工批次与验收

**批次 1 · 设计系统 + 阅读主路径（核心）**
`site.css` 令牌与基础层 → 顶栏/页脚 → `index.html`（封面）→ `home.html`（首页 + 文章流）→ `post.html`。产出即可浏览的主站。

**批次 2 · 内容页**
`archive.html`（含标签视图）、`notes.html`、`books.html`、`photos.html`。

**批次 3 · 互动页**
`messages.html`、`about.html`、`lab.html`（明亮参数版）。

**批次 4 · 收尾**
删除旧样式/脚本、`tags.html` 跳转页、`feed.xml`/`feed.json` 更新、`README.md` 重写、四档宽度（375/768/1024/1440）与明暗主题全页检查、键盘走查、Lighthouse 跑分。

**验收清单（逐条核对）**
- [ ] 10 页全部可打开，无 404、无控制台报错
- [ ] 封面 1 屏内讲完气质，首页 1 屏内看到第一篇文章
- [ ] 正文区长行 ≤ 38 字；中文行高 1.8
- [ ] 玻璃只出现在顶栏与封面卡，其余为实底
- [ ] 无 `@supports` 回退缺失；`reduced-transparency` / `reduced-motion` 生效
- [ ] 明暗两套主题下所有文字对比度 ≥ 4.5:1
- [ ] 375px 宽度无横向滚动；触控目标 ≥ 40px
- [ ] CSS ≤ 55KB、JS ≤ 30KB、0 外部请求
- [ ] 旧链接 `home.html` / `tags.html` 能正确跳转

---

## 九、内容处置：有一处必须改写

现有 13 篇文章里，至少两篇的正文把「本站背景是一片 WebGL 极光」当作现状来描述（`aurora-glsl`、`jelly-blog` 等）。新站去掉极光后，这些段落会与页面事实不符。

处理方式（二选一，我建议 A）：
- **A. 改写成"实验记录"**：把"本站现在是极光"改成"我曾用一个极光背景做实验，下面是当时的推导"，同时保留文章价值。
- **B. 保留一篇作为案例页**：给该文加一张当时的效果截图，正文不改，靠图片承载"曾经的样子"。

其余内容（碎片、书单、相册、关于）原样迁移，只重排版。

---

## 十、已确认的三个决定

1. **封面页**：**完整保留**。改为明亮版：照片底 + 柔光幕布 + 诗句 + 「进入小屋」，去掉 WebGL 极光与加载动画，进站更快但仪式感还在。
2. **音乐播放器**：**原样保留**。APlayer 与 vendor 目录不动，只换配色与位置（右下角胶囊），避免和导航抢视觉。
3. **旧链接兼容**：**保留跳转页**。`tags.html` 指向 `archive.html`；`home.html` 本身就是新首页，无需额外跳转。

方案其余部分按上表执行。从批次 1 开始施工。

---

## 十一、施工记录（2026-11-16）

批次 1–4 已一次性完成：站点从旧版 11 页切换到 10 页 + 1 个跳转页。

**已落地**
- `assets/css/site.css`（44.5 KB，唯一样式表，无覆盖层）
- `assets/js/chrome.js` / `render.js` / `post.js`（重写）、`music.js`（沿用，仅换皮与位置）
- 10 个页面 + `tags.html` 跳转页；`README.md` 重写；`feed.xml` / `feed.json` 标题与描述更新
- 旧 `style.css` / `quiet-glass.css` / `main.js` / `extra.js` / `shader.js` 移至 `_backup/old-glass/`

**与方案的偏差（有意为之）**
1. 封面隐藏 APlayer 浮动组件，只留左下音符按钮控制播放/暂停。原因：统计条、播放器、诗句在窄屏互相遮挡，封面以仪式感优先；内容页播放器原样保留（右下圆形唱片，可展开列表）。
2. 新增 `#search` 深链直接打开命令面板，方便分享与截图验收。
3. 文章页目录改用滚动位置判定高亮（IntersectionObserver 在首屏不触发首个标题）。
4. JS 体积 44 KB，超出 30 KB 预算；原因与取舍写在 README 的「已知取舍」。

**验收（已跑）**
- 10 页 + tags 跳转全部可打开，控制台无报错（仅 APlayer 自动播放被浏览器拦截的常规警告）
- 1440 / 1200 / 768 / 379 四档宽度检查，无横向滚动
- 明暗两套主题：顶栏、正文、卡片、播放器、抽屉、命令面板
- 375 档用 headless + device-scale-factor 近似验证（Windows Chrome 有约 500px 最小窗口）

**未做**
- Lighthouse 未跑（本机未装 CLI）；对比度按令牌手工核算，未做自动化扫描
- 未提交推送远端，等待确认
---

## 十二、二轮修订（2026-11-16）

用户复查提出五点，全部已落盘：

1. **播放器太丑、位置不对** → APlayer 自带 UI 全部隐藏，只保留引擎；新写左下角「音乐胶囊」：旋转封面唱片、跳动波形、可拖进度、可展开 5 首列表、上一首/下一首/播放键，玻璃材质与站点一致。移动端改为整条贴底。
2. **进相册/书架音乐就停** → 根因是这些页面根本没有引入播放器脚本与容器。已给 9 个内容页补齐 APlayer 资源与挂载点，播放器成为全站常驻组件。
3. **切模块会卡顿** → 新增 `router.js` 做站内软切换：拦截 `.html` 链接、抓取目标页、替换 `<main>`、更新标题/导航/描述，并用 View Transitions 过渡。文档不重建，音频元素与播放进度因此连续；`fetch` 失败或外部链接自动回退整页跳转。
4. **相册上传被删了** → 恢复并升级：多选上传、自动压缩（长边 1440 / JPEG 0.82）、localStorage 存储（`lg-photos-v1`，约 4.2 MB 上限）、长按后的改名与删除、上传照片打「我上传的」标记、灯箱保留键盘左右切换。
5. **背景没有设计、首页要动态** → `chrome.js` 注入 `air-bg` 氛围层：三团柔光 + 极淡纸纹；首页三团光各自以 26/34/30 秒缓慢漂移，内容页静止并叠一层几乎看不见的稿纸格线；封面的幕布加一层 24 秒呼吸光。全部使用 `transform` 动画，`prefers-reduced-motion` 下自动停。

**代价与取舍**
- CSS 53.8 KB（预算 55 KB，仍在内）；JS 不含 data 约 61 KB，超出原 30 KB 预算，已写入 README。
- 软切换要求通过 HTTP 打开；`file://` 下会退化为整页跳转，功能不缺。
- 上传容量受 localStorage 限制，属于纯静态站点的取舍；照片不上传服务器。