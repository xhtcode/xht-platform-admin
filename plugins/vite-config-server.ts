import type { ServerOptions } from 'vite'

/**
 * @description 本地开发反向代理配置
 * @param env 环境变量
 */
export default function (env: Record<string, string>): ServerOptions {
  return {
    host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
    port: +Number(env.VITE_APP_PORT) || 3000, // 设置服务启动端口号
    allowedHosts: ['www.xht.com'],
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
  }
}
