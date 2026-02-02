# 代码规范与提交工作流配置说明

## 1. 自动化工具链 (Toolchain)

本项目集成了以下工具来保证代码质量和提交规范：

- **Husky**: Git Hook 工具，用于在 git commit / git push 时自动触发脚本。
- **Lint-staged**: 只对 Git 暂存区（Staged）的文件运行命令，提高 lint 速度。
- **Commitlint**: 检查 git commit message 是否符合规范。
- **Prettier**: 代码格式化工具。
- **ESLint**: JavaScript/TypeScript 代码质量检查工具。
- **Stylelint**: CSS/Less 样式代码检查工具。
- **Vue-tsc**: Vue 的 TypeScript 类型检查工具。

---

## 2. 工作流机制 (Workflow)

当你执行 `git commit -m "..."` 时，会依次触发以下流程：

### 第一步：Pre-commit Hook

触发文件：`.husky/pre-commit`

1. **类型检查 (Type Check)**
   - 执行命令：`npm run type-check` (`vue-tsc --build`)
   - **说明**：**为什么不在 lint-staged 中做？**
     因为 TypeScript 的类型推断需要整个项目的上下文，无法单独检查某一个文件（例如修改了 A 文件，可能会导致引用了 A 的 B 文件类型报错）。
     因此，我们选择在 pre-commit 阶段对**全量代码**进行类型检查，确保没有 TS 错误才能提交。

2. **增量 Lint 与格式化 (Lint-staged)**
   - 执行命令：`pnpm lint-staged`
   - **配置位置**：`package.json`
   - **逻辑**：
     - **JS/TS/Vue 文件** (`*.{js,ts,jsx,tsx,vue}`)：
       - `eslint --fix`: 自动修复 JS/TS 语法错误和代码质量问题。
       - `prettier --write`: 统一代码格式（缩进、引号等）。
     - **样式文件** (`*.{css,less,html,vue}`)：
       - `stylelint --fix`: 自动修复 CSS/Less 样式问题（顺序、命名等）。
       - `prettier --write`: 统一格式。
     - **资源/配置/文档** (`*.{json,md}`)：
       - `prettier --write`: 统一格式。

### 第二步：Commit-msg Hook

触发文件：`.husky/commit-msg`

1. **提交信息规范检查**
   - 执行命令：`commitlint`
   - **配置文件**：`commitlint.config.ts`
   - **规范**：采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

---

## 3. 提交信息规范 (Commit Convention)

提交消息必须符合以下格式：

```
<type>(<scope>): <subject>
```

### 常用类型 (Type)

| 类型         | 描述                              | 示例                                  |
| :----------- | :-------------------------------- | :------------------------------------ |
| **feat**     | 新增功能                          | `feat: add user login page`           |
| **fix**      | 修复 Bug                          | `fix: resolve style layout issue`     |
| **docs**     | 文档变更                          | `docs: update README`                 |
| **style**    | 代码格式/样式变动（不影响逻辑）   | `style: format code with prettier`    |
| **refactor** | 代码重构（无新功能，无 Bug 修复） | `refactor: optimize user store`       |
| **perf**     | 性能优化                          | `perf: improve list rendering`        |
| **test**     | 测试相关                          | `test: add unit tests for components` |
| **chore**    | 构建/工具链/依赖变动              | `chore: update dependencies`          |
| **build**    | 构建系统或外部依赖变更            | `build: upgrade vite version`         |
| **ci**       | CI 配置文件变更                   | `ci: update github workflows`         |

---

## 4. 详细配置教程 (Configuration Details)

如果你想在其他 Vue 3 + TS + Vite 项目中复刻这套完整配置，请按以下步骤操作：

### 1. 安装核心依赖

一次性安装 Husky, Lint-staged, Commitlint, Stylelint 及相关插件：

```bash
# 1. 提交规范相关
pnpm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# 2. Stylelint 相关 (Less + Vue 支持)
pnpm install -D stylelint stylelint-config-standard-less stylelint-config-recommended-vue stylelint-config-recess-order postcss-html postcss-less

# 3. 解决 ESLint 配置中的 TS 类型推断问题
pnpm install -D @typescript-eslint/utils
```

### 2. 初始化 Husky

这会自动修改 `package.json` 添加 `prepare` 脚本并创建 `.husky` 目录：

```bash
pnpm exec husky init
```

### 3. 配置 Git Hooks

修改生成的 `.husky` 目录下的文件：

**文件 `.husky/pre-commit` (提交前检查):**

```sh
# 全量 TS 类型检查（必须全量，不能增量）
echo "Checking types..."
npm run type-check

# 增量 Lint 和格式化（只针对修改的文件）
echo "Linting staged files..."
pnpm lint-staged
```

**文件 `.husky/commit-msg` (提交信息检查):**

```sh
npx --no -- commitlint --edit ${1}
```

### 4. 配置 Lint-staged

在 `package.json` 中添加如下配置，将不同文件的检查任务分流：

```json
"lint-staged": {
  // 针对脚本和组件代码：ESLint 检查 + Prettier 格式化
  "*.{js,ts,jsx,tsx,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  // 针对样式文件：Stylelint 检查 + Prettier 格式化
  // 注意：Vue 文件也需要跑 Stylelint 检查其中的 <style> 块
  "*.{css,less,html,vue}": [
    "stylelint --fix",
    "prettier --write"
  ],
  // 针对配置文件和文档：仅 Prettier 格式化
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### 5. 配置 Commitlint

新建 `commitlint.config.ts`：

```ts
export default {
  // 继承通用的 Conventional Commits 规范
  extends: ['@commitlint/config-conventional'],
}
```

### 6. 配置 Stylelint

新建 `stylelint.config.js`，整合 Vue 和 Less 的规则：

```js
export default {
  extends: [
    'stylelint-config-standard-less', // Less 标准规则
    'stylelint-config-recommended-vue', // Vue 推荐规则
    'stylelint-config-recess-order', // CSS 属性自动排序 (如先写 display, 后写 color)
  ],
  overrides: [
    {
      files: ['**/*.html', '**/*.vue'],
      customSyntax: 'postcss-html', // 解析 HTML/Vue 中的样式
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less', // 解析 Less 文件
    },
  ],
  rules: {
    // 禁止空块
    'block-no-empty': true,
    // 允许 global/v-deep 等伪类
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'v-deep', 'deep'] },
    ],
    // 允许 Vue 的特有伪元素
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'] },
    ],
    // 强制类名使用 kebab-case (如 .user-info)
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      { message: 'Expected class selector to be kebab-case' },
    ],
  },
}
```

### 7. 配置 VS Code (推荐)

为了让编辑器也能实时提示错误，更新 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint", // 新增 Stylelint 插件推荐
    "esbenp.prettier-vscode"
  ]
}
```
