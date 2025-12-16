<script setup lang="ts">
import { MappingJavaSelectProps, MappingJavaSelectState } from '@/components/generate/mapping-java-select/types'
import { GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import { queryGenTypeMappingList } from '@/service/api/generate/type.mapping.api'

defineOptions({
  name: 'MappingJavaSelect',
})
/**
 * 定义组件属性
 */
const props = withDefaults(defineProps<MappingJavaSelectProps>(), {
  dataBaseType: DataBaseTypeEnums.MYSQL,
  dbDataType: '',
  placeholder: '请输入选择类型的数据库映射',
  clearable: true,
  disabled: false,
})
/**
 * java类型
 */
const codeJava = defineModel<string>('codeJava', { required: true })
/**
 * java包类型
 */
const codeJavaPackage = defineModel<string>('codeJavaPackage', { required: false })
/**
 * 组件状态管理
 */
const state = reactive<MappingJavaSelectState>({
  selectId: null,
  tableList: [],
  loadingStatus: false,
})
/**
 * 选择类型映射信息对象
 * @param value
 */
const handleChange = (value: GenTypeMappingResponse) => {
  codeJava.value = value?.javaType
  codeJavaPackage.value = value?.importPackage
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

<template>
  <el-select
    v-model="state.selectId"
    value-key="id"
    :placeholder="props.placeholder"
    :clearable="props.clearable"
    :disabled="props.disabled"
    @change="handleChange"
  >
    <el-option v-for="item in state.tableList" :key="item.id" :value="item.id" :label="item.javaType">
      <el-text size="large" tag="b" class="user-select-none">{{ item.dbDataType }}</el-text>
      <el-text size="small" type="info" class="user-select-none float-right">{{ item.javaType }}</el-text>
    </el-option>
  </el-select>
</template>

<style scoped lang="scss"></style>
