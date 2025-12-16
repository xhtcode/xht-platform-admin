<script setup lang="ts">
defineOptions({
  name: 'DictSelect',
})

/**
 * 字典编码
 */
const dictCode = defineModel<string>('modelValue', {
  required: true,
})
</script>

<template>
  <el-select v-model="dictCode"></el-select>
</template>

<style scoped lang="scss"></style>
