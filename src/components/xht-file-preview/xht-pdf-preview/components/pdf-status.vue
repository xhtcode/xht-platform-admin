<script lang="ts" setup>
import { Download, Loading, RefreshLeft, WarningFilled } from '@element-plus/icons-vue'
import type { PdfStatusEmits, PdfStatusProps } from './types'

/**
 * PDF 状态页：文档加载中（带进度）与加载失败（重新加载 / 下载）。
 */
defineOptions({ name: 'PdfStatus', inheritAttrs: true })

defineProps<PdfStatusProps>()

defineEmits<PdfStatusEmits>()
</script>

<template>
  <!-- 文档加载中 -->
  <div v-if="loading" class="xht-pdf-preview__status">
    <el-icon class="xht-pdf-preview__spin" :size="22"><Loading /></el-icon>
    <p class="xht-pdf-preview__status-title text-overflow">{{ displayName }}</p>
    <el-progress
      v-if="progress > 0"
      class="xht-pdf-preview__status-bar"
      :percentage="progress"
      :stroke-width="4"
      :show-text="false"
      color="#0b57d0"
    />
    <p class="xht-pdf-preview__status-desc">正在解析文档，请稍候…</p>
  </div>

  <!-- 文档加载失败 -->
  <div v-else class="xht-pdf-preview__status">
    <div class="xht-pdf-preview__status-card">
      <el-icon :size="26" color="#faad14"><WarningFilled /></el-icon>
      <p class="xht-pdf-preview__status-title">文档加载失败</p>
      <p class="xht-pdf-preview__status-desc">文件可能已损坏或已被释放，可重新加载或下载后查看</p>
      <div class="xht-pdf-preview__status-actions">
        <button type="button" class="xht-pdf-preview__action" @click="$emit('reload')">
          <el-icon :size="14"><RefreshLeft /></el-icon>
          重新加载
        </button>
        <button type="button" class="xht-pdf-preview__action is-primary" @click="$emit('download')">
          <el-icon :size="14"><Download /></el-icon>
          下载文件
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 状态页样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '../styles/status.scss';
@use '../styles/spin.scss';
</style>
