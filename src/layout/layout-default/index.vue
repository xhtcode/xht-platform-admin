<template>
  <el-container class="layout-container">
    <div class="layout__overlay" @click="handleCloseSidebar" v-if="mobileShowStatus" />
    <div class="layout__sidebar" v-if="mobileShowStatus">
      <layout-aside />
    </div>
    <layout-aside v-if="desktopShowStatus" />
    <el-container class="layout-container-view">
      <el-scrollbar always>
        <layout-header ref="headerRef" />
        <el-main class="layout-main" :style="mainStyle">
          <el-scrollbar
            class="layout-main-scrollbar"
            view-class="layout-main-scrollbar"
            wrap-class="layout-main-scrollbar"
          >
            <div class="layout-main-parent">
              <router-view>
                <template #default="{ Component, route }">
                  <Transition name="main-view-animation" mode="out-in">
                    <keep-alive>
                      <component :is="Component" class="w100" :key="route.fullPath" />
                    </keep-alive>
                  </Transition>
                </template>
              </router-view>
            </div>
            <el-footer ref="footerRef" v-if="footerStatus" class="layout-footer user-select-none">
              小糊涂后台管理系统
            </el-footer>
          </el-scrollbar>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import LayoutHeader from '@/layout/components/layout-header/index.vue'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import LayoutAside from '@/layout/components/layout-aside/index.vue'
import { useThemeHooks } from '@/hooks/use-theme-hooks'

defineOptions({ name: 'LayoutDefaultComponent' })
const headerRef = ref()
const footerRef = ref()
const themeStore = useThemeStore()
const { footerStatus, sidebarStatus } = storeToRefs(themeStore)
const { mainStyle, desktopShowStatus, mobileShowStatus } = useThemeHooks()

/**
 * 处理遮罩层点击事件，关闭侧边栏
 */
function handleCloseSidebar() {
  sidebarStatus.value = false
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss';

.layout__sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  height: 100%;
  width: variables.$menu-width-200;
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

/* 主内容区动画 */
.main-view-animation-enter-active {
  transition: 0.6s;
}

.main-view-animation-leave-active {
  transition: 0.4s;
}

.main-view-animation-enter-from {
  margin-left: -20px;
  opacity: 0;
}

.main-view-animation-leave-to {
  margin-left: 20px;
  opacity: 0;
}
</style>
