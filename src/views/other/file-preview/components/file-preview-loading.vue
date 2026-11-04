<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'

/**
 * 文件预览初始化中占位
 *
 * 预览初始化接口同时承担文件存在性与访问权限校验，校验完成前不渲染预览器。
 */
defineOptions({ name: 'FilePreviewLoading' })
</script>

<template>
  <div class="file-preview-loading">
    <el-icon class="is-loading" :size="24">
      <Loading />
    </el-icon>
    <p>正在校验文件访问权限…</p>
  </div>
</template>

<style scoped lang="scss">
.file-preview-loading {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  text-align: center;
}
</style>
