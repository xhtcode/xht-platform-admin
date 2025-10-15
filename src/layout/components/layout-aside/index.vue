<template>
  <el-aside :style="asideStyle" class="layout-aside">
    <Logo />
    <el-scrollbar view-class="user-select-none">
      <menu-main :menu-list="menuList" />
    </el-scrollbar>
  </el-aside>
</template>
<script setup lang="ts">
import Logo from '@/layout/components/logo-image/index.vue'
import MenuMain from '@/layout/components/menu-main/index.vue'
import { useThemeHooks } from '@/hooks/use-theme-hooks'
import { useRouteStore } from '@/store/modules/routes.store'
import DynamicRouter from '@/router/modules/dynamic'
import { convertRouteToMenu } from '@/layout/components/helper'

defineOptions({ name: 'LayoutAside' })
const { asideStyle } = useThemeHooks()
const routeStore = useRouteStore()
const menuList = computed(() => {
  return convertRouteToMenu(DynamicRouter.concat(routeStore.routesRaw))
})
</script>

<style scoped lang="scss"></style>
