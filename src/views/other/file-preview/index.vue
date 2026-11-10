<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useTitle } from '@/hooks/use-title'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import LayoutFooter from '@/layout/components/layout-footer/index.vue'
import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model'
import FileShareCreate from '@/views/system/file-share/components/file-share-create.vue'

defineOptions({ name: 'FilePreviewViewIndex' })

const route = useRoute()
const { setTitle } = useTitle()

const fileShareCreateRef = useTemplateRef('fileShareCreateRef')

/**
 * 路由中的文件存储key（兼容老地址：一个标签页只预览一个文件，取一次即可）
 */
const fileStorageKey = computed(() => (route.params.fileStorageKey ? String(route.params.fileStorageKey) : ''))

/**
 * 预览会话（由预览组件初始化后回传，用于页面标题与分享）
 */
const session = ref<SysFilePreviewInitResponse | null>(null)

/**
 * 预览会话就绪：用文件名做标签页标题，多标签时更容易辨认
 *
 * @param value 预览会话
 */
const handleReady = (value: SysFilePreviewInitResponse) => {
  session.value = value
  if (value.fileName) {
    setTitle(value.fileName)
  }
}

/**
 * 打开创建分享弹窗（分享入口由预览组件按能力位控制显隐）
 *
 * @param value 预览会话
 */
const handleShare = (value: SysFilePreviewInitResponse) => {
  fileShareCreateRef.value?.show(value)
}
</script>

<template>
  <el-container class="xht-file-preview-page">
    <el-header class="xht-file-preview-page-header" height="40px">
      <div class="min-w-0 flex flex-1 flex-col justify-center">
        <h1 :title="session?.fileName" class="text-overflow text-sm text-[var(--el-text-color-primary)] font-semibold leading-5">
          {{ session?.fileName || '文件预览' }}
        </h1>
        <div v-if="session" class="text-overflow text-xs text-[var(--el-text-color-secondary)] leading-4">
          {{ session.fileSuffix?.toUpperCase() || '未知类型' }} · {{ session.fileSizeInfo }}
        </div>
      </div>
      <div class="xht-file-preview-page-tools">
        <switch-dark />
        <page-full-screen />
      </div>
    </el-header>

    <el-main class="xht-file-preview-page-main">
      <xht-file-preview v-if="fileStorageKey" :file-storage-key="fileStorageKey" @ready="handleReady" @share="handleShare" />
      <el-result v-else icon="warning" title="文件地址无效" sub-title="缺少文件标识，请从文件列表重新打开预览" />
    </el-main>

    <layout-footer />
    <file-share-create ref="fileShareCreateRef" />
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
  background-color: var(--xht-main-bg-color);
}

/* 顶部信息栏（el-header 自带 flex-shrink: 0 与 height: 40px） */
.xht-file-preview-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  user-select: none;
}

/* switch-dark / page-full-screen 的根节点自带 header-tool-item 类（自身无样式），统一在这里定义 */
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
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
