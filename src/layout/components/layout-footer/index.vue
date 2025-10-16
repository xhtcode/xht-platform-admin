<template>
  <el-footer class="xht-footer-container">
    <div class="xht-footer-main">
      <div class="xht-footer-main-item flex-center">小糊涂后台管理系统</div>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
import variables from '@/styles/variables.module.scss'
defineOptions({
  name: 'LayoutFooter',
})
</script>

<style scoped lang="scss">
.xht-footer-container {
  height: auto;
  padding: 0;
  background-color: var(--el-bg-color-page);
  display: block;
  unicode-bidi: isolate;
  .xht-footer-main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $footer-height;
    padding: 0;
    overflow: hidden;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);

    .xht-footer-main-item {
      position: relative;
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
