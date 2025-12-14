<template>
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
    <el-table-column label="Java类型映射" prop="codeJava">
      <template #default="{ row }">
        <mapping-java-select
          v-model:code-java="row.codeJava"
          v-model:code-java-package="row.codeJavaPackage"
          :data-base-type="dbType"
          :db-data-type="row.dbType"
          :disabled="['id', 'version', 'tenant_id', 'del_flag'].includes(row.dbName)"
        />
      </template>
    </el-table-column>
    <el-table-column label="Ts类型映射" prop="codeTs">
      <template #default="{ row }">
        <mapping-ts-select
          v-model:code-ts="row.codeTs"
          :data-base-type="dbType"
          :db-data-type="row.dbType"
          :disabled="['id', 'version', 'tenant_id', 'del_flag'].includes(row.dbName)"
        />
      </template>
    </el-table-column>
    <el-table-column label="字典类型" prop="dictCode">
      <template #default="{ row }">
        <column-dict-select v-model="row.dictCode" v-model:from-component="row.fromComponent" />
      </template>
    </el-table-column>
    <el-table-column label="前端组件" prop="fromComponent">
      <template #default="{ row }">
        <column-form-select v-model="row.fromComponent" v-model:dict-code="row.dictCode" />
      </template>
    </el-table-column>
  </xht-table>
</template>
<script lang="ts" setup>
import type { GenColumnInfoResponse } from '@/service/model/generate/column.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

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
