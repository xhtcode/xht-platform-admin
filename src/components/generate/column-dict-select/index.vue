<template>
  <el-select v-model="modelValue" @change="handleChange" clearable>
    <el-option label="1" value="1" />
    <el-option label="2" value="2" />
    <el-option label="3" value="3" />
    <el-option label="5" value="5" />
  </el-select>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ColumnDictSelect',
  inheritAttrs: false,
})
/**
 * 字典编码
 */
const modelValue = defineModel<any>('modelValue', {
  required: false,
})
/**
 * 字典编码
 */
const fromComponent = defineModel<any>('fromComponent', {
  required: false,
})

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

<style scoped lang="scss"></style>
