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
      <el-header class="xht-header-container"></el-header>
      <div class="tabs-box-container">
        <tags-view-component />
      </div>
      <el-main class="xht-main-container"></el-main>
      <el-footer class="xht-footer-container">
        <div class="xht-footer-main">
          <div class="xht-footer-main-item bg-blue">
            <bread-crumb />
          </div>
        </div>
      </el-footer>
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

defineOptions({
  name: 'LayoutColumns',
})
const menuList = ref<RouteRecordRaw[]>([])
const asideMenuStyle = computed<CSSProperties>(() => {
  return {
    width: variables.menuWidth,
  }
})
const handleMenuClick = (menuItems: RouteRecordRaw[]) => {
  menuList.value = menuItems ?? []
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

  .xht-footer-container {
    height: auto;
    padding: 0;

    .xht-footer-main {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: $footer-height;
      padding: 0;
      overflow: hidden;
      background-color: var(--el-bg-color);
      border-top: 1px solid var(--el-border-color-light);

      .xht-footer-main-item {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
