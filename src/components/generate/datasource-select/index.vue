<script setup lang="ts">
import { queryGenDataSourceList } from '@/service/api/generate/datasource.api'
import type { DataSourceSelectProps, DataSourceSelectState } from '@/components/generate/datasource-select/types'
import { useMessage } from '@/hooks/use-message'

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
const props = withDefaults(defineProps<DataSourceSelectProps>(), {
  modelValue: null,
  placeholder: '请选择数据源对象',
  clearable: true,
  disabled: false,
  showTopDept: false,
})

/**
 * 组件状态管理
 */
const state = reactive<DataSourceSelectState>({
  tableList: [],
  loading: false,
})

/**
 * 查询数据源列表
 */
const handleQuery = async () => {
  // 设置加载状态
  state.loading = true
  try {
    const res = await queryGenDataSourceList()
    state.tableList = res.data || []
    if (state.tableList.length === 0) {
      useMessage().info('未查询到数据源信息')
    }
  } catch (error) {
    useMessage().error('查询数据源失败，请稍后重试')
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

<template>
  <el-select v-bind="{ ...$attrs, ...props, loading: state.loading }">
    <el-option v-for="item in state.tableList" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<style scoped lang="scss"></style>
