<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import type { GenDataSourceQueryRequest, GenDataSourceResponse } from '@/service/model/generate/datasource.model'
import { connectionTest, queryGenDataSourceList, removeGenDataSourceByIds } from '@/service/api/generate/datasource.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import type { AxiosResponse } from 'axios'
import { genDataSourceColumnOption } from '@/views/generate/datasource/datasource.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { useTableQueryListHooks } from '@/hooks/use-crud-hooks'

defineOptions({ name: 'GenDataSourceViewIndex' })

const datasourceForm = defineAsyncComponent(() => import('@/views/generate/datasource/components/datasource-form.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const datasourceFormRef = useTemplateRef('datasourceFormRef')

const state = reactive<TableQueryListState<GenDataSourceQueryRequest, GenDataSourceResponse>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 刷新表格状态
  expandAllStatus: false, // 展开所有状态
  searchStatus: false, // 是否显示搜索区域
  queryParams: {}, // 查询参数
  tableList: [], // 表格数据列表
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})

const { handleListQuery, handleSelectionChange } = useTableQueryListHooks<GenDataSourceQueryRequest, GenDataSourceResponse>(
  state,
  queryGenDataSourceList
)
const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<GenDataSourceResponse>>({
  ...genDataSourceColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handleListQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  datasourceFormRef.value?.show('create', null)
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
const handleDelete = (row?: GenDataSourceResponse) => {
  state.loadingStatus = true
  let ids: ModeIdArrayType = []
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows?.map((item) => item.id) || []
  }
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择数据源配置数据')
    return
  }
  useMessageBox()
    .confirm('此操作将永久删除数据源配置, 是否继续?')
    .then(async () => {
      await removeGenDataSourceByIds(ids)
      await handleListQuery()
      useMessage().success('删除数据源配置成功!')
    })
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
    await handleListQuery()
  })
}

onMounted(async () => {
  await handleListQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="120px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="数据源名称" prop="name">
            <el-input v-model="queryParams.name" clearable placeholder="请输入数据源名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="数据库类型" prop="dbType">
            <el-select v-model="queryParams.dbType" placeholder="请选择数据库类型">
              <el-option :value="DataBaseTypeEnums.MYSQL" label="MySql" />
              <el-option :value="DataBaseTypeEnums.ORACLE" label="Oracle" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleListQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar v-model:column-data="columnOption" v-model:show-search="state.searchStatus" column-status refresh-status @refresh="resetQuery">
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
      <el-button :icon="Edit" size="small" type="success" :disabled="state.singleStatus" @click="handleEdit(state.selectedRows![0])">修改</el-button>
      <el-button :icon="Delete" size="small" type="danger" :disabled="state.multipleStatus" @click="handleDelete(undefined)">批量删除</el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <xht-column-index type="step" />
      <el-table-column label="数据库名称" prop="name" min-width="120" />
      <el-table-column label="数据库类型" prop="dbType" min-width="120" />
      <el-table-column label="数据库地址" prop="url" show-overflow-tooltip min-width="220" />
      <el-table-column label="数据库用户名" prop="username" min-width="120" />
      <el-table-column label="最后测试时间" prop="lastTestTime" min-width="220">
        <template #default="{ row }">
          <el-tag v-if="row.testResult === 'success'" type="success">
            {{ row.lastTestTime }}
          </el-tag>
          <el-tag v-else type="danger">{{ row.lastTestTime }}</el-tag>
        </template>
      </el-table-column>
      <!-- @vue-generic {GenDataSourceResponse} -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button :icon="Delete" link type="primary" @click="handleTest(row)">测试</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <datasource-form ref="datasourceFormRef" @success="handleListQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
