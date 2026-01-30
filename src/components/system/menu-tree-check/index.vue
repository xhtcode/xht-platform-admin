<script lang="ts" setup>
import type { SysMenuResponse } from '@/service/model/system/menu.model'
import { MenuTypeEnums } from '@/service/model/system/menu.model'
import { queryToolsMenuTree } from '@/service/api/system/menu.api'

defineOptions({ name: 'MenuTree' })

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  disabled: false,
  showTopMenu: false,
  type: 'ALL',
})

const emits = defineEmits(['update:modelValue', 'change'])

interface Props {
  modelValue?: string[]
  disabled?: boolean
  showTopMenu?: boolean
  type?: 'ALL' | 'M' | 'C' | 'B'
}

const menuTreeRef = ref<any>()
const modelValue = useVModel(props, 'modelValue', emits)
const menuTree = ref<INodeResponse<SysMenuResponse>[]>([])

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
 * 处理节点选中事件（多选模式）
 */
const handleCheck = (_: any, { checkedNodes, checkedKeys }: any) => {
  modelValue.value = checkedKeys
  emits('change', checkedNodes)
}

/**
 * 设置选中节点
 */
const setCheckedKeys = (keys: string[]) => {
  menuTreeRef.value?.setCheckedKeys(keys)
}

/**
 * 获取选中的节点数据
 */
const getCheckedNodes = () => {
  return menuTreeRef.value?.getCheckedNodes()
}

onMounted(() => {
  getMenuTree()
})

// 暴露方法给父组件
defineExpose({
  setCheckedKeys,
  getCheckedNodes,
})
</script>

<template>
  <el-tree
    ref="menuTreeRef"
    :data="menuTree"
    :props="{ children: 'children', label: 'menuName' }"
    :disabled="disabled"
    :default-expand-all="true"
    :show-checkbox="true"
    check-strictly
    node-key="id"
    class="user-select-display menu-tree"
    @check="handleCheck"
  />
</template>

<style scoped lang="scss">
.menu-tree {
  width: 100%;
}
</style>
