import { createApp } from 'vue'
import App from '@/App.vue'
import '@/styles/index.scss'
import router from '@/router'
import { setupStore } from '@/store'
import { setupPermission } from '@/plugin/permission'
import { setupElIcons } from './plugin/icon'
import 'virtual:svg-icons-register'
import i18n from '@/lang/index'
// 布局工具
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 全局引入 animate.css
import "animate.css";

const app = createApp(App)
app.use(i18n)
app.use(router)
setupStore(app)
setupPermission()
setupElIcons(app)
// 导入布局插件
app.component('split-panes', Splitpanes)
app.component('split-pane-item', Pane)
app.mount('#app')
