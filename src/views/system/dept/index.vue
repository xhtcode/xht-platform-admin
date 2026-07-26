<script lang="ts" setup>
import { querySysDeptTree, removeSysDeptById } from '@/service/api/system/dept.api'
import type { SysDeptQueryRequest, SysDeptResponse } from '@/service/model/system/dept.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { sysDeptColumnOption } from '@/views/system/dept/dept.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { Delete, Edit, Plus, Refresh, Search, Sort } from '@element-plus/icons-vue'
import { useTableQueryListHooks } from '@/hooks/use-crud-hooks'
import { deptStatusEnum } from '@/service/enums/system/dept.enum'

defineOptions({ name: 'SysDeptViewIndex' })

const deptForm = defineAsyncComponent(() => import('@/views/system/dept/components/dept-form.vue'))
const deptFormRef = useTemplateRef('deptFormRef')

const state = reactive<TableQueryListState<SysDeptQueryRequest, INodeResponse<SysDeptResponse>>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 刷新表格状态
  expandAllStatus: false, // 展开所有状态
  searchStatus: false, // 是否显示搜索区域
  queryParams: {}, // 查询参数
  tableList: [], // 表格数据列表
})

const { handleListQuery, handleExpandAll } = useTableQueryListHooks<SysDeptQueryRequest, INodeResponse<SysDeptResponse>>(state, querySysDeptTree)
const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<SysDeptResponse>>({
  ...sysDeptColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryParams.value = {}
  await handleListQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  deptFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysDeptResponse) => {
  deptFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row: any) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除部门, 是否继续?')
    .then(async () => {
      await removeSysDeptById(row.id)
      useMessage().success('删除部门成功!')
      await handleListQuery()
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
    <el-form :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleListQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input v-model="queryParams.deptCode" placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="部门状态" prop="deptStatus">
            <xht-enum-select v-model="queryParams.deptStatus" :data="deptStatusEnum" clearable placeholder="请选择部门状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleListQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar
      v-model:column-data="columnOption"
      v-model:show-search="state.searchStatus"
      column-status
      refresh-status
      search-status
      @refresh="resetQuery"
    >
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:dept:create']">增加</el-button>
      <el-button :icon="Sort" size="small" type="info" @click="handleExpandAll">折叠/展开</el-button>
    </table-tool-bar>
    <el-table
      v-if="state.refreshTable"
      ref="tableRef"
      v-loading="state.loadingStatus"
      :data="state.tableList"
      :default-expand-all="state.expandAllStatus"
      :tree-props="{ children: 'children' }"
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
    >
      <el-table-column v-if="columnOption.deptName?.visible" align="left" fixed="left" label="部门名称" min-width="260" prop="deptName">
        <template #default="{ row }">
          <el-text size="large">{{ row.deptName }}：</el-text>
          <el-text type="info" size="small" class="ml-5">
            {{ row.deptCode }}
          </el-text>
        </template>
      </el-table-column>

      <el-table-column v-if="columnOption.leaderName?.visible" align="center" label="部门主管" min-width="160" prop="leaderName" />
      <el-table-column v-if="columnOption.phone?.visible" align="center" label="联系电话" min-width="160" prop="phone" />
      <el-table-column v-if="columnOption.email?.visible" align="center" label="联系邮箱" min-width="160" prop="email" show-overflow-tooltip>
        <template #default="{ row }">
          <ElLink>{{ row.email }}</ElLink>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.deptStatus?.visible" align="center" label="部门状态" prop="deptStatus" width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.deptStatus" :data="deptStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.deptSort?.visible" align="center" label="部门顺序" prop="deptSort" width="120" />
      <el-table-column v-if="columnOption.remark?.visible" align="center" label="部门描述" prop="remark" show-overflow-tooltip width="220" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysDeptResponse} -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:dept:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:dept:remove']">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <dept-form ref="deptFormRef" @success="handleListQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
