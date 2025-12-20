<script lang="ts" setup>
import { querySysDeptTree } from '@/service/api/system/dept.api'
import type { SysDeptResponse, SysDeptTreeResponse } from '@/service/model/system/dept.model'
import { DeptStatusEnums } from '@/service/model/system/dept.model'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'DeptTreeSelect' })

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择父部门',
  clearable: true,
  disabled: false,
  showTopDept: false,
})

const emits = defineEmits(['update:modelValue', 'clickNode'])

interface Props {
  modelValue: ModeIdType
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  showTopDept?: boolean
}

const menuSelectTreeRef = useTemplateRef('menuSelectTreeRef')
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
    :props="{ label: 'deptName' }"
    check-strictly
    highlight-current
    class="user-select-display"
    filterable
    node-key="id"
    v-bind="$attrs"
    @node-click="handleNodeClick"
  />
</template>

<style lang="scss" scoped></style>
