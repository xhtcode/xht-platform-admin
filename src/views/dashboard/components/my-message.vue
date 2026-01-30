<script setup lang="ts">
import { computed, ref } from 'vue'

interface MessageType {
  id: number
  title: string
  content: string
  time: string
  read: boolean
  type: 'system' | 'info' | 'warning' | 'error'
}

// 模拟更多消息数据
const messages: MessageType[] = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1
  return {
    id,
    title: `系统通知标题 ${id}`,
    content: `这是系统通知的内容，通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容通知的内容包含详细信息。系统通知ID：${id}，这是一条测试消息，用于展示分页功能。`,
    time: `2024-01-${String(20 - index).padStart(2, '0')} 14:30:22`,
    read: id > 5,
    type: id % 4 === 0 ? 'warning' : id % 3 === 0 ? 'error' : id % 2 === 0 ? 'info' : 'system',
    color: id % 4 === 0 ? '#E6A23C' : id % 3 === 0 ? '#F56C6C' : '#409EFF',
  }
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)

const total = computed(() => messages.length)

const unreadCount = computed(() => {
  return messages.filter((msg) => !msg.read).length
})

const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return messages.slice(start, end)
})

// 查看消息对话框
const viewDialogVisible = ref(false)
const currentMessage = ref<MessageType | null>(null)

/**
 * 查看消息详情
 * @param message 消息对象
 */
function viewMessage(message: MessageType) {
  currentMessage.value = message
  viewDialogVisible.value = true
  // 查看后自动标记为已读
  if (!message.read) {
    markAsRead(message.id)
  }
}

/**
 * 标记消息为已读
 * @param id 消息ID
 */
function markAsRead(id: number) {
  const msg = messages.find((m) => m.id === id)
  if (msg) {
    msg.read = true
  }
}

/**
 * 删除消息
 * @param id 消息ID
 */
function deleteMessage(id: number) {
  const index = messages.findIndex((m) => m.id === id)
  if (index > -1) {
    messages.splice(index, 1)
    // 如果删除的是当前页的最后一条，且不是第一页，则跳转到上一页
    if (paginatedMessages.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

/**
 * 标记全部已读
 */
function markAllAsRead() {
  messages.forEach((msg) => {
    msg.read = true
  })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <el-table
      :data="paginatedMessages"
      row-key="id"
      empty-text="系统暂无相关模板信息！"
      highlight-current-row
      border
      :row-class-name="({ row }) => (!row.read ? 'message-unread-row' : '')"
    >
      <xht-column-index :current="currentPage" :size="pageSize" />
      <!-- 标题列 -->
      <el-table-column prop="title" label="标题" width="120" show-overflow-tooltip />
      <!-- 时间列 -->
      <el-table-column prop="time" label="时间" width="120" />
      <!-- 内容列 -->
      <el-table-column prop="content" label="内容">
        <template #default="{ row }">
          <div class="content-line-clamp">
            {{ row.content }}
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #header>
          <el-button type="primary" size="small" @click="markAllAsRead" :disabled="unreadCount === 0">标记全部已读</el-button>
        </template>
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button type="primary" size="small" icon="view" text @click="viewMessage(row)">查看</el-button>
            <el-button type="danger" size="small" text icon="delete" @click="deleteMessage(row.id)">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="mt-4 flex justify-center">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>

    <!-- 查看消息对话框 -->
    <el-dialog v-model="viewDialogVisible" title="查看通知" destroy-on-close>
      <div class="max-h-[60vh] overflow-y-auto">
        <el-descriptions border :column="1" label-width="80px">
          <el-descriptions-item label="标题" label-align="right">
            <div class="flex justify-between">
              <div>{{ currentMessage?.title }}</div>
              <el-tag size="small" :type="currentMessage?.read ? 'success' : 'danger'">
                {{ currentMessage?.read ? '已读' : '未读' }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="时间" label-align="right">
            {{ currentMessage?.time }}
          </el-descriptions-item>
          <el-descriptions-item label="内容" label-align="right">
            <div class="message-content-detail overflow-y-auto whitespace-pre-wrap p-2">
              {{ currentMessage?.content }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
/* 未读行样式 */
.message-unread-row {
  background-color: #fff1f0 !important;
}

/* 表格行悬停样式 */
:deep(.el-table__row:hover) {
  background-color: var(--xht-hover-bg-color) !important;
}

/* 内容最多显示三行，多余内容省略 */
.content-line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  word-break: break-word;
}
</style>
