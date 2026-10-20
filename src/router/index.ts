import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
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
 * 动态路由移除函数集合
 *
 * router.addRoute() 会返回移除该条路由的函数，登出时逐个调用即可精确移除动态路由。
 * 不使用 clearRoutes()，因为它会把静态路由（登录页、404 等）一并清空。
 */
const dynamicRouteRemovers: Array<() => void> = []

/**
 * 注册动态路由
 * @param routes 后端菜单格式化后的路由
 */
export function addDynamicRoutes(routes: RouteRecordRaw[]) {
  routes.forEach((route) => {
    // 外链（http/mailto/tel）不注册为路由
    if (/^(?:https?:|mailto:|tel:)/.test(route.path)) {
      return
    }
    dynamicRouteRemovers.push(router.addRoute(route))
  })
}

/**
 * 移除全部动态路由，静态路由保持不变
 */
export function removeDynamicRoutes() {
  while (dynamicRouteRemovers.length > 0) {
    dynamicRouteRemovers.pop()?.()
  }
}

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
