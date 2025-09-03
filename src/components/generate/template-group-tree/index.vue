<template>
  <el-tree t v-bind="{ ...$attrs, ...props, loading: state.loading }" node-key="id">
    <template #default="{ data }">
      {{ data.groupName }}
    </template>
  </el-tree>
</template>

<script setup lang="ts">
import { queryGenTemplateGroupList } from '@/api/generate/template.group.api'
import type {
  GenTemplateGroupSelectProps,
  GenTemplateGroupSelectState,
} from '@/components/generate/template-group-select/types'
import { useMessage } from '@/hooks/use-message'

/**
 * 定义组件选项
 */
defineOptions({
  name: 'TemplateGroupSelect',
  inheritAttrs: false,
})

/**
 * 定义组件属性
 */
const props = withDefaults(defineProps<GenTemplateGroupSelectProps>(), {
  modelValue: null,
  placeholder: '请选择模板分组名称',
  clearable: true,
  disabled: false,
})

/**
 * 组件状态管理
 */
const state = reactive<GenTemplateGroupSelectState>({
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
    const res = await queryGenTemplateGroupList()
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
defineExpose({})
</script>

<style scoped lang="scss"></style>
