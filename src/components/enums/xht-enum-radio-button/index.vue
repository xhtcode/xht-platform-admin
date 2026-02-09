<script setup lang="ts">
import type { XhtEnumRadioButtonEmits, XhtEnumRadioButtonProps } from '@/components/enums/xht-enum-radio-button/types'

defineOptions({
  name: 'XhtEnumRadioButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<XhtEnumRadioButtonProps>(), {
  border: false,
})

const emits = defineEmits<XhtEnumRadioButtonEmits>()

/**
 * 枚举项编码
 */
const modelValue = defineModel<any | undefined>('modelValue', {
  required: true,
})

/**
 * 枚举单选组件发生改变的时候
 */
const handlerChange = (value?: any) => {
  emits('change', value)
}
</script>

<template>
  <el-radio-group v-model="modelValue" @change="handlerChange">
    <el-radio-button
      v-for="item in props.data"
      :border="border"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-radio-group>
</template>

<style scoped lang="scss"></style>
