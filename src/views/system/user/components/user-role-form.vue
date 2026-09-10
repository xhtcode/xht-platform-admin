<script lang="ts" setup>
import { roleRoleByUserId } from '@/service/api/system/role.api'
import { useMessage } from '@/hooks/use-message'
import { UserRoleBind } from '@/service/api/system/user.api'
import { UserRoleBindOperationRequest } from '@/service/model/system/user.model'
import { SysRoleResponse } from '@/service/model/system/role.model'

defineOptions({ name: 'UserRoleForm' })

const visibleStatus = ref<boolean>(false)
const loadingStatus = ref<boolean>(false)
const treeData = ref<SysRoleResponse[]>([])
const checkedKeys = ref<ModeIdType[]>([])
const addUpdateForm = ref<UserRoleBindOperationRequest>({
  userId: null,
  roleIds: [],
})

/**
 * 打开显示
 */
const show = async (userId: ModeIdType) => {
  try {
    visibleStatus.value = true
    addUpdateForm.value = {
      userId: userId,
      roleIds: [],
    }
    loadingStatus.value = true
    const response = await roleRoleByUserId(userId)
    const { bindRoleIds, roles } = response.data
    checkedKeys.value = bindRoleIds
    treeData.value = roles
  } finally {
    loadingStatus.value = false
  }
}

/**
 * 关闭
 */
const close = () => {
  addUpdateForm.value = {
    userId: null,
    roleIds: [],
  }
  visibleStatus.value = false
  loadingStatus.value = false
  treeData.value = []
  checkedKeys.value = []
}

/**
 * 过滤角色
 */
const filterMethod = (query: string, item: any) => {
  if (!query) return true
  return item.roleName.includes(query) || item.roleCode.includes(query)
}

/**
 * 提交表单
 */
const submitForm = async () => {
  loadingStatus.value = true
  addUpdateForm.value.roleIds = [...checkedKeys.value]
  UserRoleBind({ userId: addUpdateForm.value.userId, roleIds: addUpdateForm.value.roleIds })
    .then(() => {
      useMessage().success('当前用户分配角色成功')
      close()
    })
    .finally(() => {
      loadingStatus.value = false
    })
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="visibleStatus"
    title="分配角色"
    width="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!loadingStatus"
    :before-close="close"
  >
    <el-transfer
      v-model="checkedKeys"
      v-loading="loadingStatus"
      class="user-role-transfer"
      :data="treeData"
      filterable
      :item-size="32"
      virtual-scroll
      filter-placeholder="请输入过滤的角色名称或者角色编码"
      :filter-method="filterMethod"
      :props="{ key: 'id', label: 'roleName' }"
      :titles="['未分配角色', '已分配角色']"
    >
      <template #default="{ option }">
        <div class="w-full flex justify-between">
          <div>{{ option.roleName }}</div>
          <div class="pr-5 color-[var(--el-color-info)]">{{ option.roleCode }}</div>
        </div>
      </template>
    </el-transfer>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="loadingStatus" type="primary" @click="submitForm">提交</el-button>
        <el-button :disabled="loadingStatus" @click="close">取 消</el-button>
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

.user-role-transfer {
  display: flex;
  align-items: center;
  :deep(.el-transfer-panel) {
    flex: 1;
  }
  :deep(.el-transfer-panel__body) {
    height: 40vh;
  }
}
</style>
