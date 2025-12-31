import { createApp } from 'vue'
import App from '@/App.vue'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import 'animate.css/animate.min.css'
import '@/styles/index.scss'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupPermission } from '@/plugin/permission'
import { setupElIcons } from '@/plugin/icon'
import { setupDirectives } from '@/directives'

const app = createApp(App)
setupRouter(app)
setupStore(app)
setupPermission()
setupElIcons(app)
setupDirectives(app)
app.mount('#app')
