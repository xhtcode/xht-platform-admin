<script setup lang="ts" generic="T extends BasicResponse">
import type { SortableEvent } from 'sortablejs'
import Sortable from 'sortablejs'
import { Rank } from '@element-plus/icons-vue'
import type { XhtColumnDragSortEmits, XhtColumnDragSortProps } from '@/components/element-plus/xht-column-drag-sort/types'

defineOptions({
  name: 'XhtColumnDragSort',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<XhtColumnDragSortProps>(), {
  label: '排序',
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
    onEnd({ newIndex, oldIndex }: SortableEvent) {
      const targetRow = data.value.splice(oldIndex!, 1)[0]
      data.value.splice(newIndex!, 0, targetRow)
      emits('dragEnd', oldIndex!, newIndex!)
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

<template>
  <el-table-column :label="label" :width="width" type="default" class-name="xht-table-column-drag-sort">
    <template #default>
      <span class="xht-table-column-drag-icon">
        <el-icon class="drag-sort-icon" :size="18"><Rank /></el-icon>
      </span>
    </template>
  </el-table-column>
</template>

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
