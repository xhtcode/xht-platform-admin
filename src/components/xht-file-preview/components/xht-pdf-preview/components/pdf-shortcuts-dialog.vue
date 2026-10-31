<script lang="ts" setup>
import { SHORTCUT_ITEMS } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/constants'

/**
 * 快捷键说明弹窗：纯静态内容，只负责展示与开合。
 */
defineOptions({ name: 'PdfShortcutsDialog', inheritAttrs: true })

/**
 * 弹窗显示状态（双向绑定）
 */
const visible = defineModel<boolean>('visible', { required: true })
</script>

<template>
  <el-dialog v-model="visible" title="快捷键" width="560px" append-to-body>
    <ul class="xht-pdf-preview__shortcut-list">
      <li v-for="item in SHORTCUT_ITEMS" :key="item.label">
        <span class="xht-pdf-preview__shortcut-label">{{ item.label }}</span>
        <span class="xht-pdf-preview__shortcut-keys">
          <kbd v-for="key in item.keys" :key="key">{{ key }}</kbd>
        </span>
      </li>
    </ul>
  </el-dialog>
</template>

<style lang="scss" scoped>
/* 快捷键弹窗样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '@/components/xht-file-preview/components/xht-pdf-preview/styles/shortcuts.scss';
</style>
