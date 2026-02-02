# 750 设计稿自适应指南（px-to-viewport + 实时回显）

## 1. 目标与策略

- **设计基准**：统一以 750px 宽稿件为尺度。
- **首选方案**：构建期使用 `postcss-px-to-viewport` 将所有 `px` 单位换算为 `vw`，确保 Tailwind 原子类、`@layer` 自定义样式与 Less 变量输出一致。
- **可视化反馈**：保留 `initViewport` 脚本，仅用于写入 `--viewport-width`/`--viewport-scale` 并驱动示例页的实时指标，不再承担单位换算的唯一职责。

## 2. PostCSS 插件配置

`postcss.config.js` 里追加：

```js
pxToViewport({
  unitToConvert: 'px', // 需要转换的单位
  viewportWidth: 750, // 设计稿宽度
  unitPrecision: 6, // 保留小数位
  propList: ['*'], // 全量属性转 vw
  viewportUnit: 'vw',
  fontViewportUnit: 'vw', // font-size 也走 vw
  selectorBlackList: ['.ignore-vw', '.tw-ignore'],
  minPixelValue: 0.5,
  mediaQuery: true, // 媒体查询同样处理
  replace: true,
  exclude: [/node_modules/],
})
```

**要点**：

1. **类名使用规则**：在模板中鼓励 `tw:text-[28px]`、Token 映射为 `px` 数值，构建后自动变成 `vw`；若需保留原始像素，可给元素补上 `.ignore-vw`。
2. **媒体查询兼容**：`mediaQuery: true` 可让 `tw:md:text-[18px]` 等派生类同样转换，避免断点内出现 px/vw 混用。
3. **字体与边框**：`fontViewportUnit: 'vw'`、`propList: ['*']` 使文本、圆角、阴影等细节全部遵循设备宽度缩放。

## 3. `initViewport` 仍然做什么？

`src/utils/viewport.ts` 中的逻辑保持不变：

- Clamp 320–480 真实宽度，计算 `fontSize = (clamped / 750) * 100`，写回根节点，顺带落地 `--viewport-width` 与 `--viewport-scale`。
- 在 `src/main.ts` 中调用，确保页面加载时上述变量已就绪。

> 现在的定位：**监控及兜底**。在 Tailwind 原子类已经通过 `px→vw` 的前提下，动态 `rem` 只对极端屏宽提供额外保险，并为示例页显示实时数据。

## 4. 示例页联动（`src/App.vue`）

- `previewWidth` 滑块仍覆盖 320–480px，帮助设计/研发快速验证布局密度。
- `syncViewportMeta()` 读取 `--viewport-*` 以及 `font-size`，在 “实时视口反馈” 卡片中展示：
  - 实际宽度（px）
  - 根字体（px）
  - 相对缩放系数
- 预览容器宽度取 `previewWidth / 2`，确保桌面端对比 750 稿件更直观。

## 5. 验证步骤

1. **运行 `pnpm run dev`**，打开 DevTools：
   - 确认样式表里 `.tw:*` 类全部按 `vw` 输出，没有 residual `px`。
   - 控制台无 `viewport.ts` 报错。
2. **拖动页面滑块**：
   - 三个指标卡实时变化；若数值异常，优先检查 `--viewport-*` 是否被覆盖。
3. **覆盖测试**：
   - 在组件上添加 `.ignore-vw`、`.tw-ignore` 验证黑名单是否生效。
   - 将某些 `tw:text-[px]` 调整为 rem / 纯数字观察差异，确保文案对齐预期。
4. **构建校验**：`pnpm run build` 输出日志中应只有 `postcss-px-to-viewport` 的“plugin deprecated”提示（来自官方包），无 `unknown utility` 错误。

通过上述流程，项目在保持 750 设计稿视觉一致性的同时，实现了：

- 构建期自动单位转换（px→vw）。
- 运行期实时反馈（rem/viewport 信息）。
- 可控的排除策略（`.ignore-vw`、`.tw-ignore`）。

如需扩展到 640/828 稿件，修改 `viewportWidth` 与 `initViewport(baseWidth)` 即可同步生效。
