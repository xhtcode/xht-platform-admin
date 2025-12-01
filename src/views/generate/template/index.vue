<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
      <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="120px">
        <el-row>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-form-item label="分组名称" prop="groupName">
              <el-input v-model="queryParams.groupName" :maxlength="50" placeholder="请输入分组名称" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-tool-bar v-model:column-data="columnOption" v-model:show-search="state.searchStatus" column-status refresh-status @refresh="handleQuery">
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button :disabled="state.singleStatus" icon="Edit" size="small" type="success" @click="handleEdit(state.selectedRows[0])">修改</el-button>
      </table-tool-bar>
      <xht-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        class="flex-1"
        empty-text="系统暂无相关模板信息！"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <xht-column-index :current="queryParams.current" :size="queryParams.size" />
        <el-table-column v-if="columnOption.groupName?.visible" label="分组名称" min-width="200" prop="groupName" />
        <el-table-column v-if="columnOption.templateCount?.visible" label="模板数量" min-width="120" prop="templateCount" />
        <el-table-column v-if="columnOption.groupSort?.visible" label="分组描述" min-width="120" prop="groupSort" />
        <el-table-column v-if="columnOption.groupDesc?.visible" label="分组描述" min-width="260" prop="groupDesc" show-overflow-tooltip />
        <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
        <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
        <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
        <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
        <el-table-column align="center" fixed="right" label="操作" width="260px">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="view" link type="primary" @click="handleView(row)">模板编辑</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </xht-table>
      <xht-pagination
        v-model:current-page="state.queryParams.current"
        v-model:page-size="state.queryParams.size"
        :page-count="state.pages"
        :total="state.total"
        @pagination="handleQuery"
      />
    </div>
    <template-group-form ref="templateGroupFormRef" @success="handleQuery()" />
    <template-view-form ref="templateGroupViewRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { GenTemplateGroupQueryRequest, GenTemplateGroupResponse } from '@/service/model/generate/template.group.model'
import { queryGenTemplateGroupPage, removeGenTemplateGroupByIds } from '@/service/api/generate/template.group.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { GenTemplateGroupOperationOption } from '@/views/generate/template/template.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

defineOptions({ name: 'GenTemplateGroupViewIndex' })

const templateGroupForm = defineAsyncComponent(() => import('@/views/generate/template/components/template-group-form.vue'))
const templateViewForm = defineAsyncComponent(() => import('@/views/generate/template/components/template-view-form.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const templateGroupFormRef = useTemplateRef('templateGroupFormRef')
const templateGroupViewRef = useTemplateRef('templateGroupViewRef')

const state = reactive<TableQueryPageState<GenTemplateGroupQueryRequest, GenTemplateGroupResponse>>({
  queryParams: {
    current: 1,
    size: 10,
  },
  loadingStatus: false,
  total: 0,
  pages: 0,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})

const { handleQuery, handleCurrentChange } = useTableQueryPageHooks<GenTemplateGroupQueryRequest, GenTemplateGroupResponse>(
  state,
  queryGenTemplateGroupPage
)

const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<GenTemplateGroupResponse>>({
  ...GenTemplateGroupOperationOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  await handleQuery()
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
const handleDelete = async (row?: GenTemplateGroupResponse) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除模板信息, 是否继续?')
    .then(() => {
      removeGenTemplateGroupByIds(row!.id).then(async () => {
        useMessage().success('删除模板信息成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}

onMounted(async () => {
  await handleQuery()
})
</script>
<style lang="scss" scoped></style>
