<script setup lang="ts">
import { useDictHooks } from '@/hooks/use-dict'
import type { DictCheckboxButtonEmits, DictCheckboxButtonProps } from '@/components/system/dict-checkbox-button/types'

defineOptions({
  name: 'DictCheckboxButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DictCheckboxButtonProps>(), {
  border: false,
})

const emits = defineEmits<DictCheckboxButtonEmits>()

/**
 * 字典项编码
 */
const modelValue = defineModel<string[] | undefined>('modelValue', {
  required: true,
})

/**
 * 字典数据
 */
const { loadingStatus, dictData } = useDictHooks(props.dictCode)

/**
 * 字典多选组件发生改变的时候
 */
const handlerChange = (value: string[]) => {
  emits('change', value)
}
</script>

<template>
  <el-checkbox-group v-model="modelValue" v-loading="loadingStatus" :min="min" :max="max" @change="handlerChange">
    <el-checkbox-button
      v-for="item in dictData"
      :border="border"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-checkbox-group>
</template>

<style scoped lang="scss"></style>
