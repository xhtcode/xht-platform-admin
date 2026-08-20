import { useRouteStore } from '@/store/modules/routes.store'
import { storeToRefs } from 'pinia'

/**
 * 路由加载状态管理 Hook
 * 用于监听页面路由切换时的加载状态
 *
 * @returns 包含路由加载状态和相关操作方法的对象
 */
const useRouterLoadingHooks = () => {
  const routeStore = useRouteStore()
  const { routerStatus } = storeToRefs(routeStore)
  const loadingStatus = computed(() => routerStatus.value)

  /**
   * 刷新路由状态
   * 设置加载和刷新状态，并在下一个 DOM 更新周期后重置状态
   */
  const refreshRouter = async () => {
    routerStatus.value = true
    await nextTick(() => {
      window.setTimeout(() => {
        routerStatus.value = false
      }, 200)
    })
  }

  return {
    loadingStatus,
    refreshRouter,
  }
}

export default useRouterLoadingHooks
