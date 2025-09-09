<template>
  <el-menu
    :collapse="!menuCollapse"
    :collapse-transition="false"
    :default-active="activeMenuPath"
    :ellipsis="false"
    :unique-opened="true"
    mode="vertical"
  >
    <menu-item :menu-list="menuList" />
  </el-menu>
</template>

<script lang="ts" setup>
import { useRouteStore } from '@/store/modules/routes.store'
import MenuItem from '@/layout/components/menu-item/index.vue'
import { type RouteRecordRaw, useRoute } from 'vue-router'
import DynamicRouter from '@/router/modules/dynamic'
import { useThemeHooks } from '@/hooks/use-theme-hooks'

defineOptions({ name: 'MenuMain' })
const { menuCollapse } = useThemeHooks()
const route = useRoute()
const routeStore = useRouteStore()
const activeMenuPath = computed<any>(() => {
  return route.meta?.activeMenuPath ? route.meta?.activeMenuPath : route.path
})
// 完整导航数据
const menuList = computed(() => {
  return convertRouteToMenu(DynamicRouter.concat(routeStore.routesRaw))
})

// 将原始路由转换成导航菜单
function convertRouteToMenu(routes: any[]): any[] {
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

function convertRouteToMenuRecursive(routes: RouteRecordRaw[], basePath = ''): any[] {
  const returnMenus: any[] = []
  routes.forEach((item) => {
    if (!item.meta?.hiddenStatus) {
      const menuItem: any = {
        path: item.path,
        meta: {
          title: item?.meta?.title,
          icon: item?.meta?.icon,
          defaultOpened: item?.meta?.defaultOpened,
          auth: item?.meta?.auth,
          menu: item?.meta?.menu,
          link: item?.meta?.link,
        },
      }
      if (item.children) {
        menuItem.children = convertRouteToMenuRecursive(item.children, menuItem.path)
      }
      returnMenus.push(menuItem)
    }
  })
  return returnMenus
}
</script>

<style lang="scss" scoped></style>
