import router, { addDynamicRoutes } from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useRouteStore } from '@/store/modules/routes.store'
import type { RouteLocationNormalized } from 'vue-router'
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
          // 已登录访问登录页：直接回首页，具体落地页由后端下发的菜单决定
          return {
            path: HOME_PAGE_PATH,
            replace: true,
          }
        }
      } else {
        try {
          // 获取用户权限
          await userInfoStore.getUserInfos()
          // 生成并注册动态路由（登出时可被精确移除）
          await routeStore.generateRoutesAtBack()
          addDynamicRoutes(routeStore.formatRoutes)
          // 动态路由生成并注册后，重新进入当前路由
          return {
            path: to.path,
            query: to.query,
            replace: true,
          }
        } catch (e) {
          console.error('路由错误', e)
          await userInfoStore.logout()
          // 保留原地址，重新登录后可回到该页面
          return {
            path: PAGE_PATH_LOGIN,
            query: to.fullPath === PAGE_PATH_LOGIN ? undefined : { redirect: to.fullPath },
          }
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
