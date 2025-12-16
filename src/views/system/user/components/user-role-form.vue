<script lang="ts" setup>
import { queryToolsRoleList } from '@/service/api/tools.api'
import type { CheckboxValueType } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { selectRoleIdByUserId, UserRoleBind } from '@/service/api/system/user.api'
import type { ModeIdType } from '@/service/model/base.model'
import { UserRoleBindOperationRequest } from '@/service/model/system/user.model'

defineOptions({ name: 'UserRoleForm' })

const roleTreeRef = useTemplateRef('roleTreeRef')
const state = reactive<AddUpdateOption<UserRoleBindOperationRequest>>({
  title: '分配角色',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: {
    userId: null,
    roleIds: [],
  },
  treeData: [],
  checkedKeys: [],
  userId: '',
})
const checkStrictly = ref(true)
const treeData = ref<any[]>([])
const { addUpdateForm } = toRefs(state)

/**
 * 打开显示
 */
const show = async (userId: ModeIdType) => {
  try {
    state.visibleStatus = true
    addUpdateForm.value.userId = userId
    state.loadingStatus = true
    const roleIds = await selectRoleIdByUserId(userId)
    state.checkedKeys = roleIds.data
    const roleList = await queryToolsRoleList()
    treeData.value = roleList.data
    checkStrictly.value = state.checkedKeys.length === treeData.value.length
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.operationStatus = 'create'
  state.loadingStatus = false
}

/**
 * 角色选择
 */
const handleSelectAll = (check: CheckboxValueType) => {
  state.loadingStatus = true
  if (check) {
    roleTreeRef.value?.setCheckedKeys(treeData.value.map((item) => item.id))
  } else {
    roleTreeRef.value?.setCheckedKeys([])
  }
  state.loadingStatus = false
}

/**
 * 提交表单
 */
const submitForm = async () => {
  try {
    state.loadingStatus = true
    addUpdateForm.value.roleIds = roleTreeRef.value?.getCheckedKeys() || []
    await UserRoleBind({ userId: state.userId, roleIds: addUpdateForm.value.roleIds })
    useMessage().success('当前用户分配角色成功')
    close()
  } finally {
    state.loadingStatus = false
  }
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    title="分配角色"
    width="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <template #header>
      <div class="user-role-dialog-title">
        <div>分配角色</div>
        <div class="mr-16 flex">
          <el-checkbox v-model="checkStrictly" label="全选/不全选" @change="handleSelectAll" />
        </div>
      </div>
    </template>
    <el-scrollbar class="user-role-dialog-body">
      <el-tree
        ref="roleTreeRef"
        v-loading="state.loadingStatus"
        :check-strictly="false"
        :data="treeData"
        :default-checked-keys="state.checkedKeys"
        :default-expand-all="true"
        :props="{ children: 'children', label: 'roleName' }"
        class="filter-tree"
        highlight-current
        node-key="id"
        show-checkbox
      />
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-role-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-role-dialog-body {
  height: 65vh;
}
</style>
