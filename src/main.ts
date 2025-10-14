import { createApp } from 'vue'
import App from '@/App.vue'
import 'virtual:uno.css'
import 'animate.css/animate.min.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupPermission } from '@/plugin/permission'
import { setupElIcons } from './plugin/icon'

const app = createApp(App)
setupRouter(app)
setupStore(app)
setupPermission()
setupElIcons(app)
app.mount('#app')
