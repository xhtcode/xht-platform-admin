<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
      <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="80px">
        <el-row v-if="!state.searchStatus">
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="queryParams.roleCode" placeholder="请输入角色编码" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="角色状态" prop="roleStatus">
              <el-select v-model="queryParams.roleStatus" clearable placeholder="请选择角色状态">
                <el-option :value="RoleStatusEnums.NORMAL" label="正常" />
                <el-option :value="RoleStatusEnums.DISABLE" label="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
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
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button :disabled="state.singleStatus" icon="Edit" size="small" type="success" @click="handleEdit(state.selectedRows[0])">修改</el-button>
        <el-button :disabled="state.multipleStatus" icon="Delete" size="small" type="danger" @click="handleBatchDelete">批量删除</el-button>
      </table-tool-bar>
      <xht-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        class="flex-1"
        empty-text="系统暂无角色！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <xht-column-index :current="queryParams.current" :size="queryParams.size" />
        <el-table-column label="角色名称" min-width="120" prop="roleName" />
        <el-table-column label="角色编码" min-width="160" prop="roleCode" />
        <el-table-column label="角色状态" prop="roleStatus" width="100">
          <template #default="{ row }">
            <el-tag :type="row.roleStatus === 0 ? 'success' : 'danger'">
              {{ row.roleStatus === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据范围" prop="dataScope" width="160">
          <template #default="{ row }">
            <el-tag v-if="row.dataScope === 1" effect="dark" type="primary">全部数据权限</el-tag>
            <el-tag v-if="row.dataScope === 2" effect="dark" type="success">自定数据权限</el-tag>
            <el-tag v-if="row.dataScope === 3" effect="dark" type="info">本部门数据权限</el-tag>
            <el-tag v-if="row.dataScope === 4" effect="dark" type="warning">本部门及以下数据权限</el-tag>
            <el-tag v-if="row.dataScope === 5" effect="dark" type="danger">本岗位数据权限</el-tag>
            <el-tag v-if="row.dataScope === 6" color="#F2F6FC" effect="dark">仅本人数据权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" prop="roleSort" width="120" />
        <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
        <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
        <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
        <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
        <el-table-column fixed="right" label="操作" width="260px">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button icon="setting" link type="warning" @click="handleAuth(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </xht-table>
      <xht-pagination
        v-model:current-page="state.queryParams.current"
        v-model:page-size="state.queryParams.size"
        :page-count="state.pages"
        :total="state.total"
        @pagination="handleQuery"
      />
    </div>
    <role-from ref="roleFormRef" @success="handleQuery" />
    <menu-role-form ref="menuRoleFormRef" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysRoleQueryRequest, SysRoleResponse } from '@/service/model/system/role.model'
import { RoleStatusEnums } from '@/service/model/system/role.model'
import { querySysRolePage, removeSysRoleById, removeSysRoleByIds } from '@/service/api/system/role.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { SysRoleColumnOption } from '@/views/system/role/role.data'

defineOptions({ name: 'SysRoleViewIndex' })

const roleFrom = defineAsyncComponent(() => import('@/views/system/role/components/role-from.vue'))
const menuRoleForm = defineAsyncComponent(() => import('@/views/system/role/components/menu-role-form.vue'))
const roleFormRef = useTemplateRef('roleFormRef')
const menuRoleFormRef = useTemplateRef('menuRoleFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

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
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<SysRoleQueryRequest, SysRoleResponse>(state, querySysRolePage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysRoleResponse>>({
  ...SysRoleColumnOption,
})
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
  roleFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysRoleResponse) => {
  roleFormRef.value?.show('update', row.id)
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
  menuRoleFormRef.value?.show(row.id)
}

onMounted(async () => {
  await handleQuery()
})
</script>

<style lang="scss" scoped></style>
