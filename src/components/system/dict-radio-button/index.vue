<script setup lang="ts">
import { useDictHooks } from '@/hooks/use-dict'
import { DictRadioButtonEmits, DictRadioButtonProps } from '@/components/system/dict-radio-button/types'
import { DictRadioEmits } from '@/components/system/dict-radio/types'

defineOptions({
  name: 'DictRadioButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DictRadioButtonProps>(), {
  border: false,
})

const emits = defineEmits<DictRadioButtonEmits>()

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
