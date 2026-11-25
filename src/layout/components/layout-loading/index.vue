<script setup lang="ts">
defineOptions({ name: 'LayoutLoading', inheritAttrs: false })
</script>

<template>
  <div
    v-loading="true"
    class="layout-loading"
    element-loading-text="首页正在加载中，请你稍等一下..."
    element-loading-background="var(--xht-bg-color)"
  />
</template>

<style lang="scss" scoped>
.layout-loading {
  width: 100vw;
  height: 100vh;
}
</style>
