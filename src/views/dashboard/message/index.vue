<script setup lang="ts">
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { MessageInfoVo } from '@/service/model/notice/message.info.model'
import type { SysMenuQueryRequest } from '@/service/model/system/menu.model'
import {
  queryMyMessagePage,
  updateMessageRead,
  updateMessageReadAll,
  updateMessageRemove,
  updateMessageStart,
  updateMessageTop,
} from '@/service/api/notice/message.api'
import { ArrowUpBold, DArrowRight, Delete, Edit, Refresh, Search, StarFilled, View } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { MessageStar, MessageTop, SysMessageResponse } from '@/service/model/notice/message.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysMessageColumnOption } from '@/views/dashboard/message/data'
import { messageStarEnums, messageStatusEnums, messageTopEnums } from '@/service/enums/system/message.enum'

defineOptions({
  name: 'MyMessage',
})
const state = reactive<TableQueryPageState<SysMenuQueryRequest, MessageInfoVo>>({
  queryParams: {}, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const messageInfo = defineAsyncComponent(() => import('@/views/dashboard/message/components/message-info.vue'))
const messageInfoRef = useTemplateRef('messageInfoRef')
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysMenuQueryRequest, MessageInfoVo>(state, queryMyMessagePage)
const { queryParams } = toRefs(state)
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const columnOption = ref<ColumnConfig<SysMessageResponse>>({
  ...sysMessageColumnOption,
})
/**
 * 批量已读
 */
const handleReadAll = () => {
  state.loadingStatus = true
  updateMessageReadAll()
    .then(() => {
      useMessage().success('已读所有站内信成功!')
      handlePageQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 已读单个
 * @param messageId 消息ID
 */
const handleRead = async (messageId: ModeIdType) => {
  state.loadingStatus = true
  updateMessageRead(messageId)
    .then(() => {
      useMessage().success('已读站内信成功!')
      handlePageQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 查看单个
 * @param messageId 消息ID
 */
const handleView = async (messageId: ModeIdType) => {
  messageInfoRef.value?.show(messageId)
}

/**
 * 收藏信息
 * @param messageId 消息ID
 * @param start 收藏状态
 */
const handleStart = (messageId: ModeIdType, start: MessageStar) => {
  state.loadingStatus = true
  const requestStart = start === messageStarEnums.YES.value ? messageStarEnums.NO.value : messageStarEnums.YES.value
  const requestStartSuccessMsg = start === messageStarEnums.YES.value ? '取消收藏站内信成功！' : '收藏站内信成功！'
  updateMessageStart(messageId, requestStart)
    .then(() => {
      useMessage().success(requestStartSuccessMsg)
      handlePageQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 置顶信息
 * @param messageId 消息ID
 * @param top 置顶状态
 */
const handleTop = (messageId: ModeIdType, top: MessageTop) => {
  state.loadingStatus = true
  const requestTop = top === messageTopEnums.YES.value ? messageTopEnums.NO.value : messageTopEnums.YES.value
  const requestTopSuccessMsg = top === messageTopEnums.YES.value ? '取消收藏站内信成功！' : '收藏站内信成功！'
  updateMessageTop(messageId, requestTop)
    .then(() => {
      useMessage().success(requestTopSuccessMsg)
      handlePageQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 删除信息
 * * @param messageId 消息ID
 *  */
const handleDelete = (messageId: ModeIdType) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将删除站内信, 是否继续?')
    .then(async () => {
      await updateMessageRemove(messageId)
      await handlePageQuery()
      useMessage().success('删除站内信成功!')
    })
    .catch(() => {
      useMessage().success('删除站内信失败!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}
onMounted(() => {
  handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="信息状态" prop="messageStatus">
            <el-select v-model="queryParams.messageStatus" placeholder="请选择信息状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="未读" :value="1"></el-option>
              <el-option label="已读" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="收藏状态" prop="messageStar">
            <xht-enum-select v-model="queryParams.messageStar" :data="messageStarEnums" clearable placeholder="请选择收藏状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar column-status refresh-status @refresh="resetQuery" :column-data="columnOption"></table-tool-bar>
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
      <el-table-column fixed="left" label="发送人" prop="senderName" width="160">
        <template #default="{ row }">
          <el-icon v-if="row.response.messageStar === messageStarEnums.YES.value" color="#FFDC00" :size="18"><StarFilled /></el-icon>
          <el-icon v-if="row.response.messageTop === messageTopEnums.YES.value" :size="18"><ArrowUpBold /></el-icon>
          {{ row.senderName }}
        </template>
      </el-table-column>
      <el-table-column label="消息标题" prop="messageTitle" show-overflow-tooltip min-width="360" />
      <el-table-column label="消息类型" prop="messageType" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.messageType === 1" type="success">系统通知</el-tag>
          <el-tag v-else type="primary">业务提醒</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="消息状态" prop="response.messageStatus" width="120">
        <template #default="{ row }">
          <xht-enum-tag :status="row.response.messageStatus" :data="messageStatusEnums" />
        </template>
      </el-table-column>
      <el-table-column label="已读时间" v-if="columnOption.readTime?.visible" prop="response.readTime" width="180" />
      <el-table-column label="发送时间" v-if="columnOption.createTime?.visible" prop="response.createTime" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #header>
          <el-button type="primary" @click="handleReadAll">标记全部已读</el-button>
        </template>
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button type="success" :icon="View" text @click="handleView(row.response.messageId)">查看</el-button>
            <el-button type="primary" :icon="Edit" text @click="handleRead(row.response.messageId)" v-if="!row.response.readTime">标记已读</el-button>
            <el-dropdown trigger="click" effect="dark" size="large">
              <el-button text>
                更多操作
                <el-icon><DArrowRight /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="StarFilled" @click="handleStart(row.response.messageId, row.response.messageStar)">
                    {{ row.response.messageStar === 1 ? '取消' : null }}收藏
                  </el-dropdown-item>
                  <el-dropdown-item :icon="ArrowUpBold" @click="handleTop(row.response.messageId, row.response.messageTop)">
                    {{ row.response.messageTop === 1 ? '取消' : null }}置顶
                  </el-dropdown-item>
                  <el-dropdown-item :icon="Delete" @click="handleDelete(row.response.messageId)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <xht-pagination
      v-model:current-page="state.queryParams.current"
      v-model:page-size="state.queryParams.size"
      :page-count="state.pages"
      :total="state.total"
      @pagination="handlePageQuery"
    />
    <message-info ref="messageInfoRef" @success="handlePageQuery" />
  </div>
</template>

<style scoped lang="scss"></style>
