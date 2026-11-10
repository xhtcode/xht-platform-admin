<script lang="ts" setup>
import type { XhtTextPreviewProps } from '@/components/xht-file-preview/components/xht-text-preview/types'
import { FILE_PREVIEW_REFRESH_KEY } from '@/components/xht-file-preview/types'
import { querySysFileTextPreview } from '@/service/api/system/file.api'
import { isPreviewSessionExpired } from '@/utils/file-preview'

/**
 * 文本预览：进入后从第一页开始连续拉取，拼成完整内容后渲染
 *
 * 后端按字节分页，`offset` 为下一页游标；单次最多读取 10 页，
 * 滚动到底部自动加载下一批，避免超大文件一次拉取过多请求与内存。
 */
defineOptions({ name: 'XhtTextPreview', inheritAttrs: false })

const props = withDefaults(defineProps<XhtTextPreviewProps>(), {})

/**
 * 会话重建能力（预览会话 TTL 到期后由宿主组件重新 init）
 */
const refreshSession = inject(FILE_PREVIEW_REFRESH_KEY, null)

/**
 * 单批最多读取的页数
 *
 * 只约束「一次触发的连续请求数」，不是整份文件的请求总量：
 * 一批读完若内容仍不足一屏，底部哨兵会继续触发下一批，直到撑满视口或读完全文。
 */
const MAX_PAGES_PER_BATCH = 1

/**
 * 每个渲染块的行数
 *
 * 分块后配合 content-visibility，浏览器只排版视口附近的块，
 * 几十万行的文件也不会在滚动时整段重排。
 */
const CHUNK_LINES = 200

/**
 * 单个渲染块的字符兜底上限
 *
 * 换行极少的文件（压缩后的 JSON、单行日志）按行数是攒不满一块的：
 * 整份文件读完之前一个块都产不出来，预览区一直空白，底部哨兵始终可见，
 * 于是无论单批读多少页都会被续读拖到文件末尾。这里按字符兜底切块。
 */
const CHUNK_CHARS = 8 * 1024

const sentinelRef = ref<HTMLElement>()

const state = reactive({
  loadingStatus: false, // 加载状态（单次批次读完才结束）
  errorMessage: '', // 读取失败信息（空串表示无错误）
  chunks: [] as string[], // 已加载文本（按行切块，逐块渲染）
  hasMore: false, // 是否还有未加载内容
})

let pending = '' // 尚未凑满一块的尾部文本（跨批次保留）
let cursor: number | undefined // 下一页游标（上一页响应原样回传）
let charset: string | undefined // 服务端探测的编码，首屏之后回传
let controller: AbortController | null = null
let requestSeq = 0 // 请求序号，用于丢弃被新任务取代的响应（切文件 / 重试）

/**
 * 把新文本按行切块追加到已加载内容
 *
 * 只 push 新块，已有块不重建，避免每批内容都让整段文本重新排版。
 */
const appendText = (text: string) => {
  const lines = (pending + text).split('\n')
  pending = lines.pop() ?? ''
  for (let i = 0; i < lines.length; i += CHUNK_LINES) {
    state.chunks.push(lines.slice(i, i + CHUNK_LINES).join('\n'))
  }
  // 尾部超长单行：攒够一块字符就先落块，保证边读边显示（切分点落在行内，pre-wrap 下视觉连续）
  let offset = 0
  while (pending.length - offset >= CHUNK_CHARS) {
    state.chunks.push(pending.slice(offset, offset + CHUNK_CHARS))
    offset += CHUNK_CHARS
  }
  if (offset > 0) {
    pending = pending.slice(offset)
  }
}

/**
 * 收尾：把最后一段不足一块的文本补成一块（读到文件末尾时调用）
 */
const flushPending = () => {
  if (!pending) return
  state.chunks.push(pending)
  pending = ''
}

/**
 * 连续读取一批分页内容
 *
 * 一批内容先在局部变量里拼接，读完再一次性写入响应式状态：
 * 大文件逐页写入 `<pre>` 会反复触发整段重排，按页更新会越来越卡。
 *
 * @param options.reset 是否从头开始（切文件时清空上一次的内容）
 */
