import { createApp } from 'vue'
import App from '@/App.vue'
import '@/styles/index.scss'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupPermission } from '@/plugin/permission'
import { setupElIcons } from './plugin/icon'
// 布局工具
import 'element-plus/theme-chalk/dark/css-vars.css'
/**
 * UnoCSS 样式引擎
 */
import 'virtual:uno.css'
import 'animate.css/animate.min.css'

const app = createApp(App)
setupRouter(app)
setupStore(app)
setupPermission()
setupElIcons(app)
app.mount('#app')
