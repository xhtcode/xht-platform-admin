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
      '@typescript-eslint/no-explicit-any': 'off', // 禁用@typescript-eslint/no-explicit-any规则，以支持any类型
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off', // 禁用@typescript-eslint/no-empty-object-type规则，以支持空对象类型
      'prefer-const': 'off',
    },
  },
)
