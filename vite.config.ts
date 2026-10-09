import { type ConfigEnv, defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import pkg from './package.json' with { type: 'json' }
import xhtStartLogPlugin from './plugins/vite-plugin-log.ts'
import viteConfigServer from './plugins/vite-config-server.ts'
import viteConfigBuild from './plugins/vite-config-build.ts'
import viteConfigOptimizeDeps from './plugins/vite-config-optimizeDeps.ts'
const { dependencies, devDependencies, engines, name, version } = pkg
// 平台的名称、版本、运行所需的 node 版本、依赖、构建时间的类型提示
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
}
// 路径常量定义
const pathSrc = resolve(import.meta.dirname, 'src')

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  const isProduction = mode === 'production'
  return {
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    /**
     * 插件配置
     */
    plugins: [
      // 基础Vue插件
      vue(),
      // JSX支持
      vueJsx(),
      // UnoCSS
      UnoCSS(),
      // Vue DevTools（仅开发环境启用）
      !isProduction && vueDevTools(),
      // 自动导入配置 https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        imports: ['vue', '@vueuse/core'],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
        eslintrc: {
          enabled: false,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
        vueTemplate: true,
        dts: false, // 导入函数类型声明文件路径 (false:关闭自动生成)
        //  dts: path.resolve(pathSrc, 'typings', 'auto-imports.d.ts'),
      }),
      // 自动按需引入组件配置 https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      Components({
        resolvers: [
          //导入 Element Plus 组件
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
        globs: ['src/components/**/index.vue'], // 指定自定义组件位置(默认:src/components)
        dts: false, // 导入组件类型声明文件路径 (false:关闭自动生成)
        //  dts: path.resolve(pathSrc, 'typings', 'components.d.ts'),
      }),
      xhtStartLogPlugin(env),
    ],
    /**
     * 路径解析配置
     */
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    /**
     * CSS配置
     */
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;@use '@/styles/variables/var.scss' as *;`,
        },
      },
    },
    /**
     * 本地反向代理解决浏览器跨域限制
     */
    server: viteConfigServer(env),
    /**
     * 预加载项目必需的组件
     */
    optimizeDeps: viteConfigOptimizeDeps(),
    /**
     * 生产环境构建配置
     */
    build: viteConfigBuild(env, isProduction),
  }
})
