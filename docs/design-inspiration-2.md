# 审美参考库 · 第二轮：排版 · 色彩 · 动效 · 流派 · 灵感地图

> 自主学习向沉淀，与具体项目解耦。承接 `design-inspiration.md`（个人站点案例、Liquid Glass 官方原则、可读玻璃配方）。
> 本轮四条主线：① 排版排印；② 色彩体系；③ 动效与微交互；④ 当代设计流派趋势与长期浏览的灵感社区。

---

## 一、排版排印（Typography）

排版是界面审美的骨架：层级先靠字号、字重、行长、行距建立，颜色只做强调。

### 1.1 行长（Measure）

| 文字类型 | 理想行长 | 安全范围 | 硬上限 |
| --- | --- | --- | --- |
| 拉丁 / 西文 | 约 66 字符 | 45–75 字符 | 80 字符 |
| 中文 / CJK | 每行 30–40 字 | — | 约 40 字 |

- 用 `ch` 单位或 `max-width` 约束行长，而不是靠断点猜。
- **左对齐**为主；避免两端对齐（justify），中西混排时容易拉出"河流"状空隙。
- 长行需要更大行距补偿；短行行距应收紧。

### 1.2 行距（Line Height / Leading）

| 文本层级 | 推荐行距 | 说明 |
| --- | --- | --- |
| 正文 | 西文 1.4–1.7；中文 1.6–1.8 | 汉字字符密集成块，比西文需要略大行距 |
| 标题 | 1.1–1.3 | 收紧，显得紧凑有力 |
| 辅助 / 小字 | 1.75–2.0 | 字小需更多呼吸 |
| 长文阅读 | 可再放宽半档 | 降低密集疲劳 |

- 公式直觉：行长越长 → 行距越大；字号越大 → 行距越小。
- 段间距约为 1.5 倍行距，用比例而非固定像素堆叠。

### 1.3 字号阶梯（Type Scale）

- 建立一套可复用的阶梯，而不是每个标题随手给值：
  `Display > H1 > H2 > H3 > 正文 > 辅助 > 注释`。
- 相邻层级之间字号或字重要有可见差距，差距太小会显得层级混乱。
- 流式排版用 `clamp(最小, 视口比例, 最大)`，在窄屏先定 375px 表现，宽屏再扩展。
- 字重配合字号：大标题可用 700–800，正文 400–500，辅助 400。

### 1.4 字体搭配

- 一套界面通常 **1–2 个字体族**：一个无衬线承担界面与正文，可选一个衬线用于长文/标题增添书卷气。
- 中西文混排：西文与数字用比例字体，中文回退到系统黑体（PingFang / 雅黑 / 思源黑体系列）。
- 字体数量克制：堆砌多个字体会破坏统一感；性格靠字重、字号、字距表达。
- 代码 / 数字用等宽字体，与正文字体形成第三类对比。

### 1.5 中文排版专项要点

