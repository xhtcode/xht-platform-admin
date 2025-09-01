<template>
  <el-tree-select
    ref="menuSelectTreeRef"
    v-model="modelValue"
    :data="menuTree"
    filterable
    :empty-text="`暂无菜单数据`"
    :props="{ label: 'menuName', value: 'id' }"
    :placeholder="placeholder"
    :disabled="disabled"
    :default-expand-all="true"
    :clearable="clearable"
    :show-checkbox="multiple"
    check-strictly
    highlight-current
    class="user-select-display"
    node-key="id"
    @change="handleChange()"
  />
</template>

<script lang="ts" setup>
import type { SysMenuTreeResponse } from '@/model/system/menu.model.ts'
import { MenuTypeEnums } from '@/model/system/menu.model.ts'
import { queryToolsMenuTree } from '@/api/tools.api.ts'

defineOptions({ name: 'MenuTreeSelect' })

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  showTopMenu?: boolean
  multiple?: boolean
  type: 'ALL' | 'M' | 'C' | 'B'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '0',
  placeholder: '请选择父菜单',
  clearable: true,
  disabled: false,
  showTopMenu: false,
  type: 'M',
})
const menuSelectTreeRef = ref<any>()
const emits = defineEmits(['update:modelValue', 'change'])
const modelValue = useVModel(props, 'modelValue', emits)
const menuTree = ref<SysMenuTreeResponse>([])

/**
 * 获取菜单树数据
 */
const getMenuTree = async () => {
  try {
    const response = await queryToolsMenuTree(props.type)
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
const handleChange = () => {
  if (!modelValue.value) return
  if (!props.multiple) {
    const menuNode = menuSelectTreeRef.value.getNode(modelValue.value)?.data
    emits('change', menuNode)
  } else {
    emits('change', JSON.stringify(menuSelectTreeRef.value.getCheckedNodes()))
  }
}
onMounted(() => {
  getMenuTree()
})
</script>

<style scoped lang="scss"></style>
