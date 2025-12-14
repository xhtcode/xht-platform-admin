<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="页面风格" prop="tableInfo.pageStyle">
          <el-select v-model="tableInfo.pageStyle" placeholder="请选择页面风格">
            <el-option :value="0" label="drawer" />
            <el-option :value="1" label="dialog" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="页面宽度" prop="tableInfo.pageStyleWidth">
          <el-input-number v-model="tableInfo.pageStyleWidth" :max="100" :min="30" class="w-full!" placeholder="请输入页面宽度">
            <template #suffix>
              <span>%</span>
            </template>
          </el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="每行数量" prop="tableInfo.fromNumber">
          <el-input-number v-model="tableInfo.fromNumber" :max="24" :min="1" class="w-full!" placeholder="请输入表单每行的数量" />
        </el-form-item>
      </el-col>
    </el-row>
    <xht-table :data="columnInfo" row-key="id">
      <el-table-column label="#" prop="sortOrder" width="55" />
      <el-table-column label="基础信息">
        <template #default>
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
      <el-table-column label="必填">
        <template #default="{ row }">
          <el-switch
            v-model="row.fromFill"
            :active-value="1"
            :inactive-value="0"
            :disabled="['id', 'create_by', 'create_time', 'update_by', 'update_time', 'del_flag', 'version', 'tenant_id'].includes(row.dbName)"
          />
        </template>
      </el-table-column>
      <el-table-column label="新增">
        <template #default="{ row }">
          <el-switch v-model="row.fromInsert" :active-value="1" :inactive-value="0" :disabled="row.fromFill !== 1" />
        </template>
      </el-table-column>
      <el-table-column label="更新">
        <template #default="{ row }">
          <el-switch v-model="row.fromUpdate" :active-value="1" :inactive-value="0" :disabled="row.fromFill !== 1" />
        </template>
      </el-table-column>
    </xht-table>
  </div>
</template>
<script lang="ts" setup>
import type { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

/**
 * 列信息模型，用于双向绑定列数据
 */
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})

/**
 * 表信息模型，用于双向绑定表数据
 */
const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
</script>
