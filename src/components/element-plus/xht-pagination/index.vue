<template>
  <div class="pagination-container">
    <el-pagination
      :background="props.background"
      :current-page="currentPage"
      :default-current-page="props.defaultCurrentPage"
      :default-page-size="props.defaultPageSize"
      :disabled="props.disabled"
      :hide-on-single-page="props.hideOnSinglePage"
      :layout="props.layout"
      :next-icon="props.nextIcon"
      :next-text="props.nextText"
      :page-count="props.pageCount"
      :page-size="pageSize"
      :page-sizes="props.pageSizes"
      :pager-count="props.pagerCount"
      :prev-icon="props.prevIcon"
      :prev-text="props.prevText"
      :teleported="props.teleported"
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import type { XhtPaginationProps } from '@/components/element-plus/xht-pagination/types'

defineOptions({ name: 'XhtPagination', inheritAttrs: false })

const props = withDefaults(defineProps<XhtPaginationProps>(), {
  background: true, //是否为分页按钮添加背景色
  defaultPageSize: 10, //每页默认的条目个数，不设置时默认为10
  pagerCount: () => {
    return document.body.clientWidth < 992 ? 5 : 7
  }, //设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
  defaultCurrentPage: 1, //当前页数的默认初始值，不设置时默认为 1
  layout: 'total, sizes, prev, pager, ->, next, jumper', //组件布局，子组件名用逗号分隔
  pageSizes: () => [10, 20, 30, 50, 100, 500], //每页显示个数选择器的选项设置
  disabled: false, //是否禁用分页
  teleported: true, //是否将下拉菜单teleport至 body
  hideOnSinglePage: true, //只有一页时是否隐藏
  prevText: undefined, //	替代图标显示的上一页文字
  prevIcon: undefined,
  nextText: undefined,
  nextIcon: undefined,
  pageCount: undefined,
})
const pageSize = defineModel<number | undefined>('pageSize', {
  required: true,
})
const currentPage = defineModel<number | undefined>('currentPage', {
  required: true,
})
const emits = defineEmits(['pagination'])
/**
 *  page-size 改变时触发
 */
const handleSizeChange = () => {
  emits('pagination')
}

/**
 * current-page 改变时触发
 */
const handleCurrentChange = () => {
  emits('pagination')
}
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  flex-direction: row-reverse;
  padding: 12px;
  user-select: none;
}
</style>
