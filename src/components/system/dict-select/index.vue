<script setup lang="ts">
import { useDictHooks } from '@/hooks/use-dict'
import type { DictSelectEmits, DictSelectProps } from '@/components/system/dict-select/types'

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

const emits = defineEmits<DictSelectEmits>()

/**
 * 字典项编码
 */
const modelValue = defineModel<string | string[] | undefined>('modelValue', {
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

/**
 * 字典单选组件发生改变的时候
 */
const handlerChange = (value?: string | string[]) => {
  emits('change', value)
}

/**
 * 字典单选组件发生改变的时候
 */
const handlerRemoveTag = (value: string) => {
  console.log(value)
  emits('remove-tag', value)
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
    @change="handlerChange"
    @remove-tag="handlerRemoveTag"
  >
    <el-option v-for="item in dictData" :label="item.label" :value="item.value" :key="item.label" :disabled="item.disabled" />
    <template #empty>暂无字典项数据，请联系系统管理员</template>
  </el-select>
</template>

<style scoped lang="scss">
.dict-disabled-text {
  color: var(--el-disabled-text-color);
}
</style>
