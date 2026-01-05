<script lang="ts" setup>
import { MenuCommonStatus, MenuTypeEnums, type SysMenuTreeResponse } from '@/service/model/system/menu.model'
import { queryToolsMenuTree } from '@/service/api/tools.api'
import type { TreeNodeData, TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'
import type { MenuTreeSelectProps } from '@/components/system/menu-tree-select/types'
import type { TreeInstance } from 'element-plus'

defineOptions({ name: 'MenuTreeSelect' })

const props = withDefaults(defineProps<MenuTreeSelectProps>(), {
  id: undefined,
  placeholder: '请选择父菜单',
  clearable: true,
  disabled: false,
  showTopMenu: false,
  type: undefined,
})

const emits = defineEmits(['change'])

const menuSelectTreeRef = useTemplateRef<TreeInstance>('menuSelectTreeRef')
const modelValue = defineModel<string>('modelValue')
const menuTree = ref<SysMenuTreeResponse>([])
const menuTreeProps: TreeOptionProps = {
  label: 'menuName',
  disabled: (item: TreeNodeData) => {
    if (item.id === props.id) {
      return true
    }
    if (item.frameFlag === MenuCommonStatus.YES) {
      return true
    }
    if (props.type) {
      return item.menuType === props.type
    }
    return false
  },
}

/**
 * 获取菜单树数据
 */
const getMenuTree = async () => {
  try {
    const response = await queryToolsMenuTree()
    let treeData = response.data
    // 如果需要显示顶级菜单选项
    if (props.showTopMenu) {
      const topMenu = {
        id: '0',
        menuName: '顶级菜单',
        menuType: MenuTypeEnums.M,
        children: treeData,
      } as any
      treeData = [topMenu]
    }
    menuTree.value = treeData
  } catch (error) {
    console.error('获取菜单树数据失败:', error)
  }
}
/**
 * 选择时进行数据双向绑定
 */
const handleChange = (item: TreeNodeData) => {
  if (!modelValue.value) return
  if (!props.multiple) {
    const menuNode = menuSelectTreeRef.value?.getNode(item)?.data
    emits('change', menuNode)
  } else {
    emits('change', menuSelectTreeRef.value?.getCheckedNodes() || [])
  }
}
onMounted(() => {
  getMenuTree()
})
</script>

<template>
  <el-tree-select
    ref="menuSelectTreeRef"
    v-model="modelValue"
    :data="menuTree"
    filterable
    :empty-text="`暂无菜单数据`"
    :props="menuTreeProps"
    :placeholder="placeholder"
    :disabled="disabled"
    :default-expand-all="true"
    :clearable="clearable"
    :show-checkbox="multiple"
    check-strictly
    highlight-current
    class="user-select-display"
    node-key="id"
    @change="handleChange"
  />
</template>

<style scoped lang="scss">
* {
  user-select: none;
}
</style>
