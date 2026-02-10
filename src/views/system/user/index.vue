<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import type { SysUserQueryRequest, SysUserResponse } from '@/service/model/system/user.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { SysDeptResponse } from '@/service/model/system/dept.model'
import { sysUserColumnOption } from '@/views/system/user/user.data'
import { querySysUserPage, removeSysUserById, removeSysUserByIds, resetPassword } from '@/service/api/system/user.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { Delete, Edit, Key, Plus, Refresh, Search, User } from '@element-plus/icons-vue'
import { userStatusEnums, userTypeEnums } from '@/service/enums/system/user.enum'

defineOptions({ name: 'SysUserViewIndex' })

const userForm = defineAsyncComponent(() => import('@/views/system/user/components/user-form.vue'))
const userRoleForm = defineAsyncComponent(() => import('@/views/system/user/components/user-role-form.vue'))
const userFormRef = useTemplateRef('userFormRef')
const userRoleFormRef = useTemplateRef('userRoleFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const deptTreeRef = useTemplateRef('deptTreeRef')

const state = reactive<TableQueryPageState<SysUserQueryRequest, SysUserResponse>>({
  queryParams: {
    deptId: undefined,
    ascName: 'createTime',
  }, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysUserQueryRequest, SysUserResponse>(state, querySysUserPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysUserResponse>>({
  ...sysUserColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  deptTreeRef.value?.resetHighlightCurrent()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  userFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysUserResponse) => {
  userFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row: SysUserResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除用户, 是否继续?')
    .then(async () => {
      await removeSysUserById(row.id)
      await handlePageQuery()
      useMessage().success('删除用户成功!')
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
    .confirm(`此操作将批量删除${ids.length}个用户, 是否继续?`)
    .then(async () => {
      await removeSysUserByIds(ids)
      useMessage().success('批量删除用户成功!')
      await handlePageQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理重置密码
 */
const handleResetPwd = (row: SysUserResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将重置用户${row.userName}的密码, 是否继续?`)
    .then(async () => {
      await resetPassword(row.id)
      useMessage().success(`${row.userName}用户密码重置成功!`)
    })
    .finally(() => {
      state.loadingStatus = false
    })
}
/**
 * 处理用户授权
 */
const handleUserRole = (row: SysUserResponse) => {
  userRoleFormRef.value?.show(row.id)
}

/**
 * 部门点击事件
 * @param data
 */
const handleDeptClick = async (data: SysDeptResponse) => {
  queryParams.value.deptId = data.id
  await handlePageQuery()
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="h-full flex gap-1">
    <div class="xht-view-container-none flex-1">
      <dept-tree ref="deptTreeRef" @click-node="handleDeptClick" />
    </div>
    <div class="xht-view-container flex-[4]">
      <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
        <el-row v-if="!state.searchStatus">
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="用户类型" prop="userType">
              <xht-enum-select v-model="queryParams.userType" :data="userTypeEnums" clearable placeholder="请选择用户类型" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="queryParams.userName" :maxlength="50" placeholder="请输入用户账号" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="queryParams.nickName" :maxlength="15" placeholder="请输入用户昵称" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="用户状态" prop="userStatus">
              <xht-enum-select v-model="queryParams.userStatus" :data="userStatusEnums" clearable placeholder="请选择用户状态" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="手机号码" prop="userPhone">
              <el-input v-model="queryParams.userPhone" :maxlength="11" placeholder="请输入手机号码" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
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
        <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:user:create']">新增</el-button>
        <el-button
          :icon="Edit"
          size="small"
          type="success"
          :disabled="state.singleStatus"
          @click="handleEdit(state.selectedRows[0])"
          v-authorization="['sys:user:update']"
        >
          修改
        </el-button>
        <el-button
          :icon="Delete"
          size="small"
          type="danger"
          :disabled="state.multipleStatus"
          @click="handleBatchDelete"
          v-authorization="['sys:user:remove']"
        >
          批量删除
        </el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        border
        row-key="id"
        :empty-text="queryParams.deptId ? '该部门下未添加用户信息 🔍 试试调整筛选条件吧！' : '暂无匹配数据 🔍 试试调整筛选条件吧！'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <xht-column-index :current="queryParams.current" :size="queryParams.size" />
        <el-table-column v-if="columnOption.userAvatar?.visible" label="用户头像" prop="userAvatar" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.userAvatar" alt="用户头像" shape="circle" />
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.userName?.visible" label="用户账号" min-width="160" prop="userName" show-overflow-tooltip sortable />
        <el-table-column v-if="columnOption.nickName?.visible" label="用户昵称" min-width="160" prop="nickName" />
        <el-table-column v-if="columnOption.userType?.visible" label="用户类型" min-width="100" prop="userType">
          <template #default="{ row }">
            <xht-enum-tag :filter-label="row.userType" :data="userTypeEnums" />
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.userStatus?.visible" label="用户状态" min-width="100" prop="userStatus">
          <template #default="{ row }">
            <xht-enum-tag :filter-label="row.userStatus" :data="userStatusEnums" />
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.userPhone?.visible" label="手机号码" min-width="130" prop="userPhone" />
        <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
        <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
        <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
        <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{ row }">
            <el-space wrap class="flex-center">
              <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:user:update']">修改用户</el-button>
              <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:user:remove']">删除用户</el-button>
              <el-button :icon="Key" link type="warning" @click="handleResetPwd(row)" v-authorization="['sys:user:pwd']">重置密码</el-button>
              <el-button :icon="User" link type="primary" @click="handleUserRole(row)" v-authorization="['sys:user:role:bind']">用户授权</el-button>
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
    </div>
    <user-form ref="userFormRef" @success="handlePageQuery" />
    <user-role-form ref="userRoleFormRef" />
  </div>
</template>
