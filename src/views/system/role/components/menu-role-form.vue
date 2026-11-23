<script lang="ts" setup>
import type { CheckboxValueType } from 'element-plus'
import type { SysMenuTreeResponse } from '@/service/model/system/menu.model'
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
  expandStatus: true,
  checkAllStatus: false,
  treeData: [],
  checkedKeys: [],
  menuTotal: 0,
})

const { expandStatus, checkAllStatus, treeData, checkedKeys, addUpdateForm } = toRefs(state)
const indeterminateStatus = ref<boolean>(false)

/**
 * 统计菜单树节点总数（含父级目录）
 */
const countTreeNodes = (list: SysMenuTreeResponse[]): number => {
  return list.reduce((total, item) => total + 1 + countTreeNodes(item.children || []), 0)
}

/**
 * 同步全选/半选状态
 *
 * 以树上实际勾选结果为准：前端不再依赖后端 menuTotal 判断全选，
 * 同时自动忽略历史越界（树上不存在的）菜单ID，避免原样提交后被后端拒绝
 */
const syncCheckStatus = () => {
  const halfCheckedKeys = menuTree.value?.getHalfCheckedKeys() || []
  checkedKeys.value = menuTree.value?.getCheckedKeys() || []
  indeterminateStatus.value = halfCheckedKeys.length > 0
  checkAllStatus.value = state.menuTotal > 0 && checkedKeys.value.length === state.menuTotal
}

/**
 * 显示角色权限分配弹窗
 * @param roleId - 角色ID，用于获取该角色可分配的菜单树
 * @param roleName - 角色名称，用于弹窗标题
 */
const show = async (roleId: ModeIdType, roleName?: string) => {
  state.visibleStatus = true
  state.title = roleName ? `分配权限：${roleName}` : '分配权限'
  addUpdateForm.value = {
    roleId,
    menuIds: [],
  }
  state.loadingStatus = true
  try {
    const { data } = await selectMenuIdByRoleId(roleId)
    const { checkedMenuIds = [], menuList = [] } = data
    treeData.value = menuList
    state.menuTotal = countTreeNodes(menuList)
    // 等树渲染完成再回显，避免 setCheckedKeys 作用在旧数据上
    await nextTick()
    menuTree.value?.setCheckedKeys(checkedMenuIds)
    syncCheckStatus()
  } catch (error) {
    console.error('查询角色可分配菜单失败:', error)
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 处理展开/收起所有节点
 * @param check - 布尔值，true表示展开所有节点，false表示收起所有节点
 */
const handleExpand = (check: CheckboxValueType) => {
  expandStatus.value = check as boolean
  const nodes = menuTree.value?.store._getAllNodes()
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].expanded = check as boolean
    }
  }
}

/**
 * 处理全选/取消全选操作
 * @param check - 布尔值，true表示选中所有节点，false表示取消选中所有节点
 */
const handleSelectAll = (check: CheckboxValueType) => {
  if (check) {
    menuTree.value?.setCheckedKeys(treeData.value.map((item: SysMenuTreeResponse) => item.id))
  } else {
    menuTree.value?.setCheckedKeys([])
  }
  syncCheckStatus()
}

/**
 * 提交角色菜单权限绑定
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateForm.value.menuIds = checkedKeys.value
  roleMenuBind(addUpdateForm.value)
    .then(() => {
      useMessage().success('当前角色分配菜单权限成功')
      close()
    })
    .catch((error) => {
      console.error('角色分配菜单权限失败:', error)
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 关闭角色权限分配弹窗
 */
const close = () => {
  addUpdateForm.value = {
    roleId: null,
    menuIds: [],
  }
  state.visibleStatus = false
  state.operationStatus = 'create'
  checkAllStatus.value = false
  indeterminateStatus.value = false
  checkedKeys.value = []
  treeData.value = []
  state.menuTotal = 0
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    :title="state.title"
    width="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
    class="xht-dialog"
  >
    <template #header>
      <div class="menu-role-dialog-title">
        <div>{{ state.title }}</div>
        <div v-if="treeData.length > 0" class="mr-16 flex">
          <el-checkbox v-model="expandStatus" :label="expandStatus ? '收起所有节点' : '展开所有节点'" @change="handleExpand" />
          <el-checkbox v-model="checkAllStatus" label="全选" :indeterminate="indeterminateStatus" @change="handleSelectAll" />
        </div>
      </div>
    </template>
    <el-scrollbar class="menu-role-dialog-body">
      <el-alert
        v-if="!state.loadingStatus && treeData.length === 0"
        class="mb-12"
        title="请先为该角色绑定角色类型"
        type="warning"
        :closable="false"
        show-icon
      />
      <el-tree
        ref="menuTree"
        v-loading="state.loadingStatus"
        :data="treeData"
        :default-expand-all="true"
        :props="{ children: 'children', label: 'menuName' }"
        highlight-current
        node-key="id"
        show-checkbox
        @check="syncCheckStatus"
      >
        <template #default="{ data }">
          <div>{{ data.menuName }}</div>
        </template>
      </el-tree>
    </el-scrollbar>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus || treeData.length === 0" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-dialog>
</template>

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
