# 审美参考库 · 个人博客 × 优秀 UI 组件 × Liquid Glass

> 学习时间：2026-11-16 ｜ 用途：为本项目（liquid-glass-blog）沉淀可复用的设计判断与参数基准。
> 三条主线：① 国内外优秀个人网站/博客的版式与表达；② 经典 UI 组件的克制与秩序；③ Apple Liquid Glass 官方设计语言与可读玻璃工程配方。

---

## 一、标杆个人网站 / 博客案例库

### 1.1 国外标杆

| 站点 | 风格定位 | 核心手法 | 可借鉴点 |
| --- | --- | --- | --- |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | 教学型前端博客，活泼但有序 | 交互式图文、SVG 形变动效、滚动驱动动画（`animation-timeline`）、有性格的代码字体与斜体 | **内容即演示**：复杂概念用可交互小插图讲清楚；动效服务于解释，而非装饰 |
| [Brittany Chiang](https://brittanychiang.com/) | 暗色极简单页作品集 | 分区清晰（经历 / 项目 / 联系）、冷色调、克制微交互、强排版层级 | 信息架构优先；每个区块只讲一件事；动效轻、反馈准 |
| [Bruno Simon](https://bruno-simon.com/) | 沉浸式 3D 创意编码 | Three.js 场所化体验、物理感交互 | 只取其"场所感"：让首屏有记忆点；博客场景不必照搬 3D 重量 |
| [Cassie Evans](https://cassie.codes/) | 创意编码个人站 | 把专业专长直接做进界面语言，活泼而有秩序 | 界面本身就是个人能力的展品 |
| [Fuselle（Framer 案例集）](https://www.framer.com/blog/personal-website-examples/) | 编辑式（editorial）博客 | 重文字也能有视觉张力；文章页 / 分类页成体系 | 长文排版要有节奏：标题、引语、元信息、留白各司其职 |
| Core 极简模板（Jacob Vos） | 无干扰极简 | 大量留白、自定义光标、深浅切换、轻量装饰 | 首屏一句话定位；视觉层级熟悉，只在细节处"破一下" |
| Sharm | 大字号编辑风 | 超大现代无衬线标题、分区节奏、粘性过渡导航 | 标题字号与字重拉开差距；区块之间用留白而非分割线 |
| Aperture | 画廊式影像站 | 全屏边到边图片、柔和过渡、刻意留白 | 影像优先时，UI 全部退后；留白锁定视线 |
| Medium 类阅读布局 | 纯阅读体验 | 居中约 650–720px 行宽、1.6 左右行高、专注阅读模式隐藏 UI | 长文行宽与行高是可读性第一优先级 |

### 1.2 中文 / 国内参考

| 站点 / 趋势 | 要点 |
| --- | --- |
| [阮一峰的网络日志](http://www.ruanyifeng.com/blog/developer/) | 纯文本信息架构：时间线归档、日期与评论数等元信息朴素清晰；**内容优先于装饰**，排版服务于检索与阅读 |
| 中文独立博客趋势 | 宽阔留白、醒目的大字标题、利落细线边框；按钮有明确边框，标题不藏着掖着；首页 / 文章 / 归档 / 关于共用一套视觉 |
| [Twenty Twenty-Five](https://wordpress.org/themes/twentytwentyfive/) | 块式模板、国际化排版、多套配色；强调简洁与适应性 |

### 1.3 从案例中提炼的共性法则

1. **内容层与装饰层分离**：标杆站点的动效、色彩、材质都围着内容转，首屏一句话说清"我是谁、写什么"。
2. **层级靠排版，不靠颜色**：字号、字重、行高、留白先建立秩序，颜色只做强调。
3. **克制的动效**：每处动效都有目的（反馈、引导、解释）；悬停反馈轻、跟手、可预期。
4. **留白是最贵的装饰**：宁可区块少而疏，不要卡片密而满。
5. **深浅双主题是标配**：且两套主题共享同一套令牌，不是简单反色。

---

## 二、Apple Liquid Glass 设计语言拆解（WWDC25 官方）

来源：[Apple Newsroom 中文稿](https://www.apple.com.cn/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) ｜ [WWDC25 · Meet Liquid Glass (219)](https://developer.apple.com/videos/play/wwdc2025/219/) ｜ [Platforms State of the Union (102)](https://developer.apple.com/videos/play/wwdc2025/102/) ｜ [New Design System (356)](https://developer.apple.com/videos/play/wwdc2025/356/)

### 2.1 材质本质

- Liquid Glass 不是复刻现实玻璃，而是一种**数字元材质（meta-material）**：实时弯曲、塑形光线，并像轻液体一样有机响应触摸与界面动态。
- 三个光学动作：**折射下方内容、反射周围光线、沿边缘做响应式透镜（lensing）**。
- 灵感源自 visionOS 的深度与维度感；演进脉络：Aqua → iOS 7 实时模糊 → iPhone X 流体感 → 灵动岛的弹性 → visionOS 沉浸界面。

### 2.2 核心概念：Lensing（透镜）

- 现实中透明物体会弯折光线，人凭直觉从这种扭曲读出物体的**存在、运动与形态**。
- Liquid Glass 用这种直觉线索做**分层分隔**，同时让内容从下方透出来。
- 与以往"散射光线"的材质不同，它**实时弯曲、塑形并汇聚光线**：在背景内容上勾出轮廓，又保持视觉上的自然落地。

### 2.3 材质的分层构成（协同工作，不是孤立特效）

| 层 | 行为 |
| --- | --- |
| 高光层 | 环境光源照在材质上，高光随几何形态变化；交互/设备运动时光在材质表面游走，勾勒轮廓 |
| 阴影层 | 阴影不透明度随背后内容自适应：压在文字上时变浓以增强分隔，压在纯色浅底上时变淡 |
| 内部发光反馈 | 交互时从指尖下方点亮，光蔓延到整个元素，并反射到邻近的 Liquid Glass 元素，反馈自然流畅 |

### 2.4 自适应与场景变化

- **每层持续调整**：tint、阴影、动态范围随背后内容不断微调，优先保证清晰可读，同时尽量让内容透出来。
- **小元素可明暗翻转**：导航栏、标签栏等小浮层根据背景在明/暗间切换，保证材质可辨识；其上的图标、字形同步翻转以保持对比。
- **大元素不翻转**：菜单、侧栏面积大，明/暗切换会干扰视线，只做上下文适配，不整体翻色。
- **尺寸变大时材质变厚**：玻璃从按钮展开成菜单等大尺寸时，模拟更厚的材料——更深更实的阴影、更明显的透镜与折射、更软的散光，以增强深度感与内部内容可读性。
- **环境溢色**：附近彩色内容的光微弱溢到玻璃表面；光不仅在表面，还会反射、散射并渗进阴影，如同现实世界。
- **滚动边缘效果（Scroll Edge Effects）**：内容滚到玻璃下方时，逐渐渐隐进背景，把玻璃在视觉上抬起来，保证悬浮标题/浮层始终清晰。
- **形态贴合硬件圆角**：浮层呈圆角悬浮形态，与现代设备圆角同心嵌套，形状易于点按、贴合手指自然几何。

### 2.5 两种变体（不可混用）

| 变体 | 特性 | 适用 |
| --- | --- | --- |
| **Regular** | 通用、自适应，具备全部视觉与自适应效果；任何尺寸、任何内容上方都可用，其上可放任何元素 | 绝大多数场景，首选 |
| **Clear** | 永久更透明，不做自适应；为保证符号/标签可读，**必须配一层调光（dimming）压暗下层内容** | 仅当三个条件同时满足：① 元素位于媒体丰富的内容之上；② 调光层不会损害内容层；③ 落在玻璃上的内容本身粗且亮 |

### 2.6 使用边界（最容易踩的坑）

- **玻璃只给导航 / 控制浮层**：浮在内容之上的一层。内容层（如表格行、长列表条目）保持实色，否则层级互相打架、界面发闷。
- **避免 glass on glass**：玻璃叠玻璃会迅速变得杂乱；叠在玻璃上的元素用填充、透明或 vibrancy 表现，不要再套一层材质。
- **Tinting 克制**：着色只用来强调主元素与主操作；所有元素都上色等于没有重点。想要彩色氛围，把颜色放在内容层。
- **静止状态避免内容与玻璃相交**：首次进入等稳态下，重新摆放或缩放内容以保持分隔。

### 2.7 可访问性降级（系统设置自动生效）

- **减弱透明度**：玻璃更霜化，更多遮挡后方内容。
- **提高对比度**：元素以黑白为主，加对比边框勾勒。
- **减弱动效**：降低部分特效强度，关闭材质的弹性属性。

---

## 三、可读玻璃的工程配方（CSS 落地基准）

来源：[Glassmorphism Done Right: 8 CSS Rules](https://dev.to/agstudio/glassmorphism-done-right-8-css-rules-for-glass-ui-people-can-actually-read-cdi) ｜ [CSSTools 指南](https://csstools.io/blog/glassmorphism-guide) ｜ [aslain.dev](https://aslain.dev/en/blog/css-glassmorphism)

### 3.1 参数区间（经过验证的甜区）

| 维度 | 推荐区间 | 说明 |
| --- | --- | --- |
| 背景衬托 | 2–3 个大而柔的彩色径向渐变 | 平面底色上模糊无从发挥，"玻璃"会变成灰盒子；小而碎的图案在模糊后变成噪点 |
| 填充透明度 | 浅色 20%–40% 白；深色模式暗 tint ~30% | 太低卡片消失，太高变成白盒子；在真实背景上微调 |
| 背景模糊 | `blur(16px–24px)` | 低于 16px 背景仍清晰、干扰视线；高于 24px 一切糊成一团 |
| 饱和度 | `saturate(160%–180%)` | 保住后方色彩活性，避免发灰；保留 `-webkit-` 前缀兼容 Safari |
| 边缘高光 | `1px solid rgba(255,255,255,.5)` + `inset 0 1px 0 rgba(255,255,255,.7)` | 1px 亮边勾勒玻璃沿口，顶部内阴影做反射；对角光泽（sheen）透明度控制在 25% 以内 |
| 投影 | 跟背景同色系的着色阴影，不用纯黑 | 纯黑阴影落在彩色玻璃上显脏；表面越大、浮得越高，阴影越大越软 |
| 文字对比 | 正文 ≥ 4.5:1（WCAG AA），测最差位置而非最好位置 | 背景在文字下移动，对比逐点变化；用深而重的文字，字重 500 以上；长段落不要放在玻璃上 |
| 暗色模式 | 填充换暗 tint，边框降到 ~15% | 全部走 CSS 变量，一个开关切整套主题 |

### 3.2 标准配方（可直接对照）

```css
:root {
  --glass-fill: rgba(255, 255, 255, 0.30);
  --glass-rim:  rgba(255, 255, 255, 0.50);
  --glass-glow: rgba(255, 255, 255, 0.70);
  --glass-shadow: rgba(30, 60, 110, 0.22);
  --text-area:  rgba(255, 255, 255, 0.55);
  --surface-solid: #F4F8FC;
  --ink: #0E2236;
}
@media (prefers-color-scheme: dark) {
  :root {
    --glass-fill: rgba(12, 24, 40, 0.30);
    --glass-rim:  rgba(255, 255, 255, 0.15);
    --glass-glow: rgba(255, 255, 255, 0.25);
    --glass-shadow: rgba(0, 0, 0, 0.45);
    --text-area:  rgba(12, 24, 40, 0.55);
    --surface-solid: #13233A;
    --ink: #EAF3FA;
  }
}
.glass {
  background: var(--glass-fill);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-rim);
  border-radius: 28px;
  box-shadow: inset 0 1px 0 var(--glass-glow),
              0 24px 60px var(--glass-shadow);
  color: var(--ink);
  font-weight: 500;
}
/* 降级：用户关闭透明度 → 实色；浏览器不支持 backdrop-filter → 近实色 */
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--surface-solid); backdrop-filter: none; }
}
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgba(255, 255, 255, 0.85); }
}
```

### 3.3 常见反模式（检查清单）

1. **玻璃叠玻璃叠玻璃**：堆叠模糊把一切搅浑；一个玻璃表面 + 内部实色/近实色条目。
2. **玻璃上放彩色文字**：文字保持中性，颜色给图标与强调色。
3. **过细字重**：细体在模糊背景上消失，用 500 及以上。
4. **主操作也用玻璃按钮**：主按钮应实色填充，让人一眼找到；玻璃留给次操作。
5. **圆角到处同一个值**：外圆角 = 内圆角 + 内边距（例：38 = 14 + 24），嵌套才同心。
6. **动画 blur 数值本身**：模糊计算昂贵；要动就移动/淡入淡出元素，不要动画模糊量。
7. **模糊层过多**：模糊每一层都耗内存与电量；只给标签栏、浮层等少数表面用模糊，长列表用实色行。

---

## 四、优秀 UI 组件的审美要点

参考：[Linear 风格设计系统](https://next.jqueryscript.net/shadcn-ui/design-systems-better/) ｜ [shadcn/ui](https://www.shadcn.io/template/shadcn-ui) ｜ [Vercel/Geist 按钮规范](https://www.pixloop.ai/design-md/ui/raw)

### 4.1 导航 / 控制层

- 控制与内容分层悬浮；导航浮层是材质的主要承载者，内容条目退后为实色。
- 浮动导航与窗口圆角同心嵌套；触控目标尺寸充足、形状友好。
- 当前位置用滑动指示器/高亮胶囊表达，随模块左右滑动过渡。

### 4.2 按钮

- **主按钮**：实色填充（或高不透明渐变），字重 500，14px 上下；内边距可不对称，给尾部箭头图标留出空间。
- **次按钮（幽灵）**：玻璃/描边，弱填充、细边框、顶部高光。
- 反馈：悬停抬升 + 阴影加深；按压缩到 0.97 左右；箭头图标位移 3px 引导方向。
- 状态色克制：一个主色阶承担主要操作，危险/成功用独立语义色。

### 4.3 卡片 / 列表

- 卡片可以是玻璃；**列表行用实色或近实色**，避免行内再嵌玻璃。
- 卡片 hover：轻微抬升（translateY -1 ~ -4px），阴影幅度与表面大小匹配。
- 信息层级：标题 > 摘要 > 元信息（日期 / 标签 / 阅读时长），元信息用弱化色，不抢标题。

### 4.4 标签 / 胶囊

- 小尺寸、低饱和背景 + 细边框；前置色点表达分类，色点带轻微同色光晕。
- 标签颜色归入主色阶体系，不各自发散。

### 4.5 排版基准（长文与首页通用）

| 元素 | 建议基准 |
| --- | --- |
| 正文行宽 | 650–720px（中文每行约 30–40 字） |
| 正文行高 | 西文 1.6–1.7；中文 1.75–1.85（1.95 偏松，易散） |
| 正文字号 | 16px 起步；辅助文字 12–13px；元信息 11–12px |
| 标题层级 | Display > H1 > H2 > H3 > 正文 > 注释，字号/字重逐级递减，差距要拉开 |
| 标题字距 | 大标题可微增字距；正文保持默认 |
| 段落节奏 | 段间距约 1.5 倍行高；区块间距用比例而非固定像素堆叠 |

### 4.6 动效原则

- 缓动以 `cubic-bezier(0.22, 1, 0.36, 1)` 这类出场回弹为主；时长 0.3–0.5s。
- 反馈优先于装饰：悬停、按压、聚焦各有明确回应。
- 尊重 `prefers-reduced-motion`：减弱动效时退回静态/淡入。

---

## 五、本项目对照诊断（liquid-glass-blog）

### 5.1 已具备的优点（对照原则核验通过）

- 设计令牌化：明暗双主题共享 `:root` 变量；分层 z-index 明确（极光 0 < 内容 2 < 导航 50 < 光标 120 < Loader 200）。
- 玻璃配方完整：`blur(22px) saturate(1.7)` + 多层内阴影高光 + 边缘勾勒 + 指针扫光（`--mx/--my`）。
- 首屏大标题用 `clamp()` 流式缩放；正文行宽 720px；mac 风格代码块 + 复制按钮；顶栏胶囊 + 滑动指示器。
- 工程兜底意识：`prefers-reduced-motion` 适配、WebGL 不可用静态兜底、页面隐藏暂停渲染。

### 5.2 差距与改进清单（按优先级）

#### P0 · 可读性与层级

- [ ] **核对对比度**：深色模式 `--text-dim`(0.60)、`--text-faint`(0.38) 压在极光/照片背景与玻璃上的对比是否达到 4.5:1；重点测背景最花的位置。
- [ ] **内容层去玻璃化**：检查 `blockquote` 的 `blur(8px)`、笔记/书单卡片内嵌玻璃 chip 是否构成 glass-on-glass；长文所在面板填充可略加强，保证正文落在偏实色的底上。
- [ ] 长段落不直接放在最透的玻璃表面；必要时在文字区加一层 `--text-area` 弱填充。

#### P1 · 材质层次与自适应

- [ ] **阴影随场景自适应**：内容滚到玻璃下方时阴影加浓；大面板（侧栏/菜单）比小胶囊阴影更深更柔、折射更强，模拟"更厚材质"。
- [ ] **补全玻璃降级**：核对 `prefers-reduced-transparency: reduce` 下切实色、`@supports not (backdrop-filter: blur(1px))` 下近实色兜底。
- [ ] 滚动到浮层下方时加边缘渐隐，把玻璃在视觉上抬起。

#### P1 · 交互反馈

- [ ] 按压时内部发光从指尖蔓延到元素整体，并可联动邻近玻璃元素；保留现有 hover 扫光。
- [ ] 主操作按钮在浅色模式下也应接近实色填充，确保一眼可辨。

#### P2 · 排版系统化

- [ ] **抽离字号阶梯令牌**：`--fs-display / --fs-h1 / --fs-h2 / --fs-body / --fs-caption`，统一各处 `clamp()` 区间，避免散落取值。
- [ ] 中文正文行高由 1.95 回调到 1.75–1.85；行宽 720px 保留。
- [ ] **圆角一致性核对**：外圆角 = 内圆角 + 内边距；梳理 26 / 20 / 16 / 999 的嵌套关系，确保同心。

#### P2 · 色彩克制

- [ ] 收敛 accent 发光：标题竖条、列表点、引用边、代码、标签色统一归入主色阶；彩色氛围放到内容层，主操作只保留一处强调。

#### P3 · 组件借鉴

- [ ] 导航：现有胶囊 + 滑动指示器已是 Apple 式控制层；可补滚动边缘渐隐与明/暗随背景微调。
- [ ] 卡片：列表行实色、卡片玻璃；hover 抬升幅度与阴影匹配表面大小。
- [ ] 按钮：延续尾部箭头位移；主/次按钮材质分工明确（实色 / 玻璃幽灵）。

### 5.3 一句话审美自检

> 先看内容层级是否成立，再看材质是否克制；玻璃只做浮层，颜色只做强调，动效只做反馈，留白留给阅读。

---

## 六、延伸参考

### 设计语言与官方文档
- [Apple Newsroom · Liquid Glass 新设计](https://www.apple.com.cn/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [WWDC25 · Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
- [WWDC25 · Platforms State of the Union](https://developer.apple.com/videos/play/wwdc2025/102/)
- [WWDC25 · Get to know the new design system](https://developer.apple.com/videos/play/wwdc2025/356/)

### 玻璃拟态工程
- [Glassmorphism Done Right: 8 CSS Rules](https://dev.to/agstudio/glassmorphism-done-right-8-css-rules-for-glass-ui-people-can-actually-read-cdi)
- [The Complete Glassmorphism CSS Guide](https://csstools.io/blog/glassmorphism-guide)
- [Glassmorphism CSS: Frosted Glass with backdrop-filter](https://aslain.dev/en/blog/css-glassmorphism)
- [Glassmorphism CSS Generator](https://nicetoolkit.com/glassmorphism-generator/)

### 个人站点与作品集灵感
- [Framer · 20 unique personal website examples](https://www.framer.com/blog/personal-website-examples/)
- [10Web · 15 Personal Websites That Get You Noticed](https://10web.io/blog/personal-websites/)
- [Elementor · Best Portfolio Websites](https://elementor.com/blog/best-portfolio-websites/)
- [Twine · Freelance Developer Portfolio Examples](https://www.twine.net/blog/best-freelance-developer-portfolio-examples/)
- [Basic Website Examples 2026](https://www.basicwebsiteexample.com/personal-website-examples/)

### 组件库与设计系统
- [shadcn/ui](https://www.shadcn.io/template/shadcn-ui)
- [30+ shadcn/ui Design Systems](https://next.jqueryscript.net/shadcn-ui/design-systems-better/)
- [Cardcn 卡片设计合集](https://allshadcn.com/components/cardcn/)
