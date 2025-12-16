<script lang="ts" setup>
import { Operation } from '@element-plus/icons-vue'

defineOptions({ name: 'XhtCard' })

const state = reactive({
  footerStatus: false,
})

const handlerToolChange = () => {
  state.footerStatus = !state.footerStatus
}
</script>

<template>
  <div class="xht-card-container">
    <div v-if="$slots.footer" class="xht-card-tool flex-center cursor-pointer" @click="handlerToolChange()">
      <el-icon :size="16">
        <Operation />
      </el-icon>
    </div>
    <div class="xht-card-default">
      <slot :footer-status="state.footerStatus" />
    </div>
    <div v-if="$slots.footer && state.footerStatus" class="xht-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.xht-card-container {
  --xht-card-padding: 16px;
  --xht-card-radius-base: 8px;
  --xht-card-tool-hover: var(--xht-button-hover-bg-color);
  background-color: var(--xht-card-bg-color);
  border: 1px solid var(--xht-card-border-color);
  border-radius: var(--xht-card-radius-base);
  color: var(--xht-text-color);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  .xht-card-tool {
    width: calc(var(--xht-card-padding) * 1.5);
    border-radius: var(--xht-border-radius-circle);
    height: calc(var(--xht-card-padding) * 1.5);
    border: 1px solid var(--xht-card-border-color);
    position: absolute;
    top: calc(var(--xht-card-padding) / 2);
    right: calc(var(--xht-card-padding) / 2);
    z-index: 999;

    &:hover {
      background: var(--xht-card-tool-hover);
    }
  }

  .xht-card-default {
    padding: calc(var(--xht-card-padding) / 2);
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
  }

  .xht-card-footer {
    border-top: 1px solid var(--xht-card-border-color);
    box-sizing: border-box;
    padding: calc(var(--xht-card-padding) / 2);
    user-select: none;
  }
}
</style>
