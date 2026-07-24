import router from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useRouteStore } from '@/store/modules/routes.store'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/use-title'
import { HOME_PAGE_PATH, PAGE_PATH_LOGIN } from '@/service/constant'

const { setTitle } = useTitle()
/**
 * 进度条配置
 */
NProgress.configure({ showSpinner: false })
/**
 * 白名单路由
 */
const whiteList = ['/login', '/oauth2', '/process']

export function setupPermission() {
  router.beforeEach(async (to, _from) => {
    NProgress.start()
    const userInfoStore = useUserInfoStore()
    const routeStore = useRouteStore()
    if (userInfoStore.hasToken) {
      if (routeStore.isGenerate) {
        if (to.path === PAGE_PATH_LOGIN) {
          return {
            path: HOME_PAGE_PATH + (userInfoStore.isAdmin ? '/admin' : null),
            replace: true,
          }
        }
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
          return {
            path: to.path,
            query: to.query,
            replace: true,
          }
        } catch (e) {
          console.error('路由错误', e)
          await userInfoStore.logout()
          return { path: PAGE_PATH_LOGIN }
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        return
      } else {
        // 重定向登录页
        return {
          path: PAGE_PATH_LOGIN,
          query: {
            redirect: to.fullPath,
          },
        }
      }
    }
  })

  router.afterEach((to: RouteLocationNormalized) => {
    setTitle(to.meta?.title)
    NProgress.done()
  })
}
