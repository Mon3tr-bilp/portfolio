# PORTFOLIO · 设计档案

一个按开源项目 [kirahook/KIRAHOOK-CV-Web](https://github.com/kirahook/KIRAHOOK-CV-Web) 的实际设计与结构复刻的个人作品集。
纯静态，无需构建，双击 `index.html` 即可打开（file:// 直接可用），也能直接部署到 GitHub Pages。

---

## 1. 复刻依据（这些数字来自原项目，不是估的）

我把原站的构建产物在无头浏览器里跑起来，读出了它的设计系统：

| 项目 | 原项目实际值 | 本项目 |
| --- | --- | --- |
| 舞台尺寸 | 固定 1728 × 1080，按 min(vw/1728, vh/1080) 缩放居中 | 同 |
| 边距 | `59px` | 同 |
| 品牌字 | `44px / 48px`，`font-weight 750`，`letter-spacing 2.324px` | 同 |
| 副标 | `19px / 23px`，`600`，`.587px` | 同 |
| 档案标题 | `28px`，`750` | 同 |
| 计数 | 数字 `58px`，`/` `32px 300`，总数 `22px` | 同 |
| 标题块位置 | `left 970px / top 471px` | 同 |
| 计数器位置 | `left 60px / bottom 115px` | 同 |
| 上下箭头组 | `left 504px / bottom 131px`，按钮 `46×46` | 同 |
| 页脚 | `left/right 59px / bottom 35px`，`10px`，字距 `.9px` | 同 |
| 调色板 | 见下表（原项目 JS 里的 `ink/muted/line/paper/panel/field/accent` 光暗成对常量） | 同 |

调色板直接取自原项目源码里的成对常量（页面默认「深夜」，可切「暖昼」）：

```js
ink    ["#080a08", "#e0e3dc"]     line   ["#aaa59a", "#536166"]
muted  ["#77756d", "#a6b0b1"]     paper  ["#eae5e1", "#11181b"]
panel  ["#edebe4", "#202a2f"]     field  ["#e7e3d9", "#2a363b"]
accent ["#9b7247", "#c5a16b"]   // 左＝暖昼，右＝深夜
// 光谱：a #7acbc5 / b #a99add / glow #efc58b
```

玻璃层（`liquid-glass`）也沿用了原项目的 fill / lustre / edge / shadow / inset / active 六色。

## 2. 场景结构

和原项目一样，是一个**不分页、不滚动的舞台**，靠 `data-mode` 切换：

```
boot  ──2.1s──▶  archive  ──ENTER──▶  file
                    ▲                  │
                    └──── ESC / ← ─────┘
```

- **boot**：浅纸色（`#eae5e1`）× 黄铜双环标 → 进度条 → 「正在准备终端 …」。原项目的开机是浅色，档案场景是深色，这个明暗反切保留了下来。
- **archive**：深色档案场，左侧档案阵列（原项目是 three.js 的 GLB 阵列，这里用 CSS 透视卡片替代，避免引入 1.5 MB 模型）、右侧 `FILE NUMBER` 标题块、左下 `ARCHIVE / SELECT 01 / 02`、底部 `↑ 刻度 ↓`、页脚系统行。
- **file**：档案阅读器。左侧档案号 + 规格表，顶部四章切换（调研 / 设计定义 / 造型与原型 / 总结），右侧滚动正文。

键盘：`↑↓`/`←→` 换档案，`ENTER` 读取，`1–4` 跳章节，`ESC` 返回；点任意图版可全屏放大，`←→` 翻页。

## 3. 两份档案的内容

| 编号 | 作品 | 章节 |
| --- | --- | --- |
| X-01 | **康驾护航** · 中老年慢病车载健康安全闭环 | 调研（人群画像 / 场景任务分解 / 4 项痛点）→ 定义（1 句命题 + 4 条原则 + 三层状态机 + 系统构成）→ 造型与原型（流程 / 车载三态 / 家属端 / 两件后装硬件 / 装车校核）→ 总结（4 项价值 + 4 条局限） |
| X-02 | **陪伴治疗型动物机器人** · 3–6 岁自闭症儿童 | 调研（6 项数据 / 竞品 5 款 / 获奖作品 4 款）→ 定义（三角约束 + 三位一体 + 4 条人因约束 + 柯基形态理由）→ 造型与原型（3 草案 / 三视白模 / 22 项规格 / 3 场景）→ 总结（三方价值 + 愿景 + 4 条局限 + 3 条收获） |

两个案例都**照实写了局限**（没做真实用户测试、误报率未验证、伦理审查、数据边界），这不是谦虚话，是原始方案里确实没有做完的部分。

## 4. 上线前请改的地方

| 位置 | 现在 | 说明 |
| --- | --- | --- |
| `index.html` → `.modal` 的 CONTACT | `zjc13708596686@163.com`（已填） | 要换邮箱改这一处：`href` 的 `mailto:` 与显示文本各一个 |
| `index.html` 里 `周俊宸` / `INFORMATION & INTERACTION` | 姓名与副标 | 如需改动，同时改 `<title>`、`og:*`、`.brand`、`.powered`、页脚 |
| `.modal`（CV 面板） | 个人简介文案 | 换成你的 |
| `sitemap.xml` / `og:url` | 相对路径 | 部署到自定义域名时改成绝对地址 |

搜索 `zjc13708596686@163.com` 与 `周俊宸` 即可定位。

## 5. 目录

```
portfolio/
├── index.html              # 舞台：boot / archive / file 三场景
├── 404.html                # 同色系 404
├── robots.txt · sitemap.xml · .nojekyll
├── favicon.svg
├── assets/
│   ├── css/archive.css     # 全部样式，主题令牌在最上方 :root 与 html[data-theme=light]
│   ├── css/glass-card.css  # 档案卡的毛玻璃板（覆盖 .array-card）
│   ├── css/notfound.css
│   ├── js/archive.js       # 舞台缩放、场景状态机、键盘、图版查看器
│   ├── og-cover.jpg        # 1200×630 分享卡
│   ├── apple-touch-icon.png
│   └── img/                # 44 张作品图（kangjia / robot）
├── _src/ _tools/           # 工作文件，可整目录删除
└── README.md
```

`_tools/` 里是可复现的脚本：`dump_pptx.py` 读 PPT 文本、`extract_media.py` 抽图、`build_assets.py` 出网页尺寸、
`css_probe.py` 从原站 CSS 里取规则、`cdp_shot.js` / `drive.js` / `measure.js` 是无头浏览器截图、
驱动与几何测量，`check_site.py` 校验标签与引用。

## 6. 关于「完全按照开源内容」

**做到的**：舞台尺寸与缩放方式、所有关键坐标、字号字重字距、光暗两套配色、玻璃材质参数、
开机 → 档案 → 阅读器 的场景结构与键盘操作、`FILE NUMBER` / `ARCHIVE / SELECT` / `DESIGNED BY` 等信息层级，
全部对齐原项目。

**有意不同的三处**，请你确认：

1. **不复制原项目的代码与素材**。原项目的 JS/CSS 是编译产物（1.2 MB + 727 KB），GLB 模型、音频、
   字体与作品图都是作者的个人资产。直接打包使用会变成「胡鑫洋的作品集」，不是你的。所以这一版是按上面
   那张表**重新实现**的，只复用可公开对照的设计参数。
2. **3D 档案阵列换成 CSS 透视卡片**。原项目用 three.js 加载 3.4 MB 的 GLB，需要 WebGL 与数秒加载；
   换成 CSS 后首屏无依赖、手机可用，视觉上仍是「悬浮的倾斜档案板」。
3. **档案是 2 份不是 6 份**，计数器、刻度、`↑↓` 都按 2 自动生成。

如果这三处里有你希望更贴近原版的（比如确实想要 three.js 阵列），告诉我，我可以补上。

**署名**：视觉语言与信息结构参照 [kirahook/KIRAHOOK-CV-Web](https://github.com/kirahook/KIRAHOOK-CV-Web)（MIT，© 2026 LBEILC）。
本站为其设计方向的原创实现，页脚已保留致谢。原项目的 MIT 许可不覆盖其字体（Novecento Sans）、
GLB 模型、音频与个人作品素材——这些均未在本项目中使用。


## 7. PDF 版本

周俊宸-设计档案.pdf（A4 横向 297 × 210 mm，18 页，约 5 MB）由 print.html 打印生成，
内容与网页一致：封面、档案索引、两份档案的章节页与四章正文、联系页。

- 源文件：print.html（由 _tools/make_print.py 从 index.html 的 8 个章节自动抽取生成）
- 样式：ssets/css/print.css（1123 × 794 px 页面，单栏流式，图片按页宽等比缩放）
- 重新生成：

`sh
python _tools/make_print.py          # 同步 print.html
msedge --headless=new --no-pdf-header-footer        --print-to-pdf=周俊宸-设计档案.pdf print.html
`

改了正文之后跑前一步即可；只有改版式才需要动 print.css。
网页右上角的 CV 简介 面板里有「下载作品集 PDF」入口。

---

生成日期：2026-11
