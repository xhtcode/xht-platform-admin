<template>
  <xht-table :data="columnInfo">
    <el-table-column label="基础信息">
      <template #default>
        <xht-column-index type="step" />
        <el-table-column prop="dbName" label="DB字段名" width="160">
          <template #default="{ row }">
            <el-text :type="row.dbPrimary === 1 ? 'danger' : ''">
              {{ row.dbName }}
              <el-text v-if="row.dbRequired === 1" type="warning">(非空)</el-text>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column prop="dbComment" label="DB字段注释" show-overflow-tooltip width="160" />
        <el-table-column prop="dbLength" label="DB类型" width="160">
          <template #default="{ row }">
            <el-text>{{ row.dbType }}</el-text>
            <el-text v-if="row.dbLength > 0">({{ row.dbLength }})</el-text>
          </template>
        </el-table-column>
      </template>
    </el-table-column>
    <el-table-column prop="codeName" label="代码名称">
      <template #default="{ row }">
        <el-input
          v-model="row.codeName"
          :maxlength="30"
          show-word-limit
          placeholder="请输入代码名称"
        />
      </template>
    </el-table-column>
    <el-table-column prop="codeComment" label="代码注释">
      <template #default="{ row }">
        <el-input
          v-model="row.codeComment"
          type="textarea"
          :rows="2"
          resize="none"
          :maxlength="100"
          show-word-limit
          placeholder="请输入代码名称"
        />
      </template>
    </el-table-column>
    <el-table-column prop="sortOrder" label="字段排序">
      <template #default="{ row }">
        <el-input-number
          v-model="row.sortOrder"
          :min="1"
          :max="999"
          class="w100"
          placeholder="请输入字段排序"
        />
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
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
</script>
