<script lang="ts" setup>
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  DArrowLeft,
  DArrowRight,
  Download,
  Grid,
  InfoFilled,
  Loading,
  Minus,
  MoreFilled,
  Plus,
  Printer,
  QuestionFilled,
  Refresh,
  RefreshLeft,
  RefreshRight,
  Search,
} from '@element-plus/icons-vue'
import { MAX_SCALE, MIN_SCALE, ZOOM_PERCENTS } from '../constants'
import type { ZoomOption } from '../types'
import type { PdfToolbarEmits, PdfToolbarProps } from './types'

/**
 * PDF 工具栏（pdf.js 官方风格）：单行布局 + 页码框 + 缩放下拉 + 更多功能菜单。
 * 只做展示与菜单开合，所有功能动作经 emit 交回主组件执行。
 */
defineOptions({ name: 'PdfToolbar', inheritAttrs: true })

const props = defineProps<PdfToolbarProps>()

const emits = defineEmits<PdfToolbarEmits>()

/**
 * 页码输入框：与当前页双向同步，输入非法值时回填当前页
 */
const pageInput = ref('1')

/**
 * 缩放下拉菜单展开状态
 */
const zoomMenuVisible = ref(false)

/**
 * 更多功能菜单（文本选择/手形工具/首末页/旋转/演示模式/文档属性）
 */
const moreMenuVisible = ref(false)

// 两个菜单的触发器容器 ref：用于判断 mousedown 是否发生在菜单区域内
const zoomWrapRef = ref<HTMLElement>()
const moreWrapRef = ref<HTMLElement>()

/**
 * 菜单外 mousedown 即关闭。用 mousedown 而非遮罩层 + click：
 * 1) 在页面上拖拽选字不产生 click，遮罩层方案收不到关闭时机；
 * 2) 不用遮罩层拦截事件，mousedown 仍能到达页面元素，拖拽选择不受影响。
 *
 * @param event 全局 mousedown 事件
 */
const handleGlobalMousedown = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof Node)) return
  if (zoomMenuVisible.value && !zoomWrapRef.value?.contains(target)) {
    zoomMenuVisible.value = false
  }
  if (moreMenuVisible.value && !moreWrapRef.value?.contains(target)) {
    moreMenuVisible.value = false
  }
}

/**
 * 缩放下拉按钮文案（对齐 pdf.js：自动缩放 / 适合页面 / 适合页宽 / 实际大小 / 百分比）
 */
const zoomLabel = computed(() => {
  const { zoomMode, scale } = props.state
  if (zoomMode === 'auto') return '自动缩放'
  if (zoomMode === 'page-fit') return '适合页面'
  if (zoomMode === 'page-width') return '适合页宽'
  if (zoomMode === 'page-actual') return '实际大小'
  return `${Math.round(scale * 100)}%`
})

/**
 * 缩放菜单项是否为当前选项：按模式精确匹配，不从 scale 反推（避免多项同时打勾）
 *
 * @param option 菜单项
 */
const isZoomCurrent = (option: ZoomOption) => {
  const { zoomMode, scale } = props.state
  if (option === 'auto' || option === 'page-fit' || option === 'page-width' || option === 'page-actual') {
    return zoomMode === option
  }
  // 百分比档位：仅手动指定（custom）且比例吻合时勾选
  return zoomMode === 'custom' && Math.round(scale * 100) === option
}

/**
 * 应用缩放菜单选择：先收起菜单再回传主组件
 *
 * @param option 菜单项（模式或百分比）
 */
const handleSelectZoom = (option: ZoomOption) => {
  zoomMenuVisible.value = false
  emits('selectZoom', option)
}

/**
 * 跳转到输入页码
 */
const handleJump = () => {
  const target = Number.parseInt(pageInput.value, 10)
  if (!Number.isFinite(target)) {
    pageInput.value = String(props.state.current)
    return
  }
  emits('goPage', target)
}

watch(
  () => props.state.current,
  (current) => {
    pageInput.value = String(current)
  },
  { immediate: true }
)

onMounted(() => {
  document.addEventListener('mousedown', handleGlobalMousedown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleGlobalMousedown, true)
})
</script>

