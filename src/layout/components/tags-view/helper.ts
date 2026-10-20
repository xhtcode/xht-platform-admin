import type { RouteLocationNormalized, RouteRecordRaw, RouteMeta } from 'vue-router'

/**
 * 取路由的元信息
 *
 * 已激活的路由取最深匹配记录的 meta；路由配置则直接取自身 meta。
 *
 * @param routeView 路由对象或路由记录
 */
const resolveMeta = (routeView: RouteLocationNormalized | RouteRecordRaw): RouteMeta => {
  if ('matched' in routeView) {
    return routeView.matched?.at(-1)?.meta ?? routeView.meta ?? {}
  }
  return routeView.meta ?? {}
}

/**
 * 过滤出需要固定在页签栏的路由
 *
 * @param routes 路由记录列表
 * @returns 固定页签列表
 */
export const filterAffixTagsView = (routes: RouteRecordRaw[]): TagsViewType[] => {
  let tagsResult: TagsViewType[] = []
  routes.forEach((route) => {
    const meta = route.meta ?? {}
    if (meta.affixStatus && !meta.breadCrumbStatus) {
      tagsResult.push(formatRoute(route))
    }
    if (route.children) {
      const tempTags: TagsViewType[] = filterAffixTagsView(route.children as RouteRecordRaw[])
      if (tempTags.length >= 1) {
        tagsResult = [...tagsResult, ...tempTags]
      }
    }
  })
  return tagsResult
}

/**
 * 格式化路由为页签数据
 * @param routeView 路由对象或路由记录
 */
export const formatRoute = (routeView: RouteLocationNormalized | RouteRecordRaw): TagsViewType => {
  const meta = resolveMeta(routeView)
  const fullPath = 'fullPath' in routeView ? routeView.fullPath : undefined
  const query = 'query' in routeView ? routeView.query : undefined
  const tagName = query?.tagName
  return {
    path: fullPath || routeView.path || '/',
    // tagName 可能为空数组或空串，此时回退到菜单标题
    title: (typeof tagName === 'string' ? tagName : '') || meta.title || '',
    name: routeView.name ?? undefined,
    icon: meta.icon ?? '',
    affixStatus: !!meta.affixStatus,
    cacheStatus: meta.keepAliveStatus,
    query: query,
  }
}
