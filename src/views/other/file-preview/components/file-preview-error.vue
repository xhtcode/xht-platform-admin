<script lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue'

/**
 * 文件预览初始化失败占位
 *
 * 具体失败原因由请求拦截器统一提示（文件不存在 / 无权访问 / 接口异常），
 * 这里只负责给出页面级反馈与重试入口。
 */
defineOptions({ name: 'FilePreviewError' })

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="file-preview-error">
    <el-icon :size="36" color="var(--el-color-danger)">
      <WarningFilled />
    </el-icon>
    <p class="file-preview-error__title">文件无法打开</p>
    <p class="file-preview-error__desc">文件可能已被删除，或当前账号没有该文件的访问权限。</p>
    <el-button class="file-preview-error__action" type="primary" plain @click="$emit('retry')">重新加载</el-button>
  </div>
</template>

<style scoped lang="scss">
.file-preview-error {
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

  &__title {
    color: var(--el-text-color-primary);
    font-size: 15px;
    font-weight: 600;
  }

  &__desc {
    max-width: 380px;
    line-height: 1.6;
  }

  &__action {
    margin-top: 6px;
  }
}
</style>
