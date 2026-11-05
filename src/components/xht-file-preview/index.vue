<script setup lang="ts">
import { XhtFilePreviewMode, XhtFilePreviewRenderMode } from '@/components/xht-file-preview/types.ts'
defineOptions({ name: 'XhtFilePreview' })

const props = withDefaults(
  defineProps<{
    fileStorageKey: string // 文件存储key（预览/下载接口使用）
    previewMode: XhtFilePreviewMode // 预览模式
    fileName?: string // 文件显示名称（PDF 工具栏等位置展示，缺省回退为存储key）
  }>(),
  { fileName: '' }
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
  text: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-text-preview/index.vue')),
  json: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-json-preview/index.vue')),
}
/**
 * 当前模式对应的预览器（音视频走原生标签，不需要预览器）
 */
const previewComponent = computed<Component | null>(() => PreviewComponents[props.previewMode as XhtFilePreviewRenderMode] ?? null)
</script>

<template>
  <div class="wh-full overflow-hidden" style="background: var(--xht-bg-color)">
    <component
      :is="previewComponent"
      v-if="previewComponent"
      :file-name="props.fileName || props.fileStorageKey"
      :file-storage-key="props.fileStorageKey"
      :url="`/api/admin/sys/files/preview?fileStorageKey=${props.fileStorageKey}`"
    />
    <!-- 音视频等没有内联预览器的类型：给出兜底提示，避免整片空白 -->
    <div v-else class="wh-full flex-center">
      <el-empty description="该文件类型暂不支持在线预览，请下载后查看" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
