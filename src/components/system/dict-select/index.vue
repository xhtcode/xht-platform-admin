<script setup lang="ts">
import { useDictHooks } from '@/hooks/use-dict'
import type { DictSelectProps } from '@/components/system/dict-select/types'

defineOptions({
  name: 'DictSelect',
  inheritAttrs: true,
})

const props = withDefaults(defineProps<DictSelectProps>(), {
  clearable: true, // 是否可以清空选项
  disabled: false, // 是否禁用
  placeholder: '请选择字典项数据',
  multiple: false, // 是否多选
  multipleLimit: 0, // 最多选择个数
  collapseTags: true, // 多选时是否折叠Tag
  collapseTagsTooltip: false, // 多选时Tag是否显示Tooltip
  maxCollapseTags: 1, // 多选时最多显示多少Tag
})

/**
 * 字典编码
 */
const modelValue = defineModel<string | string[]>('modelValue', {
  required: true,
})

/**
 * 字典数据
 */
const { loadingStatus, dictData } = useDictHooks(props.dictCode)

/**
 * 过滤方法
 * @param value 值
 */
const filterMethod = (value: string) => {
  return dictData.value.some((item) => item.label.includes(value) || item.value.includes(value))
}
</script>

<template>
  <el-select
    v-model="modelValue"
    v-loading="loadingStatus"
    :disabled="disabled"
    :placeholder="placeholder"
    :clearable="clearable"
    filterable
    :filter-method="filterMethod"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    :max-collapse-tags="maxCollapseTags"
  >
    <el-option v-for="item in dictData" :label="item.label" :value="item.value" :key="item.label">
      <el-text size="large" tag="b" class="user-select-none">{{ item.label }}</el-text>
      <el-text size="small" type="info" class="user-select-none float-right">{{ item.value }}</el-text>
    </el-option>
    <template #empty>暂无字典项数据，请联系系统管理员</template>
  </el-select>
</template>
