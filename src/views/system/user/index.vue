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
                <el-input v-model="queryParams.keyWord" placeholder="请输入关键字" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
              <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户账号" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入用户账号" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户状态" prop="userStatus">
                <el-select v-model="queryParams.userStatus" placeholder="请选择用户状态">
                  <el-option :value="UserStatusEnums.NORMAL" label="正常状态" />
                  <el-option :value="UserStatusEnums.LOCKED" label="锁定状态" />
                  <el-option :value="UserStatusEnums.EXPIRED" label="过期状态" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="queryParams.realName" placeholder="请输入真实姓名" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="身份证号" prop="idCardNumber">
                <el-input v-model="queryParams.idCardNumber" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="用户性别" prop="gender">
                <el-select v-model="queryParams.gender" placeholder="请选择用户性别">
                  <el-option :value="1" label="男" />
                  <el-option :value="2" label="女" />
                  <el-option :value="3" label="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="出生开始" prop="birthDateStart">
                <el-date-picker
                  v-model="queryParams.birthDateStart"
                  type="date"
                  class="w100"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="superDisabledBeforeDate"
                  :default-value="
                    queryParams.birthDateStart
                      ? formatData(queryParams.birthDateStart)
                      : formatData(queryParams.birthDateEnd)
                  "
                  placeholder="选择出生开始日期"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="出生截至" prop="birthDateEnd">
                <el-date-picker
                  v-model="queryParams.birthDateEnd"
                  type="date"
                  class="w100"
                  format="YYYY-MM-DD"
                  :disabled-date="superDisabledBeforeDate"
                  :default-value="
                    queryParams.birthDateEnd
                      ? formatData(queryParams.birthDateEnd)
                      : formatData(queryParams.birthDateStart)
                  "
                  value-format="YYYY-MM-DD"
                  placeholder="选择出生截至日期"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="年龄开始" prop="ageStart">
                <el-input-number
                  v-model="queryParams.ageStart"
                  class="w100"
                  :min="0"
                  :max="queryParams.ageEnd"
                  placeholder="请输入用户年龄"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="年龄截至" prop="ageEnd">
                <el-input-number
                  v-model="queryParams.ageEnd"
                  class="w100"
                  :min="queryParams.ageStart"
                  :max="150"
                  placeholder="请输入用户年龄"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
              <el-form-item label="邮政编码" prop="postalCode">
                <el-input v-model="queryParams.postalCode" placeholder="请输入邮政编码" />
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
          :column-data="[]"
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
        <el-table
          v-loading="state.loadingStatus"
          :data="state.tableList"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          border
          :empty-text="queryParams.deptId ? '该部门下未添加用户信息' : '系统内暂无相关数据'"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="expand">
            <template #default="{ row }">
              <el-descriptions :column="3" border :label-width="120">
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <User />
                      </el-icon>
                      真实姓名
                    </div>
                  </template>
                  {{ row.profile?.realName }}
                </el-descriptions-item>
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <Postcard />
                      </el-icon>
                      身份证号
                    </div>
                  </template>
                  {{ row.profile?.idCardNumber }}
                </el-descriptions-item>
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <UserFilled />
                      </el-icon>
                      用户性别
                    </div>
                  </template>
                  {{ row.profile?.gender === 1 ? '男' : '女' }}
                </el-descriptions-item>
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <tickets />
                      </el-icon>
                      出生日期
                    </div>
                  </template>
                  {{ row.profile?.birthDate }}
                </el-descriptions-item>
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <Present />
                      </el-icon>
                      用户年龄
                    </div>
                  </template>
                  {{ row.profile?.age }}
                </el-descriptions-item>
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <office-building />
                      </el-icon>
                      邮政编码
                    </div>
                  </template>
                  {{ row.profile?.postalCode }}
                </el-descriptions-item>
                <el-descriptions-item label-align="right" align="center">
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <LocationFilled />
                      </el-icon>
                      联系地址
                    </div>
                  </template>
                  {{ row.profile?.address }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </el-table-column>
          <el-table-column :index="createTableIndex" label="序号" type="index" width="55" />
          <el-table-column label="账号" prop="userName" />
          <el-table-column label="昵称" prop="nickName" />
          <el-table-column label="用户状态" prop="userStatus" width="120">
            <template #default="{ row }">
              <user-status-tag :status="row.userStatus" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="180" />
          <el-table-column label="创建人" prop="createBy" width="180" />
          <el-table-column fixed="right" label="操作" width="200px">
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
        </el-table>
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
import { useTableQueryPageHooks, useTableToolHooks } from '@/hooks/use-crud-hooks'
import UserForm from '@/views/system/user/components/user-form.vue'
import type { SysUserQueryRequest, SysUserResponse } from '@/service/model/system/user.model'
import { UserStatusEnums } from '@/service/model/system/user.model'
import {
  querySysUserPage,
  removeSysUserById,
  removeSysUserByIds,
  resetPassword,
} from '@/service/api/system/user.api'
import {
  LocationFilled,
  OfficeBuilding,
  Postcard,
  Present,
  Tickets,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import type { SysDeptResponse } from '@/service/model/system/dept.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { disabledTodayAndFuture } from '@/utils/moudle/element'
import UserRoleForm from '@/views/system/user/components/user-role-form.vue'
import DeptTree from '@/components/system/dept-tree/index.vue'

defineOptions({ name: 'SysUserViewIndex' })
const state = reactive<TableQueryPageState<SysUserQueryRequest, SysUserResponse>>({
  queryParams: {
    deptId: undefined,
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
  SysUserQueryRequest,
  SysUserResponse
>(state, querySysUserPage)
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const userFormRef = useTemplateRef('userFormRef')
const deptTreeRef = useTemplateRef('deptTreeRef')
const userRoleFormRef = useTemplateRef('userRoleFormRef')
const { cellStyle, headerCellStyle } = useTableToolHooks()
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
