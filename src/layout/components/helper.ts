import type { RouteRecordRaw } from 'vue-router'

/**
 * 将原始路由转换成导航菜单
 * @param routes
 */
const convertRouteToMenu = (routes: any[]): RouteRecordRaw[] => {
  const returnMenus: any[] = []
  routes
    .filter((item: any) => !item.meta?.hiddenStatus)
    .forEach((item) => {
      const menuItem: any = {
        path: item.path,
        meta: {
          title: item.meta?.title,
          icon: item.meta?.icon,
          activeMenuPath: item.meta?.activeMenuPath,
          linkStatus: item.meta?.linkStatus,
          hiddenStatus: item.meta?.hiddenStatus,
          fullStatus: item.meta?.fullStatus,
          affixStatus: item.meta?.affixStatus || false,
          keepAliveStatus: item.meta?.keepAliveStatus,
          backstage: item.meta?.backstage,
          menuType: item.meta?.menuType,
          rank: item.meta?.rank,
          roles: item.meta?.roles,
        },
        children: [],
      }
      if (item.children && item.children.length > 0) {
        menuItem.children = convertRouteToMenu(item.children)
      }
      returnMenus.push(menuItem)
    })
  return returnMenus
}

export { convertRouteToMenu }
