<template>
  <el-select
    v-model="state.selectId"
    value-key="id"
    :placeholder="props.placeholder"
    :clearable="props.clearable"
    :disabled="props.disabled"
    @change="handleChange"
  >
    <el-option v-for="item in state.tableList" :key="item.id" :value="item.id" :label="item.tsType">
      <el-text size="large" tag="b" class="user-select-none">{{ item.dbDataType }}</el-text>
      <el-text size="small" type="info" class="float-right user-select-none">{{ item.tsType }}</el-text>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import type { GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'
import { MappingTsSelectProps, MappingTsSelectState } from '@/components/generate/mapping-ts-select/types'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import { queryGenTypeMappingList } from '@/service/api/generate/type.mapping.api'

defineOptions({
  name: 'MappingTsSelect',
})
/**
 * ts 类型
 */
const codeTs = defineModel<string>('codeTs', { required: true })
/**
 * 定义组件属性
 */
const props = withDefaults(defineProps<MappingTsSelectProps>(), {
  dataBaseType: DataBaseTypeEnums.MYSQL,
  dbDataType: '',
  placeholder: '请选择Ts类型的数据库映射',
  clearable: true,
  disabled: false,
})
/**
 * 组件状态管理
 */
const state = reactive<MappingTsSelectState>({
  selectId: null,
  tableList: [],
  loadingStatus: false,
})
/**
 * 选择类型映射信息对象
 * @param value
 */
const handleChange = (value: GenTypeMappingResponse) => {
  codeTs.value = value?.tsType
}
/**
 * 查询类型映射信息列表
 */
const handleQuery = async () => {
  state.loadingStatus = true
  try {
    if (!state.tableList || state.tableList.length <= 0) {
      const res = await queryGenTypeMappingList({
        dbType: props.dataBaseType,
      })
      state.tableList = res.data || []
    }
    state.tableList.forEach((item) => {
      if (props.dbDataType === item.dbDataType) {
        state.selectId = item.id
        return
      }
    })
  } finally {
    state.loadingStatus = false
  }
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped lang="scss"></style>
