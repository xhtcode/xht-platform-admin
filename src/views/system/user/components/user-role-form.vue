<script lang="ts" setup>
import { roleRoleByUserId } from '@/service/api/system/role.api'
import type { CheckboxValueType, CheckedInfo, FilterNodeMethodFunction } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { UserRoleBind } from '@/service/api/system/user.api'
import { UserRoleBindOperationRequest } from '@/service/model/system/user.model'
import { SysRoleResponse } from '@/service/model/system/role.model'
import { generateUUID } from '@/utils'
import { Tree } from 'element-plus/es/components/tree-v2/src/types'
import { FilterValue, TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import { Search } from '@element-plus/icons-vue'

defineOptions({ name: 'UserRoleForm' })

const roleTreeRef = useTemplateRef('roleTreeRef')
const filterText = ref<string>('')
const visibleStatus = ref<boolean>(false)
const loadingStatus = ref<boolean>(false)
const checkStrictly = ref<boolean>(false)
const roleIndeterminate = ref<boolean>(false)
const treeData = ref<SysRoleResponse[]>([])
const checkedKeys = ref<ModeIdType[]>([])
const checkedKeysSize = ref<number>(0)
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
    const { bindRoleIds, roles, allChecked, indeterminate } = response.data
    checkedKeys.value = bindRoleIds
    treeData.value = roles
    checkedKeysSize.value = bindRoleIds.length
    checkStrictly.value = allChecked
    roleIndeterminate.value = indeterminate
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
  filterText.value = ''
  checkedKeysSize.value = 0
  visibleStatus.value = false
  loadingStatus.value = false
  checkStrictly.value = false
  roleIndeterminate.value = false
  treeData.value = []
  checkedKeys.value = []
}

/**
 * 角色选择
 */
const handleSelectAll = (check: CheckboxValueType) => {
  loadingStatus.value = true
  roleIndeterminate.value = false
  if (check) {
    checkedKeysSize.value = treeData.value.length
    roleTreeRef.value?.setCheckedKeys(treeData.value.map((item) => item.id))
  } else {
    checkedKeysSize.value = 0
    roleTreeRef.value?.setCheckedKeys([])
  }
  loadingStatus.value = false
}
/**
 * 角色选择
 */
const handleCheckChange = (_: any, checkedInfo: CheckedInfo) => {
  const { checkedKeys } = checkedInfo
  checkStrictly.value = checkedKeys.length === treeData.value.length
  roleIndeterminate.value = checkedKeys.length > 0 && checkedKeys.length < treeData.value.length
  checkedKeysSize.value = checkedKeys.length
}

/**
 * 提交表单
 */
const submitForm = async () => {
  loadingStatus.value = true
  addUpdateForm.value.roleIds = roleTreeRef.value?.getCheckedKeys() || []
  UserRoleBind({ userId: addUpdateForm.value.userId, roleIds: addUpdateForm.value.roleIds })
    .then(() => {
      useMessage().success('当前用户分配角色成功')
      close()
    })
    .finally(() => {
      loadingStatus.value = false
    })
}

watch(filterText, (val) => {
  roleTreeRef.value?.filter(val)
})

const filterNode: FilterNodeMethodFunction = (value: FilterValue, data: TreeNodeData) => {
  if (!value) return true
  return data.roleCode.includes(value) || data.roleName.includes(value)
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
    <template #header>
      <div class="user-role-dialog-title">
        <div>
          分配角色
          <el-text type="info" size="small">{{ checkedKeysSize }}/{{ treeData.length }}</el-text>
        </div>
        <div class="mr-16 flex">
          <el-checkbox v-model="checkStrictly" :indeterminate="roleIndeterminate" label="全选/不全选" @change="handleSelectAll" />
        </div>
      </div>
    </template>
    <el-input v-model="filterText" placeholder="请输入过滤的角色名称或者角色编码" size="default" :maxlength="20" show-word-limit>
      <template #append>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
    <el-scrollbar class="user-role-dialog-body">
      <el-tree
        ref="roleTreeRef"
        v-loading="loadingStatus"
        :check-strictly="false"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :default-expand-all="true"
        :props="{ children: 'children', label: 'roleName' }"
        class="filter-tree"
        highlight-current
        node-key="id"
        show-checkbox
        :filter-node-method="filterNode"
        @check="handleCheckChange"
      >
        <template #default="{ data }">
          <div class="w-full flex justify-between">
            <div>{{ data.roleName }}</div>
            <div class="pr-5 color-[var(--el-color-info)]">{{ data.roleCode }}</div>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
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

.user-role-dialog-body {
  padding-top: 5px;
  height: 45vh;
}
</style>
