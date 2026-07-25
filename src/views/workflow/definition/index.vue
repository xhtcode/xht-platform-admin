<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { FlowDefinitionQueryRequest, FlowDefinitionResponse } from '@/service/model/workflow/definition.model'
import { queryFlowDefinitionPage, removeFlowDefinitionById, removeFlowDefinitionByIdBatch } from '@/service/api/workflow/definition.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { flowDefinitionColumnOption } from '@/views/workflow/definition/definition.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'FlowDefinitionView' })

const xhtDefinitionFrom = defineAsyncComponent(() => import('@/views/workflow/definition/components/definition-form.vue'))
const flowDefinitionFormRef = useTemplateRef('flowDefinitionFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<FlowDefinitionQueryRequest, FlowDefinitionResponse>>({
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
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<FlowDefinitionQueryRequest, FlowDefinitionResponse>(
  state,
  queryFlowDefinitionPage
)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<FlowDefinitionResponse>>({
  ...flowDefinitionColumnOption,
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
 * 处理新增流程扩展-流程定义
 */
const handleAdd = () => {
  flowDefinitionFormRef.value?.show('create', null)
}

/**
 * 处理编辑流程扩展-流程定义
 */
const handleEdit = (row: FlowDefinitionResponse) => {
  flowDefinitionFormRef.value?.show('update', row.id)
}

/**
 * 处理删除流程扩展-流程定义
 */
const handleDelete = (row: FlowDefinitionResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除流程扩展-流程定义, 是否继续?')
    .then(async () => {
      await removeFlowDefinitionById(row.id)
      await handlePageQuery()
      useMessage().success('删除流程扩展-流程定义成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除流程扩展-流程定义
 */
const handleBatchDelete = () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择流程扩展-流程定义数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将批量删除${ids.length}个流程扩展-流程定义, 是否继续?`)
    .then(async () => {
      await removeFlowDefinitionByIdBatch(ids)
      await handlePageQuery()
      useMessage().success('批量删除流程扩展-流程定义成功!')
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
          <el-form-item label="模型id" prop="modelId">
            <el-input v-model="queryParams.modelId" clearable :maxlength="64" show-word-limit placeholder="请输入模型id" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="模型名称" prop="modelName">
            <el-input v-model="queryParams.modelName" clearable :maxlength="255" show-word-limit placeholder="请输入模型名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程定义标识" prop="definitionKey">
            <el-input v-model="queryParams.definitionKey" clearable :maxlength="255" show-word-limit placeholder="请输入流程定义标识" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程定义名称" prop="definitionName">
            <el-input v-model="queryParams.definitionName" clearable :maxlength="255" show-word-limit placeholder="请输入流程定义名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程定义描述" prop="definitionDesc">
            <el-input
              v-model="queryParams.definitionDesc"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              :maxlength="255"
              show-word-limit
              placeholder="请输入流程定义描述"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程部署id" prop="deploymentId">
            <el-input v-model="queryParams.deploymentId" clearable :maxlength="255" show-word-limit placeholder="请输入流程部署id" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程部署状态" prop="deploymentStatus">
            <el-input v-model="queryParams.deploymentStatus" clearable :maxlength="255" show-word-limit placeholder="请输入流程部署状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程部署版本" prop="deploymentVersion">
            <el-input v-model="queryParams.deploymentVersion" clearable :maxlength="255" show-word-limit placeholder="请输入流程部署版本" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程部署开始时间" prop="deploymentTimeStart">
            <el-date-picker
              v-model="queryParams.deploymentTimeStart"
              format="YYYY-MM-DD"
              placeholder="选择流程部署开始时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="流程部署结束时间" prop="deploymentTimeEnd">
            <el-date-picker
              v-model="queryParams.deploymentTimeEnd"
              format="YYYY-MM-DD"
              placeholder="选择流程部署结束时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="表单id" prop="formId">
            <el-input v-model="queryParams.formId" clearable :maxlength="255" show-word-limit placeholder="请输入表单id" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="表单名称" prop="formName">
            <el-input v-model="queryParams.formName" clearable :maxlength="255" show-word-limit placeholder="请输入表单名称" />
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['xht:flow:definition:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['xht:flow:definition:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleBatchDelete"
        v-authorization="['xht:flow:definition:remove']"
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
      <el-table-column v-if="columnOption.modelName?.visible" label="模型名称" prop="modelName" min-width="200" />
      <el-table-column v-if="columnOption.modelVersion?.visible" label="模型版本" prop="modelVersion" width="100" />
      <el-table-column v-if="columnOption.definitionStatus?.visible" label="流程定义状态" prop="definitionStatus" width="160" sortable />
      <el-table-column v-if="columnOption.definitionSort?.visible" label="流程定义排序" prop="definitionSort" width="160" sortable />
      <el-table-column v-if="columnOption.definitionKey?.visible" label="流程定义标识" prop="definitionKey" min-width="160" />
      <el-table-column v-if="columnOption.definitionName?.visible" label="流程定义名称" prop="definitionName" min-width="160" />
      <el-table-column v-if="columnOption.definitionDesc?.visible" label="流程定义描述" prop="definitionDesc" min-width="260" />
      <el-table-column v-if="columnOption.deploymentStatus?.visible" label="流程部署状态" prop="deploymentStatus" width="160" sortable />
      <el-table-column v-if="columnOption.deploymentVersion?.visible" label="流程部署版本" prop="deploymentVersion" width="160" />
      <el-table-column v-if="columnOption.deploymentTime?.visible" label="流程部署时间" prop="deploymentTime" width="180" />
      <el-table-column v-if="columnOption.formName?.visible" label="表单名称" prop="formName" min-width="200" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!--  @vue-generic {FlowDefinitionResponse}   -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['xht:flow:definition:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['xht:flow:definition:remove']">删除</el-button>
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
    <xht-definition-from ref="flowDefinitionFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
