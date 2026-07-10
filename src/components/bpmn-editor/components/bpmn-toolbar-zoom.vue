<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'BpmnToolbarZoom',
})
const zoomNumber = ref<any>(100)
const zoomStep = 0.1
const currentScale = computed<any>(() => {
  return Math.floor(zoomNumber.value * 10) * 10
})
const bpmnStore = useBpmnStore()
const { canvas, modeler } = storeToRefs(bpmnStore)
const zoomOut = () => {
  zoomNumber.value = zoomNumber.value - zoomStep
  if (currentScale.value <= 0.5) {
    zoomNumber.value = 0.5
  }
  changeZoom()
}
const zoomReset = () => {
  zoomNumber.value = 1
  changeZoom()
}
const zoomIn = () => {
  zoomNumber.value = zoomNumber.value + zoomStep
  if (zoomNumber.value >= 5) {
    zoomNumber.value = 5
  }
  changeZoom()
}
const changeZoom = () => {
  canvas.value && canvas.value.zoom(zoomNumber.value, zoomNumber.value === 'fit-viewport' ? undefined : { x: 0, y: 0 })
}
onMounted(() => {
  nextTick(() => {
    try {
      zoomNumber.value = canvas.value?.zoom() || 1
    } finally {
      modeler.value?.on('canvas.viewbox.changed', ({ viewbox }: any) => {
        zoomNumber.value = viewbox.scale
      })
    }
  })
})
</script>

<template>
  <el-button-group size="default">
    <el-tooltip content="缩小" placement="bottom">
      <el-button @click="zoomOut" type="primary" :disabled="zoomNumber <= 0.5">
        <el-icon size="16px"><ZoomOut /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="重置缩放" placement="bottom">
      <el-button @click="zoomReset">{{ currentScale }}%</el-button>
    </el-tooltip>
    <el-tooltip content="放大" placement="bottom">
      <el-button @click="zoomIn" type="primary" :disabled="zoomNumber >= 5">
        <el-icon size="16px"><ZoomIn /></el-icon>
      </el-button>
    </el-tooltip>
  </el-button-group>
</template>

<style scoped lang="scss"></style>
