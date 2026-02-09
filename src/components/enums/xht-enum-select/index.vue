<script setup lang="ts">
import type { XhtEnumSelectEmits, XhtEnumSelectProps } from '@/components/enums/xht-enum-select/types'

defineOptions({
  name: 'XhtEnumSelect',
  inheritAttrs: true,
})

const props = withDefaults(defineProps<XhtEnumSelectProps>(), {
  clearable: true, // 是否可以清空选项
  disabled: false, // 是否禁用
  placeholder: '请选择枚举项数据',
  multiple: false, // 是否多选
  multipleLimit: 0, // 最多选择个数
  collapseTags: true, // 多选时是否折叠Tag
  collapseTagsTooltip: false, // 多选时Tag是否显示Tooltip
  maxCollapseTags: 1, // 多选时最多显示多少Tag
})

const emits = defineEmits<XhtEnumSelectEmits>()

/**
 * 枚举项编码
 */
const modelValue = defineModel<any | any[]>('modelValue', {
  required: true,
})

/**
 * 过滤方法
 * @param value 值
 */
const filterMethod = (value: any) => {
  return Object.values(props.data).filter((item) => item.label.includes(value) || item.value.includes(value))
}

/**
 * 枚举单选组件发生改变的时候
 */
const handlerChange = (value?: any | any[]) => {
  emits('change', value)
}

/**
 * 枚举单选组件发生改变的时候
 */
const handlerRemoveTag = (value: any) => {
  emits('remove-tag', value)
}
</script>

<template>
  <el-select
    v-model="modelValue"
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
    @change="handlerChange"
    @remove-tag="handlerRemoveTag"
  >
    <el-option v-for="item in props.data" :label="item.label" :value="item.value" :key="item.label" :disabled="item.disabled" />
    <template #empty>暂无枚举项数据，请联系系统管理员</template>
  </el-select>
</template>

<style scoped lang="scss">
.dict-disabled-text {
  color: var(--el-disabled-text-color);
}
</style>
