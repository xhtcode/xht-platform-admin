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
          <size-select />
          <page-full-screen />
        </template>
        <app-setting />
        <user-avatar />
      </div>
      <div class="layout-header-container-bottom" v-if="tagsViewStatus">
        <tags-view-component />
      </div>
    </div>
  </el-header>
</template>
<script setup lang="ts">
import MenuLock from '@/layout/components/menu-lock/index.vue'
import BreadCrumb from '@/layout/components/bread-crumb/index.vue'
import UserAvatar from '@/layout/components/user-avatar/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import SizeSelect from '@/layout/components/size-select/index.vue'
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
<style scoped lang="scss"></style>
