<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { FlowCategoryQueryRequest, FlowCategoryResponse } from '@/service/model/workflow/category.model'
import { queryFlowCategoryPage, removeFlowCategoryById, removeFlowCategoryByIdBatch } from '@/service/api/workflow/category.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { flowCategoryColumnOption } from '@/views/workflow/category/category.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { categoryStatusEnum } from '@/service/enums/workflow/category.enum'

defineOptions({ name: 'FlowCategoryView' })

const xhtCategoryFrom = defineAsyncComponent(() => import('@/views/workflow/category/components/category-form.vue'))
const flowCategoryFormRef = useTemplateRef('flowCategoryFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<FlowCategoryQueryRequest, FlowCategoryResponse>>({
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
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<FlowCategoryQueryRequest, FlowCategoryResponse>(
  state,
  queryFlowCategoryPage
)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<FlowCategoryResponse>>({
  ...flowCategoryColumnOption,
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
 * 处理新增流程扩展-流程分类
 */
const handleAdd = () => {
  flowCategoryFormRef.value?.show('create', null)
}

/**
 * 处理编辑流程扩展-流程分类
 */
const handleEdit = (row: FlowCategoryResponse) => {
  flowCategoryFormRef.value?.show('update', row.id)
}

/**
 * 处理删除流程扩展-流程分类
 */
const handleDelete = (row: FlowCategoryResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除流程扩展-流程分类, 是否继续?')
    .then(async () => {
      await removeFlowCategoryById(row.id)
      await handlePageQuery()
      useMessage().success('删除流程扩展-流程分类成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除流程扩展-流程分类
 */
const handleBatchDelete = () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择流程扩展-流程分类数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将批量删除${ids.length}个流程扩展-流程分类, 是否继续?`)
    .then(async () => {
      await removeFlowCategoryByIdBatch(ids)
      await handlePageQuery()
      useMessage().success('批量删除流程扩展-流程分类成功!')
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
          <el-form-item label="类别编码" prop="categoryCode">
            <el-input v-model="queryParams.categoryCode" clearable :maxlength="100" show-word-limit placeholder="请输入类别编码" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="类别名称" prop="categoryName">
            <el-input v-model="queryParams.categoryName" clearable :maxlength="200" show-word-limit placeholder="请输入类别名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="类别状态" prop="categoryStatus">
            <xht-enum-select v-model="queryParams.categoryStatus" :data="categoryStatusEnum" clearable placeholder="请选择类别状态" />
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['xht:flow:category:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['xht:flow:category:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleBatchDelete"
        v-authorization="['xht:flow:category:remove']"
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
      <el-table-column v-if="columnOption.categoryName?.visible" label="类别名称" prop="categoryName" min-width="160" />
      <el-table-column v-if="columnOption.categoryCode?.visible" label="类别编码" prop="categoryCode" min-width="160" />
      <el-table-column v-if="columnOption.categoryDesc?.visible" label="类别描述" prop="categoryDesc" min-width="260" />
      <el-table-column v-if="columnOption.categoryStatus?.visible" label="类别状态" prop="categoryStatus" min-width="100" sortable />
      <el-table-column v-if="columnOption.categorySort?.visible" label="类别排序" prop="categorySort" min-width="100" sortable />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!--  @vue-generic {FlowCategoryResponse}   -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['xht:flow:category:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['xht:flow:category:remove']">删除</el-button>
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
    <xht-category-from ref="flowCategoryFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
