<script setup lang="ts">
import type { XhtEnumCheckboxEmits, XhtEnumCheckboxProps } from '@/components/enums/xht-enum-checkbox/types'

defineOptions({
  name: 'XhtEnumCheckbox',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<XhtEnumCheckboxProps>(), {
  border: false,
})

const emits = defineEmits<XhtEnumCheckboxEmits>()

/**
 * 枚举项编码
 */
const modelValue = defineModel<any[] | undefined>('modelValue', {
  required: true,
})

/**
 * 枚举多选组件发生改变的时候
 */
const handlerChange = (value: any[]) => {
  emits('change', value)
}
</script>

<template>
  <el-checkbox-group v-model="modelValue" :min="min" :max="max" @change="handlerChange">
    <el-checkbox v-for="item in props.data" :border="border" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
  </el-checkbox-group>
</template>

<style scoped lang="scss"></style>
