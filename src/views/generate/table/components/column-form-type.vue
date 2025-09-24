<template>
  <el-table :cell-style="cellStyle" :data="columnInfo" :header-cell-style="headerCellStyle">
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
    <el-table-column label="Java" prop="codeJava">
      <template #default="{ row }">
        <type-mapping-select
          v-model="row.codeJava"
          v-model:import-value="row.codeJavaPackage"
          :db-type="dbType"
          :language-type="LanguageTypeEnums.JAVA"
        />
      </template>
    </el-table-column>
    <el-table-column label="TypeScript" prop="codeTs">
      <template #default="{ row }">
        <type-mapping-select
          v-model="row.codeTs"
          :db-type="dbType"
          :language-type="LanguageTypeEnums.TYPESCRIPT"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'

const { cellStyle, headerCellStyle } = useTableToolHooks()
const columnInfo = defineModel<GenColumnInfoResponse[]>('columnInfo', {
  required: true,
  default: () => [],
})
withDefaults(
  defineProps<{
    dbType: DataBaseTypeEnums
  }>(),
  {
    dbType: DataBaseTypeEnums.MYSQL,
  }
)
/**
 * 创建序号
 * @param index 索引
 */
const createIndex = (index: number) => {
  return index + 1
}
</script>
