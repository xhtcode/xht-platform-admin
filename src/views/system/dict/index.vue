<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        :model="queryParams"
        class="user-select-display"
        label-width="80px"
      >
        <el-row v-if="!state.searchStatus">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="字典编码" prop="dictCode">
              <el-input
                v-model="queryParams.dictCode"
                :maxlength="50"
                show-word-limit
                placeholder="请输入字典编码"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="字典名称" prop="dictName">
              <el-input
                v-model="queryParams.dictName"
                :maxlength="50"
                show-word-limit
                placeholder="请输入字典名称"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="字典状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择字典状态">
                <el-option label="启用" :value="DictStatusEnums.ENABLED" />
                <el-option label="禁用" :value="DictStatusEnums.DISABLED" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-tool-bar
        v-model:show-search="state.searchStatus"
        v-model:column-data="columnOption"
        column-status
        refresh-status
        search-status
        @refresh="handleQuery"
      >
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button
          icon="Edit"
          size="small"
          type="success"
          :disabled="state.singleStatus"
          @click="handleEdit(state.selectedRows[0])"
        >
          修改
        </el-button>
        <el-button
          icon="Delete"
          size="small"
          type="danger"
          :disabled="state.multipleStatus"
          @click="handleDelete(undefined)"
        >
          批量删除
        </el-button>
      </table-tool-bar>
      <xht-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        class="flex-1"
        empty-text="系统暂无字典！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <xht-column-index :size="queryParams.size" :current="queryParams.current" />
        <el-table-column label="字典名称" prop="dictName" width="120" />
        <el-table-column label="字典编码" prop="dictCode" width="120">
          <template #default="{ row }">
            <router-link :to="`/system/dict/${row.id}`" class="link-type">
              {{ row.dictCode }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sortOrder" width="80" />
        <el-table-column label="字典状态" prop="status" width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="字典描述" prop="remark" width="220" />
        <el-table-column label="创建人" prop="createBy" width="160" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="更新人" prop="updateBy" width="160" />
        <el-table-column label="更新时间" prop="updateTime" width="180" />
        <el-table-column fixed="right" label="操作" width="220px">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
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
    <dict-form ref="dictFormRef" @success="handleQuery" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import DictForm from './components/dict-form.vue'
import type { SysDictQueryRequest, SysDictResponse } from '@/service/model/system/dict.model'
import { DictStatusEnums } from '@/service/model/system/dict.model'
import { querySysDictPage, removeSysDictByIds } from '@/service/api/system/dict.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ModeIdArrayType } from '@/service/model/base.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { SysDictColumnOption } from '@/views/system/dict/dict.data'

defineOptions({ name: 'SysDictViewIndex' })

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
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<
  SysDictQueryRequest,
  SysDictResponse
>(state, querySysDictPage)
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const dictFormRef = useTemplateRef('dictFormRef')
const columnOption = ref<ColumnConfig<SysDictResponse>>({
  ...SysDictColumnOption,
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
  dictFormRef.value?.show('add', null)
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
const handleDelete = async (row?: SysDictResponse) => {
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
  await useMessageBox()
    .confirm('此操作将永久删除字典, 是否继续?')
    .then(() => {
      removeSysDictByIds(ids).then(async () => {
        useMessage().success('删除字典成功!')
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

<style scoped lang="scss"></style>
