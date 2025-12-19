<script setup lang="ts">
import { useDictHooks } from '@/hooks/use-dict'

defineOptions({
  name: 'ColumnDictSelect',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<{
    dictCode: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)
/**
 * 字典编码
 */
const modelValue = defineModel<string>('modelValue', {
  required: false,
})
const loading = ref<boolean>(false)
/**
 * 表单组件
 */
const fromComponent = defineModel<string>('fromComponent', {
  required: false,
})

const dictHooks = useDictHooks(props.dictCode, loading.value)
/**
 * 字典编码改变
 */
const handleChange = (value: string | any) => {
  if (value) {
    fromComponent.value = 'dict-radio'
  } else {
    fromComponent.value = 'input'
  }
}
</script>

<template>
  {{ dictHooks }}
  <el-select v-model="modelValue" @change="handleChange" :disabled="disabled" v-loading="loading" clearable placeholder="请选择字典类型">
    <el-option label="1" value="1" />
    <el-option label="2" value="2" />
    <el-option label="3" value="3" />
    <el-option label="5" value="5" />
  </el-select>
</template>

<style scoped lang="scss"></style>
