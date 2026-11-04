<script lang="ts" setup>
import { previewTextFile } from '@/components/xht-file-preview/components/xht-txt-preview/api'
import type { XhtTxtPreviewProps } from '@/components/xht-file-preview/components/xht-txt-preview/types'

/**
 * 文本预览：拉取文件文本内容后按纯文本渲染，保留原始换行与缩进
 */
defineOptions({ name: 'XhtTxtPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtTxtPreviewProps>(), {})

const state = reactive({
  loadingStatus: true, // 加载状态
  errorStatus: false, // 读取失败状态
  text: '', // 文本内容
})

/**
 * 加载文本内容
 */
const loadFileInputStream = async () => {
  state.loadingStatus = true
  state.errorStatus = false
  try {
    state.text = (await previewTextFile(props.fileStorageKey)) ?? ''
  } catch (error) {
    // 失败提示由请求拦截器统一弹出，这里只回填页面状态
    console.error('文本文件读取失败:', error)
    state.text = ''
    state.errorStatus = true
  } finally {
    state.loadingStatus = false
  }
}

onMounted(() => {
  loadFileInputStream()
})
</script>

<template>
  <div v-loading="state.loadingStatus" class="xht-txt-preview" element-loading-text="正在加载文本内容">
    <pre v-if="state.text" class="xht-txt-preview__content">{{ state.text?.content }}</pre>
    <el-empty v-else-if="!state.loadingStatus" :description="state.errorStatus ? '文本读取失败，请下载后查看' : '文件内容为空'" />
  </div>
</template>

<style scoped lang="scss">
.xht-txt-preview {
  width: 100%;
  height: 100%;
  overflow: auto;

  &__content {
    min-height: 100%;
    margin: 0;
    color: var(--el-text-color-primary);
    font-family: Consolas, Monaco, 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
