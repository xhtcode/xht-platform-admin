<script lang="ts" setup>
defineOptions({ name: 'HomeAdminViewIndex' })

const value = ref<any>(1)

const options = [
  {
    value: '1',
    label: 'Option1',
  },
  {
    value: '2',
    label: 'Option2',
  },
  {
    value: '3',
    label: 'Option3',
  },
  {
    value: '4',
    label: 'Option4',
  },
  {
    value: '5',
    label: 'Option5',
  },
]
</script>

<template>
  <div class="xht-view-container-none">
    <el-select v-model="value" placeholder="Select" style="width: 240px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<style lang="scss" scoped></style>
