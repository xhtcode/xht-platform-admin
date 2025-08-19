<template>
  <div class="main-container-none">
    <div class="main-container-auto main-container-view">
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        :model="queryParams"
        class="user-select-display"
        label-width="80px"
      >
        <el-row v-if="!state.searchStatus">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="queryParams.roleCode" placeholder="请输入角色编码" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="角色状态" prop="roleStatus">
              <el-select v-model="queryParams.roleStatus" placeholder="请选择角色状态" clearable>
                <el-option :value="RoleStatusEnums.NORMAL" label="正常" />
                <el-option :value="RoleStatusEnums.DISABLE" label="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-tool-bar
        :column-data="[]"
        column-status
        refresh-status
        search-status
        v-model:show-search="state.searchStatus"
        @refresh="handleQuery"
      >
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button
          icon="Edit"
          size="small"
          type="success"
          :disabled="state.singleStatus"
          @click="handleEdit(state.selectedRows[0])"
          >修改
        </el-button>
        <el-button
          icon="Delete"
          size="small"
          type="danger"
          :disabled="state.multipleStatus"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
        class="flex-1"
        empty-text="系统暂无角色！"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column :index="createTableIndex" label="序号" type="index" width="55" />
        <el-table-column label="角色名称" prop="roleName" min-width="120" />
        <el-table-column label="角色编码" prop="roleCode" width="100" />
        <el-table-column label="角色状态" prop="roleStatus" width="100">
          <template #default="{ row }">
            <el-tag :type="row.roleStatus === 0 ? 'success' : 'danger'">
              {{ row.roleStatus === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据范围" prop="dataScope" width="160">
          <template #default="{ row }">
            <el-tag v-if="row.dataScope === 1" type="primary" effect="dark">全部数据权限</el-tag>
            <el-tag v-if="row.dataScope === 2" type="success" effect="dark">自定数据权限</el-tag>
            <el-tag v-if="row.dataScope === 3" type="info" effect="dark">本部门数据权限</el-tag>
            <el-tag v-if="row.dataScope === 4" type="warning" effect="dark"
              >本部门及以下数据权限
            </el-tag>
            <el-tag v-if="row.dataScope === 5" type="danger" effect="dark">本岗位数据权限</el-tag>
            <el-tag v-if="row.dataScope === 6" color="#F2F6FC" effect="dark">仅本人数据权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="创建时间" prop="createTime" width="160" />
        <el-table-column label="更新时间" prop="updateTime" width="160" />
        <el-table-column label="创建人" prop="createBy" width="160" />
        <el-table-column label="更新人" prop="updateBy" width="160" />
        <el-table-column fixed="right" label="操作" width="260px">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button icon="setting" link type="warning" @click="handleAuth(row)"
              >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <xht-pagination
        v-model:current-page="state.queryParams.current"
        v-model:page-size="state.queryParams.size"
        :page-count="state.pages"
        :total="state.total"
        @pagination="handleQuery"
      />
    </div>
    <add-or-update ref="addUpdateRef" @success="handleQuery" />
    <menu-role ref="menuRoleRef" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks, useTableToolHooks } from '@/hooks/use-crud-hooks'
import AddOrUpdate from './components/add-or-update.vue'
import type { SysRoleQueryRequest, SysRoleResponse } from '@/model/system/role.model'
import { RoleStatusEnums } from '@/model/system/role.model'
import { querySysRolePage, removeSysRoleById, removeSysRoleByIds } from '@/api/system/role.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import MenuRole from '@/views/system/role/components/menu-role.vue'

defineOptions({ name: 'SysRoleViewIndex' })

const state = reactive<TableQueryPageState<SysRoleQueryRequest, SysRoleResponse>>({
  queryParams: {
    current: 1,
    size: 10,
  },
  loadingStatus: false,
  total: 0,
  pages: 0,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})
const { createTableIndex, handleQuery, handleSelectionChange } = useTableQueryPageHooks<
  SysRoleQueryRequest,
  SysRoleResponse
>(state, querySysRolePage)
const { queryParams } = toRefs(state)

const queryFormRef = ref<FormInstance>()
const addUpdateRef = ref()
const menuRoleRef = ref()
const { cellStyle, headerCellStyle } = useTableToolHooks()

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
  addUpdateRef.value?.show('add')
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysRoleResponse) => {
  addUpdateRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = async (row: SysRoleResponse) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除角色, 是否继续?')
    .then(() => {
      removeSysRoleById(row.id).then(async () => {
        useMessage().success('删除角色成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择角色数据')
  }
  state.loadingStatus = true
  await useMessageBox()
    .confirm(`此操作将批量删除${ids.length}个角色, 是否继续?`)
    .then(() => {
      removeSysRoleByIds(ids).then(async () => {
        useMessage().success('批量删除角色成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理分配权限
 */
const handleAuth = (row: SysRoleResponse) => {
  menuRoleRef.value?.show(row.id)
}

onMounted(async () => {
  await handleQuery()
})
</script>

<style scoped lang="scss"></style>
