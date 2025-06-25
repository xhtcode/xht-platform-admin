import router from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useRouteStore } from '@/store/modules/routes.store'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/use-title'
import { HOME_PAGE_PATH, PAGE_PATH_LOGIN } from '@/common/constant'

const { setTitle } = useTitle()
/**
 * 进度条配置
 */
NProgress.configure({ showSpinner: false })
/**
 * 白名单路由
 */
const whiteList = ['/login']

export function setupPermission() {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userInfoStore = useUserInfoStore()
    const routeStore = useRouteStore()
    if (userInfoStore.hasToken) {
      if (routeStore.isGenerate) {
        if (to.path === PAGE_PATH_LOGIN) {
          // 如果已登录状态下，进入登录页会强制跳转到主页
          next({
            path: HOME_PAGE_PATH,
            replace: true,
          })
          return
        }
        next()
      } else {
        try {
          // 获取用户权限
          await userInfoStore.getUserInfos().then(async () => {})
          // 生成动态路由
          await routeStore.generateRoutesAtBack()
          routeStore.formatRoutes.forEach((route) => {
            if (!/^(?:https?:|mailto:|tel:)/.test(route.path)) {
              router.addRoute(route as RouteRecordRaw)
            }
          })
          // 动态路由生成并注册后，重新进入当前路由
          next({
            path: to.path,
            query: to.query,
            replace: true,
          })
        } catch {
          await userInfoStore.logout()
          next({ path: PAGE_PATH_LOGIN })
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        // 重定向登录页
        next({
          path: PAGE_PATH_LOGIN,
          query: {
            redirect: to.fullPath,
          },
        })
      }
    }
  })

  router.afterEach((to: RouteLocationNormalized) => {
    setTitle(to.meta?.title)
    NProgress.done()
  })
}
