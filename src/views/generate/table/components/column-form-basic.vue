<template>
  <xht-table :data="columnInfo" row-key="id" ref="columnFormRef" v-if="loading">
    <xht-column-drag-sort label="" v-model:data="columnInfo" :table-ref="columnFormRef" @drag-end="handleDragEnd" />
    <el-table-column label="基础信息">
      <template #default>
        <el-table-column label="#" prop="sortOrder" width="55" />
        <el-table-column label="DB字段名" prop="dbName" width="160">
          <template #default="{ row }">
            <el-text :type="row.dbPrimary === 1 ? 'danger' : ''">
              {{ row.dbName }}
              <el-text v-if="row.dbRequired === 1" type="warning">(非空)</el-text>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="DB字段注释" prop="dbComment" show-overflow-tooltip width="160" />
        <el-table-column label="DB类型" prop="dbLength" width="160">
          <template #default="{ row }">
            <el-text>{{ row.dbType }}</el-text>
            <el-text v-if="row.dbLength > 0">({{ row.dbLength }})</el-text>
          </template>
        </el-table-column>
      </template>
    </el-table-column>
    <el-table-column label="代码名称" prop="codeName">
      <template #default="{ row }">
        <el-input
          v-model="row.codeName"
          :maxlength="30"
          placeholder="请输入代码名称"
          show-word-limit
          :disabled="['id', 'version', 'tenant_id', 'del_flag'].includes(row.dbName)"
        />
      </template>
    </el-table-column>
    <el-table-column label="代码描述" prop="codeComment">
      <template #default="{ row }">
        <el-input
          v-model="row.codeComment"
          :maxlength="100"
          placeholder="请输入代码名称"
          show-word-limit
          :disabled="['id', 'version', 'tenant_id', 'del_flag'].includes(row.dbName)"
        />
      </template>
    </el-table-column>
  </xht-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import type { TableInstance } from 'element-plus'

const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
const loading = ref(true)
const columnFormRef = useTemplateRef<TableInstance>('columnFormRef')

const handleDragEnd = () => {
  for (const index in columnInfo.value) {
    columnInfo.value[index].sortOrder = parseInt(index) + 1
  }
}
</script>
