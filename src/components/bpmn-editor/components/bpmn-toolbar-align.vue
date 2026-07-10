<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { useMessage } from '@/hooks/use-message'
import { Refresh } from '@element-plus/icons-vue'

defineOptions({
  name: 'BpmnToolbarAlign',
})
const bpmnStore = useBpmnStore()
const { modeler, modeling, selection, selectionAlign, canvas } = storeToRefs(bpmnStore)

/**
 * 元素对齐
 * @param tag
 */
const alignElements = (tag: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
  if (modeling.value && selection.value) {
    bpmnStore.selectionModelerInit(modeler.value!)
    const getElements = selection.value?.get()
    if (!getElements || getElements.length <= 1) {
      useMessage().error('请按住 Shift 键选择多个元素对齐')
      return
    }
    selectionAlign.value.trigger(getElements, tag)
  } else {
    useMessage().error('bpmn 系统错误，无法进行元素对齐')
  }
}
/**
 * 适应
 */
const fitAuto = () => {
  canvas.value?.zoom('fit-viewport', 'auto')
}
</script>

<template>
  <el-button-group type="primary" size="default">
    <el-tooltip content="自适应" placement="bottom">
      <el-button @click="fitAuto">
        <el-icon :size="16">
          <refresh />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="左对齐" placement="bottom">
      <el-button @click="alignElements('left')"><div class="i-common-align-start-vertical"></div></el-button>
    </el-tooltip>
    <el-tooltip content="水平居中" placement="bottom">
      <el-button @click="alignElements('center')"><div class="i-common-align-center-vertical"></div></el-button>
    </el-tooltip>
    <el-tooltip content="右对齐" placement="bottom">
      <el-button @click="alignElements('right')"><div class="i-common-align-end-vertical"></div></el-button>
    </el-tooltip>
    <el-tooltip content="上对齐" placement="bottom">
      <el-button @click="alignElements('top')"><div class="i-common-align-start-horizontal"></div></el-button>
    </el-tooltip>
    <el-tooltip content="垂直居中" placement="bottom">
      <el-button @click="alignElements('middle')"><div class="i-common-align-center-horizontal"></div></el-button>
    </el-tooltip>
    <el-tooltip content="下对齐" placement="bottom">
      <el-button @click="alignElements('bottom')"><div class="i-common-align-end-horizontal"></div></el-button>
    </el-tooltip>
  </el-button-group>
</template>

<style scoped lang="scss"></style>
