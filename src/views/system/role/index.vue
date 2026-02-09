<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysRoleQueryRequest, SysRoleResponse } from '@/service/model/system/role.model'
import { RoleStatusEnums } from '@/service/model/system/role.model'
import { querySysRolePage, removeSysRoleById, removeSysRoleByIds } from '@/service/api/system/role.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysRoleColumnOption } from '@/views/system/role/role.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'SysRoleViewIndex' })

const roleFrom = defineAsyncComponent(() => import('@/views/system/role/components/role-from.vue'))
const menuRoleForm = defineAsyncComponent(() => import('@/views/system/role/components/menu-role-form.vue'))
const roleFormRef = useTemplateRef('roleFormRef')
const menuRoleFormRef = useTemplateRef('menuRoleFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysRoleQueryRequest, SysRoleResponse>>({
  queryParams: {}, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysRoleQueryRequest, SysRoleResponse>(state, querySysRolePage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysRoleResponse>>({
  ...sysRoleColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
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
const handleDelete = (row: SysRoleResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除角色, 是否继续?')
    .then(async () => {
      await removeSysRoleById(row.id)
      await handlePageQuery()
      useMessage().success('删除角色成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除
 */
const handleBatchDelete = () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择角色数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将批量删除${ids.length}个角色, 是否继续?`)
    .then(async () => {
      await removeSysRoleByIds(ids)
      await handlePageQuery()
      useMessage().success('批量删除角色成功!')
    })
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
  await handlePageQuery()
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
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="queryParams.roleCode" placeholder="请输入角色编码" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="角色状态" prop="roleStatus">
            <el-select v-model="queryParams.roleStatus" clearable placeholder="请选择角色状态">
              <el-option :value="RoleStatusEnums.NORMAL" label="正常" />
              <el-option :value="RoleStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:role:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['sys:role:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleBatchDelete"
        v-authorization="['sys:role:remove']"
      >
        批量删除
      </el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.roleName?.visible" label="角色名称" min-width="120" prop="roleName" />
      <el-table-column v-if="columnOption.roleCode?.visible" label="角色编码" min-width="160" prop="roleCode" />
      <el-table-column v-if="columnOption.roleStatus?.visible" label="角色状态" prop="roleStatus" width="100">
        <template #default="{ row }">
          <el-tag :type="row.roleStatus === 0 ? 'success' : 'danger'">
            {{ row.roleStatus === 0 ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.dataScope?.visible" label="数据范围" prop="dataScope" width="160">
        <template #default="{ row }">
          <el-tag v-if="row.dataScope === 1" effect="dark" type="primary">全部数据权限</el-tag>
          <el-tag v-if="row.dataScope === 2" effect="dark" type="success">自定数据权限</el-tag>
          <el-tag v-if="row.dataScope === 3" effect="dark" type="info">本部门数据权限</el-tag>
          <el-tag v-if="row.dataScope === 4" effect="dark" type="warning">本部门及以下数据权限</el-tag>
          <el-tag v-if="row.dataScope === 5" effect="dark" type="danger">本岗位数据权限</el-tag>
          <el-tag v-if="row.dataScope === 6" color="#F2F6FC" effect="dark">仅本人数据权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.roleSort?.visible" label="显示顺序" prop="roleSort" width="120" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:role:update']">修改</el-button>
            <el-button icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:role:remove']">删除</el-button>
            <el-button icon="setting" link type="warning" @click="handleAuth(row)" v-authorization="['sys:role:menu:bind']">分配权限</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <xht-pagination
      v-model:current-page="state.queryParams.current"
      v-model:page-size="state.queryParams.size"
      :page-count="state.pages"
      :total="state.total"
      @pagination="handlePageQuery"
    />
    <role-from ref="roleFormRef" @success="handlePageQuery" />
    <menu-role-form ref="menuRoleFormRef" />
  </div>
</template>

<style lang="scss" scoped></style>
