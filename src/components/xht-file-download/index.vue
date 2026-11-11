<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import type { XhtFileDownloadProps } from '@/components/xht-file-download/types.ts'
import { handleDownloadPreviewFile } from '@/utils/file.ts'
import { useMessage } from '@/hooks/use-message.ts'

defineOptions({ name: 'XhtFileDownload' })
const props = withDefaults(defineProps<XhtFileDownloadProps>(), {})

/**
 * 下载文件
 */
const handleDownload = () => {
  if (!props.fileStorageKey) {
    useMessage().error('组件错误：fileStorageKey 不能为空')
  }
  handleDownloadPreviewFile(props.fileStorageKey).catch((_) => {
    useMessage().error('文件下载失败')
  })
}
</script>

<template>
  <div @click="handleDownload">
    <el-icon :size="18">
      <download />
    </el-icon>
  </div>
</template>

<style scoped lang="scss"></style>
