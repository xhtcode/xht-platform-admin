<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        :model="queryParams"
        class="user-select-display"
        label-width="120px"
      >
        <el-row>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-form-item label="分组名称" prop="groupName">
              <el-input
                v-model="queryParams.groupName"
                :maxlength="50"
                show-word-limit
                placeholder="请输入分组名称"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-tool-bar
        v-model:show-search="state.searchStatus"
        v-model:column-data="columnOption"
        column-status
        refresh-status
        @refresh="handleQuery"
      >
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button
          :disabled="state.singleStatus"
          icon="Edit"
          size="small"
          type="success"
          @click="handleEdit(state.selectedRows[0])"
        >
          修改
        </el-button>
      </table-tool-bar>
      <xht-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        class="flex-1"
        highlight-current-row
        @current-change="handleCurrentChange"
        empty-text="系统暂无相关模板信息！"
      >
        <xht-column-index :size="queryParams.size" :current="queryParams.current" />
        <el-table-column
          label="分组名称"
          prop="groupName"
          min-width="200"
          v-if="columnOption.groupName?.visible"
        />
        <el-table-column
          label="模板数量"
          prop="templateCount"
          min-width="120"
          v-if="columnOption.templateCount?.visible"
        />
        <el-table-column
          label="分组描述"
          prop="groupSort"
          min-width="120"
          v-if="columnOption.groupSort?.visible"
        />
        <el-table-column
          label="分组描述"
          prop="groupDesc"
          min-width="260"
          show-overflow-tooltip
          v-if="columnOption.groupDesc?.visible"
        />
        <el-table-column
          label="创建人"
          prop="createBy"
          width="160"
          v-if="columnOption.createBy?.visible"
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="180"
          v-if="columnOption.createTime?.visible"
        />
        <el-table-column
          label="更新人"
          prop="updateBy"
          width="160"
          v-if="columnOption.updateBy?.visible"
        />
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="180"
          v-if="columnOption.updateTime?.visible"
        />
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
import type {
  GenTemplateGroupQueryRequest,
  GenTemplateGroupResponse,
} from '@/service/model/generate/template.group.model'
import {
  queryGenTemplateGroupPage,
  removeGenTemplateGroupByIds,
} from '@/service/api/generate/template.group.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import TemplateGroupForm from '@/views/generate/template/components/template-group-form.vue'
import TemplateViewForm from '@/views/generate/template/components/template-view-form.vue'
import { GenTemplateGroupOperationOption } from '@/views/generate/template/template.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

defineOptions({ name: 'GenTemplateGroupViewIndex' })

const state = reactive<TableQueryPageState<GenTemplateGroupQueryRequest, GenTemplateGroupResponse>>(
  {
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
  }
)
const { handleQuery, handleCurrentChange } = useTableQueryPageHooks<
  GenTemplateGroupQueryRequest,
  GenTemplateGroupResponse
>(state, queryGenTemplateGroupPage)
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const templateGroupFormRef = useTemplateRef('templateGroupFormRef')
const templateGroupViewRef = useTemplateRef('templateGroupViewRef')
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
  templateGroupFormRef.value?.show('add', null)
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
