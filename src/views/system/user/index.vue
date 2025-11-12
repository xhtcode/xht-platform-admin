<template>
  <div class="xht-view-container xht-view-container-none">
    <el-splitter>
      <el-splitter-panel size="20%" class="xht-view-main" :resizable="false" collapsible>
        <dept-tree ref="deptTreeRef" @click-node="handleDeptClick" />
      </el-splitter-panel>
      <el-splitter-panel size="80%" class="xht-view-main xht-view-main-padding" :resizable="false">
        <el-form
          ref="queryFormRef"
          :disabled="state.loadingStatus"
          :model="queryParams"
          class="user-select-display"
          label-width="80px"
        >
          <el-row v-if="!state.searchStatus">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="关键字" prop="keyWord">
                <el-input
                  v-model="queryParams.keyWord"
                  placeholder="请输入关键字"
                  :maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
              <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户类型" prop="userType">
                <el-select v-model="queryParams.userType" placeholder="请选择用户类型">
                  <el-option :value="UserTypeEnums.ADMIN" label="管理员" />
                  <el-option :value="UserTypeEnums.BUSINESS" label="商家" />
                  <el-option :value="UserTypeEnums.USER" label="用户" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户账号" prop="userName">
                <el-input
                  v-model="queryParams.userName"
                  placeholder="请输入用户账号"
                  :maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input
                  v-model="queryParams.nickName"
                  placeholder="请输入用户昵称"
                  :maxlength="15"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户状态" prop="userStatus">
                <el-select v-model="queryParams.userStatus" placeholder="请选择用户状态">
                  <el-option :value="UserStatusEnums.NORMAL" label="账号正常" />
                  <el-option :value="UserStatusEnums.UNACTIVATED" label="账号未激活" />
                  <el-option :value="UserStatusEnums.DISABLED" label="账号禁用" />
                  <el-option :value="UserStatusEnums.LOCKED" label="账号锁定" />
                  <el-option :value="UserStatusEnums.EXPIRED" label="账号过期" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="手机号码" prop="userPhone">
                <el-input
                  v-model="queryParams.userPhone"
                  placeholder="请输入手机号码"
                  :maxlength="11"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
              <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <table-tool-bar
          v-model:show-search="state.searchStatus"
          v-model:column-data="columnOption"
          column-status
          refresh-status
          search-status
          @refresh="handleQuery"
        >
          <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
          <el-button
            icon="Edit"
            size="small"
            type="success"
            :disabled="state.singleStatus"
            @click="handleEdit(state.selectedRows[0])"
          >
            修改
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
        <xht-table
          v-loading="state.loadingStatus"
          :data="state.tableList"
          border
          :empty-text="queryParams.deptId ? '该部门下未添加用户信息' : '系统内暂无相关数据'"
          @selection-change="handleSelectionChange"
          class="flex-1"
        >
          <el-table-column type="selection" width="55" align="center" />
          <xht-column-index :size="queryParams.size" :current="queryParams.current" />
          <el-table-column
            label="用户头像"
            prop="userAvatar"
            width="100"
            v-if="columnOption.userAvatar?.visible"
          >
            <template #default="{ row }">
              <el-avatar :src="row.userAvatar" shape="circle" alt="用户头像" />
            </template>
          </el-table-column>
          <el-table-column
            label="用户账号"
            prop="userName"
            min-width="160"
            show-overflow-tooltip
            v-if="columnOption.userName?.visible"
          />
          <el-table-column
            label="用户昵称"
            prop="nickName"
            min-width="160"
            v-if="columnOption.nickName?.visible"
          />
          <el-table-column
            label="用户类型"
            prop="userType"
            min-width="100"
            v-if="columnOption.userType?.visible"
          >
            <template #default="{ row }">
              <user-type-tag :type="row.userType" />
            </template>
          </el-table-column>
          <el-table-column
            label="用户状态"
            prop="userStatus"
            min-width="100"
            v-if="columnOption.userStatus?.visible"
          >
            <template #default="{ row }">
              <user-status-tag :status="row.userStatus" />
            </template>
          </el-table-column>
          <el-table-column
            label="手机号码"
            prop="userPhone"
            min-width="130"
            v-if="columnOption.userPhone?.visible"
          />
          <el-table-column
            label="创建人"
            prop="createBy"
            width="160"
            v-if="columnOption.createBy?.visible"
          />
          <el-table-column
            label="创建时间"
            prop="createTime"
            width="180"
            v-if="columnOption.createTime?.visible"
          />
          <el-table-column
            label="更新人"
            prop="updateBy"
            width="160"
            v-if="columnOption.updateBy?.visible"
          />
          <el-table-column
            label="更新时间"
            prop="updateTime"
            width="180"
            v-if="columnOption.updateTime?.visible"
          />
          <el-table-column fixed="right" label="操作" width="220">
            <template #default="{ row }">
              <el-space wrap>
                <el-button icon="edit" link type="success" @click="handleEdit(row)">
                  修改用户
                </el-button>
                <el-button icon="delete" link type="danger" @click="handleDelete(row)">
                  删除用户
                </el-button>
                <el-button icon="key" link type="warning" @click="handleResetPwd(row)">
                  重置密码
                </el-button>
                <el-button icon="User" link type="primary" @click="handleUserRole(row)">
                  用户授权
                </el-button>
              </el-space>
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
      </el-splitter-panel>
    </el-splitter>
    <user-form ref="userFormRef" @success="handleQuery" />
    <user-role-form ref="userRoleFormRef" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import UserForm from '@/views/system/user/components/user-form.vue'
