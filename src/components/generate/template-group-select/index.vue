<template>
  <el-select v-bind="{ ...$attrs, ...props, loading: state.loading }" v-model="modelValue">
    <el-option
      v-for="item in state.tableList"
      :key="item.id"
      :label="item.groupName"
      :value="item.id"
    />
  </el-select>
</template>

<script setup lang="ts">
import { queryGenTemplateGroupList } from '@/api/generate/template.group.api'
import type {
  GenTemplateGroupSelectProps,
  GenTemplateGroupSelectState,
} from '@/components/generate/template-group-select/types'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/model/base.model.ts'

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
const modelValue = defineModel<ModeIdType>('modelValue')
/**
 * 组件状态管理
 */
const state = reactive<GenTemplateGroupSelectState>({
  tableList: [],
  loading: false,
})

/**
 * 查询模板分组列表
 */
const handleQuery = async () => {
  // 设置加载状态
  state.loading = true
  try {
    const res = await queryGenTemplateGroupList()
    state.tableList = res.data || []
    if (state.tableList.length === 0) {
      useMessage().info('未查询到模板分组信息')
    }
  } catch (error) {
    useMessage().error('查询模板分组失败，请稍后重试')
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
