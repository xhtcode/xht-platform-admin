import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import StaticRouter from '@/router/modules/static'

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [...StaticRouter],
})

/**
 * 重置路由
 */
export async function resetRouter() {}

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
