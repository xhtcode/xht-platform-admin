<script lang="ts" setup>
import { Download } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { initSysFilePreview } from '@/service/api/system/file.api'
import { handleDownloadSysFile } from '@/utils/file'
import { useMessage } from '@/hooks/use-message'
import { useTitle } from '@/hooks/use-title'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import FilePreviewLoading from '@/views/other/file-preview/components/file-preview-loading.vue'
import FilePreviewError from '@/views/other/file-preview/components/file-preview-error.vue'
import type { SysFilePreviewResponse } from '@/service/model/system/file.model'
import LayoutFooter from '@/layout/components/layout-footer/index.vue'

defineOptions({ name: 'FilePreviewViewIndex' })

const route = useRoute()
const message = useMessage()
const { setTitle } = useTitle()

const state = reactive({
  loadingStatus: true, // 初始化加载状态
  errorStatus: false, // 初始化失败状态
  downloadingStatus: false, // 下载中状态
  fileInfo: null as SysFilePreviewResponse | null, // 服务端返回的预览信息
})

/**
 * 路由中的文件存储key（一个标签页只预览一个文件，取一次即可）
 */
const fileStorageKey = route.params.fileStorageKey ? String(route.params.fileStorageKey) : ''

/**
 * 加载预览信息
 */
const loadFile = async () => {
  if (!fileStorageKey) {
    state.loadingStatus = false
    state.errorStatus = true
    return
  }
  state.loadingStatus = true
  state.errorStatus = false
  try {
    const { data } = await initSysFilePreview(fileStorageKey)
    state.fileInfo = data
    // 标签页标题用文件名，比固定的"文件预览"更容易在多标签间辨认
    if (data.fileName) {
      setTitle(data.fileName)
    }
  } catch (error) {
    // 失败提示由请求拦截器统一弹出，这里只负责页面状态复位
    console.error('文件预览初始化失败:', error)
    state.fileInfo = null
    state.errorStatus = true
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 下载当前文件
 */
const handleDownload = async () => {
  // 预览信息未拿到（初始化中 / 无权限）时不发起下载，避免必然失败的请求
  if (!state.fileInfo || state.downloadingStatus) return
  state.downloadingStatus = true
  try {
    await handleDownloadSysFile(fileStorageKey)
    message.success('文件下载成功!')
  } catch (error) {
    console.error('文件下载失败:', error)
  } finally {
    state.downloadingStatus = false
  }
}

onMounted(async () => {
  await nextTick()
  await loadFile()
})
</script>

<template>
  <el-container class="xht-file-preview-page">
    <!-- 顶部信息栏：文件名 / 元信息 / 页面级操作 -->
    <el-header class="xht-file-preview-page-header" height="40px">
      <div class="min-w-0 flex flex-1 flex-col justify-center">
        <h1 :title="state.fileInfo?.fileName" class="text-overflow text-sm text-[var(--el-text-color-primary)] font-semibold leading-5">
          {{ state.fileInfo?.fileName }}
        </h1>
        <div v-if="state.fileInfo" class="text-overflow text-xs text-[var(--el-text-color-secondary)] leading-4">
          {{ state.fileInfo.previewModeValue }} · {{ state.fileInfo.fileSizeInfo }}
        </div>
      </div>
      <div class="xht-file-preview-page-tools">
        <div
          v-loading="state.downloadingStatus"
          class="header-tool-item"
          element-loading-background="transparent"
          title="下载"
          @click="handleDownload"
        >
          <el-icon :size="18"><Download /></el-icon>
        </div>
        <switch-dark />
        <page-full-screen />
      </div>
    </el-header>

    <el-main class="xht-file-preview-page-main">
      <file-preview-loading v-if="state.loadingStatus" />
      <file-preview-error v-else-if="state.errorStatus" @retry="loadFile" />
      <xht-file-preview
        v-else
        :file-name="state.fileInfo?.fileName"
        :file-storage-key="fileStorageKey"
        :preview-mode="state.fileInfo?.previewMode ?? 'other'"
      />
    </el-main>
    <layout-footer />
  </el-container>
</template>

<style scoped lang="scss">
/* 本页自成一套样式，不依赖 layout.scss 的 xht-* 布局类；
   配色取 Element Plus 主题变量，暗黑模式由 EP dark css-vars 自动接管 */
.xht-file-preview-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color-page);
}

/* 顶部信息栏（el-header 自带 flex-shrink: 0 与 height: 40px） */
.xht-file-preview-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background-color: var(--xht-main-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  user-select: none;
}

/* switch-dark / page-full-screen 的根节点自带 header-tool-item 类（自身无样式），
   下载项复用同一个类，三者统一在这里定义 */
.xht-file-preview-page-tools {
  display: flex;
  flex-shrink: 0;
  align-items: center;

  :deep(.header-tool-item) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    border-radius: 6px;
    transition:
      color 0.2s,
      background-color 0.2s;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-light);
    }
  }
}

/* 内容区：el-main 自身即卡片，四周留 10px 灰边，卡片内再留 10px */
.xht-file-preview-page-main {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background-color: var(--xht-page-bg-color);
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
