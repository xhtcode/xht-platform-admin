<script lang="ts" setup>
import type { XhtVideoPreviewProps } from '@/components/xht-file-preview/components/xht-video-preview/types'
import { toSysFileAbsoluteUrl } from '@/service/api/system/file.api.ts'

/**
 * 视频预览：原生 video 播放器，等比缩放居中（超大视频不出滚动条）
 *
 * `preload="metadata"` 只先取时长与首帧，配合后端 HTTP Range 分段加载，
 * 打开预览不会把整段视频拉下来；拖进度条时浏览器按需请求对应分段。
 */
defineOptions({ name: 'XhtVideoPreview', inheritAttrs: false })

const props = withDefaults(defineProps<XhtVideoPreviewProps>(), {})

const url = computed<string>(() => toSysFileAbsoluteUrl(`/sys/files/preview/content?previewId=${props.previewId}`))

const state = reactive({
  errorStatus: false, // 视频加载失败（编码不支持 / 文件损坏）
})

/**
 * 切文件时复位失败态
 */
watch(url, () => {
  state.errorStatus = false
})
</script>

<template>
  <xht-preview-layout :file-storage-key="props.previewId" :previewInit="props.previewInit">
    <template #tools>
      <xht-file-download :file-storage-key="props.previewId" class="xht-file-preview-header-tools-item" />
    </template>
    <div class="xht-video-preview wh-full flex-center">
      <video
        v-if="!state.errorStatus"
        :src="url"
        controls
        playsinline
        preload="metadata"
        class="xht-video-preview-player"
        @error="state.errorStatus = true"
      />
      <el-empty v-else description="视频播放失败，请下载后查看" />
    </div>
  </xht-preview-layout>
</template>

<style scoped lang="scss">
.xht-video-preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 16px;
  .xht-video-preview-player {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
