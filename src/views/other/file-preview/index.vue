<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { initSysFilePreview } from '@/service/api/system/file.api'
import { XhtFilePreviewMode } from '@/components/xht-file-preview/types.ts'

/**
 * 文件预览页（独立全屏页）
 *
 * 路由：/file-preview/:fileStorageKey
 * 按路由参数调用预览初始化接口（服务端在此校验访问权限）拿到文件名、类型、大小，
 * 再交给 xht-file-preview 渲染；预览内容本身不带"返回"入口，返回、文件名、下载等页面级操作统一收敛在顶部信息栏。
 */
defineOptions({ name: 'FilePreviewViewIndex' })

const route = useRoute()
const previewMode = ref<XhtFilePreviewMode>('other')
/**
 * 路由中的文件存储key
 */
const fileStorageKey = computed(() => (route.params.fileStorageKey ? String(route.params.fileStorageKey) : ''))

/**
 * 加载预览信息
 */
const loadFile = () => {
  const key = fileStorageKey.value
  initSysFilePreview(key).then(({ data }) => {})
}

watch(fileStorageKey, loadFile, { immediate: true })
</script>

<template>
  <div class="xht-file-preview-view">
    <xht-file-preview :file-storage-key="fileStorageKey" :preview-mode="previewMode" />
  </div>
</template>
