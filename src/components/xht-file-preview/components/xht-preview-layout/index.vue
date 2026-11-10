<script setup lang="ts">
import type { XhtPreviewLayoutProps } from '@/components/xht-file-preview/components/xht-preview-layout/types.ts'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'

defineOptions({
  name: 'XhtPreviewLayout',
})
withDefaults(defineProps<XhtPreviewLayoutProps>(), {})
</script>

<template>
  <el-container class="xht-file-preview-page">
    <el-header class="xht-file-preview-page-header">
      <el-space class="user-select-none">
        <el-text size="default" tag="b">{{ fileName || '文件预览' }}</el-text>
        <el-text size="small" type="info">{{ fileSuffix || '未知类型' }} · {{ fileSizeInfo || '未知大小' }}</el-text>
      </el-space>
      <div class="xht-file-preview-header-tools user-select-none">
        <slot name="tools" />
        <switch-dark class="xht-file-preview-header-tools-item" />
        <page-full-screen class="xht-file-preview-header-tools-item" />
      </div>
    </el-header>
    <el-main class="xht-file-preview-page-main">
      <slot v-if="fileStorageKey" :response="previewInit" />
      <el-result v-else icon="warning" title="文件地址无效" sub-title="缺少文件标识，请从文件列表重新打开预览" />
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.xht-file-preview-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--xht-main-bg-color);
  .xht-file-preview-page-header {
    height: 40px !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-light);
    background-color: var(--xht-header-bg-color);
    .xht-file-preview-header-text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
    }
    .xht-file-preview-header-tools {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      :deep(.xht-file-preview-header-tools-item) {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 6px;
        transition:
          color 0.2s,
          background-color 0.2s;
        &:hover {
          color: var(--el-color-primary);
          background-color: var(--xht-hover-bg-color);
        }
      }
    }
  }
  .xht-file-preview-page-main {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 0 !important;
  }
}
</style>
