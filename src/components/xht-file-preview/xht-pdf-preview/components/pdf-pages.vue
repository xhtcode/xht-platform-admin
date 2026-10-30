<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'
import { PDF_TO_CSS_UNITS } from '../constants'
import type { PdfPagesProps } from './types'

/**
 * PDF 页面列表：逐页纸面 + 画布 + 透明文本层（文本选择）+ 搜索高亮 + 渲染中提示。
 * 画布与文本层容器的 ref 通过回调交给主组件收集，渲染管线仍由主组件驱动。
 */
defineOptions({ name: 'PdfPages', inheritAttrs: true })

const props = defineProps<PdfPagesProps>()

const { paperStyle, search, setPageCanvas, setPageTextLayer } = props

// 搜索模块内的 ref 与方法是稳定引用，解构后仍保持响应式
const { searchOpen, searchHighlightAll, searchCurrentLabel, pageHitRects, hitLayerStyle, hitStyle } = search
</script>

<template>
  <div v-for="no in state.total" :key="no" class="xht-pdf-preview__paper" :style="paperStyle(no)">
    <canvas :ref="(el: any) => setPageCanvas(no, el)" />
    <!-- 文本层：透明文本叠放于画布上，提供文本选择与复制能力 -->
    <div
      :ref="(el: any) => setPageTextLayer(no, el)"
      class="xht-pdf-preview__text-layer"
      :style="{ '--total-scale-factor': state.scale * PDF_TO_CSS_UNITS }"
    />
    <!-- 搜索高亮：叠加在文本层之上（不拦截选择事件）；坐标基于未旋转页面，旋转时容器整体旋转对位 -->
    <div v-if="searchOpen" class="xht-pdf-preview__hit-layer" :style="hitLayerStyle(no)">
      <span
        v-for="(rect, rectIndex) in pageHitRects(no)"
        v-show="searchHighlightAll || rect.matchNo === searchCurrentLabel"
        :key="`${rect.matchNo}-${rectIndex}`"
        class="xht-pdf-preview__search-hit"
        :class="{ 'is-current': rect.matchNo === searchCurrentLabel }"
        :style="hitStyle(rect)"
      />
    </div>
  </div>
  <transition name="el-fade-in">
    <div v-if="state.rendering" class="xht-pdf-preview__rendering">
      <el-icon class="xht-pdf-preview__spin" :size="13"><Loading /></el-icon>
      <span>渲染中</span>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
/* 页面列表样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '../styles/pages.scss';
@use '../styles/spin.scss';
</style>
