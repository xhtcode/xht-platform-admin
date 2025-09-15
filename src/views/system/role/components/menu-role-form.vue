<template>
  <el-dialog
    v-model="state.visibleStatus"
    :before-close="close"
    title="分配权限"
    width="45%"
    append-to-body
  >
    <template #header>
      <div class="menu-role-dialog-title">
        <div>分配权限</div>
        <div class="flex mr-16">
          <el-checkbox label="展开/折叠" checked @change="handleExpand" />
          <el-checkbox label="全选/不全选" @change="handleSelectAll" />
        </div>
      </div>
    </template>
    <el-scrollbar class="menu-role-dialog-body">
      <el-tree
        ref="menuTree"
        v-loading="state.loadingStatus"
        :data="treeData"
        :default-checked-keys="state.checkedKeys"
        :check-strictly="!checkStrictly"
        :default-expand-all="true"
        :props="{ children: 'children', label: 'menuName' }"
        node-key="id"
        highlight-current
        show-checkbox
      >
        <template #default="{ data }">
          <div>{{ data.menuName }}</div>
        </template>
      </el-tree>
    </el-scrollbar>
    <template #footer>
      <span>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { queryToolsMenuTree } from '@/service/api/tools.api'
import type { CheckboxValueType } from 'element-plus'
import { roleMenuBind, selectMenuIdByRoleId } from '@/service/api/system/role.api'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'MenuRoleForm' })
const state = reactive<AddUpdateOption<any>>({
  title: '增加部门',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: {},
  treeData: [],
  checkedKeys: [],
  roleId: '',
})
const checkStrictly = ref(true)
const menuTree = useTemplateRef('menuTree')
const treeData = ref<any[]>([])
/**
 * 打开显示
 */
const show = async (roleId: ModeIdType) => {
  state.visibleStatus = true
  state.roleId = roleId
  await nextTick(() => {
    state.loadingStatus = true
    selectMenuIdByRoleId(roleId)
      .then((res) => {
        state.checkedKeys = res.data
        return queryToolsMenuTree('ALL')
      })
      .then((res) => {
        treeData.value = res.data
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
const handleExpand = (check: CheckboxValueType) => {
  state.loadingStatus = true
  const nodes = menuTree.value?.store._getAllNodes()
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].expanded = check as boolean
    }
  }
  state.loadingStatus = false
}
const handleSelectAll = (check: CheckboxValueType) => {
  state.loadingStatus = true
  if (check) {
    menuTree.value?.setCheckedKeys(treeData.value.map((item) => item.id))
  } else {
    menuTree.value?.setCheckedKeys([])
  }
  state.loadingStatus = false
}
const onSubmit = () => {
  state.loadingStatus = true
  const menuIds = menuTree.value?.getCheckedKeys()
  roleMenuBind({ roleId: state.roleId, menuIds })
    .then(() => {
      useMessage().success('当前角色分配菜单权限成功')
      close()
    })
    .catch(() => {
      useMessage().error('当前角色分配菜单权限失败')
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
.menu-role-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-role-dialog-body {
  height: 65vh;
}
</style>
