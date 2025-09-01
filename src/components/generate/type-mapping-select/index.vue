<template>
  <el-select v-bind="{ ...$attrs, ...props, loading: state.loading }">
    <el-option
      v-for="item in state.tableList"
      :key="item.id"
      :label="item.targetDataType"
      :value="item.id"
    />
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type {
  TypeMappingSelectProps,
  TypeMappingSelectState,
} from '@/components/generate/type-mapping-select/types'
import { useMessage } from '@/hooks/use-message'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/model/generate/common.model'
import { queryGenTypeMappingList } from '@/api/generate/type.mapping.api'

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
  modelValue: null,
  placeholder: '请选择类型映射信息对象',
  clearable: true,
  disabled: false,
  showTopDept: false,
  dbType: DataBaseTypeEnums.MYSQL,
  languageType: LanguageTypeEnums.JAVA,
})

/**
 * 组件状态管理
 */
const state = reactive<TypeMappingSelectState>({
  tableList: [],
  loading: false,
})

/**
 * 查询类型映射信息列表
 */
const handleQuery = async () => {
  // 设置加载状态
  state.loading = true
  try {
    const res = await queryGenTypeMappingList()
    state.tableList = res.data || []
    if (state.tableList.length === 0) {
      useMessage().info('未查询到类型映射信息信息')
    }
  } catch (error) {
    useMessage().error('查询类型映射信息失败，请稍后重试')
  } finally {
    // 重置加载状态
    state.loading = false
  }
}

/**
 * 组件挂载时查询数据
 */
onMounted(() => {
  handleQuery()
})
</script>

<style scoped lang="scss"></style>
