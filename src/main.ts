import { createApp } from 'vue'
import App from '@/App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import 'animate.css/animate.min.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupPermission } from '@/plugin/permission'
import { setupElIcons } from './plugin/icon'
// 解决非被动事件监听警告，提升滚动性能
import 'default-passive-events'

const app = createApp(App)
setupRouter(app)
setupStore(app)
setupPermission()
setupElIcons(app)
app.mount('#app')
