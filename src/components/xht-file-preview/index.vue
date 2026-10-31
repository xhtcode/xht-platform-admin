<script lang="ts" setup>
import { previewSysFile, getSysFilePreviewUrl } from '@/service/api/system/file.api'
import type { XhtFilePreviewProps, XhtFilePreviewRenderMode, XhtFilePreviewState } from '@/components/xht-file-preview/types'
import { resolvePreviewMode } from '@/components/xht-file-preview/utils'
import { handleDownloadSysFile } from '@/utils/file'
import { useMessage } from '@/hooks/use-message'
import { HEADER_AUTHORIZATION } from '@/service/constant'
import { useUserInfoStore } from '@/store/modules/user.store'
import { Download } from '@element-plus/icons-vue'

/**
 * 文件预览内容区：按文件类型分发到图片 / PDF / 文本 / JSON / 音视频预览
 *
 * 不含弹窗，弹窗由调用方承载；本组件只按 file 加载预览数据并渲染内容。
 */
defineOptions({ name: 'XhtFilePreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtFilePreviewProps>(), { file: null })

/**
 * 预览器映射
 *
 * 全部动态导入：不进主包，只有真正预览对应类型时才加载（pdf.js 尤其重）。
 */
const PreviewComponents: Record<XhtFilePreviewRenderMode, Component> = {
  image: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-picture-preview.vue')),
  pdf: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-pdf-preview/index.vue')),
  text: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-txt-preview.vue')),
  json: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-json-preview.vue')),
}

const message = useMessage()
const userStore = useUserInfoStore()

const state = reactive<XhtFilePreviewState>({
  loadingStatus: false, // 加载状态
  previewMode: 'other', // 预览模式
  previewUrl: '', // 预览地址（blob 地址；PDF 为后端直连地址）
  previewHeaders: {}, // PDF 直连地址的请求头（鉴权）
})

// 请求序号：file 快速切换时用于丢弃过期响应
const loadToken = ref(0)

/**
 * 当前模式对应的预览器（音视频走原生标签，不需要预览器）
 */
const previewComponent = computed<Component | null>(() => PreviewComponents[state.previewMode as XhtFilePreviewRenderMode] ?? null)

/**
 * 释放预览地址（仅 blob 地址需要回收，后端直连地址直接置空）
 */
const revokePreviewUrl = () => {
  if (state.previewUrl) {
    if (state.previewUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(state.previewUrl)
    }
    state.previewUrl = ''
  }
  state.previewHeaders = {}
}

/**
 * 加载预览数据
 */
const loadPreview = async () => {
  const token = ++loadToken.value
  const file = props.file
  revokePreviewUrl()
  state.previewMode = file ? resolvePreviewMode(file.fileType, file.fileSuffix) : 'other'
  if (!file || state.previewMode === 'other') {
    state.loadingStatus = false
    return
  }
  // PDF 交给 pdf.js 自带的分段加载：直连后端预览地址 + 鉴权头，服务端支持 Range 时按需拉取
  if (state.previewMode === 'pdf') {
    state.previewHeaders = { [HEADER_AUTHORIZATION]: `Bearer ${userStore.getAccessToken}` }
    state.previewUrl = getSysFilePreviewUrl(file.fileStorageKey)
    state.loadingStatus = false
    return
  }
  state.loadingStatus = true
  try {
    const response = await previewSysFile(file.fileStorageKey)
    if (token !== loadToken.value) return
    const contentType: string = (response.headers['content-type'] as string) || file.fileType || 'application/octet-stream'
    // 文本、JSON 统一以 text/plain 渲染 blob，避免浏览器按原类型处理导致直接下载
    const isPlainText = state.previewMode === 'text' || state.previewMode === 'json'
    const blobType = isPlainText ? 'text/plain;charset=utf-8' : contentType
    state.previewUrl = window.URL.createObjectURL(new Blob([response.data], { type: blobType }))
  } catch (error) {
    // 失败提示已由请求拦截器给出，此处只记录日志并保留加载失败空态
    console.error('文件预览加载失败:', error)
  } finally {
    if (token === loadToken.value) {
      state.loadingStatus = false
    }
  }
}

/**
 * 下载文件（不支持在线预览或加载失败时的兜底入口）
 */
const handleDownload = async () => {
  if (!props.file) return
  state.loadingStatus = true
  try {
    const successStatus = await handleDownloadSysFile(props.file.fileStorageKey)
    if (successStatus) {
      message.success('文件下载成功!')
    }
  } finally {
    state.loadingStatus = false
  }
}

watch(() => props.file, loadPreview, { immediate: true })

onBeforeUnmount(() => {
  loadToken.value++
  revokePreviewUrl()
})
</script>

<template>
  <div v-if="props.file" v-loading="state.loadingStatus" element-loading-text="拼命加载中" class="h-full">
    <template v-if="state.previewUrl">
      <video v-if="state.previewMode === 'video'" :src="state.previewUrl" class="max-h-full max-w-full" controls />
      <audio v-else-if="state.previewMode === 'audio'" :src="state.previewUrl" class="w-[60%]" controls />
      <component
        :is="previewComponent"
        v-else
        :file-name="state.previewMode === 'pdf' ? props.file?.fileOriginalName : undefined"
        :file-storage-key="state.previewMode === 'pdf' ? props.file?.fileStorageKey : undefined"
        :http-headers="state.previewMode === 'pdf' ? state.previewHeaders : undefined"
        :url="state.previewUrl"
      />
    </template>
    <el-empty
      v-else-if="!state.loadingStatus"
      :description="state.previewMode === 'other' ? '该文件类型暂不支持在线预览，请下载后查看' : '文件预览加载失败，请下载后查看'"
    >
      <el-button :icon="Download" type="primary" @click="handleDownload">下载文件</el-button>
    </el-empty>
  </div>
</template>
