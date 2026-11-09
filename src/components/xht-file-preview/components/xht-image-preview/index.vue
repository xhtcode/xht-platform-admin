<script lang="ts" setup>
import type { XhtImagePreviewProps } from '@/components/xht-file-preview/components/xht-image-preview/types'

/**
 * 图片预览：自适应容器（contain），点击进入大图查看（滚轮缩放、拖拽、Esc 关闭）
 *
 * 直接用服务端直连地址，由浏览器原生解码，不再额外拉一次 blob。
 * 加载失败（无权限 / 文件损坏 / 非图片）时给出明确提示，避免只剩一个碎图图标。
 */
defineOptions({ name: 'XhtImagePreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtImagePreviewProps>(), {})

const state = reactive({
  loadingStatus: true, // 图片解码中
  errorStatus: false, // 图片加载失败
})

/**
 * 大图查看地址列表（el-image 的放大查看需要数组）
 */
const previewSrcList = computed(() => (props.url ? [props.url] : []))

/**
 * 切文件时复位状态（同一实例复用时不会残留上一张图的失败态）
 */
watch(
  () => props.url,
  () => {
    state.loadingStatus = true
    state.errorStatus = false
  }
)

const handleLoad = () => {
  state.loadingStatus = false
  state.errorStatus = false
}

const handleError = () => {
  state.loadingStatus = false
  state.errorStatus = true
}
</script>

<template>
  <div v-loading="state.loadingStatus" class="xht-image-preview wh-full" element-loading-text="正在加载图片">
    <el-image
      v-if="!state.errorStatus"
      :src="props.url"
      :preview-src-list="previewSrcList"
      fit="contain"
      hide-on-click-modal
      preview-teleported
      class="wh-full cursor-zoom-in"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-else class="xht-image-preview-error">
      <el-empty description="图片加载失败，请下载后查看" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.xht-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.xht-image-preview-error {
  width: 100%;
}
</style>
