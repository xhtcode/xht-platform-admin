<script lang="ts" setup>
import MenuItem from '@/layout/components/menu-item/index.vue'
import { type RouteRecordRaw, useRoute } from 'vue-router'
import { useThemeHooks } from '@/hooks/use-theme-hooks'

defineOptions({ name: 'MenuMain' })
const { menuCollapse } = useThemeHooks()
const route = useRoute()
const activeMenuPath = computed<any>(() => {
  return route.meta?.activeMenuPath ? route.meta?.activeMenuPath : route.path
})
const menuList = defineModel<RouteRecordRaw[]>('menuList', {
  required: true,
})
</script>

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

<style lang="scss" scoped></style>
