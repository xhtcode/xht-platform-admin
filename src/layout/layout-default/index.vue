<script setup lang="ts">
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import LayoutAside from '@/layout/components/layout-aside/index.vue'
import { useThemeHooks } from '@/hooks/use-theme-hooks'
import MenuSearch from '@/layout/components/menu-search/index.vue'
import MenuLock from '@/layout/components/menu-lock/index.vue'
import BreadCrumb from '@/layout/components/bread-crumb/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import UserAvatar from '@/layout/components/user-avatar/index.vue'
import AppSetting from '@/layout/components/app-setting/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import LayoutFooter from '@/layout/components/layout-footer/index.vue'
import TagsView from '@/layout/components/tags-view/index.vue'
import LayoutMain from '@/layout/components/layout-main/index.vue'

defineOptions({ name: 'LayoutDefaultComponent' })
const themeStore = useThemeStore()
const { sidebarStatus } = storeToRefs(themeStore)
const { desktopShowStatus, mobileShowStatus, asideStyle } = useThemeHooks()

/**
 * 处理遮罩层点击事件，关闭侧边栏
 */
function handleCloseSidebar() {
  sidebarStatus.value = false
}
</script>

<template>
  <el-container class="xht-layout-container">
    <div v-if="mobileShowStatus" class="layout__overlay" @click="handleCloseSidebar" />
    <div v-if="mobileShowStatus" class="layout__sidebar" :style="asideStyle">
      <layout-aside />
    </div>
    <layout-aside v-if="desktopShowStatus" />
    <el-container class="h-full w-full overflow-hidden">
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

<style lang="scss" scoped>
@use '@/styles/variables.scss';

.layout__sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  height: 100%;
  transition: width 0.28s;
  background: var(--xht-bg-color);

  :deep(.el-menu) {
    border: none;
  }
}

.layout__overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
