import { RouteLocationNormalized } from 'vue-router'

export const filterAffixTagsView = (routes: any[]) => {
  let tagsResult: TagsViewType[] = []
  routes.forEach((route: any) => {
    const meta: any = route.meta || {}
    if (meta.affixStatus && !meta.breadCrumbStatus) {
      tagsResult.push(formatRoute(route))
    }
    if (route.children) {
      const tempTags: TagsViewType[] = filterAffixTagsView(route.children)
      if (tempTags.length >= 1) {
        tagsResult = [...tagsResult, ...tempTags]
      }
    }
  })
  return tagsResult
}
/**
 * 格式化路由
 * @param routeView 路由信息
 */
export const formatRoute = (routeView: RouteLocationNormalized): TagsViewType => {
  const meta: any = routeView.matched?.at(-1)?.meta || routeView.meta || {}
  return {
    path: routeView.fullPath || routeView.path || '/',
    title: routeView.query?.tagName || meta.title,
    name: routeView.name,
    icon: meta.icon,
    affixStatus: meta.affixStatus,
    cacheStatus: meta.keepAliveStatus,
    query: routeView.query,
  }
}
