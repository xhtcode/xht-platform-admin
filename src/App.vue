<template>
  <el-config-provider :size="sizeType">
    <gen-table-info-add-or-update />
  </el-config-provider>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useThemeDeviceHooks } from '@/hooks/use-theme-hooks'
import GenTableInfoAddOrUpdate from '@/views/generate/table/components/add-or-update.vue'

const themeStore = useThemeStore()
const { sizeType } = storeToRefs(themeStore)
useThemeDeviceHooks()
</script>
<style lang="scss" scoped></style>
