<template>
  <el-table-column class-name="user-select-none" type="index" :resizable="false" :width="width" :label="label" :index="createTableIndex" />
</template>

<script setup lang="ts">
import type { XhtColumnIndexProps } from '@/components/element-plus/xht-table/types'

defineOptions({
  name: 'XhtColumnIndex',
})

const props = withDefaults(defineProps<XhtColumnIndexProps>(), {
  width: 55,
  label: '#',
  type: 'step',
  current: 1,
  size: 0,
})

/**
 * 生成表格索引
 * @param index 当前页内行索引
 * @returns 全局索引值
 */
const createTableIndex = (index: number): number => {
  if (props.type === 'step') {
    return index + 1
  }
  const current = props.current
  const size = props.size
  return (current - 1) * size + index + 1
}
</script>

<style scoped lang="scss"></style>
