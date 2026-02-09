<script lang="ts" setup>
import type { MessageStatusProps } from '@/components/system/message-status/types'
import { MESSAGE_STATUS } from '@/service/model/notice/message.model'

defineOptions({ name: 'MessageStatus', inheritAttrs: false })
// 定义组件的 props
const props = withDefaults(defineProps<MessageStatusProps>(), {})

/**
 * 根据消息状态获取标签颜色
 * @param status 消息状态
 * @returns 对应的颜色字符串，若状态无效则返回默认颜色
 */
const getTagColor = (status: number): string => {
  // 参数校验：确保 status 是合法的状态值
  if (!Object.values(MESSAGE_STATUS).includes(status)) {
    console.warn(`Invalid status: ${status}`)
    return 'default' // 默认颜色
  }
  // 使用映射表简化逻辑
  const colorMap: Record<number, string> = {
    [MESSAGE_STATUS.UNREAD]: 'var(--el-color-primary)',
    [MESSAGE_STATUS.READ]: 'var(--el-color-success)',
    [MESSAGE_STATUS.DELETED]: 'var(--el-color-danger)',
    [MESSAGE_STATUS.WITHDRAWN]: 'var(--el-color-info)',
  }
  return colorMap[status]
}

/**
 * 根据消息状态获取标签文本
 * @param status 消息状态
 * @returns 对应的标签文本，若状态无效则返回默认文本
 */
const getStatusLabel = (status: number): string => {
  // 参数校验：确保 status 是合法的状态值
  if (!Object.values(MESSAGE_STATUS).includes(status)) {
    console.warn(`Invalid status: ${status}`)
    return '未知状态' // 默认文本
  }
  // 使用映射表简化逻辑
  const labelMap: Record<number, string> = {
    [MESSAGE_STATUS.UNREAD]: '未读',
    [MESSAGE_STATUS.READ]: '已读',
    [MESSAGE_STATUS.DELETED]: '已删除',
    [MESSAGE_STATUS.WITHDRAWN]: '已撤回',
  }
  return labelMap[status]
}
</script>

<template>
  <el-tag class="message-status-tag" :color="getTagColor(props.status)">
    {{ getStatusLabel(props.status) }}
  </el-tag>
</template>

<style lang="scss" scoped>
.message-status-tag {
  border-width: 0 !important;
  color: #ffffff;
  user-select: none;
}
</style>
