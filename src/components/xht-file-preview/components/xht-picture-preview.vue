<script lang="ts" setup>
import type { XhtPicturePreviewProps } from '@/components/xht-file-preview/components/types'

/**
 * 图片预览：点击可放大查看（支持滚轮缩放、拖拽）
 */
defineOptions({ name: 'XhtPicturePreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtPicturePreviewProps>(), {})

const previewSrcList = computed(() => (props.url ? [props.url] : []))
</script>

<template>
  <div class="wh-full flex-center">
    <el-image
      :src="props.url"
      :preview-src-list="previewSrcList"
      fit="contain"
      hide-on-click-modal
      preview-teleported
      class="wh-full cursor-zoom-in"
    />
  </div>
</template>
