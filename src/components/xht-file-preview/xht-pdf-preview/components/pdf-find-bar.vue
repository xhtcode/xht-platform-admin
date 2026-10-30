<script lang="ts" setup>
import { ArrowDown, ArrowUp, Close } from '@element-plus/icons-vue'
import type { PdfFindBarProps } from './types'

/**
 * PDF 搜索栏（仿官方 viewer findbar）：输入框 + 上下跳转 + 匹配选项 + 命中计数。
 * 搜索逻辑在搜索模块内，本组件只负责交互绑定。
 */
defineOptions({ name: 'PdfFindBar', inheritAttrs: true })

const props = defineProps<PdfFindBarProps>()

// 搜索模块内的 ref 与方法是稳定引用，解构后仍保持响应式
const {
  searchInput,
  searchHighlightAll,
  searchCaseSensitive,
  searchWholeWord,
  searchDiacritics,
  searchMatches,
  searchCurrentLabel,
  searchExtracting,
  handleSearchKeydown,
  handleSearchNext,
  handleSearchPrev,
  closeSearch,
} = props.search

/**
 * 回填搜索输入框给主组件（打开搜索时焦点由搜索模块集中处理）
 *
 * @param el ref 元素
 */
const handleInputRef = (el: unknown) => {
  props.setInputRef(el instanceof HTMLInputElement ? el : null)
}
</script>

<template>
  <div class="xht-pdf-preview__findbar">
    <input
      :ref="handleInputRef"
      v-model="searchInput"
      type="text"
      class="xht-pdf-preview__find-input"
      placeholder="在文档中搜索"
      @keydown="handleSearchKeydown"
    />
    <button
      type="button"
      class="xht-pdf-preview__find-btn is-nav"
      aria-label="上一个"
      title="上一个"
      :disabled="!searchMatches.length"
      @click="handleSearchPrev()"
    >
      <el-icon :size="13"><ArrowUp /></el-icon>
    </button>
    <button
      type="button"
      class="xht-pdf-preview__find-btn is-nav"
      aria-label="下一个"
      title="下一个"
      :disabled="!searchMatches.length"
      @click="handleSearchNext()"
    >
      <el-icon :size="13"><ArrowDown /></el-icon>
    </button>
    <label class="xht-pdf-preview__find-option">
      <input v-model="searchHighlightAll" type="checkbox" />
      <span>全部高亮显示</span>
    </label>
    <label class="xht-pdf-preview__find-option">
      <input v-model="searchCaseSensitive" type="checkbox" />
      <span>区分大小写</span>
    </label>
    <label class="xht-pdf-preview__find-option">
      <input v-model="searchWholeWord" type="checkbox" />
      <span>全词匹配</span>
    </label>
    <label class="xht-pdf-preview__find-option">
      <input v-model="searchDiacritics" type="checkbox" />
      <span>匹配变音符号</span>
    </label>
    <span class="xht-pdf-preview__find-count">
      <template v-if="searchExtracting">搜索中…</template>
      <template v-else-if="searchMatches.length">{{ searchCurrentLabel }}/{{ searchMatches.length }}</template>
      <template v-else>无匹配结果</template>
    </span>
    <button type="button" class="xht-pdf-preview__find-btn" aria-label="关闭搜索" @click="closeSearch()">
      <el-icon :size="13"><Close /></el-icon>
    </button>
  </div>
</template>

<style lang="scss" scoped>
/* 搜索栏样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '../styles/findbar.scss';
</style>
