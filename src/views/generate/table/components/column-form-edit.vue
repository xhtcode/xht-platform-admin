<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="页面风格">
          <el-select v-model="tableInfo.pageStyle" placeholder="请选择页面风格">
            <el-option label="drawer" :value="0" />
            <el-option label="dialog" :value="1" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="页面宽度">
          <el-input-number
            v-model="tableInfo.pageStyleWidth"
            class="w100"
            :min="30"
            :max="100"
            placeholder="请输入页面宽度"
          >
            <template #suffix>
              <span>%</span>
            </template>
          </el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="每行数量">
          <el-input-number
            v-model="tableInfo.fromNumber"
            class="w100"
            :min="1"
            :max="24"
            placeholder="请输入表单每行的数量"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-table
      border
      :cell-style="cellStyle"
      :data="columnInfo"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column label="基础信息">
        <template #default>
          <el-table-column type="index" label="序号" :index="createIndex" width="55" />
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
      <el-table-column label="必填">
        <template #default="{ row }">
          <el-switch v-model="row.fromFill" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="新增">
        <template #default="{ row }">
          <el-switch v-model="row.fromInsert" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="更新">
        <template #default="{ row }">
          <el-switch v-model="row.fromUpdate" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="前端组件">
        <template #default="{ row }">
          <el-select v-model="row.fromComponent">
            <el-option label="输入框" value="input" />
            <el-option label="下拉框" value="select" />
            <el-option label="多选框" value="checkbox" />
            <el-option label="单选框" value="radio" />
            <el-option label="日期选择" value="date" />
            <el-option label="时间选择" value="time" />
            <el-option label="图片上传" value="upload" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import type { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

const { cellStyle, headerCellStyle } = useTableToolHooks()
/**
 * 列信息模型，用于双向绑定列数据
 * @type {GenColumnInfoResponse[]} 列信息数组
 */
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
/**
 * 表信息模型，用于双向绑定表数据
 * @type {GenTableInfoResponse} 表信息对象
 */
const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
</script>
