import { type ConfigEnv, defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path, { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { dependencies, devDependencies, engines, name, version } from './package.json'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 平台的名称、版本、运行所需的 node 版本、依赖、构建时间的类型提示
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
}
// 路径常量定义
const pathSrc = resolve(__dirname, 'src')
const iconDirs = resolve(process.cwd(), 'src/assets/icons')

// Element Plus 预加载组件样式（按需优化）
const elementPlusPreloadStyles = [
  'form',
  'form-item',
  'button',
  'input',
  'input-number',
  'switch',
  'upload',
  'menu2',
  'col',
  'icon',
  'row',
  'tag',
  'dialog',
  'loading',
  'radio',
  'radio-group',
  'popover',
  'scrollbar',
  'tooltip',
  'dropdown',
  'dropdown-menu2',
  'dropdown-item',
  'sub-menu2',
  'menu2-item',
  'divider',
  'card',
  'link',
  'breadcrumb',
  'breadcrumb-item',
  'table',
  'tree-select',
  'table-column',
  'select',
  'option',
  'pagination',
  'tree',
  'alert',
  'radio-button',
  'checkbox-group',
  'checkbox',
  'tabs',
  'tab-pane',
  'rate',
  'date-picker',
  'notification',
  'image',
  'statistic',
  'watermark',
  'config-provider',
  'text',
  'drawer',
  'color-picker',
  'backtop',
  'message-box',
  'skeleton',
  'skeleton-item',
  'badge',
  'steps',
  'step',
  'avatar',
  'descriptions',
  'descriptions-item',
  'progress',
  'image-viewer',
  'empty',
].map((component) => `element-plus/es/components/${component}/style/css`)

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  const isProduction = mode === 'production'
  return {
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    plugins: [
      // 基础Vue插件
      vue(),
      // JSX支持
      vueJsx(),
      // UnoCSS
      UnoCSS(),
      // Vue DevTools（仅开发环境启用）
      !isProduction && vueDevTools(),
      // SVG图标处理
      createSvgIconsPlugin({
        iconDirs: [iconDirs], //  指定需要缓存的图标文件夹
        symbolId: 'icon-[dir]-[name]', // 指定symbolId格式
      }),
      // 自动导入配置 https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        imports: ['vue', '@vueuse/core'],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
        vueTemplate: true,
        dts: path.resolve(pathSrc, 'typings', 'auto-imports.d.ts'), // 导入函数类型声明文件路径 (false:关闭自动生成)
      }),
      // 自动按需引入组件配置 https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      Components({
        resolvers: [
          //导入 Element Plus 组件
          ElementPlusResolver(),
        ],
        dirs: ['src/components'], // 指定自定义组件位置(默认:src/components)
        dts: path.resolve(pathSrc, 'typings', 'components.d.ts'), // 导入组件类型声明文件路径 (false:关闭自动生成)
      }),
    ],
    // 路径解析配置
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    // CSS配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    /**
     * 本地反向代理解决浏览器跨域限制
     */
    server: {
      host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
      port: +Number(env.VITE_APP_PORT) || 3000, // 设置服务启动端口号
      open: false, // 是否自动在浏览器中打开应用程序
      cors: true, // 是否允许跨域
      // 跨域代理配置
      proxy: {
        [env.VITE_BASE_API]: {
          target: env.VITE_GATEWAY_API, // easymock
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp('^' + env.VITE_BASE_API), ''),
        },
      },
    },
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'element-plus',
        'pinia',
        'axios',
        '@vueuse/core',
        'path-to-regexp',
        'echarts',
        'path-browserify',
        ...elementPlusPreloadStyles,
      ],
    },
    // 生产环境构建配置
    build: {
      target: 'es2015',
      cssCodeSplit: true,
      sourcemap: !isProduction, // 开发环境生成sourcemap
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
