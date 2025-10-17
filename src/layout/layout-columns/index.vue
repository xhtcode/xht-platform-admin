<template>
  <el-container class="xht-layout-container">
    <div class="xht-aside-split">
      <el-scrollbar>
        <menu-split @change="handleMenuClick" />
      </el-scrollbar>
    </div>
    <el-aside :style="asideMenuStyle" class="xht-aside-menu">
      <logo-image />
      <el-scrollbar>
        <menu-main :menu-list="menuList" />
      </el-scrollbar>
    </el-aside>
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
        <tags-view-component />
      </div>
      <el-main class="xht-main-container">
        <router-view />
      </el-main>
      <layout-footer />
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import variables from '@/styles/variables.module.scss'
import type { CSSProperties } from 'vue'
import BreadCrumb from '@/layout/components/bread-crumb/index.vue'
import TagsViewComponent from '@/layout/components/tags-view/index.vue'
import LogoImage from '@/layout/components/logo-image/index.vue'
import MenuSplit from '@/layout/components/menu-split/index.vue'
import MenuMain from '@/layout/components/menu-main/index.vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { findMenuChildrenFirst } from '@/layout/components/helper'
import { useMessage } from '@/hooks/use-message'
import MenuLock from '@/layout/components/menu-lock/index.vue'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import UserAvatar from '@/layout/components/user-avatar/index.vue'
import MenuSearch from '@/layout/components/menu-search/index.vue'
import AppSetting from '@/layout/components/app-setting/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import LayoutFooter from '@/layout/components/layout-footer/index.vue'

defineOptions({
  name: 'LayoutColumns',
})
const router = useRouter()
const menuList = ref<RouteRecordRaw[]>([])
const themeStore = useThemeStore()
const { menuStatus } = storeToRefs(themeStore)
const asideMenuStyle = computed<CSSProperties>(() => {
  return {
    width: menuStatus.value ? variables.menuWidth : variables.menuCollapseWidth,
  }
})

/**
 * 菜单点击事件
 * @param menuItems - 菜单列表
 * @param linkStatus - 菜单是否跳转
 */
const handleMenuClick = async (menuItems: RouteRecordRaw[], linkStatus: boolean) => {
  menuList.value = menuItems
  if (linkStatus) {
    const menuChildrenFirst = findMenuChildrenFirst(menuItems)
    if (menuChildrenFirst) {
      await router.push(menuChildrenFirst.path).catch((_) => {
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
    background-color: var(--xht-menu-bg-color);
    border-right: 1px solid var(--xht-border-color);
  }

  .xht-aside-menu {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background-color: var(--xht-menu-bg-color);
    border-right: 1px solid var(--xht-border-color);
    transition: width 0.3s ease;
  }

  .xht-header-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    padding: 0;
    background-color: var(--xht-header-bg-color);
    border-bottom: 1px solid var(--xht-border-color-light);

    .xht-header-item {
      height: $header-height;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .tabs-box-container {
    background-color: var(--xht-tag-bg-color);
    width: 100%;
  }

  .xht-main-container {
    position: relative;
    box-sizing: border-box;
    padding: 8px;
    overflow-x: hidden;
    background-color: var(--el-bg-color-page);
  }
}
</style>
