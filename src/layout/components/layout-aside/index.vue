<template>
  <el-aside :style="asideStyle" class="layout-aside">
    <Logo />
    <el-scrollbar view-class="user-select-none">
      <menu-main-component />
    </el-scrollbar>
  </el-aside>
</template>
<script setup lang="ts">
import Logo from '@/layout/components/logo/index.vue'
import MenuMainComponent from '@/layout/components/menu-main/index.vue'
import { useThemeHooks } from '@/hooks/use-theme-hooks'

defineOptions({ name: 'LayoutAside' })
const { asideStyle } = useThemeHooks()
</script>

<style scoped lang="scss"></style>
