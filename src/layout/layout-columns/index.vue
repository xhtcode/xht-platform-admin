<template>
  <el-container class="xht-layout-container">
    <div class="xht-aside-split">
      <el-scrollbar>
        <menu-split @change="handleMenuClick" />
      </el-scrollbar>
    </div>
    <layout-aside :child-menu-list="menuList" />
    <el-container class="w-full h-full">
      <el-header class="xht-header-container">
        <div class="xht-header-item">
          <menu-lock />
          <bread-crumb />
        </div>
        <div class="xht-header-item">
          <switch-dark />
          <page-full-screen />
          <menu-search />
          <app-setting />
          <user-avatar />
        </div>
      </el-header>
      <div class="tabs-box-container">
        <tags-view />
      </div>
      <layout-main />
      <layout-footer />
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import BreadCrumb from '@/layout/components/bread-crumb/index.vue'
import TagsView from '@/layout/components/tags-view/index.vue'
import MenuSplit from '@/layout/components/menu-split/index.vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { findMenuChildrenFirst } from '@/layout/components/helper'
import { useMessage } from '@/hooks/use-message'
import MenuLock from '@/layout/components/menu-lock/index.vue'
import UserAvatar from '@/layout/components/user-avatar/index.vue'
import MenuSearch from '@/layout/components/menu-search/index.vue'
import AppSetting from '@/layout/components/app-setting/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import LayoutFooter from '@/layout/components/layout-footer/index.vue'
import LayoutMain from '@/layout/components/layout-main/index.vue'
import LayoutAside from '@/layout/components/layout-aside/index.vue'

defineOptions({
  name: 'LayoutColumns',
})
const router = useRouter()
const menuList = ref<RouteRecordRaw[]>([])
/**
 * 菜单点击事件
 * @param menuItems - 菜单列表
 * @param linkStatus - 菜单是否跳转   true 跳转 false 不跳转
 */
const handleMenuClick = async (menuItems: RouteRecordRaw[], linkStatus: boolean) => {
  menuList.value = menuItems
  if (linkStatus) {
    const menuChildrenFirst = findMenuChildrenFirst(menuItems)
    if (menuChildrenFirst) {
      await router.push(menuChildrenFirst.path).catch((err) => {
        console.log(err)
        useMessage().error('路由错误，请联系管理员!')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.xht-layout-container {
  width: 100%;
  height: 100%;

  .xht-aside-split {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    width: $menu-column-width;
    height: 100%;
    background-color: var(--xhe-split-menu-bg-color);
  }
}
</style>
