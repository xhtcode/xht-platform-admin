<script setup lang="ts">
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import LayoutLoading from '@/layout/components/layout-loading/index.vue'

defineOptions({ name: 'LayoutIndex' })
/**
 * 布局壳按需异步加载（保留代码分割）
 *
 * vue-router 导航确认只等待路由壳 chunk，不等待嵌套异步组件，
 * 因此用 loadingComponent 在布局 chunk 加载期间展示加载动画，
 * 避免登录跳转、刷新时出现整页白屏闪断；delay 取 0 保证首帧即有占位。
 */
const LayoutComponents: Record<string, Component> = {
  default: defineAsyncComponent({
    loader: () => import('@/layout/layout-default/index.vue'),
    loadingComponent: LayoutLoading,
    delay: 0,
  }),
  columns: defineAsyncComponent({
    loader: () => import('@/layout/layout-columns/index.vue'),
    loadingComponent: LayoutLoading,
    delay: 0,
  }),
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
