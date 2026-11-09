<script lang="ts" setup>
import type { XhtVideoPreviewProps } from '@/components/xht-file-preview/components/xht-video-preview/types'

/**
 * 视频预览：原生 video 播放器，等比缩放居中（超大视频不出滚动条）
 *
 * `preload="metadata"` 只先取时长与首帧，配合后端 HTTP Range 分段加载，
 * 打开预览不会把整段视频拉下来；拖进度条时浏览器按需请求对应分段。
 */
defineOptions({ name: 'XhtVideoPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtVideoPreviewProps>(), {})

const state = reactive({
  errorStatus: false, // 视频加载失败（编码不支持 / 文件损坏）
})

/**
 * 切文件时复位失败态
 */
watch(
  () => props.url,
  () => {
    state.errorStatus = false
  }
)
</script>

<template>
  <div class="xht-video-preview wh-full flex-center">
    <video
      v-if="!state.errorStatus"
      :src="props.url"
      controls
      playsinline
      preload="metadata"
      class="xht-video-preview-player"
      @error="state.errorStatus = true"
    />
    <el-empty v-else description="视频播放失败，请下载后查看" />
  </div>
</template>

<style scoped lang="scss">
.xht-video-preview {
  overflow: hidden;
  background-color: var(--el-fill-color-lighter);
}

.xht-video-preview-player {
  max-width: 100%;
  max-height: 100%;
  background-color: var(--xht-bg-color);
  object-fit: contain;
}
</style>
