<template>
  <el-table :cell-style="cellStyle" :data="columnInfo" :header-cell-style="headerCellStyle">
    <el-table-column label="基础信息">
      <template #default>
        <el-table-column type="index" label="序号" :index="createIndex" width="55" />
        <el-table-column prop="columnName" label="DB字段名" width="160">
          <template #default="{ row }">
            <el-text :type="row.isPrimary === 1 ? 'danger' : ''">
              {{ row.columnName }}
              <el-text v-if="row.isRequired === 1" type="warning">(非空)</el-text>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column
          prop="columnComment"
          label="DB字段注释"
          show-overflow-tooltip
          width="160"
        />
      </template>
    </el-table-column>
    <el-table-column label="Java" prop="javaType" />
    <el-table-column label="TypeScript" prop="tsType" />
  </el-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'

const { cellStyle, headerCellStyle } = useTableToolHooks()
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
</script>
