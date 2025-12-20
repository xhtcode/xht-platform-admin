<script lang="ts" setup>
import { useDictStore } from '@/store/modules/dict.store'

defineOptions({ name: 'HomeViewComponentIndex' })
const a = ref<any>('user_status')
const dictStore = useDictStore()
</script>

<template>
  <div class="xht-view-container-none">
    <div class="xht-view-main">
      <el-button @click="dictStore.removeDict('order_status')">删除</el-button>
      {{ a }}
      <column-dict-select v-model="a" dict-code="order_status" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