<template>
  <header class="xht-pdf-preview__toolbar">
    <div class="xht-pdf-preview__cluster">
      <el-tooltip content="页面缩略图" placement="bottom">
        <button
          type="button"
          class="xht-pdf-preview__btn"
          :class="{ 'is-active': sidebarVisible }"
          aria-label="切换缩略图侧栏"
          @click="emits('toggleSidebar')"
        >
          <el-icon :size="15"><Grid /></el-icon>
        </button>
      </el-tooltip>

      <span class="xht-pdf-preview__divider" />

      <button
        type="button"
        class="xht-pdf-preview__btn"
        aria-label="上一页"
        :disabled="state.current <= 1"
        @click="emits('goPage', state.current - 1)"
      >
        <el-icon :size="14"><ArrowLeft /></el-icon>
      </button>
      <div class="xht-pdf-preview__page-box">
        <input v-model="pageInput" class="xht-pdf-preview__page-input" inputmode="numeric" @change="handleJump" @keyup.enter="handleJump" />
        <span class="xht-pdf-preview__page-total">/ {{ state.total }}</span>
      </div>
      <button
        type="button"
        class="xht-pdf-preview__btn"
        aria-label="下一页"
        :disabled="state.current >= state.total"
        @click="emits('goPage', state.current + 1)"
      >
        <el-icon :size="14"><ArrowRight /></el-icon>
      </button>

      <el-tooltip content="搜索（Ctrl+F）" placement="bottom">
        <button type="button" class="xht-pdf-preview__btn" aria-label="搜索" @click="emits('toggleSearch')">
          <el-icon :size="15"><Search /></el-icon>
        </button>
      </el-tooltip>

      <span class="xht-pdf-preview__divider" />

      <button type="button" class="xht-pdf-preview__btn" aria-label="缩小" :disabled="state.scale <= MIN_SCALE" @click="emits('zoom', -0.1)">
        <el-icon :size="14"><Minus /></el-icon>
      </button>

      <div ref="zoomWrapRef" class="xht-pdf-preview__zoom">
        <button
          type="button"
          class="xht-pdf-preview__zoom-trigger"
          :class="{ 'is-open': zoomMenuVisible }"
          aria-label="选择缩放比例"
          @click="zoomMenuVisible = !zoomMenuVisible"
        >
          {{ zoomLabel }}
          <el-icon :size="11"><ArrowDown /></el-icon>
        </button>
        <div v-if="zoomMenuVisible" class="xht-pdf-preview__zoom-menu" role="menu">
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="handleSelectZoom('auto')">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="isZoomCurrent('auto')" :size="12"><Check /></el-icon>
            </span>
            自动缩放
          </button>
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="handleSelectZoom('page-actual')">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="isZoomCurrent('page-actual')" :size="12"><Check /></el-icon>
            </span>
            实际大小
          </button>
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="handleSelectZoom('page-fit')">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="isZoomCurrent('page-fit')" :size="12"><Check /></el-icon>
            </span>
            适合页面
          </button>
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="handleSelectZoom('page-width')">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="isZoomCurrent('page-width')" :size="12"><Check /></el-icon>
            </span>
            适合页宽
          </button>
          <div class="xht-pdf-preview__zoom-sep" />
          <button
            v-for="percent in ZOOM_PERCENTS"
            :key="percent"
            type="button"
            class="xht-pdf-preview__zoom-item"
            role="menuitem"
            @click="handleSelectZoom(percent)"
          >
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="isZoomCurrent(percent)" :size="12"><Check /></el-icon>
            </span>
            {{ percent }}%
          </button>
        </div>
      </div>

      <button type="button" class="xht-pdf-preview__btn" aria-label="放大" :disabled="state.scale >= MAX_SCALE" @click="emits('zoom', 0.1)">
        <el-icon :size="14"><Plus /></el-icon>
      </button>
    </div>

    <!-- 文件名：单行工具栏居中展示 -->
    <div v-if="displayName" class="xht-pdf-preview__filename" :title="displayName">
      {{ displayName }}
    </div>

    <div class="xht-pdf-preview__cluster is-right">
      <el-tooltip content="快捷键" placement="bottom">
        <button type="button" class="xht-pdf-preview__btn" aria-label="查看快捷键" @click="emits('openShortcuts')">
          <el-icon :size="15"><QuestionFilled /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="下载" placement="bottom">
        <button type="button" class="xht-pdf-preview__btn" aria-label="下载文件" @click="emits('download')">
          <el-icon :size="15"><Download /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="打印" placement="bottom">
        <button type="button" class="xht-pdf-preview__btn" aria-label="打印" :disabled="state.printing" @click="emits('print')">
          <el-icon :size="15" :class="state.printing ? 'xht-pdf-preview__spin' : ''">
            <Loading v-if="state.printing" />
            <Printer v-else />
          </el-icon>
        </button>
      </el-tooltip>

      <!-- 更多功能：文本选择/手形工具 / 首末页 / 旋转 / 演示模式 / 文档属性 -->
      <div ref="moreWrapRef" class="xht-pdf-preview__more">
        <el-tooltip content="更多功能" placement="bottom">
          <button
            type="button"
            class="xht-pdf-preview__btn"
            :class="{ 'is-active': moreMenuVisible }"
            aria-label="更多功能"
            @click="moreMenuVisible = !moreMenuVisible"
          >
            <el-icon :size="15"><MoreFilled /></el-icon>
          </button>
        </el-tooltip>
        <div v-if="moreMenuVisible" class="xht-pdf-preview__zoom-menu is-right" role="menu">
          <button
            type="button"
            class="xht-pdf-preview__zoom-item"
            :class="{ 'is-on': !state.handTool }"
            role="menuitem"
            @click="emits('setHandTool', false)"
          >
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="!state.handTool" :size="12"><Check /></el-icon>
            </span>
            文本选择工具
          </button>
          <button
            type="button"
            class="xht-pdf-preview__zoom-item"
            :class="{ 'is-on': state.handTool }"
            role="menuitem"
            @click="emits('setHandTool', true)"
          >
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="state.handTool" :size="12"><Check /></el-icon>
            </span>
            手形工具
          </button>
          <div class="xht-pdf-preview__zoom-sep" />
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" :disabled="state.current <= 1" @click="emits('goPage', 1)">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon :size="12"><DArrowLeft /></el-icon>
            </span>
            转到第一页
          </button>
          <button
            type="button"
            class="xht-pdf-preview__zoom-item"
            role="menuitem"
            :disabled="state.current >= state.total"
            @click="emits('goPage', state.total)"
          >
            <span class="xht-pdf-preview__zoom-check">
              <el-icon :size="12"><DArrowRight /></el-icon>
            </span>
            转到最后一页
          </button>
          <div class="xht-pdf-preview__zoom-sep" />
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="emits('rotate', -90)">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon :size="12"><RefreshLeft /></el-icon>
            </span>
            逆时针旋转
          </button>
          <button
            type="button"
            class="xht-pdf-preview__zoom-item"
            role="menuitem"
            :disabled="state.rotation === 0"
            @click="emits('rotate', -state.rotation)"
          >
            <span class="xht-pdf-preview__zoom-check">
              <el-icon :size="12"><Refresh /></el-icon>
            </span>
            重置旋转
          </button>
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="emits('rotate', 90)">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon :size="12"><RefreshRight /></el-icon>
            </span>
            顺时针旋转
          </button>
          <div class="xht-pdf-preview__zoom-sep" />
          <button
            type="button"
            class="xht-pdf-preview__zoom-item"
            :class="{ 'is-on': state.presenting }"
            role="menuitem"
            @click="emits('togglePresentation')"
          >
            <span class="xht-pdf-preview__zoom-check">
              <el-icon v-if="state.presenting" :size="12"><Check /></el-icon>
            </span>
            演示模式
          </button>
          <div class="xht-pdf-preview__zoom-sep" />
          <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="emits('openProperties')">
            <span class="xht-pdf-preview__zoom-check">
              <el-icon :size="12"><InfoFilled /></el-icon>
            </span>
            文档属性…
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
/* 工具栏样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '../styles/toolbar.scss';
@use '../styles/spin.scss';
</style>
