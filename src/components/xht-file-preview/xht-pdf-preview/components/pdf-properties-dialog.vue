<script lang="ts" setup>
import type { PdfPropertiesDialogProps } from './types'

/**
 * 文档属性弹窗：字段文本由文档属性模块生成，本组件只负责展示。
 */
defineOptions({ name: 'PdfPropertiesDialog', inheritAttrs: true })

const props = defineProps<PdfPropertiesDialogProps>()

// 文档属性模块内的 ref 是稳定引用，解构后仍保持响应式
const { propertiesVisible, docProperties } = props.properties
</script>

<template>
  <el-dialog v-model="propertiesVisible" title="文档属性" width="640px" append-to-body>
    <ul class="xht-pdf-preview__property-list">
      <li v-for="(row, index) in docProperties" :key="index" :class="{ 'is-divider': row.divider }">
        <span class="xht-pdf-preview__property-label">{{ row.label }}</span>
        <span class="xht-pdf-preview__property-value">{{ row.value }}</span>
      </li>
    </ul>
  </el-dialog>
</template>

<style lang="scss" scoped>
/* 文档属性弹窗样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '../styles/properties.scss';
</style>
