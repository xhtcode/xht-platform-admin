<script lang="ts" setup>
import { previewSysFile } from '@/service/api/system/file.api'
import type { SysFileResponse } from '@/service/model/system/file.model'
import type { FilePreviewMode } from '@/views/system/file/file.utils'
import { handleDownloadSysFile, parseFileErrorResponse, resolvePreviewMode } from '@/views/system/file/file.utils'
import { useMessage } from '@/hooks/use-message'
import { Download } from '@element-plus/icons-vue'

defineOptions({ name: 'SysFilePreview' })

const state = reactive({
  visibleStatus: false, // 弹窗可见状态
  loadingStatus: false, // 加载状态
  fileInfo: {} as SysFileResponse, // 文件信息
  previewMode: 'other' as FilePreviewMode, // 预览模式
  previewUrl: '', // 预览地址（blob）
})

/**
 * 打开显示
 *
 * @param row 文件列表行数据
 */
const show = async (row: SysFileResponse) => {
  state.fileInfo = row
  state.previewMode = resolvePreviewMode(row.fileType, row.fileSuffix)
  state.visibleStatus = true
  if (state.previewMode === 'other') {
    return
  }
  await loadPreviewUrl()
}

/**
 * 加载预览数据
 */
const loadPreviewUrl = async () => {
  state.loadingStatus = true
  revokePreviewUrl()
  try {
    const response = await previewSysFile(state.fileInfo.fileStorageKey)
    const errorMsg = await parseFileErrorResponse(response)
    if (errorMsg) {
      useMessage().error(errorMsg)
      return
    }
    const contentType: string = (response.headers['content-type'] as string) || state.fileInfo.fileType || 'application/octet-stream'
    // 文本类型统一以 text/plain 渲染 blob，避免浏览器按原类型处理导致直接下载
    const blobType = state.previewMode === 'text' ? 'text/plain;charset=utf-8' : contentType
    state.previewUrl = window.URL.createObjectURL(new Blob([response.data], { type: blobType }))
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 释放预览地址
 */
const revokePreviewUrl = () => {
  if (state.previewUrl) {
    window.URL.revokeObjectURL(state.previewUrl)
    state.previewUrl = ''
  }
}

/**
 * 下载文件
 */
const handleDownload = async () => {
  state.loadingStatus = true
  try {
    const successStatus = await handleDownloadSysFile(state.fileInfo.fileStorageKey)
    if (successStatus) {
      useMessage().success('文件下载成功!')
    }
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  revokePreviewUrl()
  state.fileInfo = {} as SysFileResponse
  state.previewMode = 'other'
  state.visibleStatus = false
}

onBeforeUnmount(() => {
  revokePreviewUrl()
})

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    :title="state.fileInfo.fileOriginalName || '文件预览'"
    width="70%"
    top="6vh"
    append-to-body
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="close"
  >
    <div v-loading="state.loadingStatus" element-loading-text="拼命加载中" class="preview-body">
      <template v-if="state.previewUrl">
        <el-image
          v-if="state.previewMode === 'image'"
          :src="state.previewUrl"
          :preview-src-list="[state.previewUrl]"
          class="preview-image"
          fit="contain"
          hide-on-click-modal
          preview-teleported
        />
        <iframe v-else-if="state.previewMode === 'pdf' || state.previewMode === 'text'" :src="state.previewUrl" class="preview-frame" />
        <video v-else-if="state.previewMode === 'video'" :src="state.previewUrl" class="preview-media" controls />
        <audio v-else-if="state.previewMode === 'audio'" :src="state.previewUrl" class="preview-audio" controls />
      </template>
      <el-empty
        v-else-if="!state.loadingStatus"
        :description="state.previewMode === 'other' ? '该文件类型暂不支持在线预览，请下载后查看' : '文件预览加载失败，请下载后查看'"
      >
        <el-button :icon="Download" type="primary" @click="handleDownload">下载文件</el-button>
      </el-empty>
    </div>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">关闭</el-button>
      <el-button :disabled="state.loadingStatus" :icon="Download" type="primary" @click="handleDownload">下载</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72vh;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-media {
  max-width: 100%;
  max-height: 100%;
}

.preview-audio {
  width: 60%;
}
</style>
