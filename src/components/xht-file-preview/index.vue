<script setup lang="ts">
import type { XhtFilePreviewMode, XhtFilePreviewRenderMode } from '@/components/xht-file-preview/types.ts'

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
  image: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-image-preview/index.vue')),
  pdf: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-pdf-preview/index.vue')),
  text: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-text-preview/index.vue')),
  json: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-json-preview/index.vue')),
  audio: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-audio-preview/index.vue')),
  video: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-video-preview/index.vue')),
  other: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-other-preview/index.vue')),
}
/**
 * 当前模式对应的预览器
 *
 * 后端只会下发约定的 7 种模式；万一出现未知值，兜底为下载型预览器，避免整片空白。
 */
const previewComponent = computed<Component>(() => PreviewComponents[props.previewMode as XhtFilePreviewRenderMode] ?? PreviewComponents.other)
/**
 * 是否为下载型预览器（other，或未知模式兜底到 other）
 */
const isDownloadMode = computed(() => props.previewMode === 'other' || !(props.previewMode in PreviewComponents))
/**
 * 文件预览地址
 *
 * 网关直连地址，由浏览器原生容器（img/video/audio）直接加载，鉴权依赖同源 Cookie；
 * 存储key中可能含 `/`、`+` 等字符，必须编码后再拼接查询串，否则会被截断或转义成空格。
 */
const previewUrl = computed(() => {
  return `${import.meta.env.VITE_ADMIN_API_PREFIX}/sys/files/preview?fileStorageKey=${encodeURIComponent(props.fileStorageKey)}`
})
/**
 * 预览器地址
 *
 * 下载型预览器不加载文件内容，无需预览地址（传 undefined 不会渲染为属性）。
 */
const previewerUrl = computed(() => (isDownloadMode.value ? undefined : previewUrl.value))
</script>

<template>
  <div class="xht-file-preview wh-full overflow-hidden">
    <component
      :is="previewComponent"
      :file-name="props.fileName || props.fileStorageKey"
      :file-storage-key="props.fileStorageKey"
      :url="previewerUrl"
    />
  </div>
</template>

<style scoped lang="scss">
.xht-file-preview {
  background-color: var(--xht-bg-color);
  border: 1px solid var(--xht-border-color);
  border-radius: 6px;
  box-shadow: 0 0 12px var(--xht-shadow-color-lightest);
}
</style>
