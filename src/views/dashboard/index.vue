<script lang="ts" setup>
import { generateUUID } from '@/utils'

defineOptions({ name: 'HomeViewComponentIndex' })
const a = ref<any>()
const b = ref<any>(generateUUID())
</script>

<template>
  <div class="xht-view-container-none">
    <div class="xht-view-main">
      <div />
      <column-dict-select v-model="a" :dict-code="generateUUID()" />
      <column-dict-select v-model="a" :dict-code="generateUUID()" />
      <column-dict-select v-model="a" :dict-code="generateUUID()" />
      <column-dict-select v-model="a" :dict-code="generateUUID()" />
      <column-dict-select v-model="a" :dict-code="generateUUID()" />
      <column-dict-select v-model="a" :dict-code="generateUUID()" />
      <column-dict-select v-model="a" dict-code="b" />
      <column-dict-select v-model="a" dict-code="bsssss" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
