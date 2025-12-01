<template>
  <xht-table :data="columnInfo">
    <el-table-column label="基础信息">
      <template #default>
        <xht-column-index type="step" />
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
        <el-input v-model="row.codeName" :maxlength="30" placeholder="请输入代码名称" show-word-limit />
      </template>
    </el-table-column>
    <el-table-column label="代码注释" prop="codeComment">
      <template #default="{ row }">
        <el-input v-model="row.codeComment" :maxlength="100" :rows="2" placeholder="请输入代码名称" resize="none" show-word-limit type="textarea" />
      </template>
    </el-table-column>
    <el-table-column label="字段排序" prop="sortOrder">
      <template #default="{ row }">
        <el-input-number v-model="row.sortOrder" :max="999" :min="1" class="w-full!" placeholder="请输入字段排序" />
      </template>
    </el-table-column>
  </xht-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoResponse } from '@/service/model/generate/column.model'

const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
</script>
