<template>
  <el-dialog v-model="state.visibleStatus" :before-close="close" append-to-body size="45%" title="分配角色">
    <template #header>
      <div class="user-role-dialog-title">
        <div>分配角色</div>
        <div class="flex mr-16">
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
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { queryToolsRoleList } from '@/service/api/tools.api'
import type { CheckboxValueType } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { selectRoleIdByUserId, UserRoleBind } from '@/service/api/system/user.api'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'UserRoleForm' })
const state = reactive<AddUpdateOption<any>>({
  title: '增加部门',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: {},
  treeData: [],
  checkedKeys: [],
  userId: '',
})
const checkStrictly = ref(true)
const roleTreeRef = useTemplateRef('roleTreeRef')
const treeData = ref<any[]>([])
/**
 * 打开显示
 */
const show = async (userId: ModeIdType) => {
  state.visibleStatus = true
  state.userId = userId
  state.loadingStatus = true
  await selectRoleIdByUserId(userId)
    .then((res) => {
      state.checkedKeys = res.data
      return queryToolsRoleList()
    })
    .then((res) => {
      treeData.value = res.data
      checkStrictly.value = state.checkedKeys.length === treeData.value.length
    })
    .finally(() => {
      state.loadingStatus = false
    })
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

const handleSelectAll = (check: CheckboxValueType) => {
  state.loadingStatus = true
  if (check) {
    roleTreeRef.value?.setCheckedKeys(treeData.value.map((item) => item.id))
  } else {
    roleTreeRef.value?.setCheckedKeys([])
  }
  state.loadingStatus = false
}
const submitForm = () => {
  state.loadingStatus = true
  const roleIds = roleTreeRef.value?.getCheckedKeys()
  UserRoleBind({ userId: state.userId, roleIds: roleIds })
    .then(() => {
      useMessage().success('当前用户分配角色成功')
      close()
    })
    .catch(() => {
      useMessage().error('当前用户分配角色失败')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}
defineExpose({
  show,
})
</script>

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
