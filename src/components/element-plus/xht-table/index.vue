<template>
  <el-table :data="tableDataList" :cell-style="cellStyle" :header-cell-style="headerCellStyle">
    <el-table-column label="日期" prop="date" />
    <el-table-column label="中文姓名" prop="name" />
    <el-table-column label="中文省份" prop="state" />
    <el-table-column label="中文城市" prop="city" />
    <el-table-column label="中文地址" prop="address" />
    <el-table-column label="邮政编码" prop="zip" />
    <el-table-column label="中文标签" prop="tag" />
  </el-table>
</template>

<script setup lang="ts">
import { fetchTableData, type TableData } from '@/components/element-plus/xht-table/data'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'

defineOptions({
  name: 'XhtTable',
})
const { cellStyle, headerCellStyle } = useTableToolHooks()
const tableDataList = shallowRef<TableData[]>([])

const queryData = () => {
  fetchTableData().then((res) => {
    tableDataList.value = res
  })
}
onMounted(() => {
  queryData()
})
</script>

<style scoped lang="scss"></style>
