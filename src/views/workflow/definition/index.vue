<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import type { AxiosPromise } from 'axios'
import { useTableQueryListHooks } from '@/hooks/use-crud-hooks'
import type { FlowDefinitionQueryRequest, FlowDefinitionResponse, FlowDefinitionTreeResponse } from '@/service/model/workflow/definition.model'
import { queryFlowDefinitionList, removeFlowDefinitionById } from '@/service/api/workflow/definition.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { flowDefinitionColumnOption } from '@/views/workflow/definition/definition.data'
import { Delete, Edit, Plus, Refresh, Search, Sort } from '@element-plus/icons-vue'
import { definitionStatusEnum, definitionTypeEnum } from '@/service/enums/workflow/definition.enum'

defineOptions({ name: 'FlowDefinitionView' })

const flowDefinitionForm = defineAsyncComponent(() => import('@/views/workflow/definition/components/definition-form.vue'))
const flowDefinitionFormRef = useTemplateRef('flowDefinitionFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryListState<FlowDefinitionQueryRequest, FlowDefinitionTreeResponse>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 刷新表格状态
  expandAllStatus: false, // 展开所有状态
  searchStatus: false, // 是否显示搜索区域
  queryParams: {}, // 查询参数
  tableList: [], // 表格数据列表
})

/**
 * 处理树形数据，根据定义类型判断是否存在下级节点
 * 分类（category）类型一定有下级，其他类型没有下级
 * @param list 树形列表数据
 */
const handleTreeData = (list: FlowDefinitionTreeResponse[]): FlowDefinitionTreeResponse[] => {
  return list.map((item) => ({
    ...item,
    hasChildren: item.definitionType === 'category',
  }))
}

/**
 * 查询树形列表，并标记每个节点的下级状态
 * @param query 查询参数
 */
const queryFlowDefinitionTree = async (query: FlowDefinitionQueryRequest): AxiosPromise<FlowDefinitionTreeResponse[]> => {
  const response = await queryFlowDefinitionList(query)
  response.data = handleTreeData(response.data)
  return response
}

const { handleListQuery, handleExpandAll } = useTableQueryListHooks<FlowDefinitionQueryRequest, FlowDefinitionTreeResponse>(
  state,
  queryFlowDefinitionTree
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
  await handleListQuery()
}

/**
 * 处理新增流程定义
 * @param row 父级流程定义（新增子级时传）
 */
const handleAdd = (row?: FlowDefinitionResponse) => {
  flowDefinitionFormRef.value?.show('create', null, row)
}

/**
 * 处理修改流程定义
 */
const handleEdit = (row: FlowDefinitionResponse) => {
  flowDefinitionFormRef.value?.show('update', row.id)
}

/**
 * 处理删除流程定义
 */
const handleDelete = (row: FlowDefinitionResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除该流程定义及其下级流程定义, 是否继续?')
    .then(async () => {
      await removeFlowDefinitionById(row.id)
      useMessage().success('删除流程定义成功!')
      await handleListQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 树形懒加载子节点
 * @param row 当前展开的行数据
 * @param treeNode 树节点信息
 * @param resolve 解析子节点数据
 */
const handleLoadChildren = async (row: FlowDefinitionTreeResponse, treeNode: unknown, resolve: (data: FlowDefinitionTreeResponse[]) => void) => {
  try {
    const { data } = await queryFlowDefinitionList({ parentId: row.id })
    resolve(handleTreeData(data))
  } catch {
    resolve([])
  }
}

onMounted(async () => {
  await handleListQuery()
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
          <el-space>
            <el-button :icon="Search" type="primary" @click="handleListQuery()">查询</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-space>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="定义编码" prop="definitionCode">
            <el-input v-model="queryParams.definitionCode" clearable :maxlength="100" show-word-limit placeholder="请输入流程定义编码" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="定义名称" prop="definitionName">
            <el-input v-model="queryParams.definitionName" clearable :maxlength="200" show-word-limit placeholder="请输入流程定义名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="定义状态" prop="definitionStatus">
            <xht-enum-select v-model="queryParams.definitionStatus" :data="definitionStatusEnum" clearable placeholder="请选择流程定义状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleListQuery()">查询</el-button>
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd()" v-authorization="['xht:flow:definition:create']">新增</el-button>
      <el-button :icon="Sort" size="small" type="info" @click="handleExpandAll">折叠/展开</el-button>
    </table-tool-bar>
    <el-table
      v-if="state.refreshTable"
      v-loading="state.loadingStatus"
      :data="state.tableList"
      :default-expand-all="state.expandAllStatus"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      lazy
      :load="handleLoadChildren"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
    >
      <el-table-column v-if="columnOption.definitionName?.visible" fixed="left" label="流程定义名称" prop="definitionName" min-width="200" />
      <el-table-column v-if="columnOption.definitionCode?.visible" label="流程定义编码" prop="definitionCode" min-width="160" />
      <el-table-column v-if="columnOption.definitionType?.visible" align="center" label="流程定义类型" prop="definitionType" min-width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.definitionType" :data="definitionTypeEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.definitionStatus?.visible" align="center" label="流程定义状态" prop="definitionStatus" min-width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.definitionStatus" :data="definitionStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.definitionLevel?.visible" align="center" label="流程定义层级" prop="definitionLevel" width="100" />
      <el-table-column v-if="columnOption.definitionSort?.visible" align="center" label="流程定义排序" prop="definitionSort" width="100" />
      <el-table-column v-if="columnOption.definitionDesc?.visible" label="流程定义描述" prop="definitionDesc" min-width="240" show-overflow-tooltip />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!--  @vue-generic {FlowDefinitionResponse}   -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Plus" link type="primary" @click="handleAdd(row)" v-authorization="['xht:flow:definition:create']">新增下级</el-button>
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['xht:flow:definition:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['xht:flow:definition:remove']">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <flow-definition-form ref="flowDefinitionFormRef" @success="handleListQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
