<script lang="ts" setup>
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { XhtPdfPreviewProps } from '@/components/xht-file-preview/xht-pdf-preview/types'
import { RefreshLeft, ZoomIn, ZoomOut } from '@element-plus/icons-vue'

/**
 * PDF 预览：基于 pdf.js 逐页渲染到 canvas，支持翻页与缩放
 */
defineOptions({ name: 'XhtPdfPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtPdfPreviewProps>(), {})

// Worker 以独立资源引入，由 Vite 处理打包与 URL 解析
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

/**
 * pdf.js 版本号，用于拼接 CDN 的 cMap / 标准字体资源地址（中日韩等非拉丁文档渲染需要）
 */
const PDFJS_VERSION = pdfjsLib.version

/**
 * 缩放范围限制
 */
const MIN_SCALE = 0.5
const MAX_SCALE = 3
const DEFAULT_SCALE = 1.2

const state = reactive({
  loadingStatus: true, // 加载状态
  total: 0, // 总页数
  current: 1, // 当前页码
  scale: DEFAULT_SCALE, // 缩放比例
})
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
let loadingTask: PDFDocumentLoadingTask | null = null
let pdfDoc: PDFDocumentProxy | null = null
let renderTask: RenderTask | null = null

/**
 * 释放当前文档（销毁 loadingTask 会同时结束其上的所有渲染任务）
 */
const destroyDocument = async () => {
  try {
    renderTask?.cancel()
  } catch {
    // 渲染已结束，忽略
  }
  renderTask = null
  pdfDoc = null
  try {
    await loadingTask?.destroy()
  } catch (error) {
    console.error('PDF文档销毁失败:', error)
  }
  loadingTask = null
}

/**
 * 加载 PDF 文档
 */
const loadDocument = async () => {
  state.loadingStatus = true
  try {
    await destroyDocument()
    loadingTask = pdfjsLib.getDocument({
      url: props.url,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
    })
    pdfDoc = await loadingTask.promise
    state.total = pdfDoc.numPages
    state.current = 1
    state.scale = DEFAULT_SCALE
    await nextTick()
    await renderPage()
  } catch (error) {
    // 文档加载失败（如 blob 已释放、格式损坏）：不弹全局提示，由父级降级展示
    console.error('PDF文档加载失败:', error)
    pdfDoc = null
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 渲染当前页
 */
const renderPage = async () => {
  const canvas = canvasRef.value
  if (!pdfDoc || !canvas) return
  try {
    renderTask?.cancel()
  } catch {
    // 上一次渲染已结束或已取消，忽略
  }
  const page = await pdfDoc.getPage(state.current)
  const viewport = page.getViewport({ scale: state.scale })
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const task = page.render({ canvas, viewport })
  renderTask = task
  try {
    await task.promise
  } catch {
    // 渲染被取消（切页/缩放/销毁）属正常流程，静默忽略
  }
}

/**
 * 翻页
 *
 * @param offset 页码偏移量
 */
const handlePageChange = async (offset: number) => {
  const target = state.current + offset
  if (target < 1 || target > state.total) return
  state.current = target
  await renderPage()
}

/**
 * 缩放
 *
 * @param delta 缩放步长
 */
const handleZoom = async (delta: number) => {
  const target = Math.round((state.scale + delta) * 10) / 10
  if (target < MIN_SCALE || target > MAX_SCALE) return
  state.scale = target
  await renderPage()
}

/**
 * 重置缩放
 */
const handleResetZoom = async () => {
  state.scale = DEFAULT_SCALE
  await renderPage()
}

watch(
  () => props.url,
  (url) => {
    if (url) {
      loadDocument()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  destroyDocument()
})
</script>

<template>
  <div v-loading="state.loadingStatus" element-loading-text="拼命加载中" class="h-full flex flex-col">
    <template v-if="state.total > 0">
      <div class="flex-center gap-2 border-b border-[var(--el-border-color-lighter)] py-2">
        <el-button size="small" :disabled="state.current <= 1" @click="handlePageChange(-1)">上一页</el-button>
        <span class="min-w-14 select-none text-center text-sm">{{ state.current }} / {{ state.total }}</span>
        <el-button size="small" :disabled="state.current >= state.total" @click="handlePageChange(1)">下一页</el-button>
        <el-divider direction="vertical" />
        <el-button size="small" :icon="ZoomOut" :disabled="state.scale <= MIN_SCALE" @click="handleZoom(-0.1)" />
        <span class="min-w-14 select-none text-center text-sm">{{ Math.round(state.scale * 100) }}%</span>
        <el-button size="small" :icon="ZoomIn" :disabled="state.scale >= MAX_SCALE" @click="handleZoom(0.1)" />
        <el-button size="small" :icon="RefreshLeft" @click="handleResetZoom">重置</el-button>
      </div>
      <div class="flex-1 overflow-auto bg-[var(--el-fill-color-darker)] p-3">
        <canvas ref="canvasRef" class="m-0-auto block max-w-full shadow-[var(--el-box-shadow-light)]" />
      </div>
    </template>
    <el-empty v-else-if="!state.loadingStatus" description="PDF文档加载失败，请下载后查看" />
  </div>
</template>
