<script setup lang="ts">
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'LayoutIndex' })
const LayoutComponents: Record<any, Component> = {
  default: defineAsyncComponent(() => import('@/layout/layout-default/index.vue')),
  columns: defineAsyncComponent(() => import('@/layout/layout-columns/index.vue')),
}
const themeStore = useThemeStore()
const { layoutType } = storeToRefs(themeStore)
</script>

<template>
  <component :is="LayoutComponents[layoutType]" />
</template>
<style lang="scss"></style>
