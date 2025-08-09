<script setup lang="ts">
defineOptions({ name: 'LayoutIndex' })
const LayoutComponents: Record<any, Component> = {
  default: defineAsyncComponent(() => import('@/layout/layout-default/index.vue')),
  columns: defineAsyncComponent(() => import('@/layout/layout-columns/index.vue')),
}
const layout = computed<any>(() => 'default')

// 页面加载前
onMounted(() => {})
</script>

<template>
  <div class="vwh-100">
    <component :is="LayoutComponents[layout]" />
  </div>
</template>
<style lang="scss"></style>
