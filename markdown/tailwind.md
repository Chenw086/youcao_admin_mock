# Tailwind + TDesign 集成记录（v4 升级版）

## 1. 依赖基线

```bash
pnpm add -D tailwindcss@4.1.18 @tailwindcss/postcss postcss@8.5.0 autoprefixer@10.4.22 postcss-px-to-viewport@1.1.1
pnpm add tailwind-merge@^2.6.0 tailwindcss-animate@^1.0.7 lucide-vue-next
# 新增 Prettier 插件，用于自动排序类名
pnpm add -D prettier-plugin-tailwindcss
```

- `tailwindcss 4.1`：Oxide 引擎 + CSS-first 体验，默认即为 JIT。
- `@tailwindcss/postcss`：在 Vite 的 PostCSS 管线中加载 Oxide，供后续插件串联。
- `postcss-px-to-viewport`：统一 750 设计稿 → `vw` 转换（与用户诉求一致）。
- `tailwind-merge`、`tailwindcss-animate`：运行时合并类名 & 微交互动效。
- `lucide-vue-next`：保持图标来源一致。
- `prettier-plugin-tailwindcss`：Prettier 插件，保存时自动对 class 类名进行规范排序。

## 2. 配置文件

### 2.1 `tailwind.config.js`

- 采用 ESM，直接 `import` 默认主题与 `tailwind.tokens.js`。
- 仅保留 `darkMode: 'class'`、`content`、`theme.extend`、`plugins`，无需再声明 `prefix`（前缀交由 CSS `prefix(tw)` 处理）。
- 通过 `design-tokens.json` 注入 colors / spacing / radius / typography，配合 `tailwindcss-animate` 插件输出自定义 `shadow-glow` 等原子。

### 2.2 `postcss.config.js`

```js
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import pxToViewport from 'postcss-px-to-viewport'

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    pxToViewport({
      unitToConvert: 'px',
      viewportWidth: 750,
      unitPrecision: 6,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: ['.ignore-vw', '.tw-ignore'],
      minPixelValue: 0.5,
      mediaQuery: true,
      replace: true,
      exclude: [/node_modules/],
    }),
  ],
}
```

- 顺序：Tailwind → Autoprefixer → `px-to-viewport`，保证先生成工具类，再统一转换单位。
- `selectorBlackList` 允许通过 `.ignore-vw`、`.tw-ignore` 精准跳过不需转换的组件。
- `mediaQuery: true` 让断点内的 `px`（如 `tw:md:text-[18px]`）同样被转成 `vw`。

### 2.3 `tailwind.tokens.js`

```js
import tokens from './design-tokens.json' assert { type: 'json' }

export default tokens
```

- 通过 JSON assert 语法在 Node 20+ 中直接复用 Token。
- `src/styles/tokens.ts` 继续封装 `getColorValue` 等 helper，并对缺失 Token 抛出显式错误。

### 2.4 `.prettierrc` (新增)

在 `.prettierrc` 中启用插件：

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

注意：

- 插件会自动读取 Tailwind 配置，按照官方推荐顺序对 class 进行排序。
- 排序规则：布局 > 盒模型 > 视觉 > 交互。

## 3. 样式入口 `src/styles/tailwind.css`

```css
@import 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
@import 'tailwindcss' prefix(tw);
@config '../../tailwind.config.js';
```

- 先引入字体，再通过 `prefix(tw)` 激活最新语法（所有工具类写成 `tw:bg-layer`、`tw:hover:shadow-xl`）。
- `@config` 显式指向根目录配置，保证 `darkMode`、`plugin` 生效。
- `@layer base` 继续声明 CSS 变量、深色背景等基线；`@layer components` 改为纯 CSS 实现 `.glass-panel` / `.elevated-button`，避免 v4 对 `@apply` 的限制。

## 4. 入口文件与运行顺序

1. `src/main.ts` 引入顺序保持不变：`tailwind.css → tdesign-mobile-vue/es/style → src/assets/main.less`。
2. `initViewport()` 仍在挂载前执行，用于同步 `--viewport-*` 变量（配合可视化面板）；但真正的单位换算由 `postcss-px-to-viewport` 完成。
3. 组件中统一使用 `tw:` 前缀原子类，`twMerge` 负责消解冲突。

## 5. 校验流程

- `pnpm run lint:all`：串行执行 type-check、ESLint、Stylelint、Prettier，确保配置迁移后零告警。
- `pnpm run build`：Vite 构建 + PostCSS 处理 + px→vw 转换；日志中如出现 `postcss.plugin deprecated` 仅为上游包提醒，可在需要时切换到 `postcss-px-to-viewport-8-plugin`。
- 打开示例页，确认：
  - 所有 `tw:` 类均正确渲染，未出现 TDesign 冲突。
  - “实时视口反馈” 面板展示的宽度 / 字号 / 缩放与实际浏览器一致。
  - `.glass-panel`、`.elevated-button` 的视觉效果与 v3 保持一致。

> 以上步骤覆盖了 Tailwind 4 的安装、配置、主题共享与 px→vw 适配，可按顺序复现整个升级过程。`adaptive.md` 列出了 viewport 工具脚本与验证方式，可配套查阅。
