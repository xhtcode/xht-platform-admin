<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="页面方式">
          <el-button-group>
            <el-button>弹窗</el-button>
            <el-button>抽屉</el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="页面宽度">
          <el-input-number class="w100" :min="30" :max="100" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="每行数量">
          <el-input-number class="w100" :min="1" :max="24" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-table :cell-style="cellStyle" :data="columnInfo" :header-cell-style="headerCellStyle">
      <el-table-column label="基础信息">
        <template #default>
          <el-table-column type="index" label="序号" :index="(index) => index + 1" width="55" />
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
      <el-table-column label="必填">
        <template #default="{ row }">
          <el-checkbox v-model="row.fill" />
        </template>
      </el-table-column>
      <el-table-column label="新增">
        <template #default="{ row }">
          <el-checkbox v-model="row.insert" />
        </template>
      </el-table-column>
      <el-table-column label="更新">
        <template #default="{ row }">
          <el-checkbox v-model="row.update" />
        </template>
      </el-table-column>
      <el-table-column label="前端组件">
        <template #default="{ row }">
          <el-select v-model="row.webFrom">
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
import { GenColumnInfoResponse } from '@/model/generate/column.model'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'

const { cellStyle, headerCellStyle } = useTableToolHooks()
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
</script>
