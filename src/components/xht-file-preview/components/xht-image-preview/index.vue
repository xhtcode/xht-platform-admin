<script lang="ts" setup>
import type { XhtImagePreviewProps } from '@/components/xht-file-preview/components/xht-image-preview/types'
import { toSysFileAbsoluteUrl } from '@/service/api/system/file.api.ts'

defineOptions({ name: 'XhtImagePreview', inheritAttrs: false })

const props = withDefaults(defineProps<XhtImagePreviewProps>(), {})

const url = computed<string>(() => toSysFileAbsoluteUrl(props.previewInit.urls.previewUrl))
/**
 * 大图查看地址列表（el-image 的放大查看需要数组）
 */
const previewSrcList = computed<string[]>(() => [url.value])
const imageRef = ref()
const handleClick = () => {
  imageRef.value.showPreview()
}
</script>

<template>
  <xht-preview-layout :file-storage-key="props.previewId" :previewInit="props.previewInit">
    <template #tools>
      <xht-file-download :file-storage-key="props.previewId" class="xht-file-preview-header-tools-item" />
      <xht-file-share class="xht-file-preview-header-tools-item" />
    </template>
    <div class="xht-image-preview" @click="handleClick">
      <el-image
        class="xht-image-preview-image"
        ref="imageRef"
        :src="url"
        :scale="0.8"
        fit="cover"
        :preview-src-list="previewSrcList"
        preview-teleported
      />
    </div>
  </xht-preview-layout>
</template>

<style lang="scss">
.xht-image-preview {
  padding: 16px;
  cursor: pointer;
  width: 100%;
  height: 100%;

  .xht-image-preview-image {
    user-select: none;
    width: 100%;
    height: 100%;
    padding: 8px;
    background: var(--xht-bg-color);
    border-radius: var(--xht-border-radius-base);
    box-shadow: 2px 0 4px var(--xht-aside-shadow-color);
    img {
      border-radius: var(--xht-border-radius-base);
    }
  }
}
</style>
