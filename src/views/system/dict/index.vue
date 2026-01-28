<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysDictQueryRequest, SysDictResponse } from '@/service/model/system/dict.model'
import { DictStatusEnums } from '@/service/model/system/dict.model'
import { querySysDictPage, removeSysDictByIds } from '@/service/api/system/dict.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ModeIdArrayType } from '@/service/model/base.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysDictColumnOption } from '@/views/system/dict/dict.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'SysDictViewIndex' })

const dictForm = defineAsyncComponent(() => import('@/views/system/dict/components/dict-form.vue'))
const dictFormRef = useTemplateRef('dictFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysDictQueryRequest, SysDictResponse>>({
  queryParams: {
    current: 1,
    size: 10,
    ascName: 'sortOrder',
  },
  loadingStatus: false,
  total: 0,
  pages: 0,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<SysDictQueryRequest, SysDictResponse>(state, querySysDictPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysDictResponse>>({
  ...sysDictColumnOption,
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
  dictFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysDictResponse) => {
  dictFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row?: SysDictResponse) => {
  state.loadingStatus = true
  let ids: ModeIdArrayType = []
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows.map((item) => item.id)
  }
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择字典数据')
    return
  }
  useMessageBox()
    .confirm('此操作将永久删除字典, 是否继续?')
    .then(async () => {
      await removeSysDictByIds(ids)
      useMessage().success('删除字典成功!')
      await handleQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

onMounted(async () => {
  await handleQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="字典编码" prop="dictCode">
            <el-input v-model="queryParams.dictCode" :maxlength="50" placeholder="请输入字典编码" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="queryParams.dictName" :maxlength="50" placeholder="请输入字典名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="字典状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择字典状态">
              <el-option :value="DictStatusEnums.ENABLED" label="启用" />
              <el-option :value="DictStatusEnums.DISABLED" label="禁用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleQuery">查询</el-button>
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
      @refresh="handleQuery"
    >
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:dict:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['sys:dict:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleDelete(undefined)"
        v-authorization="['sys:dict:remove']"
      >
        批量删除
      </el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="系统暂无字典！"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.dictName?.visible" label="字典名称" min-width="160" prop="dictName" />
      <el-table-column v-if="columnOption.dictCode?.visible" label="字典编码" min-width="160" prop="dictCode">
        <template #default="{ row }">
          <router-link :to="`/system/dict/${row.id}?tagName=字典项(${row.dictName})`">
            <el-link>{{ row.dictCode }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.sortOrder?.visible" label="排序" min-width="80" prop="sortOrder" />
      <el-table-column v-if="columnOption.status?.visible" label="字典状态" min-width="160" prop="status" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.remark?.visible" label="字典描述" min-width="220" prop="remark" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column fixed="right" label="操作" width="220px">
        <template #default="{ row }">
          <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
          <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <xht-pagination
      v-model:current-page="state.queryParams.current"
      v-model:page-size="state.queryParams.size"
      :page-count="state.pages"
      :total="state.total"
      @pagination="handleQuery"
    />
    <dict-form ref="dictFormRef" @success="handleQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
