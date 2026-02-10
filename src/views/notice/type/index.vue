<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryListHooks } from '@/hooks/use-crud-hooks'
import type { SysNoticeTypeQueryRequest, SysNoticeTypeResponse } from '@/service/model/notice/type.model'
import { querySysNoticeTypeList, removeSysNoticeTypeById, removeSysNoticeTypeByIdBatch } from '@/service/api/notice/type.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { noticeTypeStatusEnums } from '@/service/enums/system/notice.enum'

defineOptions({ name: 'SysNoticeTypeView' })

const noticeTypeFrom = defineAsyncComponent(() => import('@/views/notice/type/components/type-from.vue'))
const sysNoticeTypeFormRef = useTemplateRef('sysNoticeTypeFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryListState<SysNoticeTypeQueryRequest, SysNoticeTypeResponse>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 刷新表格状态
  expandAllStatus: false, // 展开所有状态
  searchStatus: false, // 是否显示搜索区域
  queryParams: {
    descName: 'noticeTypeSort',
  }, // 查询参数
  tableList: [], // 表格数据列表
})
const { handleListQuery, handleSelectionChange } = useTableQueryListHooks<SysNoticeTypeQueryRequest, SysNoticeTypeResponse>(
  state,
  querySysNoticeTypeList
)
const { queryParams } = toRefs(state)

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handleListQuery()
}

/**
 * 处理新增系统管理-通知类型
 */
const handleAdd = () => {
  sysNoticeTypeFormRef.value?.show('create', null)
}

/**
 * 处理编辑系统管理-通知类型
 */
const handleEdit = (row: SysNoticeTypeResponse) => {
  sysNoticeTypeFormRef.value?.show('update', row.id)
}

/**
 * 处理删除系统管理-通知类型
 */
const handleDelete = (row: SysNoticeTypeResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除系统管理-通知类型, 是否继续?')
    .then(async () => {
      await removeSysNoticeTypeById(row.id)
      await handleListQuery()
      useMessage().success('删除系统管理-通知类型成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除系统管理-通知类型
 */
const handleBatchDelete = () => {
  const ids = state.selectedRows?.map((item) => item.id) || []
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择系统管理-通知类型数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将批量删除${ids.length}个系统管理-通知类型, 是否继续?`)
    .then(async () => {
      await removeSysNoticeTypeByIdBatch(ids)
      await handleListQuery()
      useMessage().success('批量删除系统管理-通知类型成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

onMounted(async () => {
  await handleListQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="类型名称" prop="noticeTypeName">
            <el-input v-model="queryParams.noticeTypeName" clearable :maxlength="100" show-word-limit placeholder="请输入类型名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="类型状态" prop="noticeTypeStatus">
            <xht-enum-select v-model="queryParams.noticeTypeStatus" :data="noticeTypeStatusEnums" clearable placeholder="请选择类型状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleListQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar>
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:notice:type:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows![0])"
        v-authorization="['sys:notice:type:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleBatchDelete"
        v-authorization="['sys:notice:type:remove']"
      >
        批量删除
      </el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed="left" align="center" type="selection" width="55" />
      <xht-column-index fixed="left" :current="queryParams.current" :size="queryParams.size" />
      <el-table-column label="类型名称" prop="noticeTypeName" min-width="120" />
      <el-table-column label="类型状态" prop="noticeTypeStatus" width="80">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.noticeTypeStatus" :data="noticeTypeStatusEnums" />
        </template>
      </el-table-column>
      <el-table-column label="类型排序" prop="noticeTypeSort" width="80" />
      <el-table-column label="创建人" prop="createBy" width="160" />
      <el-table-column label="创建时间" prop="createTime" width="180" />
      <el-table-column label="更新人" prop="updateBy" width="160" />
      <el-table-column label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" width="160">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:notice:type:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:notice:type:remove']">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <xht-pagination
      v-model:current-page="state.queryParams.current"
      v-model:page-size="state.queryParams.size"
      :page-count="state.pages"
      :total="state.total"
      @pagination="handleListQuery"
    />
    <notice-type-from ref="sysNoticeTypeFormRef" @success="handleListQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
