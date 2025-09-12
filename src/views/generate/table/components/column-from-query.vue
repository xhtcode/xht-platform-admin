<template>
  <el-table :cell-style="cellStyle" :data="queryColumns" :header-cell-style="headerCellStyle">
    <el-table-column>
      <template #header>
        <div class="text-left">
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
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
              :label="item.columnName"
              :value="item.id"
              v-for="item in columnInfo"
              :key="item.id"
            >
              {{ item.columnName }}
              <el-text type="info">({{ item.dbDataType }})</el-text>
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
          <el-button @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import { GenColumnInfoResponse } from '@/service/model/generate/column.model'

const { cellStyle, headerCellStyle } = useTableToolHooks()
const queryColumns = defineModel<any[]>('queryColumns', {
  required: true,
  default: () => [],
})
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
/**
 * 删除
 * @param row 删除行
 */
const handleDelete = (row: any) => {
  queryColumns.value = queryColumns.value.filter((item) => item.rowGuid !== row.rowGuid)
}
/**
 * 添加
 */
const handleAdd = () => {
  queryColumns.value.push({
    rowGuid: Date.now(),
    queryType: null,
    queryColumn: null,
    conditionName: null,
    conditionColumnName: null,
  })
}
</script>
