<template>
  <el-watermark :content="watermarkContent" class="w100 h100" :font="font">
    <el-config-provider :locale="zhCn" :size="sizeType">
      <router-view />
    </el-config-provider>
  </el-watermark>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import type { WatermarkFontType } from 'element-plus/es/components/watermark/src/watermark'
import { useThemeDeviceHooks } from '@/hooks/use-theme-hooks'

const themeStore = useThemeStore()
const { sizeType, darkStatus, watermarkContent } = storeToRefs(themeStore)
const font = computed<WatermarkFontType>(() => {
  const color = darkStatus.value ? 'rgba(255, 255, 255, .25)' : 'rgba(0, 0, 0, .25)'
  return {
    color: color,
  }
})
useThemeDeviceHooks()
</script>
<style lang="scss" scoped></style>
