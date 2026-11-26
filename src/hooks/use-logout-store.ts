import { useRouteStore } from '@/store/modules/routes.store.ts'
import { useUserInfoStore } from '@/store/modules/user.store.ts'
import { useThemeStore } from '@/store'
import useTagsStore from '@/store/modules/tags.store.ts'

/**
 * 重置 Pinia 的 hooks
 *
 * 依赖 src/store/index.ts 中全局插件注入的自定义 $reset
 * （创建 store 时快照初始 state，调用 $reset 时回填），
 * 因此 setup 写法的 store 也能被正确复位为默认值。
 */
export function useLogoutStore() {
  const routeStore = useRouteStore()
  const userInfo = useUserInfoStore()
  const themeStore = useThemeStore()
  const tagsStore = useTagsStore()
  /**
   * 重置所有 store 为默认值
   *
   * 注意：仅复位 store 内部的 state；路由类副作用（如已注册的动态路由）
   * 仍需由对应 store 的方法处理（routes.store 的 resetRoutes）。
   */
  const resetAllStores = () => {
    routeStore.resetRoutes()
    userInfo.clearSession()
    themeStore.resetTheme()
    tagsStore.resetTagsView()
  }

  return {
    resetAllStores,
  }
}

export default useLogoutStore
