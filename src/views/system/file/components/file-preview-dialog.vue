<script lang="ts" setup>
import type { SysFileResponse } from '@/service/model/system/file.model'
import { handleDownloadSysFile } from '@/utils/file'
import { useMessage } from '@/hooks/use-message'
import { Download } from '@element-plus/icons-vue'

/**
 * 文件预览弹窗
 *
 * 承载除 PDF、JSON 之外的预览类型（图片 / 音频 / 视频 / 文本等）：
 * 后两者需要整页空间（PDF 工具栏与侧栏、JSON 树），仍走独立预览页 `FilePreviewViewIndex`。
 */
defineOptions({ name: 'SysFilePreviewDialog' })

const message = useMessage()

const state = reactive({
  visibleStatus: false, // 弹窗可见状态
  downloadingStatus: false, // 下载状态
  file: null as SysFileResponse | null, // 当前预览文件
})

/**
 * 打开显示
 *
 * @param row 文件列表行数据
 */
const show = (row: SysFileResponse) => {
  state.file = row
  state.visibleStatus = true
}

/**
 * 下载当前文件
 */
const handleDownload = async () => {
  if (!state.file || state.downloadingStatus) return
  state.downloadingStatus = true
  try {
    const successStatus = await handleDownloadSysFile(state.file.fileStorageKey)
    if (successStatus) {
      message.success('文件下载成功!')
    }
  } finally {
    state.downloadingStatus = false
  }
}

/**
 * 关闭动画结束后清空文件：触发预览组件卸载并回收 blob 地址，避免下次打开残留上一次内容
 */
const handleClosed = () => {
  state.file = null
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog v-model="state.visibleStatus" append-to-body class="xht-dialog" destroy-on-close :close-on-click-modal="false" @closed="handleClosed">
    <template #header>
      <el-text size="large">
        {{ state.file?.fileOriginalName || '文件预览' }}
      </el-text>
      <el-text size="small" class="ml-5!">{{ state?.file?.fileSizeInfo }}</el-text>
    </template>
    <div class="h-full">
      <xht-file-preview v-if="state.file" :file="state.file" />
    </div>
    <template #footer>
      <el-button :disabled="state.downloadingStatus" @click="state.visibleStatus = false">关闭</el-button>
      <el-button :disabled="state.downloadingStatus" :icon="Download" type="primary" @click="handleDownload">下载</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.file-preview-dialog {
}
</style>
