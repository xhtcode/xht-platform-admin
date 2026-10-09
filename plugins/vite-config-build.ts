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
        // 静态资源分类打包
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  }
}
