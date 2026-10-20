import type { BuildEnvironmentOptions } from 'vite'

/**
 * @description: vite build 配置
 * @param {Record<string, string>} env 环境变量
 * @param {boolean} isProduction 是否生产环境
 */
export default function (env: Record<string, string>, isProduction: boolean): BuildEnvironmentOptions {
  return {
    target: 'es2015',
    chunkSizeWarningLimit: 2000, // chunk 大小警告限制
    outDir: env.VITE_OUT_DIR || 'dist', // 输出目录
    cssCodeSplit: true, // 是否将 CSS 提取到单独的文件中
    sourcemap: !isProduction, // 开发环境生成sourcemap
    rolldownOptions: {
      output: {
        // 代码分包：把体积大且更新频率低的依赖拆出，避免业务代码变更导致整包缓存失效
        codeSplitting: {
          groups: [
            // Monaco 仅在代码生成相关页面使用，单独成块可延后加载
            { name: 'monaco', test: /node_modules[\\/]monaco-editor[\\/]/ },
            { name: 'element-plus', test: /node_modules[\\/]element-plus[\\/]/ },
            { name: 'vendor', test: /node_modules[\\/]/ },
          ],
        },
        // 静态资源分类打包
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  }
}
