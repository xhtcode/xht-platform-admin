<script setup lang="ts">
import { XhtFilePreviewMode, XhtFilePreviewRenderMode, XhtFilePreviewState } from '@/components/xht-file-preview/types.ts'
defineOptions({ name: 'XhtFilePreview' })

const props = withDefaults(
  defineProps<{
    fileStorageKey: string // 文件存储key（预览/下载接口使用）
    previewMode: XhtFilePreviewMode // 预览模式
  }>(),
  {}
)
/**
 * 预览器映射
 *
 * 全部动态导入：不进主包，只有真正预览对应类型时才加载（pdf.js 尤其重）。
 * 每个预览器一个目录、入口统一为 `index.vue`（与 `xht-pdf-preview` 一致）。
 */
const PreviewComponents: Record<XhtFilePreviewRenderMode, Component> = {
  image: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-picture-preview/index.vue')),
  pdf: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-pdf-preview/index.vue')),
  text: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-txt-preview/index.vue')),
  json: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-json-preview/index.vue')),
}
/**
 * 当前模式对应的预览器（音视频走原生标签，不需要预览器）
 */
const previewComponent = computed<Component | null>(() => PreviewComponents[props.previewMode as XhtFilePreviewRenderMode] ?? null)
</script>

<template>
  <div class="wh-full">
    <component
      :is="previewComponent"
      :file-name="props.fileStorageKey"
      :file-storage-key="props.fileStorageKey"
      :url="`/api/admin/sys/files/preview?fileStorageKey=${props.fileStorageKey}`"
    />
  </div>
</template>

<style scoped lang="scss"></style>
