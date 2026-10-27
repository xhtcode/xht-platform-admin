<script lang="ts" setup>
import { previewSysFile } from '@/service/api/system/file.api'
import type { XhtFilePreviewFile, XhtFilePreviewMode } from '@/components/xht-file-preview/types'
import { resolvePreviewMode } from '@/components/xht-file-preview/utils'
import { handleDownloadSysFile, parseFileErrorResponse } from '@/utils/file'
import { useMessage } from '@/hooks/use-message'
import { Download } from '@element-plus/icons-vue'

/**
 * 文件预览：按文件类型分发到图片 / PDF / 文本 / JSON / 音视频预览
 */
defineOptions({ name: 'XhtFilePreview', inheritAttrs: true })

// PDF 预览依赖 pdf.js，体量较大，按需加载
const XhtPdfPreview = defineAsyncComponent(() => import('@/components/xht-file-preview/xht-pdf-preview/index.vue'))

const state = reactive({
  visibleStatus: false, // 弹窗可见状态
  loadingStatus: false, // 加载状态
  fileInfo: {} as XhtFilePreviewFile, // 文件信息
  previewMode: 'other' as XhtFilePreviewMode, // 预览模式
  previewUrl: '', // 预览地址（blob）
})

/**
 * 打开显示
 *
 * @param file 文件信息（业务行数据结构兼容即可）
 */
const show = async (file: XhtFilePreviewFile) => {
  state.fileInfo = file
  state.previewMode = resolvePreviewMode(file.fileType, file.fileSuffix)
  state.visibleStatus = true
  if (state.previewMode === 'other') {
    return
  }
  try {
    await loadPreviewUrl()
  } catch (error) {
    // 失败提示已由请求拦截器给出，此处只记录日志并复位状态
    console.error('文件预览加载失败:', error)
  }
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
    // 文本、JSON 统一以 text/plain 渲染 blob，避免浏览器按原类型处理导致直接下载
    const isPlainText = state.previewMode === 'text' || state.previewMode === 'json'
    const blobType = isPlainText ? 'text/plain;charset=utf-8' : contentType
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
  state.fileInfo = {} as XhtFilePreviewFile
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
    <div v-loading="state.loadingStatus" element-loading-text="拼命加载中" class="h-[72vh] flex-center">
      <template v-if="state.previewUrl">
        <xht-picture-preview v-if="state.previewMode === 'image'" :url="state.previewUrl" />
        <XhtPdfPreview v-else-if="state.previewMode === 'pdf'" :url="state.previewUrl" />
        <xht-txt-preview v-else-if="state.previewMode === 'text'" :url="state.previewUrl" />
        <xht-json-preview v-else-if="state.previewMode === 'json'" :url="state.previewUrl" />
        <video v-else-if="state.previewMode === 'video'" :src="state.previewUrl" class="max-h-full max-w-full" controls />
        <audio v-else-if="state.previewMode === 'audio'" :src="state.previewUrl" class="w-[60%]" controls />
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
