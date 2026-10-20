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

/**
 * 布局组件兜底
 *
 * layoutType 由 localStorage 持久化恢复，可能残留旧版本的非法值（如 'classic'），
 * 直接索引会得到 undefined 导致整页白屏，此处兜底到默认布局。
 */
const layoutComponent = computed<Component>(() => LayoutComponents[layoutType.value] ?? LayoutComponents.default)
</script>

<template>
  <component :is="layoutComponent" />
</template>

<style lang="scss"></style>
