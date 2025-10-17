<template>
  <div class="xht-split-container">
    <div
      v-for="item in menuList"
      :key="item.path"
      :class="item.path === activeMenuPath ? 'xht-split-item-active' : ''"
      class="xht-split-item"
      @click="handleMenuClick(item)"
    >
      <div class="xht-split-item-icon">
        <i class="item-icon" :class="`icon-menu-${item.meta?.icon}`"></i>
      </div>
      <div class="xht-split-item-text">{{ item.meta?.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { convertRouteToMenu } from '@/layout/components/helper'
import DynamicRouter from '@/router/modules/dynamic'
import { useRouteStore } from '@/store/modules/routes.store'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import type { EmitsType } from '@/layout/components/menu-split/types'

defineOptions({
  name: 'MenuSplit',
})
const route = useRoute()
const router = useRouter()
const emits = defineEmits<EmitsType>()
const routeStore = useRouteStore()
const menuList = computed<RouteRecordRaw[]>(() => {
  return convertRouteToMenu(DynamicRouter.concat(routeStore.routesRaw))
})
const activeMenuPath = ref<string>('')
const handleMenuClick = (menuItem: RouteRecordRaw) => {
  if (activeMenuPath.value === menuItem.path) {
    return
  }
  activeMenuPath.value = menuItem.path
  emits(
    'change',
    menuItem.children && menuItem.children.length > 0 ? menuItem.children : [menuItem],
    false
  )
}
const changeMenuList = () => {
  const currentMenuPath = router.currentRoute.value.matched[0]?.path
  if (activeMenuPath.value === currentMenuPath) {
    return
  }
  activeMenuPath.value = currentMenuPath
  menuList.value.forEach((item) => {
    if (item.path === currentMenuPath) {
      emits('change', item.children && item.children.length > 0 ? item.children : [item], true)
      return
    }
  })
}
onMounted(() => {
  console.log(route.path)
  activeMenuPath.value = router.currentRoute.value.matched[0]?.path
  menuList.value.forEach((item) => {
    if (item.path === activeMenuPath.value) {
      emits('change', item.children && item.children.length > 0 ? item.children : [item], false)
    }
  })
})
watch(
  () => route.path,
  () => {
    console.log(route.path)
    changeMenuList()
  }
)
</script>

<style scoped lang="scss">
.xht-split-container {
  .xht-split-item-active {
    background: var(--el-color-primary);

    .xht-split-item-icon {
      color: #ffffff !important;
    }

    .xht-split-item-text {
      color: #ffffff !important;
    }
  }

  .xht-split-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: $header-height;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      .xht-split-item-icon {
        color: var(--el-color-primary);
        transform: scale(1.1);
      }

      .xht-split-item-text {
        color: var(--el-color-primary);
      }
    }

    .xht-split-item-icon {
      height: 20px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--xht-text-color);
    }

    .xht-split-item-text {
      user-select: none;
      font-size: 12px;
      color: var(--xht-text-color);
    }
  }
}
</style>
