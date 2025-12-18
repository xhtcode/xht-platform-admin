<script setup lang="ts" generic="T extends DefaultRow">
import type { XhtTableProps, XhtTablePropsEmits } from '@/components/element-plus/xht-table/types'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
import type { TableInstance } from 'element-plus'

defineOptions({
  name: 'XhtTable',
  inheritAttrs: false,
})

withDefaults(defineProps<XhtTableProps<T>>(), {
  data: () => [], // 表数据
  border: true, // 是否带有纵向边框，默认false
  className: 'xht-table',
  fit: true, // 列的宽度是否自撑开，默认true
  selectOnIndeterminate: true, // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行，默认true
  cellStyle: () => ({ textAlign: 'center', padding: '6px' }),
  headerCellStyle: () => ({
    textAlign: 'center',
    background: 'var(--el-table-row-hover-bg-color)',
    color: 'var(--el-text-color-primary)',
    userSelect: 'none',
  }),
  emptyText: '暂无匹配数据 🔍 试试调整筛选条件吧', // 空数据时显示的文本内容
  treeProps: undefined,
  defaultExpandAll: false, // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效，默认false
  showHeader: true, // 是否显示表头，默认true
  showSummary: false, // 是否在表尾显示合计行，默认false
  highlightCurrentRow: false, // 是否要高亮当前行，默认false
})

const emits = defineEmits<XhtTablePropsEmits<T>>()

const tableRef = useTemplateRef<TableInstance>('tableRef')

const setCurrentRow = (data: any) => {
  tableRef.value!.setCurrentRow(data)
}
defineExpose({
  setCurrentRow,
})
</script>

<template>
  <el-table
    :data="data"
    :border="border"
    :row-key="rowKey"
    class="xht-table"
    :class-name="className"
    :fit="fit"
    :cell-style="cellStyle"
    :header-cell-style="headerCellStyle"
    :empty-text="emptyText"
    :tree-props="treeProps!"
    :default-expand-all="defaultExpandAll"
    :show-header="showHeader"
    :show-summary="showSummary"
    :highlight-current-row="highlightCurrentRow"
    @selection-change="
      (value: any) => {
        emits('selectionChange', value)
      }
    "
    ref="tableRef"
  >
    <slot />
    <!-- 插入至表格最后一行之后的内容 -->
    <template #append>
      <slot name="append" />
    </template>

    <!-- 当数据为空时自定义的内容 -->
    <template #empty>
      <slot name="empty" />
    </template>
  </el-table>
</template>
