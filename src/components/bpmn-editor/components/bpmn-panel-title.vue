<script setup lang="ts">
defineOptions({
  name: 'BpmnPanelTitle',
  inheritAttrs: false,
})
withDefaults(
  defineProps<{
    name: string
    className?: string
  }>(),
  {}
)
</script>

<template>
  <div class="bpmn-panel-title" :class="className">
    <el-icon :size="16">
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
