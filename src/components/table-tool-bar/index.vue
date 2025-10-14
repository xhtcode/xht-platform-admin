<template>
  <div class="flex p-8">
    <div class="flex-1">
      <el-space>
        <slot />
      </el-space>
    </div>
    <div class="top-right-btn" :style="style">
      <el-tooltip
        v-if="searchStatus"
        class="item"
        content="搜索切换"
        placement="top"
      >
        <el-button circle size="small" icon="Switch" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip v-if="refreshStatus" class="item" content="刷新" placement="top">
        <el-button
          type="info"
          size="small"
          circle
          icon="Refresh"
          @click="emitFunction('refresh')"
        />
      </el-tooltip>
      <el-tooltip v-if="importStatus" class="item" content="导入" placement="top">
        <el-button
          type="success"
          size="small"
          circle
          icon="Upload"
          @click="emitFunction('import')"
        />
      </el-tooltip>
      <el-tooltip v-if="exportStatus" class="item" content="导出" placement="top">
        <el-button
          type="primary"
          size="small"
          circle
          icon="Download"
          @click="emitFunction('export')"
        />
      </el-tooltip>
      <el-button color="#626aef" ref="columnBtnRef" size="small" circle icon="Tools" />
      <slot name="column" />
    </div>
    <el-popover
      trigger="click"
      placement="left-start"
      :virtual-ref="columnBtnRef"
      virtual-triggering
      append-to="body"
      width="auto"
    >
      <el-checkbox
        v-model="checkAllStatus"
        :indeterminate="indeterminateStatus"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
      <el-divider style="margin: 0" />
      <el-checkbox-group v-model="checkedDataArray">
        <div v-for="city in columnData" :key="city.value" class="max-w-[160px] overflow-hidden ws-nowrap">
          <el-checkbox
            :label="city.value"
            :value="city.name"
            :disabled="city.disabled"
            @change="checkboxChange(city)"
          >
            <div class="">
              {{ city.value }}
            </div>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import type {
  ColumnOption,
  EmitsType,
  RightToolbarPropsType,
} from '@/components/table-tool-bar/types'
import type { CheckboxValueType } from 'element-plus'

defineOptions({ name: 'TableToolbar' })
const props = withDefaults(defineProps<RightToolbarPropsType>(), {
  searchStatus: false, // 是否显示搜索框
  refreshStatus: false, // 是否显示刷新
  importStatus: false, // 是否导入
  exportStatus: false, // 是否导出
  columnStatus: false, // 显隐列
  gutter: 0, // 列表项之间的间距
})
const columnBtnRef = useTemplateRef('columnBtnRef')
const checkAllStatus = ref(false)
const indeterminateStatus = ref(false)
const checkedDataArray = ref<string[]>([])
const checkedAllCount = computed<string[]>(() =>
  columnData.value.filter((item) => !item.disabled).map((item) => item.name)
)
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedDataArray.value = val ? checkedAllCount.value : []
  const empStatus = checkedDataArray.value.length > 0
  columnData.value.forEach((item) => {
    if (!item.disabled) item.visible = empStatus
  })
  indeterminateStatus.value = false
}

const checkboxChange = (value: ColumnOption) => {
  value.visible = !value.visible
  const empStatus = checkedDataArray.value.length === checkedAllCount.value.length
  indeterminateStatus.value = checkedDataArray.value.length > 0 && !empStatus
  checkAllStatus.value = empStatus
}

const emits = defineEmits<EmitsType>()
const showSearch = defineModel<boolean>('showSearch', {
  required: false,
  default: false,
})
const columnData = defineModel<ColumnOption[]>('columnData', {
  required: false,
  default: [],
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

const emitFunction = (emitFunName: 'import' | 'export' | 'refresh' | any) => {
  emits(emitFunName)
}
</script>

<style lang="scss" scoped>
/* 表格右侧工具栏样式 */
.top-right-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
