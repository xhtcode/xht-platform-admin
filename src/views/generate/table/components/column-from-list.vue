<template>
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
    <el-table-column prop="codeName" label="列表字段">
      <template #default="{ row }">
        <el-input
          v-model="row.codeName"
          :maxlength="30"
          show-word-limit
          placeholder="请输入列表字段"
        />
      </template>
    </el-table-column>
    <el-table-column prop="listComment" label="列表描述">
      <template #default="{ row }">
        <el-input
          v-model="row.listComment"
          :disabled="row.listShow !== 1"
          :maxlength="20"
          placeholder="请输入代码名称"
        />
      </template>
    </el-table-column>
    <el-table-column prop="listShow" label="显示" width="90">
      <template #default="{ row }">
        <el-checkbox
          v-model="row.listShow"
          :true-value="1"
          :false-value="0"
          @change="changeList(row)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="listDisabled" label="显示禁用" width="90">
      <template #default="{ row }">
        <el-checkbox
          v-model="row.listDisabled"
          :disabled="row.listShow !== 1"
          :true-value="1"
          :false-value="0"
        />
      </template>
    </el-table-column>
    <el-table-column prop="listHidden" label="默认隐藏" width="90">
      <template #default="{ row }">
        <el-checkbox
          v-model="row.listHidden"
          :disabled="row.listShow !== 1"
          :true-value="1"
          :false-value="0"
        />
      </template>
    </el-table-column>
    <el-table-column prop="listOverflowTooltip" label="溢出提示" width="90">
      <template #default="{ row }">
        <el-checkbox
          v-model="row.listOverflowTooltip"
          :disabled="row.listShow !== 1"
          :true-value="1"
          :false-value="0"
        />
      </template>
    </el-table-column>
    <el-table-column prop="listWidth" label="列宽度">
      <template #default="{ row }">
        <el-input-number
          class="w100"
          v-model="row.listWidth"
          :disabled="row.listShow !== 1"
          :min="0"
          :max="999"
          placeholder="请输入列宽度"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoOperationRequest, GenColumnInfoResponse } from '@/model/generate/column.model'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'

const { cellStyle, headerCellStyle } = useTableToolHooks()
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
/**
 *
 * @param row
 */
const changeList = (row: GenColumnInfoOperationRequest) => {
  if (row.listShow !== 1) {
    row.listDisabled = 0
    row.listHidden = 0
    row.listOverflowTooltip = 0
    row.listWidth = null
  }
}
</script>
