// 导入必要的ESLint插件和配置
import pluginVue from 'eslint-plugin-vue' // Vue.js的ESLint插件
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript' // Vue+TypeScript的ESLint配置
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting' // 跳过Prettier格式化的配置

// 导出ESLint配置
export default defineConfigWithVueTs(
  // 第一个配置对象：指定需要检查的文件
  {
    name: 'app/files-to-lint', // 配置名称
    files: ['**/*.{ts,mts,tsx,vue}'], // 匹配所有TypeScript和Vue文件
  },

  // 第二个配置对象：指定需要忽略的文件
  {
    name: 'app/files-to-ignore', // 配置名称
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'], // 忽略构建和测试覆盖率目录
  },

  // 应用Vue.js的基本规则集
  pluginVue.configs['flat/essential'],

  // 应用Vue+TypeScript的推荐规则集
  vueTsConfigs.recommended,

  // 跳过Prettier格式化相关规则
  skipFormatting,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      // JavaScript规则调整
      'prefer-const': [
        'warn',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: true,
        },
      ],
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // Vue规则调整
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App'], // 允许常见的单字组件名
        },
      ],
      'vue/no-v-model-argument': 'off', // 允许v-model带参数（适用于Vue 3）
      'vue/require-default-prop': 'off', // 不强制要求props设置默认值
      'vue/html-self-closing': [
        'warn',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
)
