<script lang="ts" setup>
import type { XhtOtherPreviewProps } from '@/components/xht-file-preview/components/xht-other-preview/types'
import { handleDownloadSysFile } from '@/utils/file'
import { useMessage } from '@/hooks/use-message'
import { Document, Download } from '@element-plus/icons-vue'

/**
 * 其它类型文件：浏览器无法内联渲染（Office、压缩包、可执行文件等），
 * 统一展示文件信息并提供下载入口，避免预览区出现一片空白。
 *
 * 下载走系统标准下载接口：失败文案由后端透传，文件名按 `xht-download-filename` 响应头还原，
 * 与文件管理列表、PDF 工具栏的下载行为保持一致。
 */
defineOptions({ name: 'XhtOtherPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtOtherPreviewProps>(), { fileName: '' })

const message = useMessage()

const state = reactive({
  downloadingStatus: false, // 下载中状态
})

/**
 * 展示名称：优先文件名，缺失时回退存储key，避免标题空白
 */
const displayName = computed(() => props.fileName || props.fileStorageKey)

/**
 * 下载文件
 *
 * 失败提示（业务异常 / 请求错误）由 handleDownloadSysFile 与请求拦截器统一给出，
 * 此处只记录日志并复位状态，不重复弹提示。
 */
const handleDownload = async () => {
  if (!props.fileStorageKey || state.downloadingStatus) return
  state.downloadingStatus = true
  try {
    if (await handleDownloadSysFile(props.fileStorageKey)) {
      message.success('文件下载成功!')
    }
  } catch (error) {
    console.error('文件下载失败:', error)
  } finally {
    state.downloadingStatus = false
  }
}
</script>

<template>
  <div class="wh-full flex-center">
    <div class="xht-other-preview">
      <el-icon :size="64" class="xht-other-preview-icon">
        <Document />
      </el-icon>
      <p :title="displayName" class="xht-other-preview-name">{{ displayName }}</p>
      <p class="xht-other-preview-tip">该文件类型暂不支持在线预览，请下载后查看</p>
      <el-button type="primary" :icon="Download" :disabled="!props.fileStorageKey" :loading="state.downloadingStatus" @click="handleDownload">
        {{ state.downloadingStatus ? '正在下载' : '下载文件' }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 类名统一单 `-` 分隔、不使用 SCSS `&__` 简写（与 xht-file-preview 页面一致） */
.xht-other-preview {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  max-width: 460px;
  padding: 48px 32px;
  text-align: center;
  background-color: var(--xht-main-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--xht-border-radius-base);
}

.xht-other-preview-icon {
  color: var(--el-text-color-placeholder);
}

.xht-other-preview-name {
  max-width: 100%;
  margin: 16px 0 0;
  overflow: hidden;
  color: var(--el-text-color-primary);
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.xht-other-preview-tip {
  margin: 8px 0 20px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
