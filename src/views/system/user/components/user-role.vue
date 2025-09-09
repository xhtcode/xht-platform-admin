<template>
  <el-dialog
    v-model="state.visibleStatus"
    :before-close="close"
    title="分配角色"
    size="45%"
    append-to-body
  >
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
        :data="treeData"
        :default-checked-keys="state.checkedKeys"
        :check-strictly="false"
        :default-expand-all="true"
        :props="{ children: 'children', label: 'roleName' }"
        class="filter-tree"
        node-key="id"
        highlight-current
        show-checkbox
      />
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { queryToolsRoleList } from '@/api/tools.api'
import type { CheckboxValueType } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { selectRoleIdByUserId, UserRoleBind } from '@/api/system/user.api'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'UserRole' })
const state = reactive<AddUpdateOption<any>>({
  title: '增加部门',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: {},
  treeData: [],
  checkedKeys: [],
  userId: '',
})
const checkStrictly = ref(true)
const roleTreeRef = ref()
const treeData = ref<any[]>([])
/**
 * 打开显示
 */
const show = async (userId: ModeIdType) => {
  state.visibleStatus = true
  state.userId = userId
  await nextTick(() => {
    state.loadingStatus = true
    selectRoleIdByUserId(userId)
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
  })
}
/**
 * 关闭
 */
const close = () => {
  state.visibleStatus = false
  state.operationStatus = 'add'
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
const onSubmit = () => {
  state.loadingStatus = true
  const roleIds = roleTreeRef.value.getCheckedKeys()
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

<style scoped lang="scss">
.user-role-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-role-dialog-body {
  height: 65vh;
}
</style>
