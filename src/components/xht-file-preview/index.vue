<script setup lang="ts">
import { Download, Share } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/use-message'
import { initSysFilePreview, querySysFilePreviewStatus, toSysFileAbsoluteUrl } from '@/service/api/system/file.api'
import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model'
import type { XhtFilePreviewMode, XhtFilePreviewRenderMode } from '@/components/xht-file-preview/types.ts'
import { FILE_PREVIEW_REFRESH_KEY } from '@/components/xht-file-preview/types.ts'
import { handleDownloadPreviewFile } from '@/utils/file'
import { PreviewApiError } from '@/utils/file-preview'

defineOptions({ name: 'XhtFilePreview' })

const props = withDefaults(
  defineProps<{
    fileId?: string // 文件ID（与 fileStorageKey 二选一，优先 fileId）
    fileStorageKey?: string // 文件存储Key（兼容老数据）
    shareTicket?: string // 分享访问票据（存在时按分享权限执行）
    fileName?: string // 文件显示名称（缺省取服务端返回的文件名）
    showHeader?: boolean // 是否展示内置顶栏（文件名 + 下载/分享操作）
  }>(),
  { fileId: '', fileStorageKey: '', shareTicket: '', fileName: '', showHeader: true }
)

const emit = defineEmits<{
  ready: [session: SysFilePreviewInitResponse] // 会话就绪 / 转换完成，父级可据此展示额外操作
  share: [session: SysFilePreviewInitResponse] // 请求分享，父级弹出创建分享弹窗
}>()

const message = useMessage()

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
 * 轮询上限：90 秒或 60 次，先到者生效
 */
const POLL_MAX_DURATION = 90 * 1000
const POLL_MAX_COUNT = 60

const state = reactive({
  loadingStatus: true, // 初始化请求中
  downloadingStatus: false, // 下载中
  errorMessage: '', // 初始化失败信息（空串表示无错误）
  pollTimeoutStatus: false, // 转换轮询超时
  session: null as SysFilePreviewInitResponse | null, // 预览会话
})

let pollTimer: number | null = null
let pollStartAt = 0
let pollCount = 0
let requestSeq = 0 // 请求序号：丢弃被新任务（切换文件 / 重载）取代的响应

/**
 * 当前会话的预览模式
 */
const previewMode = computed<XhtFilePreviewMode>(() => state.session?.previewMode ?? 'other')

/**
 * 当前模式对应的预览器
 *
 * 后端只会下发约定的 7 种模式；万一出现未知值，兜底为下载型预览器，避免整片空白。
 */
const previewComponent = computed<Component>(() => PreviewComponents[previewMode.value as XhtFilePreviewRenderMode] ?? PreviewComponents.other)

/**
 * 预览内容地址
 *
 * 浏览器原生容器（img/video/audio）与 pdf.js 的 fetch 都不走 axios 的 baseURL，
 * 必须补上网关前缀；服务端下发的地址已带 previewId，无需前端拼接。
 */
const contentUrl = computed(() => (state.session?.urls?.previewUrl ? toSysFileAbsoluteUrl(state.session.urls.previewUrl) : ''))

/**
 * 是否允许在线预览（转换中仍需等待，不渲染预览器）
 */
const previewableStatus = computed(() => !!state.session && state.session.capabilities.preview && state.session.initStatus === 0)

/**
 * 是否允许下载
 */
const downloadableStatus = computed(() => !!state.session?.capabilities.download)

/**
 * 是否允许分享
 */
const shareableStatus = computed(() => !!state.session?.capabilities.share)

/**
 * 是否允许打印（不允许时整个预览区加 no-print，打印时直接隐藏）
 */
const printableStatus = computed(() => state.session?.capabilities.print !== false)

/**
 * 展示用文件名：外部传入优先，其次服务端完整原始名
 */
const displayName = computed(() => props.fileName || state.session?.fileOriginalName || state.session?.fileName || '文件预览')

/**
 * 水印图层背景图（仅 L1 需要前端渲染；L2 已烧录在文件字节里，不能重复叠加）
 */
const watermarkImage = ref('')

/**
 * 生成平铺水印背景
 *
 * @param text 水印文案
 */
const buildWatermarkImage = (text: string): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.translate(40, 130)
  ctx.rotate(-Math.PI / 12)
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#999'
  ctx.fillText(text, 0, 0)
  return canvas.toDataURL('image/png')
}

watch(
  () => state.session?.watermark,
  (watermark) => {
    if (!watermark?.enabled || watermark.level !== 'l1' || !watermark.text) {
      watermarkImage.value = ''
      return
    }
    watermarkImage.value = buildWatermarkImage(watermark.text)
  },
  { immediate: true }
)

/**
 * 清定时器
 */
const stopPoll = () => {
  if (pollTimer !== null) {
    window.clearTimeout(pollTimer)
    pollTimer = null
  }
}

/**
 * 轮询间隔：前 5 次 1s，之后 2s，最长 3s；服务端给出建议间隔时优先采用
 *
 * @param retryAfterMs 服务端建议的重试间隔
 */
