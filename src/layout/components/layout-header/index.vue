<script setup lang="ts">
import MenuLock from '@/layout/components/menu-lock/index.vue'
import BreadCrumb from '@/layout/components/bread-crumb/index.vue'
import UserAvatar from '@/layout/components/user-avatar/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import TagsViewComponent from '@/layout/components/tags-view/index.vue'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import MenuSearch from '@/layout/components/menu-search/index.vue'
import AppSetting from '@/layout/components/app-setting/index.vue'
import { useThemeHooks } from '@/hooks/use-theme-hooks'

defineOptions({ name: 'LayoutHeader' })
const themeStore = useThemeStore()
const { tagsViewStatus } = storeToRefs(themeStore)
const { desktopShowStatus } = useThemeHooks()
</script>

<template>
  <el-header class="layout-header">
    <div class="layout-header-container">
      <div class="layout-header-container-top">
        <div class="layout-main-breadcrumb">
          <menu-lock />
          <bread-crumb v-if="desktopShowStatus" />
        </div>
        <menu-search />
        <template v-if="desktopShowStatus">
          <switch-dark />
          <page-full-screen />
        </template>
        <app-setting />
        <user-avatar />
      </div>
      <div v-if="tagsViewStatus" class="layout-header-container-bottom">
        <tags-view-component />
      </div>
    </div>
  </el-header>
</template>

<style scoped lang="scss">
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.06);
  height: auto !important;

  .layout-header-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .layout-header-container-top {
      height: 50px;
      display: flex;
      align-items: center;
      background: var(--next-bg-topBar);
      border-bottom: 1px solid var(--xht-border-color);

      .layout-main-breadcrumb {
        flex: 1;
        height: inherit;
        display: flex;
        align-items: center;
      }

      .layout-header-top-item {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: $header-height;
        opacity: 0.8;

        &:hover {
          opacity: 1;
          color: var(--el-color-primary);
          background-color: var(--xht-hover-bg-color);
        }
      }
    }

    .layout-header-container-bottom {
      background: var(--xht-bg-header-color);
      position: relative;
      height: 37px;
    }
  }
}
</style>
