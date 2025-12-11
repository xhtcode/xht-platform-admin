<template>
  <el-table :data="queryColumns">
    <el-table-column>
      <template #header>
        <div class="text-left">
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <xht-column-index type="step" />
      <el-table-column label="查询类型">
        <template #default="{ row }">
          <el-select v-model="row.queryType">
            <el-option label="等于" value="eq" />
            <el-option label="模糊" value="like" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="查询列">
        <template #default="{ row }">
          <el-select v-model="row.columnId" clearable placeholder="请选择查询列" value-key="id" @change="(value) => handleColumnChange(value, row)">
            <el-option v-for="item in columnInfo" :key="item.id" :label="item.dbName" :value="item.id">
              {{ item.dbName }}
              <el-text type="info">({{ item.dbType }})</el-text>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="条件标签">
        <template #default="{ row }">
          <el-input v-model="row.conditionLabel" placeholder="请输入条件标签" />
        </template>
      </el-table-column>
      <el-table-column label="字段命名">
        <template #default="{ row }">
          <el-input v-model="row.conditionValue" placeholder="请输入字段命名" />
        </template>
      </el-table-column>
      <el-table-column label="字段注释">
        <template #default="{ row }">
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import type { GenColumnInfoResponse, GenTableColumnQueryResponse } from '@/service/model/generate/column.model'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'
import { ModeIdType } from '@/service/model/base.model'
import { generateUUID } from '@/utils'

defineOptions({
  name: 'ColumnFormQuery',
  inheritAttrs: false,
})

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
    id: generateUUID(),
    tableId: tableInfo.value.id,
    tableName: tableInfo.value.tableName,
    columnId: undefined,
    columnName: '',
    fromLength: 0,
    queryType: 'eq',
    conditionLabel: '',
    conditionValue: '',
    sortOrder: 0,
  })
}

/**
 *
 */
const handleColumnChange = (id: ModeIdType, row: GenTableColumnQueryResponse) => {
  columnInfo.value.forEach((item) => {
    if (item.id === id) {
      row.columnId = item.id
      row.columnName = item.codeName
      row.conditionLabel = item.codeComment
      row.fromLength = item.fromLength || 0
      row.conditionValue = item.codeName
      row.sortOrder = item.sortOrder
    }
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

defineExpose({
  setData,
  getData,
})
</script>
