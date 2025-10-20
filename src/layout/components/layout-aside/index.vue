<template>
  <el-aside :style="asideStyle" class="xht-aside-container">
    <Logo />
    <el-scrollbar>
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
import type { RouteRecordRaw } from 'vue-router'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'LayoutAside' })
const { asideStyle } = useThemeHooks()
const themeStore = useThemeStore()
const { layoutType } = storeToRefs(themeStore)
const routeStore = useRouteStore()
const props = withDefaults(
  defineProps<{
    childMenuList?: RouteRecordRaw[]
  }>(),
  {
    childMenuList: () => [],
  }
)
const menuList = computed(() => {
  if (layoutType.value === 'columns') {
    return props.childMenuList || []
  }
  return convertRouteToMenu(DynamicRouter.concat(routeStore.routesRaw))
})
</script>

<style scoped lang="scss">
.xht-aside-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: var(--xht-menu-bg-color);
  z-index: 1;
  box-shadow: 2px 0 4px #00152959;
}

html.dark {
  .xht-aside-container {
    z-index: 0;
    border-right: 1px solid var(--xht-border-color);
  }
}
</style>
