<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'
import type { PdfPrintOverlayProps } from '@/components/xht-file-preview/components/xht-pdf-preview/components/types'

/**
 * PDF 打印等待遮罩：大文档逐页转图片期间展示进度。
 * 遮罩同时挡住整个预览区的交互，避免生成过程中用户翻页/缩放导致画面停在半路。
 */
defineOptions({ name: 'PdfPrintOverlay', inheritAttrs: true })

defineProps<PdfPrintOverlayProps>()
</script>

<template>
  <transition name="el-fade-in">
    <div v-if="visible" class="xht-pdf-preview__print-mask">
      <div class="xht-pdf-preview__print-box">
        <el-icon class="xht-pdf-preview__spin" :size="22"><Loading /></el-icon>
        <p class="xht-pdf-preview__print-title">正在生成打印内容</p>
        <el-progress class="xht-pdf-preview__print-bar" :percentage="progress" :stroke-width="4" :show-text="false" color="var(--el-color-primary)" />
        <p class="xht-pdf-preview__print-desc">
          共 {{ total }} 页，已完成 {{ progress }}%
          <br />
          生成完成后会自动打开打印预览
        </p>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
/* 打印等待遮罩样式：类名 xht-pdf-preview__* 全局唯一，分片在本组件内 scoped 生效 */
@use '@/components/xht-file-preview/components/xht-pdf-preview/styles/print-overlay.scss';
@use '@/components/xht-file-preview/components/xht-pdf-preview/styles/spin.scss';
</style>
