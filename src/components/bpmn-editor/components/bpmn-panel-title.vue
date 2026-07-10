<script setup lang="ts">
import { Grid } from '@element-plus/icons-vue'

defineOptions({
  name: 'BpmnPanelTitle',
  inheritAttrs: false,
})
withDefaults(
  defineProps<{
    name: string
  }>(),
  {}
)
</script>

<template>
  <div class="bpmn-panel-title">
    <el-icon :size="22">
      <slot />
    </el-icon>
    <div class="font-[22px]">{{ name }}</div>
  </div>
</template>

<style scoped lang="scss">
.bpmn-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: var(--xht-text-color);
}
</style>
