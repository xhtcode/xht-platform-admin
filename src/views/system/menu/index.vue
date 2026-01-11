<script lang="ts" setup>
import { querySysMenuTree, removeSysMenuById } from '@/service/api/system/menu.api'
import { SysMenuQueryRequest, SysMenuResponse, SysMenuTreeResponse } from '@/service/model/system/menu.model'
import { MenuStatusEnums, MenuTypeEnums } from '@/service/model/system/menu.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { FormInstance } from 'element-plus'
import { SysMenuColumnOption } from '@/views/system/menu/menu.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { Delete, Edit, Plus, Refresh, Search, Sort } from '@element-plus/icons-vue'

defineOptions({ name: 'SysMenuViewIndex' })

const menuForm = defineAsyncComponent(() => import('@/views/system/menu/components/menu-form.vue'))
const menuFormRef = useTemplateRef('menuFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<{
  total: number
  pages: number
  loadingStatus: boolean
  refreshTable: boolean
  expandAllStatus: boolean
  searchStatus: boolean
  queryParams: SysMenuQueryRequest
  tableList: SysMenuTreeResponse
}>({
  total: 0,
  pages: 1,
  loadingStatus: false,
  refreshTable: true,
  expandAllStatus: false,
  searchStatus: false,
  queryParams: {},
  tableList: [],
})

const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<SysMenuResponse>>({
  ...SysMenuColumnOption,
})

/**
 * 查询数据列表
 */
const handleQuery = async () => {
  state.loadingStatus = true
  querySysMenuTree(state.queryParams)
    .then((res) => {
      state.tableList = res.data
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  await handleQuery()
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
      await handleQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理展开/折叠
 */
const handleExpandAll = () => {
  state.refreshTable = false
  state.expandAllStatus = !state.expandAllStatus
  nextTick(() => {
    state.refreshTable = true
  })
}

onMounted(async () => {
  await handleQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-space>
            <el-button :icon="Search" type="primary" @click="handleQuery()">查询</el-button>
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
            <el-select v-model="queryParams.menuType" clearable placeholder="请选择菜单类型">
              <el-option :value="MenuTypeEnums.M" label="目录" />
              <el-option :value="MenuTypeEnums.C" label="菜单" />
              <el-option :value="MenuTypeEnums.B" label="按钮" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="菜单状态" prop="menuStatus">
            <el-select v-model="queryParams.menuStatus" clearable placeholder="请选择菜单状态">
              <el-option :value="MenuStatusEnums.NORMAL" label="正常" />
              <el-option :value="MenuStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handleQuery()">查询</el-button>
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
      @refresh="handleQuery"
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
      empty-text="暂无匹配系统菜单数据 🔍 试试调整筛选条件吧！"
    >
      <el-table-column v-if="columnOption.menuType?.visible" align="left" fixed="left" label="菜单类型" width="160" prop="menuType">
        <template #default="{ row }">
          <el-tag :type="row.menuType === MenuTypeEnums.M ? 'success' : row.menuType === MenuTypeEnums.C ? 'warning' : 'info'">
            {{ row.menuType === MenuTypeEnums.M ? '目录' : row.menuType === MenuTypeEnums.C ? '菜单' : '按钮' }}
          </el-tag>
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
          <div :class="`i-menu-${row.menuIcon}`" class="text-16px color-[var(--xht-svg-color)]" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.menuStatus?.visible" align="center" label="菜单状态" min-width="120" prop="menuStatus">
        <template #default="{ row }">
          <el-switch
            :active-value="MenuStatusEnums.NORMAL"
            :inactive-value="MenuStatusEnums.DISABLE"
            :model-value="row.menuStatus"
            active-text="正常"
            inactive-text="停用"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.menuAuthority?.visible" align="center" label="权限标识" prop="menuAuthority" width="150" />
      <el-table-column v-if="columnOption.menuSort?.visible" align="center" label="排序" min-width="80" prop="menuSort" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column align="center" fixed="right" label="操作" width="220px">
        <template #default="{ row }">
          <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:menu:update']">修改</el-button>
          <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:menu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-form ref="menuFormRef" @success="handleQuery()" />
  </div>
</template>

<style lang="scss" scoped></style>