- **避头尾**：句号、逗号、顿号、分号、冒号、问号、叹号不出现在一行之首；前引号、前括号不出现在一行之尾。
- **中西文 / 数字间隙**：中文与相邻英文单词、阿拉伯数字之间按字体与字距决定是否留半角间隙，视觉上不挤在一起即可。
- **标点悬挂（hanging punctuation）**：引语、清单首的标点可挂到版心外侧，让首行视觉对齐更干净。
- **不强行两端对齐**：中文混排西文时两端对齐容易在汉字间拉出不均空隙。
- 参考规范：[W3C 中文排版需求（clreq）](https://www.w3.org/TR/clreq/)。

### 1.6 节奏与留白

- 留白用于分组、呼吸、强调，不是用来填充版面。
- 同一类区块的上下间距保持同一套比例；视觉上先分组，再在组内放松。
- 首屏一句话定位，标题、摘要、元信息按层级递减弱化。

---

## 二、色彩体系

### 2.1 色彩模型与分工

- **HSL / HSB**：最贴近设计师思维——色相（H 0–360°）、饱和（S 0–100%）、明度（L 0–100%）；改一个值就能派生一整套色阶。
- **OKLCH / OKLab**：感知均匀色空间，等值变化产生等值的观感明度；跨不同色相建等亮度色阶时优先于 HSL。
- 分工直觉：设计调色用 HSL/OKLCH；样式表记紧凑 HEX；程序计算与动画用 RGB。
- 色相环参考：0° 红、30° 橙、60° 黄、120° 绿、180° 青、210° 天蓝、240° 蓝、270° 紫、300° 品红、330° 粉。

### 2.2 色轮和谐（起点，不是定律）

| 和谐关系 | 位置 | 观感 | 用法 |
| --- | --- | --- | --- |
| 互补 Complementary | 色相相距 180° | 高对比、有活力 | 少量使用；适合单一主色背景上的 CTA |
| 类似 Analogous | 相邻 30–60° | 和谐、平静 | 近似单色但有细微变化；自然感配色 |
| 三分 Triadic | 各 120° | 鲜艳而平衡 | 一个主色占 60%，其余 30% / 10% |
| 分裂互补 Split-complement | 基色 + 互补色两侧两色 | 对比强但张力较柔 | 互补色太刺眼时的更稳选择 |

### 2.3 用量法则：60-30-10

- **60% 主色**：中性色，背景与大表面。
- **30% 次色**：品牌色，关键界面元素。
- **10% 强调**：CTA、高亮、通知。
- 超出这个比例就容易变成视觉噪音；强调色全场只承担少数焦点。

### 2.4 色阶与语义色构建

- 固定色相，沿明度/饱和拉色阶（50 → 900）；品牌色落在中间一档。
- 暗色模式下不要直接照搬亮色饱和值：彩色在深底上会显刺眼，降饱和 10–20% 或略提亮。
- 语义色独立于品牌色阶：成功、警告、错误、信息；并配图标 / 文字 / 形状作为辅助信号，**颜色不能是唯一信号**（顾及红绿色盲）。
- 跨色盲最安全的可区分组合是蓝与橙；避免红绿直接相邻搭配。

### 2.5 暗色模式规则

- **不用纯黑 `#000`**：极端对比在 OLED 上产生光晕与疲劳；用极深灰（如 `hsl(220, 10%, 10%)`）。
- **不要简单反色**：暗色是重新设计，不是把亮色值翻转。
- **高程表达**：亮色模式靠阴影表达层级；暗色模式靠更亮的表面色表达高程（越靠近"上方光源"越亮）。
  - Level 0 背景：`hsl(220, 15%, 8%)`
  - Level 1 卡片：`hsl(220, 13%, 12%)`
  - Level 2 弹窗：`hsl(220, 11%, 16%)`
  - Level 3 浮层：`hsl(220, 9%, 20%)`
- **阴影在暗色失效**：改用同色辉光（glow）或提亮表面来区分层级。
- 表面与正文对比要留足：保证最高（最亮）表面上的正文仍过 WCAG AA 4.5:1。
- 品牌暗色表面：用低透明度品牌色叠在推荐暗色表面色上，而不是直接铺高饱和。

### 2.6 对比与可访问性

- 正文 ≥ **4.5:1**；大字号文本 ≥ **3:1**（WCAG AA）。
- 状态色搭配文字时，测背景最花、对比最差的位置，而不是最好看的位置。
- 用色盲模拟器（如 Colorblindly 类扩展）走查一遍。

### 2.7 现代 CSS 色彩工具

- `color-mix(in srgb, A 50%, transparent)`：派生悬停、描边、浅底色。
- 相对颜色：`hsl(from var(--brand) h s calc(l + 15%))` 一键派生明/暗/灰化版本。
- `light-dark(亮色, 暗色)`：一行声明两套主题色，配合 `color-scheme`。
- `oklch()`：建等感知亮度的色阶。

---

## 三、动效与微交互（Motion）

### 3.1 决策阶梯：先证明动画存在的必要

1. **每个动画都要传达信息**：层级、状态、空间关系。纯装饰动画是噪音。
2. **频率决定预算**：
   | 使用频率 | 动画待遇 |
   | --- | --- |
   | 每天 100+ 次（快捷键、命令面板） | 永不加动画 |
   | 每天数十次（悬停、列表导航、输入） | 移除或大幅压缩到 150ms 内 |
   | 偶发（弹窗、抽屉、提示条） | 标准动画 200–300ms，目的明确 |
   | 首次 / 罕见（引导、庆祝） | 可以讲故事、加愉悦感 |
3. **速度传达自信**：200ms 以内感觉即时；300ms 以上开始显得拖沓。
4. **`prefers-reduced-motion` 不是可选项**：要优雅降级到无动效，而不是直接 `animation: none` 后丢状态。
5. **只动 GPU 属性**：`transform` 与 `opacity`；不要动画 `width/height/top/left`，会触发布局抖动。
6. **显式列出属性**：避免 `transition: all`，它会动画你没打算动的属性。

### 3.2 时长令牌（五档覆盖约 95% 场景）

| 令牌 | 时长 | 用途 |
| --- | --- | --- |
| `--motion-fast` | 120ms | 透明度、颜色、悬停、聚焦环、提示条显隐 |
| `--motion-base` | 200ms | 下拉、开关、标签页、选择器、标签、手风琴 |
| `--motion-medium` | 280ms | 弹窗、浮层、抽屉、消息条 |
| `--motion-slow` | 400ms | 页面转场、移动端抽屉、全屏面板 |
| `--motion-slower` | 600ms | Hero 动画、首次引导编排（克制使用） |

- 不自造时长：不要 `153ms`，不要同状态一个按钮 200ms、另一个 220ms。
- 决策类操作可慢（长按删除 2s 线性），释放反馈必须快（200ms ease-out）。

### 3.3 缓动令牌

| 令牌 | 曲线 | 用途 |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | 默认；进入、悬停、下拉、弹窗打开 |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 同层元素位移 / 形变（重排、换位） |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | 单屏只一处：Hero 揭示、主 CTA 强调 |
| `--ease-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material 风格通用柔缓 |

禁用清单：
- 不在 UI 用 `ease-in`：慢启动延迟了视觉反馈。
- `linear` 仅限加载指示器、跑马灯、滚动进度、长按删除指示。
- 不要用对称 `cubic-bezier(0.5,0.5,0.5,0.5)` 冒充"smooth"——那就是直线。
- 功能 UI 不用弹性 / 回弹缓动；回弹属于庆祝场景。
- 同一元素进入与退出用同一套缓动，不对称会显得坏掉。

### 3.4 交互规则

- **交互反馈 ≤100ms**：超过就不再像"反应"。
- **悬停契约**：transform、颜色、阴影一起动，不要只动一个属性。
- **聚焦契约**：聚焦环也要有可感知的快速过渡，键盘用户才能看到状态变化。
- 退出中的元素禁用交互（视觉还在，逻辑已走）。
- 错落（stagger）播放期间不要阻塞输入；装饰动效不能挡住操作。

### 3.5 编排（Choreography）

- **退出时长约为进入的 75%**：进入 280ms，退出约 200ms，走 `ease-out`。
- **层级优先**：父 / 容器先动，子 / 内容后动；上下文先到，细节后到。例：遮罩淡入 → 面板滑入 → 表单项错落进入。
- **兄弟错落间隔 30–80ms**：不要全是 0（像贴上去的），单项不超过 80ms（第 6 项以后列表就显慢）；营销页戏剧化进入可放到 100–150ms。
- 同一元素的多个属性共享一套时长与缓动，不要三套时长互相竞争。
- 同一元素出现在两处（列表 → 详情）用布局动画（layoutId / View Transitions / FLIP），不要做离散的销毁重建。
- 退出镜像进入：从 `opacity:0, y:20` 进入，就回到同样位置退出。
- 动态列表用唯一 key（不要用索引），才能平滑增删。

### 3.6 每表面动效预算（对抗"加载就全动"的 slop）

| 表面 | 预算 |
| --- | --- |
| 落地 Hero | 最多 3 个错落进入（标题 / 副标题 / CTA）；最多 1 个滚动联动元素 |
| 特性区块 | 每卡片 1 次滚动揭示，错落 40ms，只触发一次 |
| 仪表盘 | 只做微交互；指标卡、图表、表格不加入场动画 |
| 表单 | 每字段 1 个聚焦环过渡；不逐字段错落进入 |
| 弹窗 | 遮罩淡入 + 面板位移；弹窗内部元素不在打开时动画 |
| 设置 / 后台 | 零入场动画；高频工具，动效浪费时间 |
| 首次引导 | 预算最大，唯一值得讲故事的时刻 |

### 3.7 弹簧（Spring）与补间（Tween）

- **全局二选一**，不要逐组件混用；混用读起来不一致。
- **用弹簧**：带动量的拖拽、需要"活着"感的元素、可中途打断的手势、跟随鼠标的装饰交互（弹簧保留速度，CSS 动画从零重启）。
- **用补间**：有严格时长预算、确定性动效匹配品牌、纯功能性动效。
- 弹簧回弹保持 0.1–0.3，多数功能 UI 避免回弹；常见配置：
  - 卡片 / 容器平稳落定：`stiffness 300, damping 30`
  - 弹出 / 徽章利落：`stiffness 500, damping 25`
  - 滑入 / 进入均衡：`stiffness 350, damping 28`
  - 拖拽释放：`stiffness 500, damping 30` + 继承速度

### 3.8 降级契约

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

两个例外：**加载指示器继续转**（冻住像坏掉）；**必要反馈保留**（聚焦环仍需可感知过渡）。

### 3.9 动效反模式

- 自造时长；`transition: all`；对称假 smooth 曲线；功能 UI 回弹；UI 用 `ease-in`。
- 内容区身体视差（伤滚动性能，对减弱动效不友好）；滚动劫持（scroll-jacking）。
- 每次悬停都动（死在一千个小动画里）；每次页面加载都播入场动画。
- 同一元素进出缓动不一致；悬停夸张缩放（功能 UI ≤1.02，卡片 1.02–1.05）。
- 动画 `width/height/top/left` 造成布局抖动。

---

## 四、当代设计流派与趋势（2026 观察）

| 流派 | 特征 | 耐久用法 / 注意 |
| --- | --- | --- |
| **Glassmorphism / 液态玻璃** | 半透明面板、背景模糊、柔阴影、分层深度；极简与深度的平衡 | 最耐久的落点是吸顶导航 / 浮层；长列表与正文内容层保持实色，避免玻璃叠玻璃 |
| **Bento Grid 便当格** | 不同比例瓷砖组成的不对称网格（Apple 带火，SaaS 通用） | 2026 走向"主动式"：悬停滑开、播放视频、露出附加层；格内信息层级要齐 |
| **Soft Brutalism 软粗野** | 超大字号、粗描边、硬边零模糊阴影、按压式 hover、纯色 | 作为全页风格在降温；其元素（粗边、硬阴影、按压态）可作为常规布局里的大胆 CTA |
| **Editorial 编辑式** | 强对比、深色调、戏剧化滚动叙事、画廊式留白、大标题排印 | 长文 / 作品集适用；靠排版而非装饰撑场面 |
| **Dark Mode** | 深色表面层级、提亮浮层、同色辉光 | 重新设计而非反色；避免纯黑与高饱和照搬 |
| **微交互** | 悬停、按压、聚焦的即时反馈 | 反馈快、属性协同、有目的 |
| **柔和新拟态（Subtle Neumorphism）** | 同色系凹凸柔影 | 只在低信息密度场景点缀，重信息界面易显脏 |
| **AI 生成艺术与渐变** | 氛围背景、渐变光斑、生成插画 | 装饰层退后，不压住可读性；渐变保持大而柔，不做小碎图案 |

**跨流派的共识**：内容优先、层级清晰、动效克制、色彩收敛、深浅成体系；潮流是外衣，排版与可读性是底子。

---

## 五、灵感社区地图（按用途收藏）

### 5.1 奖项与综合网站画廊

| 站点 | 适合看什么 |
| --- | --- |
| [Awwwards](https://www.awwwards.com/websites/gallery/) | 获奖级创意网站，动效、叙事、视觉实验前沿 |
| [CSS Design Awards](https://www.cssdesignawards.com/) | 每日精选高质量创新网页 |
| [SiteInspire](https://siteinspire.com/) | 按风格 / 类型筛选的干净站点案例 |
| [Godly](https://godly.website/) | 精选高质量设计站点 |
| [Land-book](https://land-book.com/) | 落地页 / 作品集画廊 |
| [Httpster](https://httpster.net/) | 独立网页作品周刊 |
| [SaaSPO](https://saaspo.co/) | SaaS 与创业公司站点参考 |

### 5.2 组件与界面参考

| 站点 | 适合看什么 |
| --- | --- |
| [Dribbble](https://dribbble.com/) | UI 概念、组件、移动屏幕、仪表盘；按具体组件关键词搜，别漫无目的刷 |
| [Behance](https://www.behance.net/) | 完整项目与案例过程，看从概念到成品的路径 |
| [Mobbin](https://mobbin.com/) | 真实产品界面库，浏览现成产品模式 |
| [UI Garage](https://uigarage.net/) | 单屏界面模式与模式集锦 |
| [Figma Community](https://www.figma.com/community) | 共享文件、UI Kit、设计系统，可拆解组件与布局搭法 |

### 5.3 字体与配色工具

| 站点 | 用途 |
| --- | --- |
| [Typewolf](https://typewolf.com/) | 字体搭配与排印案例 |
| [Coolors](https://coolors.co/) | 配色方案生成与调整 |
| [Colorable / 对比度检查工具](https://colorable.jxnblk.com/) | 文本与背景对比度走查 |

### 5.4 浏览方法（比收藏名单更重要）

- 带着问题逛：要做按钮就搜 button / card / nav，不要刷首页找感觉。
- 看到喜欢的案例，记录三点：**层级怎么分的、配色怎么分配的、动效在反馈什么**。
- 区分"视觉炫技"与"可迁移规则"：实验站的手法不必照搬，规则（行长、时长、层级）才沉淀得下来。
- 定期回看自己收藏的清单，删掉只刺激视觉、讲不出道理的案例。

---

## 六、审美自检心法

1. **层级先于装饰**：先问标题、正文、元信息的层级是否成立，再谈材质与动效。
2. **克制是默认值**：颜色只强调焦点，动效只做反馈，玻璃只做浮层，留白留给阅读。
3. **参数成体系**：时长、缓动、色阶、字号都走令牌，不自造单点数值。
4. **为可读性兜底**：对比、降级、减弱动效是审美底线，不是事后补丁。
5. **潮流随时间变，底子不变**：排版节奏、色彩关系、反馈直觉、空间秩序是长期能力。

---

## 延伸来源

### 排版
- [Line Width in Digital Typography（Oregon State）](http://blogs.oregonstate.edu/calverta/line-width-in-digital-typography-for-accessibility-and-comprehension/)
- [Web Typography 2025 指南](https://lovablewebagency.com/fr/blog/typographie-web-2025)
- [网页字体设计指南（元伸科技）](https://www.ozchamp.com/insights/typography-web-design)
- [W3C 中文排版需求 clreq](https://www.w3.org/TR/clreq/)

### 色彩
- [Color Theory for Web Design: RGB, HSL, Contrast（ToolsDock）](https://toolsdock.com/blog/color-theory-web-design/)
- [Material Design 3 · Color system](https://m3.material.io/styles/color/system/how-the-system-works)
- [Material Dark theme 与对比度](https://m2.material.io/design/color/dark-theme.html)
- [web.dev · 用 Baseline CSS 函数做色彩主题](https://web.developers.google.cn/articles/baseline-in-action-color-theme)

### 动效
- [SmoothUI · Motion 决策阶梯与令牌](https://skills.smoothui.dev/docs/motion)
- [SmoothUI · Animation Best Practices](https://smoothui.dev/docs/guides/animation-best-practices)
- [Wayflyer Design · Motion 标准](https://design.wayflyer.com/latest/product/design-language/motion-3zzW96lw-3zzW96lw)
- [Motion Design 参考（jsDelivr）](https://cdn.jsdelivr.net/npm/@su-record/vibe@2.8.24/skills/ui-ux-pro-max/reference/motion-design.md)

### 流派趋势
- [Modern Website Design 2026（spoko.space）](https://spoko.space/blog/modern-website-design-trends/)
- [Web Design Trends 2026（The Plus Addons）](https://theplusaddons.com/blog/web-design-trends-2026/)
- [Top 16 Web Design Trends 2026（WP Creative）](https://www.wpcreative.com.au/web-design-trends/)

### 灵感社区
- [25+ UI/UX Inspiration Sites by what you're building（DEV）](https://dev.to/oluwadamilare_elufowohan_/25-uiux-and-web-design-inspiration-sites-sorted-by-what-youre-building-fh7)
- [Best Websites for Design Inspiration 2026（Paperblog）](https://en.paperblog.com/best-websites-for-design-inspiration-in-2026-8050545/)
- [Best Web Design Inspiration（Devflow）](https://www.devflow.co.uk/blog/best-websites-for-web-design-inspiration-for-designers)
