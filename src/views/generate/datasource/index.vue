<template>
  <div class="main-container-none">
    <div class="main-container-auto main-container-view">
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        :model="queryParams"
        class="user-select-display"
        label-width="120px"
      >
        <el-row>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="数据源名称" prop="name">
              <el-input v-model="queryParams.name" clearable placeholder="请输入数据源名称" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="数据库类型" prop="dbType">
              <el-select v-model="queryParams.dbType" placeholder="请选择数据库类型">
                <el-option :value="DataBaseTypeEnums.MYSQL" label="MySql" />
                <el-option :value="DataBaseTypeEnums.ORACLE" label="Oracle" />
              </el-select>
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
        <el-button
          :disabled="state.multipleStatus"
          icon="Delete"
          size="small"
          type="danger"
          @click="handleDelete(undefined)"
        >
          批量删除
        </el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :cell-style="cellStyle"
        :data="state.tableList"
        :header-cell-style="headerCellStyle"
        class="flex-1"
        empty-text="请添加数据源配置！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column :index="createIndex" label="序号" type="index" width="55" />
        <el-table-column label="数据库名称" prop="name" width="120px" />
        <el-table-column label="数据库类型" prop="dbType" width="120px" />
        <el-table-column label="数据库地址" prop="url" width="220px" show-overflow-tooltip />
        <el-table-column label="数据库用户名" prop="username" width="120px" />
        <el-table-column label="数据库密码" prop="password" width="120px" />
        <el-table-column label="最后测试时间" prop="lastTestTime" width="220px">
          <template #default="{ row }">
            <el-tag v-if="row.testResult === 'SUCCESS'" type="success">
              {{ row.lastTestTime }}
            </el-tag>
            <el-tag v-else type="danger">{{ row.lastTestTime }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button icon="delete" link type="primary" @click="handleTest(row)">测试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <datasource-form ref="datasourceFormRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import DatasourceForm from './components/datasource-form.vue'
import type {
  GenDataSourceQueryRequest,
  GenDataSourceResponse,
} from '@/service/model/generate/datasource.model'
import {
  connectionTest,
  queryGenDataSourceList,
  removeGenDataSourceByIds,
} from '@/service/api/generate/datasource.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { BasicResponse, ModeIdArrayType, PageQueryRequest } from '@/service/model/base.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import type { AxiosResponse } from 'axios'

defineOptions({ name: 'GenDataSourceViewIndex' })

interface TableQueryState<req extends PageQueryRequest, Response extends BasicResponse> {
  queryParams: GenDataSourceQueryRequest // 查询参数
  searchStatus?: boolean // 是否显示搜索
  tableList: GenDataSourceResponse[] // 表格数据
  selectedRows: GenDataSourceResponse[] // 选中行数据
  loadingStatus: boolean // 加载状态
  singleStatus: boolean // 单个禁用
  multipleStatus: boolean // 多个禁用
}

const state = reactive<TableQueryState<GenDataSourceQueryRequest, GenDataSourceResponse>>({
  queryParams: {},
  loadingStatus: false,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const datasourceFormRef = useTemplateRef('datasourceFormRef')
const { cellStyle, headerCellStyle } = useTableToolHooks()
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
/**
 * 查询表单提交
 */
const handleQuery = async () => {
  queryGenDataSourceList({ ...queryParams.value }).then((res) => {
    state.tableList = res.data
  })
}
/**
 * 多选框选中数据
 * @param selection 选中信息
 */
const handleSelectionChange = (selection: any[]) => {
  state.selectedRows = selection
  state.singleStatus = selection.length !== 1
  state.multipleStatus = !selection.length
}
/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  console.log(queryFormRef.value)
  await handleQuery()
}
/**
 * 处理新增
 */
const handleAdd = () => {
  datasourceFormRef.value?.show('add', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: GenDataSourceResponse) => {
  datasourceFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = async (row?: GenDataSourceResponse) => {
  state.loadingStatus = true
  let ids: ModeIdArrayType = []
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows.map((item) => item.id)
  }
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择数据源配置数据')
    return
  }
  await useMessageBox()
    .confirm('此操作将永久删除数据源配置, 是否继续?')
    .then(() => {
      removeGenDataSourceByIds(ids).then(async () => {
        useMessage().success('删除数据源配置成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}
/**
 * 测试链接
 */
const handleTest = (row: GenDataSourceResponse) => {
  connectionTest(row.id).then(async (res: AxiosResponse<boolean>) => {
    if (res.data) {
      useMessage().success('数据库链接正常！')
    } else {
      useMessage().error('数据库链接异常！')
    }
    await handleQuery()
  })
}
onMounted(async () => {
  await handleQuery()
})
</script>
<style lang="scss" scoped></style>
