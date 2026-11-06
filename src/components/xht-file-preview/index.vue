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
  image: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-picture-preview/index.vue')),
  pdf: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-pdf-preview/index.vue')),
  text: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-text-preview/index.vue')),
  json: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-json-preview/index.vue')),
  other: defineAsyncComponent(() => import('@/components/xht-file-preview/components/xht-other-preview/index.vue')),
}
/**
 * 当前模式对应的预览器（音视频走原生标签，不需要预览器）
 */
const previewComponent = computed<Component | null>(() => PreviewComponents[props.previewMode as XhtFilePreviewRenderMode] ?? null)
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
 * 下载型预览器（other）不加载文件内容，无需预览地址（传 undefined 不会渲染为属性）。
 */
const previewerUrl = computed(() => (props.previewMode === 'other' ? undefined : previewUrl.value))
</script>

<template>
  <div class="xht-file-preview wh-full overflow-hidden">
    <component
      :is="previewComponent"
      v-if="previewComponent"
      :file-name="props.fileName || props.fileStorageKey"
      :file-storage-key="props.fileStorageKey"
      :url="previewerUrl"
    />
    <!-- 音视频交给浏览器原生容器解码播放：不引入预览器，也不额外占用包体 -->
    <div v-else-if="props.previewMode === 'video'" class="wh-full flex-center">
      <video class="xht-file-preview__video" :src="previewUrl" controls playsinline preload="metadata" />
    </div>
    <div v-else-if="props.previewMode === 'audio'" class="wh-full flex-center">
      <audio class="xht-file-preview__audio" :src="previewUrl" controls preload="metadata" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.xht-file-preview {
  background-color: var(--xht-bg-color);
}

.xht-file-preview__video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.xht-file-preview__audio {
  width: 100%;
  max-width: 640px;
}
</style>
