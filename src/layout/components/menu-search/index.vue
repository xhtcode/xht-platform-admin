<template>
  <div class="header-tool-item" @click="show">
    <div class="icon-common-search size-20px" />
    <el-dialog
      v-model="state.visibleStatus"
      :before-close="close"
      destroy-on-close
      append-to-body
      :show-close="false"
      modal-class="menu-search-dialog"
      header-class="menu-search-dialog-header"
      body-class="menu-search-dialog-body"
      footer-class="menu-search-dialog-footer"
    >
      <template #footer>
        <el-autocomplete
          ref="filterRef"
          v-model="state.search"
          size="large"
          class="w100"
          :fetch-suggestions="querySearch"
          placeholder="菜单搜索：支持菜单名称、路由路径"
          :fit-input-width="true"
          popper-class="menu-search-select"
          @select="handleSelect"
        >
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
          <template #default="{ item }">
            <div
              class="menu-search-item"
              :class="{
                'menu-search-is-active': activeMenuPath === item.path,
              }"
            >
              <div :class="`icon-menu-${item.icon}`" class="mr5" />
              {{ item.title }}
            </div>
          </template>
        </el-autocomplete>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useRouteStore } from '@/store/modules/routes.store'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import RegularUtil from '@/utils/moudle/RegularUtils'
import { useMessage } from '@/hooks/use-message'

defineOptions({
  name: 'MenuSearch',
})
const routeStore = useRouteStore()
const router = useRouter()
const route = useRoute()
const activeMenuPath = computed<any>(() => {
  return route.meta?.activeMenuPath ? route.meta?.activeMenuPath : route.path
})
const state = reactive<{
  search: any
  visibleStatus: boolean
  restaurants: any[]
}>({
  search: null,
  visibleStatus: false,
  restaurants: [],
})
const filterRef = useTemplateRef('filterRef')
/**
 * 搜索
 */
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? state.restaurants.filter(createFilter(queryString))
    : state.restaurants
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.title?.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
      restaurant.path?.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    )
  }
}
const handleSelect = async (item: any) => {
  if (item.linkStatus) {
    if (RegularUtil.isExternal(item.path)) {
      return window.open(item.path, '_blank')
    }
    const href = router.resolve({
      path: item.path,
    })
    return window.open(href.href, '_blank')
  }
  await router.push(item.path).catch((_) => {
    useMessage().error('路由错误，请联系管理员!' + item.path)
  })
  close()
}
/**
 * 显示
 */
const show = () => {
  state.visibleStatus = true
  state.restaurants = []
  if (routeStore.formatRoutes && routeStore.formatRoutes.length) {
    initRestaurants(routeStore.formatRoutes)
  }
  nextTick(() => {
    setTimeout(() => {
      filterRef.value?.focus()
    })
  })
}
/*
 * 关闭
 */
const close = () => {
  state.visibleStatus = false
}
const initRestaurants = (data: RouteRecordRaw[]) => {
  if (data) {
    data.forEach((item) => {
      if (item.meta && !item.meta.hiddenStatus) {
        state.restaurants.push({
          icon: item.meta.icon,
          title: item.meta.title,
          path: item.path,
        })
      }
      if (item.children && item.children.length) {
        initRestaurants(item.children)
      }
    })
  }
}
</script>
<style lang="scss">
.menu-search-dialog {
  .el-dialog {
    padding: 0 !important;
    top: 10vh !important;
  }

  .menu-search-dialog-header {
    display: none;
  }

  .menu-search-dialog-body {
    display: none;
  }

  .menu-search-dialog-footer {
    background: transparent;
    padding: 0 !important;
  }
}

.menu-search-select {
  li {
    padding: 0 !important;
  }

  .menu-search-item {
    padding: 0 20px;
    width: 100%;
  }

  .menu-search-is-active {
    background: var(--el-color-primary-light-9) !important;
    color: var(--el-color-primary) !important;
  }
}
</style>
