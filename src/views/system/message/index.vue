<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysMessageQueryRequest, SysMessageResponse } from '@/service/model/system/message.model'
import { queryAdminPage, updateCancelAll } from '@/service/api/system/message.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysMessageColumnOption } from '@/views/system/message/message.data'
import { RefreshLeft, Refresh, Search, View } from '@element-plus/icons-vue'
import { messageTypeEnums } from '@/service/enums/system/message.enum'

defineOptions({ name: 'SysMessageViewIndex' })

const messageView = defineAsyncComponent(() => import('@/views/system/message/components/message-view.vue'))
const messageViewRef = useTemplateRef('messageViewRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysMessageQueryRequest, SysMessageResponse>>({
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
const { handlePageQuery } = useTableQueryPageHooks<SysMessageQueryRequest, SysMessageResponse>(state, queryAdminPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysMessageResponse>>({
  ...sysMessageColumnOption,
})

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理编辑站内信
 */
const handleView = (row: SysMessageResponse) => {
  messageViewRef.value?.show(row.id)
}

/**
 * 处理删除站内信
 */
const handleCancel = (row: SysMessageResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将撤回全部站内信, 是否继续?')
    .then(async () => {
      await updateCancelAll(row.id)
      await handlePageQuery()
      useMessage().success('撤回站内信成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="发件人名称" prop="senderName">
            <el-input v-model="queryParams.senderName" clearable :maxlength="100" show-word-limit placeholder="请输入发件人名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="消息标题" prop="messageTitle">
            <el-input v-model="queryParams.messageTitle" clearable :maxlength="100" show-word-limit placeholder="请输入消息标题" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar
      v-model:column-data="columnOption"
      v-model:show-search="state.searchStatus"
      column-status
      refresh-status
      search-status
      @refresh="resetQuery"
    />
    <el-table v-loading="state.loadingStatus" :data="state.tableList" border row-key="id" empty-text="暂无匹配数据 🔍 试试调整筛选条件吧">
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.senderName?.visible" label="发件人名称" prop="senderName" width="120" />
      <el-table-column v-if="columnOption.messageType?.visible" label="消息类型" prop="messageType" width="160">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row?.messageType" :data="messageTypeEnums" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.cancelTime?.visible" label="撤回时间" prop="cancelTime" min-width="180" />
      <el-table-column v-if="columnOption.messageTitle?.visible" label="消息标题" prop="messageTitle" show-overflow-tooltip min-width="360" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysMessageResponse} -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="View" link type="primary" @click="handleView(row)">发送详情</el-button>
            <template v-if="!row.cancelTime">
              <el-button :icon="RefreshLeft" link type="danger" @click="handleCancel(row)">撤回</el-button>
            </template>
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
    <message-view ref="messageViewRef" />
  </div>
</template>

<style lang="scss" scoped></style>
