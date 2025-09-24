<template>
  <el-table :cell-style="cellStyle" :data="queryColumns" :header-cell-style="headerCellStyle">
    <el-table-column>
      <template #header>
        <div class="text-left">
          <el-button type="primary" @click="handleAdd">添加{{ queryColumns.length }}</el-button>
        </div>
      </template>
      <el-table-column type="index" label="序号" :index="createIndex" width="55" />
      <el-table-column label="查询类型">
        <template #default="{ row }">
          <el-select v-model="row.queryType">
            <el-option label="等于" value="EQ" />
            <el-option label="模糊" value="LIKE" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="查询列">
        <template #default="{ row }">
          <el-select v-model="row.queryColumn" value-key="id" clearable placeholder="请选择查询列">
            <el-option
              :label="item.dbName"
              :value="item.id"
              v-for="item in columnInfo"
              :key="item.id"
            >
              {{ item.dbName }}
              <el-text type="info">({{ item.dbType }})</el-text>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="条件名称">
        <template #default="{ row }">
          <el-input v-model="row.conditionName" placeholder="请输入条件名称" />
        </template>
      </el-table-column>
      <el-table-column label="字段命名">
        <template #default="{ row }">
          <el-input v-model="row.conditionColumnName" placeholder="请输入字段命名" />
        </template>
      </el-table-column>
      <el-table-column label="字段注释">
        <template #default="{ row }">
          <el-button @click="handleDelete(row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import type {
  GenColumnInfoResponse,
  GenTableColumnQueryResponse,
} from '@/service/model/generate/column.model'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

defineOptions({
  name: 'ColumnFormQuery',
  inheritAttrs: false,
})
const { cellStyle, headerCellStyle } = useTableToolHooks()
const queryColumns = ref<GenTableColumnQueryResponse[]>([])
const count = shallowRef(0)
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
/**
 * 删除
 * @param row 删除行
 */
const handleDelete = (row: any) => {
  queryColumns.value = queryColumns.value.filter((item) => item.id !== row.id)
}
/**
 * 添加
 */
const handleAdd = () => {
  queryColumns.value.push({
    columnId: undefined,
    columnName: undefined,
    conditionLabel: 'eq',
    sortOrder: 99,
    tableId: tableInfo.value.id,
    tableName: tableInfo.value.tableName,
    id: count.value++,
  })
}
/**
 * 设置查询列数据
 * @param data 查询列数据数组
 */
const setData = (data: GenTableColumnQueryResponse[]) => {
  if (data) {
    queryColumns.value = [...data]
  }
}
/**
 * 获取查询列数据
 * @returns 查询列数据数组的副本
 */
const getData = (): GenTableColumnQueryResponse[] => {
  return [...queryColumns.value]
}
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
defineExpose({
  setData,
  getData,
})
</script>
