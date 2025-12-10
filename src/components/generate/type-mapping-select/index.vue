<template>
  <el-select v-model="value" :clearable="clearable" :disabled="disabled" value-key="id" :placeholder="placeholder" filterable @change="handleChange">
    <el-option v-for="item in tableList" :key="item.id" :label="item.targetDataType" :value="item" />
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { TypeMappingSelectProps, TypeMappingSelectState } from '@/components/generate/type-mapping-select/types'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'
import { queryGenTypeMappingList } from '@/service/api/generate/type.mapping.api'
import { ModeIdType } from '@/service/model/base.model'
import type { GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'

/**
 * 定义组件选项
 */
defineOptions({
  name: 'DataSourceSelect',
  inheritAttrs: false,
})

/**
 * 定义组件属性
 */
const props = withDefaults(defineProps<TypeMappingSelectProps>(), {
  dbType: DataBaseTypeEnums.MYSQL,
  languageType: LanguageTypeEnums.JAVA,
  placeholder: '请选择类型映射信息对象',
  clearable: true,
  disabled: false,
})
const modelValue = defineModel<string>('modelValue')
const importValue = defineModel<string>('importValue', {
  required: false,
  default: '',
})
const value = ref<ModeIdType>('')
/**
 * 组件状态管理
 */
const state = reactive<TypeMappingSelectState>({
  tableList: [],
  loading: false,
})
const tableList = useSessionStorage<GenTypeMappingResponse[]>('type:mapping2:' + props.dbType + ':' + props.languageType, [])

/**
 * 查询类型映射信息列表
 */
const handleQuery = async () => {
  // 设置加载状态
  state.loading = true
  try {
    if (!tableList.value || tableList.value.length <= 0) {
      const res = await queryGenTypeMappingList({
        dbType: props.dbType,
        targetLanguage: props.languageType,
      })
      tableList.value = res.data || []
    }
    tableList.value.forEach((item) => {
      if (modelValue.value === item.targetDataType) {
        value.value = item
        return
      }
    })
  } finally {
    // 重置加载状态
    state.loading = false
  }
}
const handleChange = (value: GenTypeMappingResponse) => {
  modelValue.value = value.targetDataType
  importValue.value = value.importPackage
  console.dir(value)
}
/**
 * 组件挂载时查询数据
 */
onMounted(() => {
  handleQuery()
})
</script>

<style scoped lang="scss"></style>
