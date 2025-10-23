<template>
  <el-table-column
    label="排序"
    :width="width"
    type="default"
    class-name="xht-table-column-drag-sort"
  >
    <span class="xht-table-column-drag-icon">
      <el-icon class="drag-sort-icon" :size="18"><Rank /></el-icon>
    </span>
  </el-table-column>
</template>

<script setup lang="ts" generic="T extends BasicResponse">
import type { SortableEvent } from 'sortablejs'
import Sortable from 'sortablejs'
import { Rank } from '@element-plus/icons-vue'
import {
  XhtColumnDragSortEmits,
  XhtColumnDragSortProps,
} from '@/components/element-plus/xht-table/types'
import type { BasicResponse } from '@/service/model/base.model'

defineOptions({
  name: 'XhtColumnDragSort',
})

const props = withDefaults(defineProps<XhtColumnDragSortProps>(), {
  width: 55,
})
const emits = defineEmits<XhtColumnDragSortEmits>()
const data = defineModel<T[]>('data', {
  required: true,
})
// 行拖拽
const rowDrop = () => {
  const element = props.tableRef?.$el?.querySelector('.el-table__body-wrapper tbody')
  const config: Sortable.Options = {
    handle: '.xht-table-column-drag-sort',
    animation: 150,
    group: 'box',
    easing: 'cubic-bezier(1, 0, 0, 1)',
    chosenClass: 'sortable-chosen',
    forceFallback: true,
    onEnd({ newIndex, oldIndex }: SortableEvent) {
      const targetRow = data.value.splice(oldIndex!, 1)[0]
      data.value.splice(newIndex!, 0, targetRow)
      emits('dragEnd', newIndex!, oldIndex!)
    },
  }
  Sortable.create(element as HTMLElement, config)
}
onMounted(() => {
  nextTick(() => {
    rowDrop()
  })
})
</script>
<style lang="scss">
.el-table__body {
  .xht-table-column-drag-sort {
    cursor: grab;

    &:active {
      cursor: grabbing; /* 拖拽中：闭合的手 */
    }

    &:hover {
      .xht-table-column-drag-icon {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
