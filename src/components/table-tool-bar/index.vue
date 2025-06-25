<template>
  <div class="flex p-8">
    <div class="flex-1">
      <el-space>
        <slot />
      </el-space>
    </div>
    <div class="top-right-btn" :style="style">
      <el-tooltip
        class="item"
        :content="showSearch ? '快速查询' : '高级查询'"
        placement="top"
        v-if="searchStatus"
      >
        <el-button circle size="small" icon="Search" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip class="item" content="刷新" placement="top" v-if="refreshStatus">
        <el-button type="info" size="small" circle icon="Refresh" @click="refresh" />
      </el-tooltip>
      <el-tooltip class="item" content="导入" placement="top" v-if="importStatus">
        <el-button type="success" size="small" circle icon="Upload" @click="importData" />
      </el-tooltip>
      <el-tooltip class="item" content="导出" placement="top" v-if="exportStatus">
        <el-button type="primary" size="small" circle icon="Download" @click="exportData" />
      </el-tooltip>
      <el-tooltip class="item" content="显隐列" placement="top" v-if="columnStatus">
        <el-button color="#626aef" size="small" circle icon="Menu" @click="showColumn" />
      </el-tooltip>
      <slot name="column" />
      <el-dialog title="显示/隐藏" v-model="state.openStatus" append-to-body width="45vw">
        <div class="w100 flex-center">
          <el-transfer
            v-model="state.columnValue"
            v-loading="state.loadingStatus"
            :data="columnData"
            :props="{
              key: 'value',
              label: 'name'
            }"
            filterable
            :titles="['隐藏列', '显示列']"
          >
            <template #left-empty>
              <el-empty :image-size="60" description="暂无隐藏的列数据" />
            </template>
            <template #right-empty>
              <el-empty :image-size="60" description="暂无显示的列数据" />
            </template>
          </el-transfer>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmitsType, RightToolbarPropsType, StateType } from '@/components/table-tool-bar/types'
import { useVModel } from '@vueuse/core'

defineOptions({ name: 'TableToolbar' })
const props = withDefaults(defineProps<RightToolbarPropsType>(), {
  searchStatus: false, // 是否显示搜索框
  showSearch: false, // 是否显示搜索框提示
  refreshStatus: false, // 是否显示刷新
  importStatus: false, // 是否导入
  exportStatus: false, // 是否导出
  columnStatus: false, // 显隐列
  columnData: () => [], // 显隐数据
  gutter: 0, // 列表项之间的间距
})
const emits = defineEmits<EmitsType>()
const state = reactive<StateType>({
  columnValue: [], // 显隐数据
  openStatus: false, // 是否显示弹出层
  loadingStatus: false, // 加载
})
const showSearch = useVModel(props, 'showSearch', emits)
const columnData = useVModel(props, 'columnData', emits)

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
 * 导入数据
 */
const importData = () => {
  emits('import')
}

/**
 * 导出数据
 */
const exportData = () => {
  emits('export')
}

/**
 * 刷新
 */
const refresh = () => {
  emits('refresh')
}

/**
 * 打开显隐列dialog
 */
const showColumn = () => {
  state.loadingStatus = true
  state.columnValue = []
  state.openStatus = true
  // 显隐列初始默认隐藏列
  props.columnData.forEach((item) => {
    if (item.visible) {
      state.columnValue.push(item.value)
    }
  })
  state.loadingStatus = false
}
</script>

<style lang="scss" scoped>
/* 表格右侧工具栏样式 */
.top-right-btn {
  display: flex;
  justify-content: flex-end;

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
