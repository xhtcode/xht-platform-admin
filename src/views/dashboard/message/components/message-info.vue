<script setup lang="ts">
import type { MessageInfoVo } from '@/service/model/notice/message.info.model'
import { querySysMessageById } from '@/service/api/notice/message.api'
import { MessageStarEnums, MessageTopEnums } from '@/service/model/notice/message.model'

defineOptions({
  name: 'MessageInfo',
})
const emits = defineEmits(['success'])
const visibleStatus = ref<boolean>(false)
const loadingStatus = ref<boolean>(false)
const messageInfo = ref<Partial<MessageInfoVo>>({})
/**
 * 打开显示
 */
const show = async (id: ModeIdType) => {
  try {
    visibleStatus.value = true
    loadingStatus.value = true
    const { data } = await querySysMessageById(id)
    messageInfo.value = data
    loadingStatus.value = false
  } catch {
    loadingStatus.value = false
  }
}
/**
 * 关闭
 */
const close = () => {
  if (loadingStatus.value) return
  messageInfo.value = {}
  visibleStatus.value = false
  loadingStatus.value = false
  emits('success')
}
defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="visibleStatus"
    title="信息详情"
    size="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!loadingStatus"
    :before-close="close"
  >
    <el-descriptions border :column="2" label-width="120px">
      <el-descriptions-item label="消息标题" :span="2">{{ messageInfo.messageTitle }}</el-descriptions-item>
      <el-descriptions-item label="发件人名称">{{ messageInfo.senderName }}</el-descriptions-item>
      <el-descriptions-item label="消息类型">
        <el-tag v-if="messageInfo.messageType === 1" type="success">系统通知</el-tag>
        <el-tag v-else type="primary">业务提醒</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="收件人名称">{{ messageInfo.response?.recipientName }}</el-descriptions-item>
      <el-descriptions-item label="消息状态">
        <message-status :status="messageInfo.response?.messageStatus || -1" />
      </el-descriptions-item>
      <el-descriptions-item label="信息置顶">{{ messageInfo.response?.messageTop === MessageTopEnums.YES ? '置顶' : '未置顶' }}</el-descriptions-item>
      <el-descriptions-item label="信息收藏">
        {{ messageInfo.response?.messageStar === MessageStarEnums.YES ? '收藏' : '未收藏' }}
      </el-descriptions-item>
      <el-descriptions-item label="阅读时间" :span="2">{{ messageInfo.response?.readTime }}</el-descriptions-item>
      <el-descriptions-item label="消息内容" :span="2">
        {{ messageInfo.messageContent }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button :disabled="loadingStatus" @click="close">关闭</el-button>
    </template>
  </el-drawer>
</template>
