<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { Download, Loading, RefreshLeft, WarningFilled } from '@element-plus/icons-vue'
import type { SysFilePreviewResponse } from '@/service/model/system/file.model'
import type { XhtFilePreviewFile } from '@/components/xht-file-preview/types'
import { initSysFilePreview } from '@/service/api/system/file.api'
import { handleDownloadSysFile } from '@/utils/file'
import { HOME_PAGE_PATH } from '@/service/constant'

/**
 * 文件预览页（独立全屏页）
 *
 * 路由：/file-preview/:fileStorageKey
 * 按路由参数调用预览初始化接口（服务端在此校验访问权限）拿到文件名、类型、大小，
 * 再交给 xht-file-preview 渲染；预览内容本身不带"返回"入口，返回、文件名、下载等页面级操作统一收敛在顶部信息栏。
 */
defineOptions({ name: 'FilePreviewViewIndex' })

const route = useRoute()
const router = useRouter()

const state = reactive({
  loadingStatus: true, // 预览信息加载状态
  errorStatus: false, // 预览信息加载失败
  downloadingStatus: false, // 下载状态
  fileInfo: null as SysFilePreviewResponse | null, // 当前预览文件信息
})

/**
 * 路由中的文件存储key
 */
const fileStorageKey = computed(() => (route.params.fileStorageKey ? String(route.params.fileStorageKey) : ''))

/**
 * 传给预览组件的文件信息（初始化响应不含存储key，用路由参数补齐）
 */
const previewFile = computed<XhtFilePreviewFile | null>(() => {
  if (!state.fileInfo) return null
  return {
    fileStorageKey: fileStorageKey.value,
    fileOriginalName: state.fileInfo.fullOriginalFilename,
    fileType: state.fileInfo.fileType,
    fileSuffix: state.fileInfo.fileSuffix,
  }
})

const displayName = computed(() => state.fileInfo?.fullOriginalFilename || '文件预览')

/**
 * 文件元信息：后缀 · 大小
 */
const displayMeta = computed(() => {
  if (!state.fileInfo) return ''
  const suffix = state.fileInfo.fileSuffix ? state.fileInfo.fileSuffix.toUpperCase() : ''
  return [suffix, state.fileInfo.fileSizeInfo].filter(Boolean).join(' · ')
})

/**
 * 加载预览信息
 */
