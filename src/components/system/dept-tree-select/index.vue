<template>
  <el-tree-select
    ref="menuSelectTreeRef"
    v-model="modelValue"
    :clearable="clearable"
    :data="menuTree"
    :disabled="disabled"
    :default-expand-all="true"
    :empty-text="`暂无部门数据`"
    :placeholder="placeholder"
    :props="{ label: 'deptName', value: 'id' }"
    check-strictly
    highlight-current
    class="user-select-display"
    filterable
    node-key="id"
    v-bind="$attrs"
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup>
import { querySysDeptTree } from '@/api/system/dept.api.ts'
import type { SysDeptResponse, SysDeptTreeResponse } from '@/model/system/dept.model.ts'
import { DeptStatusEnums } from '@/model/system/dept.model.ts'
import type { ModeIdType } from '@/model/base.model.ts'

defineOptions({ name: 'DeptTreeSelect' })

interface Props {
  modelValue: ModeIdType
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  showTopDept?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '请选择父部门',
  clearable: true,
  disabled: false,
  showTopDept: false,
})
const menuSelectTreeRef = useTemplateRef('menuSelectTreeRef')
const emits = defineEmits(['update:modelValue', 'clickNode'])
const modelValue = useVModel(props, 'modelValue', emits)
const menuTree = ref<SysDeptTreeResponse>([])

/**
 * 获取部门树数据
 */
const getMenuTree = async () => {
  try {
    const response = await querySysDeptTree({
      deptStatus: DeptStatusEnums.NORMAL,
    })
    let treeData = response.data
    // 如果需要显示顶级部门选项
    if (props.showTopDept) {
      const topMenu = {
        id: '0',
        deptName: '顶级部门',
        children: treeData,
      } as any
      treeData = [topMenu]
    }
    menuTree.value = treeData
  } catch (error) {
    console.error('获取部门树数据失败:', error)
  }
}
watch(
  () => modelValue.value,
  (newVal) => {
    if (!newVal) {
      menuSelectTreeRef.value?.setCurrentKey(undefined)
    }
  },
  {
    deep: true,
  }
)
/**
 * 选择时进行数据双向绑定
 */
const handleNodeClick = (data: SysDeptResponse) => {
  emits('clickNode', data)
}
onMounted(() => {
  nextTick(() => {
    getMenuTree()
  })
})
</script>

<style lang="scss" scoped></style>
