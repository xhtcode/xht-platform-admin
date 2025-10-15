<template>
  <el-config-provider :locale="zhCn" :size="sizeType">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useThemeDeviceHooks } from '@/hooks/use-theme-hooks'

const themeStore = useThemeStore()
const { sizeType } = storeToRefs(themeStore)
useThemeDeviceHooks()
</script>
<style lang="scss" scoped></style>