const loadFile = () => {
  const key = fileStorageKey.value
  if (!key) {
    state.loadingStatus = false
    state.errorStatus = true
    return
  }
  state.loadingStatus = true
  state.errorStatus = false
  initSysFilePreview(key)
    .then(({ data }) => {
      state.fileInfo = data ?? null
      state.errorStatus = !data
    })
    .catch((error) => {
      // 错误提示已由请求拦截器统一给出，此处只记录日志并切到失败态
      console.error('文件预览信息加载失败:', error)
      state.fileInfo = null
      state.errorStatus = true
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 是否 PDF 预览：PDF 组件工具栏已带文件名与下载，页面级信息栏不再展示（合并为单行）
 */
const isPdf = computed(() => {
  const info = state.fileInfo
  if (!info) return false
  return info.fileSuffix?.toLowerCase() === 'pdf' || /\.pdf$/i.test(info.fullOriginalFilename || '')
})

/**
 * 返回：有历史记录时回上一页；新标签页打开（无历史记录）时尝试关闭当前标签，
 * 关闭被浏览器拦截（非脚本打开的标签）则兜底回首页。仅用于加载失败卡片的「关闭」按钮。
 */
const handleBack = () => {
  if (window.history.state?.back) {
    router.back()
    return
  }
  window.close()
  // close() 被浏览器忽略时兜底跳首页，延时避免与成功关闭的流程抢跑
  setTimeout(() => router.replace(HOME_PAGE_PATH), 120)
}

/**
 * 下载当前文件
 */
const handleDownload = () => {
  if (!state.fileInfo || state.downloadingStatus) return
  state.downloadingStatus = true
  handleDownloadSysFile(fileStorageKey.value)
    .catch((error) => {
      // 失败提示已由请求拦截器给出，此处只记录日志
      console.error('文件下载失败:', error)
    })
    .finally(() => {
      state.downloadingStatus = false
    })
}

watch(fileStorageKey, loadFile, { immediate: true })
</script>

<template>
  <div class="xht-file-preview-view">
    <!-- 顶部信息栏：仅非 PDF 类型展示（PDF 由组件工具栏承载文件名与下载，合并为单行） -->
    <header v-if="!isPdf" class="xht-file-preview-view__header">
      <div v-if="state.fileInfo" class="xht-file-preview-view__title">
        <span class="xht-file-preview-view__name text-overflow" :title="displayName">{{ displayName }}</span>
        <span v-if="displayMeta" class="xht-file-preview-view__meta">{{ displayMeta }}</span>
      </div>
      <div class="xht-file-preview-view__actions">
        <el-tooltip v-if="state.fileInfo" content="下载" placement="bottom">
          <button type="button" class="xht-file-preview-view__btn" aria-label="下载文件" :disabled="state.downloadingStatus" @click="handleDownload">
            <el-icon :size="15" :class="state.downloadingStatus ? 'xht-file-preview-view__spin' : ''">
              <Loading v-if="state.downloadingStatus" />
              <Download v-else />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
    </header>

    <div class="xht-file-preview-view__body">
      <!-- 文件信息加载中 -->
      <div v-if="state.loadingStatus" class="xht-file-preview-view__status">
        <el-icon class="xht-file-preview-view__spin" :size="22"><Loading /></el-icon>
        <p class="xht-file-preview-view__status-desc">正在加载文件信息，请稍候…</p>
      </div>

      <!-- 文件信息加载失败 -->
      <div v-else-if="state.errorStatus || !state.fileInfo" class="xht-file-preview-view__status">
        <div class="xht-file-preview-view__card">
          <el-icon :size="26" color="#faad14"><WarningFilled /></el-icon>
          <p class="xht-file-preview-view__status-title">文件信息加载失败</p>
          <p class="xht-file-preview-view__status-desc">文件可能已被删除，或当前账号无权访问</p>
          <div class="xht-file-preview-view__status-actions">
            <button type="button" class="xht-file-preview-view__action" @click="loadFile">
              <el-icon :size="14"><RefreshLeft /></el-icon>
              重新加载
            </button>
            <button type="button" class="xht-file-preview-view__action is-primary" @click="handleBack">关闭</button>
          </div>
        </div>
      </div>

      <xht-file-preview v-else :file="previewFile" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.xht-file-preview-view {
  display: flex;
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
  background-color: #f1f2f4;
  color: #15151a;
  font-size: 12px;

  &__header {
    display: flex;
    height: 40px;
    flex-shrink: 0;
    align-items: center;
    gap: 10px;
    padding: 0 8px;
    background-color: #f9f9fb;
    border-bottom: 1px solid #d7d9de;
  }

  &__title {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: baseline;
    gap: 8px;
  }

  &__name {
    color: #15151a;
    font-size: 13px;
    font-weight: 500;
  }

  &__meta {
    flex-shrink: 0;
    color: #909399;
    font-variant-numeric: tabular-nums;
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 2px;
  }

  &__btn {
    display: inline-flex;
    height: 26px;
    width: 26px;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    background-color: transparent;
    color: #5b5f6b;
    cursor: pointer;
    outline: none;
    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      background-color: #e8e9ed;
      color: #15151a;
    }

    &:disabled {
      color: #c6c8ce;
      cursor: not-allowed;
    }
  }

  &__body {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  &__status {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #909399;
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 28px 32px;
    border: 1px solid #d7d9de;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px rgb(0 0 0 / 4%);
  }

  &__status-title {
    color: #1f2226;
    font-size: 13px;
    font-weight: 500;
  }

  &__status-desc {
    color: #909399;
  }

  &__status-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  &__action {
    display: inline-flex;
    height: 28px;
    align-items: center;
    gap: 4px;
    padding: 0 12px;
    border: 1px solid #c9cbd1;
    border-radius: 4px;
    background-color: #fff;
    color: #5b5f6b;
    cursor: pointer;
    outline: none;
    transition:
      background-color 0.15s,
      border-color 0.15s,
      color 0.15s;

    &:hover {
      border-color: #a6a9b1;
      background-color: #f0f1f3;
      color: #15151a;
    }

    &.is-primary {
      border-color: #0b57d0;
      background-color: #0b57d0;
      color: #fff;

      &:hover {
        border-color: #0948ab;
        background-color: #0948ab;
        color: #fff;
      }
    }
  }

  &__spin {
    animation: xht-file-preview-view-spin 0.9s linear infinite;
  }
}

@keyframes xht-file-preview-view-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
