import { type ViteDevServer, type PluginOption } from 'vite'

// 终端ANSI颜色
const COLOR = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
}

/** 格式化当前时间 YYYY-MM-DD HH:mm:ss */
function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 自定义启动日志插件
 */
const xhtStartLogPlugin = (env: Record<string, any>): PluginOption => {
  const prot = env.VITE_APP_PORT || 3000
  const nodeEnv = env.VITE_USER_NODE_ENV || '未知'
  const title = env.VITE_APP_TITLE || 'xht-cloud-admin-ui'
  const author = env.VITE_APP_AUTHOR || '小糊涂 (xht)'
  const gatewayApi = env.VITE_GATEWAY_API || 'http://www.xht.com:8080'
  return {
    name: 'plugin-xht-start-log',
    configureServer(server: ViteDevServer) {
      server.printUrls = () => {}
      const startTimeStamp = Date.now()
      server.httpServer?.on('listening', () => {
        const startDate = new Date(startTimeStamp)
        const startStr = formatDateTime(startDate)
        console.log(`\n${COLOR.green}================================================================================${COLOR.reset}`)
        console.log(`${COLOR.cyan}🐣项目名称:${COLOR.yellow}👉${title}👈${COLOR.reset}`)
        console.log(`${COLOR.cyan}🌴项目作者:${COLOR.yellow}👉${author}👈${COLOR.reset}`)
        console.log(`${COLOR.cyan}⌚启动时间:${COLOR.yellow}👉${startStr}👈${COLOR.reset}`)
        console.log(`${COLOR.cyan}🌎当前环境:${COLOR.magenta}👉${nodeEnv}👈${COLOR.reset}`)
        console.log(`${COLOR.cyan}🌐后端访问地址:${COLOR.blue}${gatewayApi}${COLOR.reset}`)
        console.log(`${COLOR.cyan}🌐前端访问地址:${COLOR.blue}http://www.xht.com:${prot}${COLOR.reset}`)
        console.log(`${COLOR.cyan}🛠️VueDevTools:${COLOR.blue}http://www.xht.com:${prot}/__devtools__/${COLOR.reset}`)
        console.log(`${COLOR.cyan}🎨UnoCSS调试面板:${COLOR.blue}http://www.xht.com:${prot}/__unocss/${COLOR.reset}`)
        console.log(`${COLOR.cyan}📚接口文档地址:${COLOR.reset}`)
        console.log(`${COLOR.cyan}   ├─ Knife4j文档:${COLOR.blue}${gatewayApi}/doc.html${COLOR.reset}`)
        console.log(`${COLOR.cyan}   ├─ Swagger文档:${COLOR.blue}${gatewayApi}/swagger-ui.html${COLOR.reset}`)
      })
    },
  }
}

export default xhtStartLogPlugin
