import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPlugin from 'pinia-plugin-persistedstate'

const store = createPinia()

// 全局注册 store
export function setupStore(app: App<Element>) {
  store.use(piniaPlugin)
  app.use(store)
}

export * from '@/store/modules/theme.store'
export { store }
