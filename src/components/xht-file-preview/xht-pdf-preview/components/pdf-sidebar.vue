<script lang="ts" setup>
import { ArrowRight, Check, Paperclip } from '@element-plus/icons-vue'
import type { SidebarTab } from '../thumbs'
import { formatBytes } from '../utils'
import type { PdfSidebarEmits, PdfSidebarProps } from './types'

/**
 * PDF 侧栏：目录 / 缩略图 / 附件 / 图层 四个面板。
 * 数据与操作全部来自对应功能模块（由主组件注入），本组件只负责渲染与标签切换。
 */
defineOptions({ name: 'PdfSidebar', inheritAttrs: true })

const props = defineProps<PdfSidebarProps>()

const emits = defineEmits<PdfSidebarEmits>()

/**
 * 当前标签页（双向绑定）
 */
const tab = defineModel<SidebarTab>('tab', { required: true })

// 功能模块内的 ref 与方法是稳定引用，解构后仍保持响应式
const { outlineLoading, outlineLoaded, visibleOutline, outlineActiveId, handleOutlineClick, toggleOutline } = props.outline
const { setThumbWrapper } = props.thumbs
const { attachmentsLoading, attachments: attachmentItems, handleAttachmentClick } = props.attachments
const { layersLoading, layers: layerItems, toggleLayer } = props.layers

/**
 * 回填缩略图列表容器给主组件（缩略图懒渲染观察器挂在容器上）
 *
 * @param el ref 元素
 */
const handleListRef = (el: unknown) => {
  props.setListRef(el instanceof HTMLDivElement ? el : null)
}
</script>

<template>
  <aside class="xht-pdf-preview__sidebar">
    <div class="xht-pdf-preview__tabs" role="tablist">
      <button type="button" class="xht-pdf-preview__tab" :class="{ 'is-active': tab === 'outline' }" role="tab" @click="tab = 'outline'">目录</button>
      <button type="button" class="xht-pdf-preview__tab" :class="{ 'is-active': tab === 'thumb' }" role="tab" @click="tab = 'thumb'">缩略图</button>
      <!-- 附件、图层始终显示；文档没有对应内容时置灰禁用 -->
      <button
        type="button"
        class="xht-pdf-preview__tab"
        :class="{ 'is-active': tab === 'attach' }"
        role="tab"
        :disabled="!attachmentsLoading && !attachmentItems.length"
        title="此文档没有附件"
        @click="tab = 'attach'"
      >
        附件
      </button>
      <button
        type="button"
        class="xht-pdf-preview__tab"
        :class="{ 'is-active': tab === 'layer' }"
        role="tab"
        :disabled="!layersLoading && !layerItems.length"
        title="此文档没有图层"
        @click="tab = 'layer'"
      >
        图层
      </button>
    </div>

    <div v-show="tab === 'outline'" class="xht-pdf-preview__outline">
      <p v-if="outlineLoading" class="xht-pdf-preview__outline-tip">正在读取目录…</p>
      <p v-else-if="outlineLoaded && !visibleOutline.length" class="xht-pdf-preview__outline-tip">此文档没有目录</p>
      <button
        v-for="node in visibleOutline"
        :key="node.id"
        type="button"
        class="xht-pdf-preview__outline-item"
        :class="{ 'is-current': node.id === outlineActiveId }"
        :style="{ paddingLeft: `${8 + node.level * 12}px` }"
        :title="node.title"
        @click="handleOutlineClick(node)"
      >
        <span
          class="xht-pdf-preview__outline-toggle"
          :class="{ 'is-open': node.open, 'is-empty': !node.children.length }"
          @click.stop="node.children.length && toggleOutline(node)"
        >
          <el-icon v-if="node.children.length" :size="10"><ArrowRight /></el-icon>
        </span>
        <span class="xht-pdf-preview__outline-title">{{ node.title }}</span>
      </button>
    </div>

    <div v-show="tab === 'thumb'" :ref="handleListRef" class="xht-pdf-preview__thumb-list">
      <button
        v-for="no in state.total"
        :key="no"
        type="button"
        class="xht-pdf-preview__thumb"
        :class="{ 'is-active': no === state.current }"
        :data-page="no"
        :ref="(el: any) => setThumbWrapper(no, el)"
        @click="emits('goPage', no)"
      >
        <span class="xht-pdf-preview__thumb-paper"><canvas /></span>
        <span class="xht-pdf-preview__thumb-no">{{ no }}</span>
      </button>
    </div>

    <div v-show="tab === 'attach'" class="xht-pdf-preview__attach">
      <p v-if="attachmentsLoading" class="xht-pdf-preview__outline-tip">正在读取附件…</p>
      <p v-else-if="!attachmentItems.length" class="xht-pdf-preview__outline-tip">此文档没有附件</p>
      <button
        v-for="item in attachmentItems"
        :key="item.id"
        type="button"
        class="xht-pdf-preview__attach-item"
        :title="item.description || item.filename"
        @click="handleAttachmentClick(item)"
      >
        <el-icon :size="14" class="xht-pdf-preview__attach-icon"><Paperclip /></el-icon>
        <span class="xht-pdf-preview__attach-name text-overflow">{{ item.filename }}</span>
        <span v-if="item.size" class="xht-pdf-preview__attach-size">{{ formatBytes(item.size) }}</span>
      </button>
    </div>

    <div v-show="tab === 'layer'" class="xht-pdf-preview__layer">
      <p v-if="layersLoading" class="xht-pdf-preview__outline-tip">正在读取图层…</p>
      <p v-else-if="!layerItems.length" class="xht-pdf-preview__outline-tip">此文档没有图层</p>
      <button
        v-for="item in layerItems"
        :key="item.id"
        type="button"
        class="xht-pdf-preview__layer-item"
        :title="item.name"
        @click="toggleLayer(item)"
      >
        <span class="xht-pdf-preview__layer-box" :class="{ 'is-checked': item.visible }">
          <el-icon v-if="item.visible" :size="10"><Check /></el-icon>
        </span>
        <span class="xht-pdf-preview__layer-name text-overflow">{{ item.name }}</span>
      </button>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
/* 侧栏样式：类名为 xht-pdf-preview__* 全局唯一，分片在子组件内 scoped 生效 */
@use '../styles/sidebar.scss';
</style>
