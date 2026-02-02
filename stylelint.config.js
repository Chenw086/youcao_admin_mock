export default {
  extends: [
    'stylelint-config-standard-less',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  overrides: [
    {
      files: ['**/*.html', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.css'],
      rules: {
        // 在 CSS 文件中显式覆盖 less 的规则
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: [
              'tailwind',
              'apply',
              'variants',
              'responsive',
              'screen',
              'config',
              'layer',
              'theme',
              'utility',
              'variant',
              'custom-variant',
              'plugin',
            ],
          },
        ],
      },
    },
  ],
  rules: {
    // 禁止空块
    'block-no-empty': true,
    // 颜色值小写
    'color-hex-length': 'short',
    // 全局规则（针对所有文件）
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'config',
          'layer',
          'theme',
          'utility',
          'variant',
          'custom-variant',
          'plugin',
          'reference',
        ],
      },
    ],
    // 允许空源文件
    'no-empty-source': null,
    // 允许 global 伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'],
      },
    ],
    // 允许未知属性
    'property-no-unknown': true,
    // 针对 vue 的特定规则修正
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
      },
    ],
    // 命名规范 (kebab-case) - 允许 BEM 风格
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*|([a-z][a-z0-9]*)(-[a-z0-9]+)*(--[a-z0-9]+)?(__[a-z0-9]+)?$',
      {
        message: 'Expected class selector to be kebab-case or BEM-style',
      },
    ],
  },
  // 忽略文件
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    'dist/**',
    'node_modules/**',
    'public/**',
  ],
}
