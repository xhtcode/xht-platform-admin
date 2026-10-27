<script lang="ts" setup>
import type { XhtTxtPreviewProps } from '@/components/xht-file-preview/xht-txt-preview/types'

/**
 * 文本预览：以 iframe 直接渲染 text/plain 数据流，保留浏览器原生的换行与编码处理
 */
defineOptions({ name: 'XhtTxtPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtTxtPreviewProps>(), {})
</script>

<template>
  <iframe :src="props.url" title="文本预览" class="wh-full border-none bg-[var(--el-bg-color)]" />
</template>
