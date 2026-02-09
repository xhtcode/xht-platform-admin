<script setup lang="ts">
import type { XhtDictRadioButtonEmits, XhtDictRadioButtonProps } from '@/components/dict/xht-dict-radio-button/types'
import { useDictHooks } from '@/hooks/use-dict'

defineOptions({
  name: ' XhtDictRadioButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<XhtDictRadioButtonProps>(), {
  border: false,
})

const emits = defineEmits<XhtDictRadioButtonEmits>()

/**
 * 字典项编码
 */
const modelValue = defineModel<string | undefined>('modelValue', {
  required: true,
})
/**
 * 字典数据
 */
const { loadingStatus, dictData } = useDictHooks(props.dictCode)

/**
 * 字典单选组件发生改变的时候
 */
const handlerChange = (value?: string) => {
  emits('change', value)
}
</script>

<template>
  <el-radio-group v-model="modelValue" v-loading="loadingStatus" @change="handlerChange">
    <el-radio-button v-for="item in dictData" :border="border" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
  </el-radio-group>
</template>

<style scoped lang="scss"></style>
