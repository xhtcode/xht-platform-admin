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
        <type-mapping-select v-model="row.codeTs" :db-type="dbType" :language-type="LanguageTypeEnums.TYPESCRIPT" />
      </template>
    </el-table-column>
  </xht-table>
</template>
<script lang="ts" setup>
import { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'

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
</script>
