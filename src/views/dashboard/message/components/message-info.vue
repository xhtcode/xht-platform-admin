<script setup lang="ts">
import type { MessageInfoVo } from '@/service/model/system/message.info.model'
import { querySysMessageById } from '@/service/api/system/message.api'
import { messageStarEnums, messageStatusEnums, messageTopEnums } from '@/service/enums/system/message.enum'

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
        <xht-enum-tag :filter-label="messageInfo.response?.messageStatus" :data="messageStatusEnums" />
      </el-descriptions-item>
      <el-descriptions-item label="信息置顶">
        <xht-enum-tag :filter-label="messageInfo.response?.messageTop" :data="messageTopEnums" />
      </el-descriptions-item>
      <el-descriptions-item label="信息收藏">
        <xht-enum-tag :filter-label="messageInfo.response?.messageStar" :data="messageStarEnums" />
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
