import type { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 注册所有图标
export function setupElIcons(Vue: App<Element>) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
  }
}