const nextPollDelay = (retryAfterMs?: number | null): number => {
  if (retryAfterMs && retryAfterMs > 0) return Math.min(retryAfterMs, 3000)
  if (pollCount <= 5) return 1000
  if (pollCount <= 15) return 2000
  return 3000
}

/**
 * 轮询转换状态
 *
 * 页面隐藏时暂停（浏览器对后台定时器节流，继续排队只会积压请求），
 * 可见后由 visibilitychange 立即补查一次。
 */
const pollStatus = async () => {
  const session = state.session
  if (!session?.previewId) return
  if (document.hidden) return
  if (Date.now() - pollStartAt > POLL_MAX_DURATION || pollCount >= POLL_MAX_COUNT) {
    state.pollTimeoutStatus = true
    return
  }
  const seq = requestSeq
  pollCount += 1
  try {
    const { data } = await querySysFilePreviewStatus(session.previewId)
    if (seq !== requestSeq) return
    const merged: SysFilePreviewInitResponse = { ...session, ...data }
    state.session = merged
    if (data.initStatus === 1) {
      pollTimer = window.setTimeout(pollStatus, nextPollDelay(data.conversion?.retryAfterMs))
      return
    }
    emit('ready', merged)
  } catch (error) {
    // 轮询失败（网络抖动等）不打断转换流程，按普通间隔重试
    console.error('预览状态查询失败:', error)
    if (seq !== requestSeq) return
    pollTimer = window.setTimeout(pollStatus, nextPollDelay())
  }
}

/**
 * 初始化预览会话
 *
 * `previewId` 是后续内容 / 下载 / 创建分享的唯一凭证，必须落本地状态，不要自行拼接。
 */
const initSession = async () => {
  const seq = ++requestSeq
  stopPoll()
  state.loadingStatus = true
  state.errorMessage = ''
  state.pollTimeoutStatus = false
  state.session = null
  if (!props.fileId && !props.fileStorageKey && !props.shareTicket) {
    state.loadingStatus = false
    state.errorMessage = '缺少文件定位参数，无法打开预览'
    return
  }
  try {
    const { data } = await initSysFilePreview({
      fileId: props.fileId || undefined,
      fileStorageKey: props.fileStorageKey || undefined,
      shareTicket: props.shareTicket || undefined,
    })
    if (seq !== requestSeq) return
    state.session = data
    if (data.initStatus === 1) {
      pollStartAt = Date.now()
      pollCount = 0
      pollTimer = window.setTimeout(pollStatus, nextPollDelay(data.conversion?.retryAfterMs))
    }
    emit('ready', data)
  } catch (error) {
    if (seq !== requestSeq) return
    // 失败提示由请求拦截器统一弹出，这里只记录日志并给出可重试的页面状态
    console.error('文件预览初始化失败:', error)
    state.errorMessage = (error as Error).message || '预览初始化失败'
  } finally {
    if (seq === requestSeq) state.loadingStatus = false
  }
}

/**
 * 下载当前文件
 *
 * 下载凭证是 previewId；二进制接口的业务错误绕过拦截器，需在此补一次提示。
 */
const handleDownload = async () => {
  const session = state.session
  if (!session || !downloadableStatus.value || state.downloadingStatus) return
  state.downloadingStatus = true
  try {
    if (await handleDownloadPreviewFile(session.previewId)) {
      message.success('文件下载成功!')
    }
  } catch (error) {
    console.error('文件下载失败:', error)
    if (error instanceof PreviewApiError) {
      message.error(error.message || '文件下载失败')
    }
  } finally {
    state.downloadingStatus = false
  }
}

/**
 * 触发分享
 */
const handleShare = () => {
  const session = state.session
  if (!session || !shareableStatus.value) return
  emit('share', session)
}

/**
 * 页面可见性变化：可见时立即补查一次转换状态
 */
const handleVisibilityChange = () => {
  if (document.hidden || state.session?.initStatus !== 1) return
  stopPoll()
  void pollStatus()
}

/**
 * 会话过期后的静默重试：重新 init 拿新的 previewId
 */
const refreshSession = async () => {
  await initSession()
}

// 预览器识别到 50221 时回调此处重建会话
provide(FILE_PREVIEW_REFRESH_KEY, refreshSession)

/**
 * 状态页文案
 */
const statusTip = computed(() => {
  const session = state.session
  if (!session) return '预览初始化失败'
  switch (session.initStatus) {
    case 1:
      return session.conversion?.message || '文件正在转换，请稍候…'
    case 2:
      return '该文件类型不支持在线预览，请下载查看'
    case 3:
      return session.conversion?.message || '文件转换失败，请下载查看'
    case 4:
      return '该文件仅支持下载'
    default:
      return '当前文件暂不可预览'
  }
})

watch(() => [props.fileId, props.fileStorageKey, props.shareTicket], initSession, { immediate: true })

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  // 递增序号让在途响应失效，避免卸载后仍写入状态
  requestSeq++
  stopPoll()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

