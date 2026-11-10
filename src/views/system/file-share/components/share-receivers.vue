<script lang="ts" setup>
import { querySysFileShareReceivers } from '@/service/api/system/file-share.api'
import type { SysFileShareReceiverResponse } from '@/service/model/system/file-share.model'

defineOptions({ name: 'ShareReceivers' })

const state = reactive({
  visibleStatus: false,
  loadingStatus: false,
  fileName: '',
  list: [] as SysFileShareReceiverResponse[],
})

/**
 * 打开接收人列表
 *
 * @param shareId 分享ID
 * @param fileName 文件名（弹窗标题展示）
 */
const show = async (shareId: ModeIdType, fileName: string) => {
  state.visibleStatus = true
  state.loadingStatus = true
  state.fileName = fileName
  state.list = []
  try {
    const { data } = await querySysFileShareReceivers(shareId)
    state.list = data
  } catch (error) {
    // 失败提示由请求拦截器给出，这里只记录日志
    console.error('接收人查询失败:', error)
  } finally {
    state.loadingStatus = false
  }
}

defineExpose({ show })
</script>

<template>
  <el-dialog v-model="state.visibleStatus" align-center append-to-body :title="`接收人 · ${state.fileName}`" width="720px">
    <el-table v-loading="state.loadingStatus" :data="state.list" border max-height="420" row-key="receiverId">
      <el-table-column label="用户" min-width="180" prop="userName" show-overflow-tooltip />
      <el-table-column label="已读" prop="readStatus" width="90">
        <template #default="{ row }">
          <el-tag :type="row.readStatus === 1 ? 'success' : 'info'" size="small">{{ row.readStatus === 1 ? '已读' : '未读' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已读时间" prop="readTime" width="180">
        <template #default="{ row }">{{ row.readTime || '—' }}</template>
      </el-table-column>
      <el-table-column label="首次查看" prop="firstViewTime" width="180">
        <template #default="{ row }">{{ row.firstViewTime || '—' }}</template>
      </el-table-column>
      <el-table-column label="下载次数" prop="downloadCount" width="110" />
    </el-table>
    <template #footer>
      <el-button @click="state.visibleStatus = false">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
