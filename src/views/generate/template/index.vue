<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { GenTemplateGroupQueryRequest, GenTemplateGroupResponse } from '@/service/model/generate/template.group.model'
import { queryGenTemplateGroupPage, removeGenTemplateGroupByIds } from '@/service/api/generate/template.group.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { genTemplateGroupOperationOption } from '@/views/generate/template/template.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { Delete, Edit, Plus, Refresh, Search, View } from '@element-plus/icons-vue'

defineOptions({ name: 'GenTemplateGroupViewIndex' })

const templateGroupForm = defineAsyncComponent(() => import('@/views/generate/template/components/template-group-form.vue'))
const templateViewForm = defineAsyncComponent(() => import('@/views/generate/template/components/template-view-form.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const templateGroupFormRef = useTemplateRef('templateGroupFormRef')
const templateGroupViewRef = useTemplateRef('templateGroupViewRef')

const state = reactive<TableQueryPageState<GenTemplateGroupQueryRequest, GenTemplateGroupResponse>>({
  queryParams: {
    desc: 'groupSort',
  }, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})

const { handlePageQuery, handleCurrentChange } = useTableQueryPageHooks<GenTemplateGroupQueryRequest, GenTemplateGroupResponse>(
  state,
  queryGenTemplateGroupPage
)

const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<GenTemplateGroupResponse>>({
  ...genTemplateGroupOperationOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  templateGroupFormRef.value?.show('create', null)
}

/**
 * 处理模板查看
 */
const handleView = (row: GenTemplateGroupResponse) => {
  templateGroupViewRef.value?.show(row.id)
}

/**
 * 处理编辑
 */
const handleEdit = (row: GenTemplateGroupResponse) => {
  templateGroupFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row?: GenTemplateGroupResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除模板信息, 是否继续?')
    .then(async () => {
      await removeGenTemplateGroupByIds(row!.id)
      await handlePageQuery()
      useMessage().success('删除模板信息成功!')
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
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="120px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-form-item label="分组名称" prop="groupName">
            <el-input v-model="queryParams.groupName" :maxlength="50" placeholder="请输入分组名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar v-model:column-data="columnOption" v-model:show-search="state.searchStatus" column-status refresh-status @refresh="resetQuery">
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
      <el-button :icon="Edit" size="small" type="success" :disabled="state.singleStatus" @click="handleEdit(state.selectedRows[0])">修改</el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
      highlight-current-row
      border
      @current-change="handleCurrentChange"
    >
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.groupName?.visible" label="分组名称" min-width="200" prop="groupName" />
      <el-table-column v-if="columnOption.templateCount?.visible" label="模板数量" min-width="120" prop="templateCount" />
      <el-table-column v-if="columnOption.groupSort?.visible" label="分组排序" min-width="120" prop="groupSort" />
      <el-table-column v-if="columnOption.groupDesc?.visible" label="分组描述" min-width="260" prop="groupDesc" show-overflow-tooltip />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button :icon="View" link type="primary" @click="handleView(row)">模板编辑</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
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
    <template-group-form ref="templateGroupFormRef" @success="handlePageQuery()" />
    <template-view-form ref="templateGroupViewRef" @success="handlePageQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