defineExpose({
  reload: initSession, // 重新初始化（失败重试 / 会话过期）
  download: handleDownload, // 下载当前文件
  refreshSession, // 会话过期后静默重建
  session: computed(() => state.session), // 只读会话，父级可据此扩展操作
})
</script>

<template>
  <div class="xht-file-preview" :class="{ 'is-no-print': !printableStatus }">
    <div v-if="props.showHeader" class="xht-file-preview-header">
      <div class="xht-file-preview-title">
        <span :title="displayName" class="xht-file-preview-name">{{ displayName }}</span>
        <span v-if="state.session" class="xht-file-preview-meta">
          {{ state.session.fileSizeInfo }}
          <template v-if="state.session.previewSource === 'convert'">· 转换预览</template>
        </span>
      </div>
      <div class="xht-file-preview-tools">
        <el-tooltip v-if="downloadableStatus" content="下载" placement="bottom">
          <el-button :icon="Download" :loading="state.downloadingStatus" link type="primary" size="small" @click="handleDownload">下载</el-button>
        </el-tooltip>
        <el-tooltip v-if="shareableStatus" content="分享" placement="bottom">
          <el-button :icon="Share" link type="primary" size="small" @click="handleShare">分享</el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="xht-file-preview-body">
      <!-- 初始化中 -->
      <div v-if="state.loadingStatus" v-loading="true" class="xht-file-preview-loading" element-loading-text="正在准备预览" />

      <!-- 初始化失败：可重试 -->
      <div v-else-if="state.errorMessage" class="xht-file-preview-status">
        <el-empty :description="state.errorMessage">
          <el-button type="primary" @click="initSession">重新加载</el-button>
        </el-empty>
      </div>

      <!-- 转换中 / 不支持 / 失败 / 仅下载：不渲染预览器，按状态给提示 -->
      <div v-else-if="!previewableStatus" class="xht-file-preview-status">
        <el-result :icon="state.session?.initStatus === 1 ? 'info' : 'warning'" :title="statusTip">
          <template #sub-title>
            <div v-if="state.session?.initStatus === 1" class="xht-file-preview-progress">
              <el-progress
                :percentage="state.session?.conversion?.progress ?? 0"
                :stroke-width="4"
                :show-text="false"
                color="var(--el-color-primary)"
              />
              <span class="xht-file-preview-progress-text">
                {{ state.pollTimeoutStatus ? '转换超时，请稍后重试或下载查看' : '转换完成后将自动展示' }}
              </span>
            </div>
            <span v-else-if="state.session?.fileSizeInfo">文件大小：{{ state.session.fileSizeInfo }}</span>
          </template>
          <div class="xht-file-preview-status-actions">
            <el-button v-if="state.session?.initStatus === 1 && state.pollTimeoutStatus" @click="initSession">重新加载</el-button>
            <el-button v-if="downloadableStatus" :icon="Download" type="primary" :loading="state.downloadingStatus" @click="handleDownload">
              下载文件
            </el-button>
          </div>
        </el-result>
      </div>

      <!-- 正常预览 -->
      <component
        :is="previewComponent"
        v-else
        :key="state.session?.previewId"
        :url="contentUrl"
        :preview-id="state.session?.previewId"
        :file-name="displayName"
        :downloadable="downloadableStatus"
        :printable="printableStatus"
      />

      <!-- L1 水印层：不参与交互，不遮挡滚动 -->
      <div
        v-if="watermarkImage"
        class="xht-file-preview-watermark"
        :style="{ backgroundImage: `url(${watermarkImage})`, opacity: state.session?.watermark.opacity ?? 0.1 }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.xht-file-preview {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--xht-bg-color);
  border: 1px solid var(--xht-border-color);
  border-radius: 6px;
  box-shadow: 0 0 12px var(--xht-shadow-color-lightest);
}

.xht-file-preview-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--xht-border-color);
  user-select: none;
}

.xht-file-preview-title {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  line-height: 1.4;
}

.xht-file-preview-name {
  overflow: hidden;
  color: var(--el-text-color-primary);
  font-weight: 600;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.xht-file-preview-meta {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.xht-file-preview-tools {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
}

.xht-file-preview-body {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.xht-file-preview-loading,
.xht-file-preview-status {
  width: 100%;
  height: 100%;
}

.xht-file-preview-status {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.xht-file-preview-progress {
  width: 260px;
  margin: 8px auto 0;
}

.xht-file-preview-progress-text {
  display: block;
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  text-align: center;
}

.xht-file-preview-status-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.xht-file-preview-watermark {
  position: absolute;
  z-index: 5;
  inset: 0;
  background-repeat: repeat;
  pointer-events: none;
  user-select: none;
}

/* 无打印权限时整块预览区在打印稿中隐藏，避免绕过能力位打印 */
@media print {
  .is-no-print {
    display: none !important;
  }
}
</style>
