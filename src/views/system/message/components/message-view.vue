<script setup lang="ts">
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { querySysUserPage } from '@/service/api/system/user.api'
import { SysMessageInfoResponse } from '@/service/model/system/message.info.model'
import { SysMessageQueryRequest, SysMessageResponse } from '@/service/model/system/message.model'
import { queryAdminSendPage, updateCancelSingle } from '@/service/api/system/message.api'
import { Operation, Plus, Refresh, RefreshLeft, Search, View } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { messageStatusEnum, messageTypeEnum } from '@/service/enums/system/message.enum'

defineOptions({ name: 'SysMessageView' })

const state = reactive<TableQueryPageState<SysMessageQueryRequest, SysMessageInfoResponse>>({
  queryParams: {
    deptId: undefined,
    ascName: 'createTime',
  }, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
  visibleStatus: false,
  currentId: null,
})
const { queryParams } = toRefs(state)
const messageInfo = ref<Partial<SysMessageResponse>>({})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysMessageQueryRequest, SysMessageInfoResponse>(
  state,
  queryAdminSendPage,
  (res) => {
    messageInfo.value.senderName = res['senderName']
    messageInfo.value.messageType = res['messageType']
    messageInfo.value.messageTitle = res['messageTitle']
    messageInfo.value.messageContent = res['messageContent']
    messageInfo.value.messageExtend = res['messageExtend']
  }
)
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
/**
 * 打开显示
 */
const show = async (id: ModeIdType) => {
  state.visibleStatus = true
  state.currentId = id
  queryParams.value.messageId = id
  await handlePageQuery()
}

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {
    messageId: state.currentId,
  }
  await handlePageQuery()
}
/**
 * 关闭显示
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
}
/**
 * 改变搜索状态
 */
const changeSearchStatus = () => {
  state.searchStatus = !state.searchStatus
}
/**
 * 处理删除站内信
 */
const handleCancel = (row: SysMessageInfoResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将撤回${row.recipientName}的站内信, 是否继续?`)
    .then(async () => {
      await updateCancelSingle(row.id)
      await handlePageQuery()
      useMessage().success('撤回站内信成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}
defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    size="75%"
    title="查看站内信详情"
    append-to-body
    body-class="custom-drawer-body"
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-button :icon="Operation" type="info" @click="changeSearchStatus">详情</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-descriptions :column="4" border label-width="120" class="pb-2">
      <template #extra></template>
      <template #default v-if="state.searchStatus">
        <el-descriptions-item label="信息名称" :span="4">
          {{ messageInfo?.messageTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="发送人" :span="2">{{ messageInfo?.senderName }}</el-descriptions-item>
        <el-descriptions-item label="信息类型" :span="2">
          <xht-enum-tag :filter-label="messageInfo?.messageType" :data="messageTypeEnum" />
        </el-descriptions-item>
        <el-descriptions-item label="消息内容" :span="4">{{ messageInfo?.messageContent }}</el-descriptions-item>
        <el-descriptions-item label="扩展信息" :span="4">{{ messageInfo?.messageExtend }}</el-descriptions-item>
      </template>
    </el-descriptions>

    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed="left" align="center" type="selection" width="55" />
      <xht-column-index fixed="left" :current="queryParams.current" :size="queryParams.size" />
      <el-table-column label="接收人" prop="recipientName" width="160" />
      <el-table-column label="消息状态" prop="messageStatus" width="160">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.messageStatus" :data="messageStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column label="已读时间" prop="readTime" width="180" />
      <el-table-column label="删除时间" prop="removeTime" width="180" />
      <el-table-column label="撤回时间" prop="cancelTime" width="180" />
      <el-table-column label="发送时间" prop="createTime" width="180" />
      <el-table-column label="更新人" prop="updateBy" width="160" />
      <el-table-column label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysMessageInfoResponse} -->
      <el-table-column label="操作" fixed="right" width="100">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <template v-if="row.messageStatus !== 4">
              <el-button :icon="RefreshLeft" link type="danger" @click="handleCancel(row)">撤回</el-button>
            </template>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <xht-pagination
        class="pb-0!"
        v-model:current-page="state.queryParams.current"
        v-model:page-size="state.queryParams.size"
        :page-count="state.pages"
        :total="state.total"
        @pagination="handlePageQuery"
      />
    </template>
  </el-drawer>
</template>

<style></style>
