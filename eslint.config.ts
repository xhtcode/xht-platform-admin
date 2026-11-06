// ============================================================================
// 两套 linter 的分工（改规则前务必读这段）
// ----------------------------------------------------------------------------
// 项目同时跑 oxlint 和 eslint：`pnpm lint` = lint:oxlint → lint:eslint。
//
// 【唯一事实源】.oxlintrc.json
//   · 在里面设 error / warn  → oxlint 负责该规则，ESLint 自动让位（本文件末尾
//     的 pluginOxlint 块会把这条规则在 ESLint 里置 off），不会重复报。
//   · 在里面设 off           → 表示「oxlint 不管」，插件会把它从让位清单里删掉，
//     交还 ESLint 接管（用于需要按环境区分等级、或只有 eslint 能做的情况）。
//
// 【本文件只写 oxlint 管不到的规则】oxlint 未实现的 vue 结构类、TS 类型感知类、
// unoCSS 规则留在下面；已在 .oxlintrc.json 生效的规则不要在这里重复写，写了也
// 会被末尾的 oxlint 块覆盖，只会制造"配置了却不生效"的假象。
//
// 【顺序铁律】pluginOxlint.buildFromOxlintConfigFile 必须放在**最后**。它只做
// "关闭"动作，放在 rules 块之前会被后面的 rules 覆盖 —— 之前 no-debugger、
// no-useless-catch 等 5 条规则两边同时报就是这个原因。
// ============================================================================

// 导入必要的ESLint插件和配置
import { globalIgnores } from 'eslint/config'
import eslintPluginVue from 'eslint-plugin-vue' // Vue.js的ESLint插件
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript' // Vue+TypeScript的ESLint配置
import unoCss from '@unocss/eslint-config/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// 导出ESLint配置
export default defineConfigWithVueTs(
  // 指定需要检查的文件
  {
    name: 'app/files-to-lint', // 配置名称
    files: ['**/*.{ts,mts,tsx,vue}'], // 匹配所有TypeScript和Vue文件
  },

  // 指定需要忽略的文件
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**', '**/auto-imports.d.ts', '**/components.d.ts']),
  // 应用Vue.js的基本规则集
  ...eslintPluginVue.configs['flat/essential'],

  // 应用Vue+TypeScript的推荐规则集
  vueTsConfigs.recommended,
  unoCss,
  {
    name: 'app/rules',
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // ========== 以下规则 oxlint 均未实现，或需要按环境/类型信息判断，因此归 ESLint ==========
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用any类型，方便开发
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // oxlint 侧同为 off，见 .oxlintrc.json
      '@typescript-eslint/no-unused-expressions': 'off', // oxlint 侧同为 off，见 .oxlintrc.json
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // ========== 原生ESLint ==========
      'no-unused-vars': 'off', // oxlint 侧同为 off
      'no-console': 'off',
      // oxlint 的 no-debugger 已在 .oxlintrc.json 置 off（交还本文件接管），
      // 因为只有这里能按 NODE_ENV 区分生产 error / 开发 warn
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'unicorn/no-empty-file': 'off',
      // ========== 以下 vue 规则 oxlint 未实现，留在 ESLint ==========
      // 注意：纯格式类规则（html-self-closing / max-attributes-per-line / no-multi-spaces）
      // 归 Prettier 管，eslint-config-prettier 在末尾会把它们置 off，写在这里也不生效，故不声明
      'vue/multi-word-component-names': 'off', // Vue 组件的名称应该是多词的，以提高可读性和维护性
      'vue/require-name-property': 'error', // 确保组件有name属性
      'vue/require-prop-types': 'error', // props设置类型
      'vue/require-default-prop': 'error', // props设置默认值
      'vue/operator-linebreak': 'off', //关闭操作符换行规则的检查。
      'vue/no-deprecated-inline-template': 'error', // 禁止使用弃用属性
      'vue/attributes-order': 'off', // 属性顺序
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ], // 块顺序
      'vue/padding-line-between-blocks': 'error', // 块之间添加空行
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ], // 宏定义顺序
      // ========== 以下规则已移交 oxlint（在 .oxlintrc.json 配置，勿在此重复） ==========
      // no-useless-catch / vue/no-reserved-component-names / vue/no-export-in-script-setup
    },
  },
  skipFormatting, // 跳过Prettier格式化相关规则
  // 必须是最后一项：把 .oxlintrc.json 里已启用的规则在 ESLint 中统一关闭，
  // 保证同一条规则只由一个 linter 负责（详见文件顶部说明）
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json')
)