import {
  SysUserQueryRequest,
  SysUserResponse,
  UserStatusEnums,
  UserTypeEnums,
} from '@/service/model/system/user.model'
import {
  querySysUserPage,
  removeSysUserById,
  removeSysUserByIds,
  resetPassword,
} from '@/service/api/system/user.api'
import type { SysDeptResponse } from '@/service/model/system/dept.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { disabledTodayAndFuture } from '@/utils/moudle/element'
import UserRoleForm from '@/views/system/user/components/user-role-form.vue'
import DeptTree from '@/components/system/dept-tree/index.vue'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { SysUserColumnOption } from '@/views/system/user/user.data'
import UserStatusTag from '@/components/system/user-status-tag/index.vue'

defineOptions({ name: 'SysUserViewIndex' })
const state = reactive<TableQueryPageState<SysUserQueryRequest, SysUserResponse>>({
  queryParams: {
    deptId: undefined,
    current: 1,
    size: 10,
    ascName: 'createTime',
  },
  loadingStatus: false,
  total: 0,
  pages: 0,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<
  SysUserQueryRequest,
  SysUserResponse
>(state, querySysUserPage)
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const userFormRef = useTemplateRef('userFormRef')
const deptTreeRef = useTemplateRef('deptTreeRef')
const userRoleFormRef = useTemplateRef('userRoleFormRef')
const columnOption = ref<ColumnConfig<SysUserResponse>>({
  ...SysUserColumnOption,
})
/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  deptTreeRef.value?.resetHighlightCurrent()
  state.queryParams = {
    current: 1,
    size: 10,
  }
  await handleQuery()
}
/**
 * 要根据 queryParams.value.birthDateStart和queryParams.value.birthDateEnd 来禁用时间选择框的数据限制
 * @param time
 */
const superDisabledBeforeDate = (time: Date) => {
  // 2. 如果设置了开始日期，则禁用开始日期之前的日期
  const time1 = time.getTime()
  if (queryParams.value.birthDateStart && queryParams.value.birthDateEnd) {
    return (
      formatData(queryParams.value.birthDateStart).getTime() - 8.64e7 >= time1 ||
      formatData(queryParams.value.birthDateEnd).getTime() <= time1
    )
  }
  // 3. 如果设置了结束日期，则禁用结束日期之后的日期
  if (queryParams.value.birthDateStart) {
    return formatData(queryParams.value.birthDateStart).getTime() - 8.64e7 >= time1
  }
  if (queryParams.value.birthDateEnd) {
    return formatData(queryParams.value.birthDateEnd).getTime() <= time1
  }
  // 4. 默认情况下使用基础禁用规则
  return disabledTodayAndFuture(time)
}
/**
 * YYYY-MM-DD 转化成Data类型
 * @param data
 */
const formatData = (data?: string): Date => {
  if (!data) {
    return new Date()
  }
  return new Date(data)
}
/**
 * 处理新增
 */
const handleAdd = () => {
  userFormRef.value?.show('add', null)
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
const handleDelete = async (row: SysUserResponse) => {
  // TODO: 实现删除功能
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除用户, 是否继续?')
    .then(() => {
      removeSysUserById(row.id).then(async () => {
        useMessage().success('删除用户成功!')
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
    .confirm(`此操作将批量删除${ids.length}个用户, 是否继续?`)
    .then(() => {
      removeSysUserByIds(ids).then(async () => {
        useMessage().success('批量删除用户成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理重置密码
 */
const handleResetPwd = async (row: SysUserResponse) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm(`此操作将重置用户${row.userName}的密码, 是否继续?`)
    .then(() => {
      resetPassword(row.id).then(async () => {
        useMessage().success(`${row.userName}用户密码重置成功!`)
      })
    })
    .catch((_) => {})
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
const handleDeptClick = (data: SysDeptResponse) => {
  queryParams.value.deptId = data.id
  handleQuery()
}
onMounted(async () => {
  await handleQuery()
})
</script>
