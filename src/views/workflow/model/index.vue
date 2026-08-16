<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { FlowModelQueryRequest, FlowModelResponse } from '@/service/model/workflow/model.model'
import { queryFlowModelPage, removeFlowModelById, removeFlowModelByIdBatch } from '@/service/api/workflow/model.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { flowModelColumnOption } from '@/views/workflow/model/model.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'FlowModelView' })

const actModelFrom = defineAsyncComponent(() => import('@/views/workflow/model/components/model-form.vue'))
const flowModelFormRef = useTemplateRef('flowModelFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<FlowModelQueryRequest, FlowModelResponse>>({
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
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<FlowModelQueryRequest, FlowModelResponse>(state, queryFlowModelPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<FlowModelResponse>>({
  ...flowModelColumnOption,
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
 * 处理新增流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 */
const handleAdd = () => {
  flowModelFormRef.value?.show('create', null)
}

/**
 * 处理编辑流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 */
const handleEdit = (row: FlowModelResponse) => {
  flowModelFormRef.value?.show('update', row.id)
}

/**
 * 处理删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 */
const handleDelete = (row: FlowModelResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储, 是否继续?')
    .then(async () => {
      await removeFlowModelById(row.id)
      await handlePageQuery()
      useMessage().success('删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 */
const handleBatchDelete = () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm(
      `此操作将批量删除${ids.length}个流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储, 是否继续?`
    )
    .then(async () => {
      await removeFlowModelByIdBatch(ids)
      await handlePageQuery()
      useMessage().success('批量删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储成功!')
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
          <el-form-item label="" prop="id">
            <el-input v-model="queryParams.id" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="name">
            <el-input v-model="queryParams.name" clearable :maxlength="255" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="key">
            <el-input v-model="queryParams.key" clearable :maxlength="255" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="category">
            <el-input v-model="queryParams.category" clearable :maxlength="255" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="开始时间" prop="createTimeStart">
            <el-input v-model="queryParams.createTimeStart" clearable :maxlength="0" show-word-limit placeholder="请输入开始时间" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="结束时间" prop="createTimeEnd">
            <el-input v-model="queryParams.createTimeEnd" clearable :maxlength="0" show-word-limit placeholder="请输入结束时间" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="开始时间" prop="lastUpdateTimeStart">
            <el-input v-model="queryParams.lastUpdateTimeStart" clearable :maxlength="0" show-word-limit placeholder="请输入开始时间" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="结束时间" prop="lastUpdateTimeEnd">
            <el-input v-model="queryParams.lastUpdateTimeEnd" clearable :maxlength="0" show-word-limit placeholder="请输入结束时间" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="deploymentId">
            <el-input v-model="queryParams.deploymentId" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="editorSourceValueId">
            <el-input v-model="queryParams.editorSourceValueId" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="editorSourceExtraValueId">
            <el-input v-model="queryParams.editorSourceExtraValueId" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="" prop="tenantId">
            <el-input v-model="queryParams.tenantId" clearable :maxlength="255" show-word-limit placeholder="请输入" />
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
    >
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['act:re:model:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['act:re:model:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleBatchDelete"
        v-authorization="['act:re:model:remove']"
      >
        批量删除
      </el-button>
    </table-tool-bar>
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
      <el-table-column v-if="columnOption.rev?.visible" label="" prop="rev" />
      <el-table-column v-if="columnOption.name?.visible" label="" prop="name" />
      <el-table-column v-if="columnOption.key?.visible" label="" prop="key" />
      <el-table-column v-if="columnOption.category?.visible" label="" prop="category" />
      <el-table-column v-if="columnOption.createTime?.visible" label="" prop="createTime" />
      <el-table-column v-if="columnOption.lastUpdateTime?.visible" label="" prop="lastUpdateTime" />
      <el-table-column v-if="columnOption.version?.visible" label="" prop="version" />
      <el-table-column v-if="columnOption.metaInfo?.visible" label="" prop="metaInfo" />
      <el-table-column v-if="columnOption.deploymentId?.visible" label="" prop="deploymentId" />
      <el-table-column v-if="columnOption.editorSourceValueId?.visible" label="" prop="editorSourceValueId" />
      <el-table-column v-if="columnOption.editorSourceExtraValueId?.visible" label="" prop="editorSourceExtraValueId" />
      <el-table-column v-if="columnOption.tenantId?.visible" label="" prop="tenantId" />
      <!--  @vue-generic {FlowModelResponse}   -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['act:re:model:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['act:re:model:remove']">删除</el-button>
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
    <act-model-from ref="flowModelFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
