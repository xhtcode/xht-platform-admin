<template>
  <div class="main-container-scrollbar">
    <div class="main-container-auto main-container-view">
      <data-source-select />
    </div>
  </div>
</template>
<script setup lang="ts">
import DataSourceSelect from '@/components/generate-components/datasource-select/index.vue'

defineOptions({ name: 'HomeViewComponentIndex' })
</script>

<style scoped lang="scss"></style>
