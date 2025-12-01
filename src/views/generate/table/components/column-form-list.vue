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
    <el-table-column label="列表字段" prop="codeName">
      <template #default="{ row }">
        <el-input v-model="row.codeName" :maxlength="30" placeholder="请输入列表字段" show-word-limit />
      </template>
    </el-table-column>
    <el-table-column label="列表描述" prop="listComment">
      <template #default="{ row }">
        <el-input v-model="row.listComment" :disabled="row.listShow !== 1" :maxlength="20" placeholder="请输入代码名称" />
      </template>
    </el-table-column>
    <el-table-column label="显示" prop="listShow" width="90">
      <template #default="{ row }">
        <el-switch
          v-model="row.listShow"
          :active-value="GenStatusEnums.ENABLED"
          :inactive-value="GenStatusEnums.DISABLED"
          @change="changeList(row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="显示禁用" prop="listDisabled" width="90">
      <template #default="{ row }">
        <el-switch
          v-model="row.listDisabled"
          :active-value="GenStatusEnums.ENABLED"
          :disabled="row.listShow !== 1"
          :inactive-value="GenStatusEnums.DISABLED"
        />
      </template>
    </el-table-column>
    <el-table-column label="默认隐藏" prop="listHidden" width="90">
      <template #default="{ row }">
        <el-switch
          v-model="row.listHidden"
          :active-value="GenStatusEnums.ENABLED"
          :disabled="row.listShow !== 1"
          :inactive-value="GenStatusEnums.DISABLED"
        />
      </template>
    </el-table-column>
  </xht-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoOperationRequest, GenColumnInfoResponse, GenStatusEnums } from '@/service/model/generate/column.model'

/**
 * 列信息模型，用于双向绑定列数据
 * @type {GenColumnInfoResponse[]} 列信息数组
 */
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})

/**
 * 当列表显示状态改变时的处理函数
 * 如果列表不显示，则重置禁用和隐藏状态
 * @param row 需要处理的列信息对象
 */
const changeList = (row: GenColumnInfoOperationRequest) => {
  if (row.listShow !== 1) {
    row.listDisabled = 0
    row.listHidden = 0
  }
}
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
</script>
