<template>
  <el-config-provider :size="sizeType">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useThemeDeviceHooks } from '@/hooks/use-theme-hooks'

const themeStore = useThemeStore()
const { sizeType } = storeToRefs(themeStore)
useThemeDeviceHooks()
</script>
<style lang="scss" scoped></style>
