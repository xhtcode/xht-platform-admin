<template>
  <div class="main-container-none">
    <div class="main-container-auto main-container-view">
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        :model="queryParams"
        class="user-select-display"
        label-width="100px"
      >
        <el-row>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="数据源" prop="dataSourceId">
              <datasource-select v-model="queryParams.dataSourceId" placeholder="请选择数据源" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="模板分组" prop="groupId">
              <template-group-select v-model="queryParams.groupId" placeholder="请选择模板分组" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="表名称" prop="tableName">
              <template-group-select v-model="queryParams.tableName" placeholder="请输入表名称" />
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
        :column-data="[]"
        column-status
        refresh-status
        search-status
        @refresh="handleQuery"
      >
        <el-button icon="Download" size="small" type="primary" @click="handleImport">
          导入
        </el-button>
        <el-button
          :disabled="state.singleStatus"
          icon="Edit"
          size="small"
          type="success"
          @click="handleEdit(state.selectedRows[0])"
        >
          修改
        </el-button>
        <el-button
          :disabled="state.multipleStatus"
          icon="download"
          size="small"
          type="warning"
          @click="handleDownload()"
        >
          批量下载
        </el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :cell-style="cellStyle"
        :data="state.tableList"
        :header-cell-style="headerCellStyle"
        class="flex-1"
        empty-text="系统相关表信息！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column :index="createTableIndex" label="序号" type="index" width="55" />
        <el-table-column label="引擎名称" prop="engineName" width="100" />
        <el-table-column label="数据库表名" align="left" prop="tableName" width="220" sortable />
        <el-table-column label="表注释" prop="tableComment" width="260" show-overflow-tooltip />
        <el-table-column label="代码名称" prop="codeName" width="220" />
        <el-table-column label="代码注释" prop="codeComment" width="260" show-overflow-tooltip />
        <el-table-column label="表创建时间" prop="tableCreateTime" width="180" sortable />
        <el-table-column label="表更新时间" prop="tableUpdateTime" width="180" sortable />
        <el-table-column align="center" fixed="right" label="操作" width="280px">
          <template #default="{ row }">
            <el-button icon="refresh" link type="primary" @click="handleSync(row)">同步</el-button>
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button icon="download" link type="warning" @click="handleDownload(row)">
              下载
            </el-button>
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
    </div>
    <table-from ref="tableFormRef" @success="handleQuery()" />
    <import-table ref="importTableRef" @success="handleQuery()" />
    <download-code-file ref="downloadCodeFileRef" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks, useTableToolHooks } from '@/hooks/use-crud-hooks'
import TableFrom from './components/table-from.vue'
import type {
  GenTableInfoQueryRequest,
  GenTableInfoResponse,
} from '@/service/model/generate/table.model'
import {
  queryExistsPage,
  removeGenTableInfoByIds,
  syncTableApi,
} from '@/service/api/generate/table.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import ImportTable from '@/views/generate/table/components/import-table.vue'
import { ModeIdArrayType } from '@/service/model/base.model'
import DownloadCodeFile from '@/views/generate/table/components/download-code-file.vue'

defineOptions({ name: 'GenTableInfoViewIndex' })

const state = reactive<TableQueryPageState<GenTableInfoQueryRequest, GenTableInfoResponse>>({
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
const { createTableIndex, handleQuery, handleSelectionChange } = useTableQueryPageHooks<
  GenTableInfoQueryRequest,
  GenTableInfoResponse
>(state, queryExistsPage)
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const tableFormRef = useTemplateRef('tableFormRef')
const importTableRef = useTemplateRef('importTableRef')
const downloadCodeFileRef = useTemplateRef('downloadCodeFileRef')
const { cellStyle, headerCellStyle } = useTableToolHooks()

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  await handleQuery()
}

/**
 * 处理导入
 */
const handleImport = () => {
  importTableRef.value?.show()
}

/**
 * 处理编辑
 */
const handleEdit = (row: GenTableInfoResponse) => {
  tableFormRef.value?.show(row.id)
}

/**
 * 处理同步操作
 */
const handleSync = async (row: GenTableInfoResponse) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm(`是否要同步${row.tableName}的信息,此操作会更改已有的配置，是否继续！`)
    .then(() => {
      syncTableApi(row!.id).then(async () => {
        useMessage().success(`${row.tableName}表信息成功!`)
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理下载操作
 */
const handleDownload = async (row?: GenTableInfoResponse) => {
  state.loadingStatus = true
  let dataArray: ModeIdArrayType = []
  if (row) {
    dataArray = [row]
  } else {
    dataArray = [...state.selectedRows]
  }
  if (!dataArray || dataArray.length <= 0) {
    useMessage().error('请选择表信息数据')
    return
  }
  downloadCodeFileRef.value?.show(dataArray)
  state.loadingStatus = false
}

/**
 * 处理删除
 */
const handleDelete = async (row: GenTableInfoResponse) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除表信息, 是否继续?')
    .then(() => {
      removeGenTableInfoByIds(row!.id).then(async () => {
        useMessage().success('删除表信息成功!')
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
