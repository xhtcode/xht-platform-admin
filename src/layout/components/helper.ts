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

/**
 * 递归查找菜单列表中的第一个有效子菜单项
 * @param menuList 菜单列表
 * @returns 返回第一个有效的菜单项
 */
const findMenuChildrenFirst = (menuList: RouteRecordRaw[]): RouteRecordRaw | null => {
  if (!menuList || menuList.length === 0) {
    return null
  }
  const firstMenu = menuList[0]
  if (firstMenu.children && firstMenu.children.length > 0) {
    return findMenuChildrenFirst(firstMenu.children)
  }
  if (firstMenu.meta?.linkStatus) {
    for (const menuListElement of menuList) {
      if (!menuListElement.meta?.linkStatus) {
        return menuListElement
      }
    }
    return null
  }
  return firstMenu
}
export { convertRouteToMenu, findMenuChildrenFirst }
