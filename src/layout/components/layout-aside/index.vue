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

<style scoped lang="scss">
.layout-aside {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 1;
  height: inherit;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden !important;

  .el-scrollbar__view {
    overflow: hidden;
  }

  .el-menu {
    border: none;

    .el-menu-item {
      &.is-active {
        background: var(--el-color-primary-light-9) !important;
      }
    }
  }
}
</style>
