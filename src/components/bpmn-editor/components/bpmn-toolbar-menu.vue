<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
defineOptions({
  name: 'BpmnPanelMenu',
  inheritAttrs: false,
})
const panelMenu = defineModel<boolean>('panelMenu', {
  default: false,
  required: false,
})
</script>

<template>
  <el-tooltip :content="panelMenu ? '折叠Panel' : '展开Panel'" placement="bottom">
    <el-button size="default" @click="panelMenu = !panelMenu">
      <el-icon size="16px">
        <Expand v-if="panelMenu" />
        <Fold v-else />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>

<style scoped lang="scss"></style>
