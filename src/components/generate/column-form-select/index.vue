<template>
  <el-select v-model="modelValue" placeholder="请选择前端组件">
    <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in selectData" />
  </el-select>
</template>

<script setup lang="ts">
import type { ColumnFormSelectOptionType } from '@/components/generate/column-form-select/types'
import { commonOptions, dictOptions } from '@/components/generate/column-form-select/data'

defineOptions({
  name: 'ColumnFormSelect',
})
/**
 * 表单组件属性
 */
const modelValue = defineModel<string>('modelValue', {
  required: false,
  default: '',
})
/**
 * 字典编码
 */
const dictCode = defineModel<any>('dictCode', {
  required: false,
})
/**
 * 表单列表
 */
const selectData = computed<ColumnFormSelectOptionType[]>(() => {
  return dictCode.value ? dictOptions : commonOptions
})
</script>

<style scoped lang="scss"></style>
