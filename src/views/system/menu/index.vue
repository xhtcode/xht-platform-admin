<script lang="ts" setup>
import { querySysMenuTree, removeSysMenuById } from '@/service/api/system/menu.api'
import type { SysMenuQueryRequest, SysMenuResponse } from '@/service/model/system/menu.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { FormInstance } from 'element-plus'
import { sysMenuColumnOption } from '@/views/system/menu/menu.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { Delete, Edit, Plus, Refresh, Search, Sort } from '@element-plus/icons-vue'
import { useTableQueryListHooks } from '@/hooks/use-crud-hooks'
import { menuStatusEnums, menuTypeEnums } from '@/service/enums/system/menu.enum'

defineOptions({ name: 'SysMenuViewIndex' })

const menuForm = defineAsyncComponent(() => import('@/views/system/menu/components/menu-form.vue'))
const menuFormRef = useTemplateRef('menuFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryListState<SysMenuQueryRequest, INodeResponse<SysMenuResponse>>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 刷新表格状态
  expandAllStatus: false, // 展开所有状态
  searchStatus: false, // 是否显示搜索区域
  queryParams: {}, // 查询参数
  tableList: [], // 表格数据列表
})

const { handleListQuery, handleExpandAll } = useTableQueryListHooks<SysMenuQueryRequest, INodeResponse<SysMenuResponse>>(state, querySysMenuTree)
const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<SysMenuResponse>>({
  ...sysMenuColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handleListQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  menuFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysMenuResponse) => {
  menuFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row: any) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除菜单, 是否继续?')
    .then(async () => {
      await removeSysMenuById(row.id)
      useMessage().success('删除菜单成功!')
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
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-space>
            <el-button :icon="Search" type="primary" @click="handleListQuery()">查询</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-space>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="菜单类型" prop="menuType">
            <xht-enum-select v-model="queryParams.menuType" :data="menuTypeEnums" clearable placeholder="请选择菜单类型" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="菜单状态" prop="menuStatus">
            <xht-enum-select v-model="queryParams.menuStatus" :data="menuStatusEnums" clearable placeholder="请选择菜单状态" />
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:menu:create']">增加</el-button>
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
      <el-table-column v-if="columnOption.menuType?.visible" align="left" fixed="left" label="菜单类型" width="160" prop="menuType">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.menuType" :data="menuTypeEnums" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnOption.menuName?.visible"
        :show-overflow-tooltip="true"
        fixed="left"
        label="菜单名称"
        prop="menuName"
        width="200"
      />
      <el-table-column v-if="columnOption.menuIcon?.visible" align="center" label="菜单图标" min-width="120" prop="menuIcon">
        <template #default="{ row }">
          <div :class="`${row.menuIcon}`" class="text-16px color-[var(--xht-svg-color)]" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.menuStatus?.visible" align="center" label="菜单状态" min-width="120" prop="menuStatus">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.menuStatus" :data="menuStatusEnums" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.menuAuthority?.visible" align="center" label="权限标识" prop="menuAuthority" width="150" />
      <el-table-column v-if="columnOption.menuSort?.visible" align="center" label="排序" min-width="80" prop="menuSort" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:menu:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:menu:remove']">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <menu-form ref="menuFormRef" @success="handleListQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
