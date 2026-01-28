<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import type { GenTableInfoQueryRequest, GenTableInfoResponse } from '@/service/model/generate/table.model'
import type { ModeIdArrayType } from '@/service/model/base.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { genTableInfoColumnOption } from '@/views/generate/table/table.data'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { queryExistsPage, removeGenTableInfoByIds, syncTableApi } from '@/service/api/generate/table.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { Delete, Download, Edit, Refresh, Search, View } from '@element-plus/icons-vue'

defineOptions({ name: 'GenTableInfoViewIndex' })

const tableFrom = defineAsyncComponent(() => import('@/views/generate/table/components/table-from.vue'))
const codeView = defineAsyncComponent(() => import('@/views/generate/table/components/code-view.vue'))
const importTable = defineAsyncComponent(() => import('@/views/generate/table/components/import-table.vue'))
const downloadCodeFile = defineAsyncComponent(() => import('@/views/generate/table/components/download-code-file.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const tableFormRef = useTemplateRef('tableFormRef')
const importTableRef = useTemplateRef('importTableRef')
const downloadCodeFileRef = useTemplateRef('downloadCodeFileRef')
const codeViewRef = useTemplateRef('codeViewRef')

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
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<GenTableInfoQueryRequest, GenTableInfoResponse>(state, queryExistsPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<GenTableInfoResponse>>({
  ...genTableInfoColumnOption,
})

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
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理下载操作
 */
const handleDownload = async (row?: GenTableInfoResponse) => {
  state.loadingStatus = true
  let dataArray: ModeIdArrayType
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
const handleDelete = (row: GenTableInfoResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除表信息, 是否继续?')
    .then(async () => {
      await removeGenTableInfoByIds(row!.id)
      await handleQuery()
      useMessage().success('删除表信息成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理查看代码
 */
const handleCodeView = (row?: GenTableInfoResponse) => {
  let ids: ModeIdArrayType
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows.map((item) => item.id)
  }
  codeViewRef.value?.show(ids)
}

onMounted(async () => {
  await handleQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="100px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="数据源" prop="dataSourceId">
            <datasource-select v-model="queryParams.dataSourceId" placeholder="请选择数据源" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="模板分组" prop="groupId">
            <template-group-select v-model="queryParams.groupId" placeholder="请选择模板分组" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="表名称" prop="tableName">
            <el-input v-model="queryParams.tableName" :maxlength="200" placeholder="请输入表名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar v-model:column-data="columnOption" v-model:show-search="state.searchStatus" column-status refresh-status @refresh="handleQuery">
      <el-button :icon="Download" size="small" type="primary" @click="handleImport">导入</el-button>
      <el-button :icon="Edit" size="small" type="success" :disabled="state.singleStatus" @click="handleEdit(state.selectedRows[0])">修改</el-button>
      <el-button :disabled="state.multipleStatus" :icon="Download" size="small" type="warning" @click="handleDownload()">批量下载</el-button>
      <el-button :disabled="state.multipleStatus" :icon="View" size="small" type="warning" @click="handleCodeView()">代码预览</el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="系统相关表信息！"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.engineName?.visible" label="引擎名称" min-width="100" prop="engineName" />
      <el-table-column v-if="columnOption.tableName?.visible" label="数据库表名" min-width="220" prop="tableName" sortable />
      <el-table-column v-if="columnOption.tableComment?.visible" label="表注释" min-width="260" prop="tableComment" show-overflow-tooltip />
      <el-table-column v-if="columnOption.codeName?.visible" label="代码名称" min-width="220" prop="codeName" />
      <el-table-column v-if="columnOption.codeComment?.visible" label="代码注释" min-width="260" prop="codeComment" show-overflow-tooltip />
      <el-table-column v-if="columnOption.tableCreateTime?.visible" label="表创建时间" prop="tableCreateTime" sortable width="180" />
      <el-table-column v-if="columnOption.tableUpdateTime?.visible" label="表更新时间" prop="tableUpdateTime" sortable width="180" />
      <el-table-column align="center" fixed="right" label="操作" width="280px">
        <template #default="{ row }">
          <el-button :icon="Refresh" link type="info" @click="handleSync(row)">同步</el-button>
          <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
          <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button :icon="View" link type="primary" @click="handleCodeView(row)">预览</el-button>
          <el-button :icon="Download" link type="warning" @click="handleDownload(row)">下载</el-button>
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
    <table-from ref="tableFormRef" @success="handleQuery()" />
    <import-table ref="importTableRef" @success="handleQuery()" />
    <download-code-file ref="downloadCodeFileRef" />
    <code-view ref="codeViewRef" />
  </div>
</template>

<style lang="scss" scoped></style>
