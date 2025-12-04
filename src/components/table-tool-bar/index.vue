<template>
  <div class="flex p-8px">
    <div class="flex-1">
      <el-space>
        <slot />
      </el-space>
    </div>
    <div :style="style" class="top-right-btn">
      <slot name="after" />
      <el-tooltip v-if="importStatus" class="item" content="导入" placement="top">
        <el-button circle :icon="Upload" size="small" type="success" @click="emitFunction('import')" />
      </el-tooltip>
      <el-tooltip v-if="exportStatus" class="item" content="导出" placement="top">
        <el-button circle :icon="Download" size="small" type="primary" @click="emitFunction('export')" />
      </el-tooltip>
      <el-tooltip v-if="refreshStatus" class="item" content="刷新" placement="top">
        <el-button circle :icon="Refresh" size="small" type="info" @click="emitFunction('refresh')" />
      </el-tooltip>
      <el-tooltip v-if="searchStatus" class="item" content="搜索切换" placement="top">
        <el-button circle :icon="Switch" size="small" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip class="item" content="列设置" placement="top">
        <el-button @click="show" circle color="#626aef" :icon="Menu" size="small" />
      </el-tooltip>
      <slot name="before" />
    </div>
    <el-drawer title="列设置" v-model="visibleStatus" append-to="body" size="30vw" :before-close="close" width="auto">
      <template #header>
        <el-checkbox v-model="checkAllStatus" :indeterminate="indeterminateStatus" @change="handleCheckAllChange">全选（列）</el-checkbox>
      </template>
      <div v-for="(item, key) in columnData" :key="key" class="w-full p-4px overflow-hidden ws-nowrap">
        <el-checkbox v-model="item!.visible" :disabled="item!.disabled" :label="item!.desc" @change="checkboxChange()" />
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import type { ColumnConfig, ColumnOption, EmitsType, RightToolbarPropsType } from '@/components/table-tool-bar/types'
import { Download, Menu, Refresh, Switch, Upload } from '@element-plus/icons-vue'

defineOptions({ name: 'TableToolbar' })
const props = withDefaults(defineProps<RightToolbarPropsType>(), {
  searchStatus: false, // 是否显示搜索框
  refreshStatus: false, // 是否显示刷新
  importStatus: false, // 是否导入
  exportStatus: false, // 是否导出
  columnStatus: false, // 显隐列
  gutter: 0, // 列表项之间的间距
})
const emits = defineEmits<EmitsType>()
const showSearch = defineModel<boolean>('showSearch', {
  required: false,
  default: false,
})
const columnData = defineModel<ColumnConfig<any>>('columnData', {
  required: false,
  default: {},
})
const checkAllStatus = ref<boolean>(false)
const indeterminateStatus = ref<boolean>(false)
const visibleStatus = ref<boolean>(false)
const checkBoxDataList = computed(() => {
  return Object.entries(columnData.value).map(([_, item]) => item) || []
})

const checkboxData = computed<ColumnOption[]>(() => {
  const filter: ColumnOption[] = []
  checkBoxDataList.value.forEach((item) => {
    if (item && item.visible) {
      filter.push(item)
    }
  })
  return filter
})

/**
 * 如果props中有传入gutter属性，则计算出marginRight 返回计算后的样式对象
 */
const style = computed(() => {
  if (props.gutter && props.gutter >= 10) {
    return {
      marginRight: `${props.gutter / 2}px`,
    }
  }
  return { marginRight: '0px' }
})

/**
 * 搜索切换
 */
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

/**
 * 触发对应的事件
 * @param emitFunName 需要触发的事件名称，可选值为 'import'(导入) | 'export'(导出) | 'refresh'(刷新)
 */
const emitFunction = (emitFunName: 'import' | 'export' | 'refresh' | any) => {
  emits(emitFunName)
}

/**
 * 处理全选状态变更
 * 当全选复选框状态改变时，同步更新所有列的可见状态
 */
const handleCheckAllChange = () => {
  const empStatus = checkAllStatus.value
  Object.entries(columnData.value).forEach(([_, value]) => {
    if (value && !value.disabled) value.visible = empStatus
  })
  indeterminateStatus.value = false
}

/**
 * 处理单个复选框状态变更
 * 根据当前选中项数量更新全选复选框的状态（选中、半选中或未选中）
 */
const checkboxChange = () => {
  const empStatus = checkboxData.value.length === checkBoxDataList.value.length
  indeterminateStatus.value = checkboxData.value.length > 0 && !empStatus
  checkAllStatus.value = empStatus
}
/**
 * 显示列设置
 */
const show = () => {
  visibleStatus.value = true
}
/**
 * 隐藏列设置
 */
const close = () => {
  visibleStatus.value = false
}

onMounted(() => {
  checkboxChange()
})
</script>

<style lang="scss" scoped>
/* 表格右侧工具栏样式 */
.top-right-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
