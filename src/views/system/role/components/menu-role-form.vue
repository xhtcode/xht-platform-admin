<template>
  <el-dialog v-model="state.visibleStatus" :before-close="close" align-center append-to-body title="分配权限" width="45%">
    <template #header>
      <div class="menu-role-dialog-title">
        <div>分配权限</div>
        <div class="flex mr-16">
          <el-checkbox checked label="展开/折叠" @change="handleExpand" />
          <el-checkbox v-model="checkAll" label="全选/不全选" @change="handleSelectAll" />
        </div>
      </div>
    </template>
    <el-scrollbar class="menu-role-dialog-body">
      <el-tree
        ref="menuTree"
        v-loading="state.loadingStatus"
        :check-strictly="false"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :default-expand-all="true"
        :props="{ children: 'children', label: 'menuName' }"
        highlight-current
        node-key="id"
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
        <el-button type="primary" @click="submitForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { CheckboxValueType } from 'element-plus'
import type { ModeIdType } from '@/service/model/base.model'
import type { SysMenuResponse } from '@/service/model/system/menu.model'
import type { SysRoleMenuBindForm } from '@/service/model/system/role.model'
import { roleMenuBind, selectMenuIdByRoleId } from '@/service/api/system/role.api'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'MenuRoleForm' })

const menuTree = useTemplateRef('menuTree')

const state = reactive<AddUpdateOption<SysRoleMenuBindForm>>({
  title: '分配权限',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: {
    roleId: null,
    menuIds: [],
  },
  checkAll: false,
  treeData: [],
  checkedKeys: [],
})

const { checkAll, treeData, checkedKeys, addUpdateForm } = toRefs(state)
/**
 * 显示角色权限分配弹窗
 * @param roleId - 角色ID，用于获取该角色已有的菜单权限并加载菜单树
 */
const show = async (roleId: ModeIdType) => {
  state.visibleStatus = true
  addUpdateForm.value.roleId = roleId
  state.loadingStatus = true
  await selectMenuIdByRoleId(roleId).then((res) => {
    checkAll.value = res.data.checkAll
    checkedKeys.value = res.data.checkedKeys
    treeData.value = res.data.menuList
  })
  state.loadingStatus = false
}

/**
 * 关闭角色权限分配弹窗
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.operationStatus = 'create'
  state.loadingStatus = false
  checkAll.value = false
  checkedKeys.value = []
  treeData.value = []
}

/**
 * 处理展开/收起所有节点
 * @param check - 布尔值，true表示展开所有节点，false表示收起所有节点
 */
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

/**
 * 处理全选/取消全选操作
 * @param check - 布尔值，true表示选中所有节点，false表示取消选中所有节点
 */
const handleSelectAll = (check: CheckboxValueType) => {
  state.loadingStatus = true
  if (check) {
    // 选中所有菜单项
    menuTree.value?.setCheckedKeys(treeData.value.map((item: SysMenuResponse) => item.id))
  } else {
    // 取消选中所有菜单项
    menuTree.value?.setCheckedKeys([])
  }
  state.loadingStatus = false
}

/**
 * 提交角色菜单权限绑定
 */
const submitForm = async () => {
  state.loadingStatus = true
  try {
    addUpdateForm.value.menuIds = menuTree.value?.getCheckedKeys() || []
    await roleMenuBind(addUpdateForm.value)
    useMessage().success('当前角色分配菜单权限成功')
    close()
  } finally {
    state.loadingStatus = false
  }
}

defineExpose({
  show,
})
</script>

<style lang="scss" scoped>
.menu-role-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-role-dialog-body {
  height: 55vh;
}
</style>
