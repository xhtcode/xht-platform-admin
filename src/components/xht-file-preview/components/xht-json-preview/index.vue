<script lang="ts" setup>
import type { XhtJsonPreviewProps } from '@/components/xht-file-preview/components/xht-json-preview/types'
import { useMessage } from '@/hooks/use-message'
import { readFileText } from '@/utils/file'
import { DocumentCopy } from '@element-plus/icons-vue'

/**
 * JSON 预览：读取文本后格式化为 2 空格缩进展示；解析失败时回退为原文展示
 */
defineOptions({ name: 'XhtJsonPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtJsonPreviewProps>(), {})

const message = useMessage()
// legacy: true —— 内网 http 环境下 navigator.clipboard 不可用时回退到 execCommand('copy')
const { copy, copied } = useClipboard({ legacy: true })

const state = reactive({
  loadingStatus: true, // 加载状态
  formattedStatus: false, // 是否成功格式化为 JSON
  text: '', // 展示文本
})

/**
 * 加载并格式化 JSON
 */
const loadJson = async () => {
  state.loadingStatus = true
  try {
    const raw = await readFileText(props.url)
    try {
      state.text = JSON.stringify(JSON.parse(raw), null, 2)
      state.formattedStatus = true
    } catch {
      // 非合法 JSON：回退展示原文，便于用户自查内容
      state.text = raw
      state.formattedStatus = false
    }
  } catch (error) {
    console.error('JSON文件读取失败:', error)
    state.text = ''
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 复制当前展示内容
 *
 * 复制结果需要即时反馈，属预览器自身闭环的交互，故在组件内提示
 */
const handleCopy = async () => {
  if (!state.text) {
    message.error('暂无可复制的内容')
    return
  }
  try {
    await copy(state.text)
    if (copied.value) {
      message.success('JSON 内容复制成功')
      return
    }
    message.error('复制失败，请手动选择内容复制')
  } catch (error) {
    console.error('JSON内容复制失败:', error)
    message.error('复制失败，请手动选择内容复制')
  }
}

watch(
  () => props.url,
  (url) => {
    if (url) {
      loadJson()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-loading="state.loadingStatus" element-loading-text="拼命加载中" class="h-full flex flex-col">
    <div
      v-if="!state.loadingStatus && state.text"
      class="flex-x-between gap-2 border-b border-[var(--el-border-color-lighter)] border-b-solid px-3 py-2"
    >
      <el-tag v-if="!state.formattedStatus" type="warning" size="small">内容不是合法 JSON，已展示原文</el-tag>
      <el-text v-else size="small" type="info">{{ state.text.length }} 个字符</el-text>
      <el-button :icon="DocumentCopy" :type="copied ? 'success' : 'primary'" plain size="small" @click="handleCopy">
        {{ copied ? '已复制' : '复制' }}
      </el-button>
    </div>
    <pre v-if="state.text" class="json-content m-0 flex-1 overflow-auto p-3">{{ state.text }}</pre>
    <el-empty v-else-if="!state.loadingStatus" description="JSON内容为空或读取失败，请下载后查看" />
  </div>
</template>

<style lang="scss" scoped>
.json-content {
  color: var(--el-text-color-primary);
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  background-color: var(--el-fill-color-lighter);
}
</style>