const loadBatch = async (options: { reset?: boolean } = {}) => {
  // 同一时刻只保留一个在途任务：滚动续读 / 重试直接忽略，切文件则打断当前任务
  if (state.loadingStatus && !options.reset) return

  controller?.abort()
  const currentController = new AbortController()
  controller = currentController
  const seq = ++requestSeq

  if (options.reset) {
    cursor = undefined
    charset = undefined
    pending = ''
    state.chunks = []
    state.hasMore = false
  }
  state.loadingStatus = true
  state.errorMessage = ''
  // 本批已拼接的内容：失败时也要落到 chunks，重试才能从当前游标接着读
  let text = ''
  try {
    let loadedPages = 0
    let hasMore = true
    while (hasMore && loadedPages < MAX_PAGES_PER_BATCH) {
      const page = await querySysFileTextPreview(props.previewId, {
        offset: cursor,
        charset,
        signal: currentController.signal,
      })
      // 已被切文件 / 重试取代：丢弃本次结果
      if (seq !== requestSeq) return
      charset = page.charset
      cursor = page.offset
      hasMore = page.hasMore
      text += page.content
      loadedPages += 1
    }
    appendText(text)
    if (!hasMore) {
      flushPending()
    }
    state.hasMore = hasMore
  } catch (error) {
    // 被新任务取代或主动中断：不覆盖当前状态
    if (seq !== requestSeq) return
    appendText(text)
    // 会话过期：交宿主重建会话，重建后 previewId 变化会触发本组件整体重载
    if (isPreviewSessionExpired(error)) {
      await refreshSession?.()
      return
    }
    console.error('文本文件读取失败:', error)
    state.errorMessage = (error as Error).message
  } finally {
    if (seq === requestSeq) {
      state.loadingStatus = false
      refreshSentinel()
    }
  }
}

/**
 * 底部哨兵进入视口时加载下一批
 *
 * 不监听具体元素的 scroll：预览可能由组件自身滚动，也可能由外层容器滚动，
 * 用 IntersectionObserver 观察视口更稳妥，同时兼容内容不足一屏的情况。
 */
let observer: IntersectionObserver | null = null

const observeSentinel = () => {
  observer?.disconnect()
  const el = sentinelRef.value
  if (!el) return
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      if (state.loadingStatus || !state.hasMore || state.errorMessage) return
      loadBatch()
    },
    { rootMargin: '200px 0px' }
  )
  observer.observe(el)
}

/**
 * 重新观察哨兵：每批内容渲染后重新触发一次相交计算，
 * 内容仍不足一屏时会继续加载，直到撑满视口或读完
 */
const refreshSentinel = async () => {
  await nextTick()
  const el = sentinelRef.value
  if (!el || !observer) return
  observer.unobserve(el)
  observer.observe(el)
}

/**
 * 失败重试：从当前游标继续，已加载内容保留
 */
const handleRetry = () => {
  loadBatch()
}

watch(
  () => props.previewId,
  () => loadBatch({ reset: true }),
  { immediate: true }
)

onMounted(() => {
  observeSentinel()
})

onBeforeUnmount(() => {
  // 递增序号让在途响应失效，避免卸载后仍写入状态
  requestSeq++
  controller?.abort()
  observer?.disconnect()
})
</script>

<template>
  <div v-loading="state.loadingStatus && !state.chunks.length" class="xht-text-preview" element-loading-text="正在加载文本内容">
    <div v-for="(chunk, index) in state.chunks" :key="index" class="xht-text-preview-chunk">{{ chunk }}</div>
    <div v-if="state.errorMessage" class="xht-text-preview-hint is-error" @click="handleRetry">
      加载失败{{ state.errorMessage ? `：${state.errorMessage}` : '' }}（点击重试）
    </div>
    <div v-else-if="state.loadingStatus && state.chunks.length" class="xht-text-preview-hint">正在加载…</div>
    <el-empty v-else-if="!state.loadingStatus && !state.chunks.length" description="文件内容为空" />
    <!-- 底部哨兵：进入视口即加载下一批 -->
    <div ref="sentinelRef" class="xht-text-preview-sentinel" aria-hidden="true" />
  </div>
</template>

<style scoped lang="scss">
.xht-text-preview {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px 16px;
  overflow: auto;
  color: var(--el-text-color-primary);
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 16px;
  line-height: 1.7;
  border-radius: 6px;
}

/* 分块渲染：视口外的块跳过排版，超大文本滚动时不会整段重排；
   200 行 × 1.7 × 16px ≈ 5440px，仅作为未渲染块的占位估算 */
.xht-text-preview-chunk {
  white-space: pre-wrap;
  word-break: break-word;
}

/* 不支持 content-visibility 的浏览器退化为普通渲染，不影响正确性 */
@supports (content-visibility: auto) {
  .xht-text-preview-chunk {
    content-visibility: auto;
    contain-intrinsic-size: auto 5440px;
  }
}

.xht-text-preview-hint {
  padding: 10px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  text-align: center;
}

.xht-text-preview-hint.is-error {
  color: var(--el-color-warning);
  cursor: pointer;
}

.xht-text-preview-sentinel {
  height: 1px;
}
</style>
