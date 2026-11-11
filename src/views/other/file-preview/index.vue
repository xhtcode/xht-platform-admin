<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useTitle } from '@/hooks/use-title'
import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model'

defineOptions({ name: 'FilePreviewViewIndex' })

const route = useRoute()
const { setTitle } = useTitle()

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
</script>

<template>
  <xht-file-preview v-if="fileStorageKey" :file-storage-key="fileStorageKey" @ready="handleReady" />
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
