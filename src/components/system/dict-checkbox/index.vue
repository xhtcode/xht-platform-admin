<script setup lang="ts">
import { useDictHooks } from '@/hooks/use-dict'
import type { DictCheckboxEmits, DictCheckboxProps } from '@/components/system/dict-checkbox/types'

defineOptions({
  name: 'DictCheckbox',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DictCheckboxProps>(), {
  border: false,
})

const emits = defineEmits<DictCheckboxEmits>()

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
    <el-checkbox v-for="item in dictData" :border="border" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
  </el-checkbox-group>
</template>

<style scoped lang="scss"></style>
