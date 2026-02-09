<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { GenTypeMappingQueryRequest, GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'
import { queryGenTypeMappingPage, removeGenTypeMappingByIds } from '@/service/api/generate/type.mapping.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { dbDataTypeList, genTypeMappingColumnOption } from '@/views/generate/type-mapping/type.mapping.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'GenTypeMappingViewIndex' })

const typeMappingForm = defineAsyncComponent(() => import('@/views/generate/type-mapping/components/type-mapping-form.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const typeMappingFormRef = useTemplateRef('typeMappingFormRef')

const state = reactive<TableQueryPageState<GenTypeMappingQueryRequest, GenTypeMappingResponse>>({
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
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<GenTypeMappingQueryRequest, GenTypeMappingResponse>(
  state,
  queryGenTypeMappingPage
)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<GenTypeMappingResponse>>({
  ...genTypeMappingColumnOption,
})

/**
 * 表单自动提示
 */
const handleAutoComplete = (queryString: string, cb: any) => {
  const results = queryString ? dbDataTypeList.filter(createFilter(queryString)) : dbDataTypeList
  cb(results)
}

const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
  }
}

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
  typeMappingFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: GenTypeMappingResponse) => {
  typeMappingFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row?: GenTypeMappingResponse) => {
  state.loadingStatus = true
  let ids: ModeIdArrayType = []
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows.map((item) => item.id)
  }
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择字段类型映射数据')
    return
  }
  useMessageBox()
    .confirm('此操作将永久删除字段类型映射, 是否继续?')
    .then(async () => {
      await removeGenTypeMappingByIds(ids)
      await handlePageQuery()
      useMessage().success('删除字段类型映射成功!')
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
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="120px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="数据库" prop="dbType">
            <el-select v-model="queryParams.dbType" placeholder="请选择数据库类型">
              <el-option :value="DataBaseTypeEnums.MYSQL" label="MySql" />
              <el-option :value="DataBaseTypeEnums.ORACLE" label="Oracle" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="编程语言" prop="dbDataType">
            <el-autocomplete v-model="queryParams.dbDataType" clearable :fetch-suggestions="handleAutoComplete" placeholder="请输入数据库数据类型" />
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
      <el-table-column type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.dbType?.visible" label="数据库类型" prop="dbType" />
      <el-table-column v-if="columnOption.dbDataType?.visible" label="数据库数据类型" prop="dbDataType" />
      <el-table-column v-if="columnOption.javaType?.visible" label="java类型" prop="javaType" />
      <el-table-column v-if="columnOption.importPackage?.visible" label="java包路径" prop="importPackage" />
      <el-table-column v-if="columnOption.tsType?.visible" label="ts类型" prop="tsType" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
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
    <type-mapping-form ref="typeMappingFormRef" @success="handlePageQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
