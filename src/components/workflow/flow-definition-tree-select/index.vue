<script lang="ts" setup>
import { queryFlowDefinitionList } from '@/service/api/workflow/definition.api'
import type { FlowDefinitionTreeResponse } from '@/service/model/workflow/definition.model'
import type { LoadFunction, TreeNodeData, TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'
import type { FlowDefinitionTreeSelectProps } from '@/components/workflow/flow-definition-tree-select/types'

defineOptions({ name: 'FlowDefinitionTreeSelect' })

const props = withDefaults(defineProps<FlowDefinitionTreeSelectProps>(), {
  excludeId: undefined,
  placeholder: '请选择上级流程定义',
  disabled: false,
  clearable: true,
})

const emits = defineEmits(['change'])

const modelValue = defineModel<ModeIdType>('modelValue')
const loadingStatus = ref<boolean>(false)

/**
 * 默认上级节点ID（顶级）
 * 后端约定以'0'表示顶级节点
 */
const DEFAULT_PARENT_ID = '0'

/**
 * 构建默认上级节点数据（顶级）
 */
const getTopParentNode = (): FlowDefinitionTreeResponse => {
  return {
    id: DEFAULT_PARENT_ID,
    parentId: '',
    definitionLevel: 0,
    definitionCode: '',
    definitionName: '顶级流程定义',
    definitionType: 'category',
    definitionStatus: 1,
    definitionSort: 999,
  } as FlowDefinitionTreeResponse
}

// 懒加载未加载节点的缓存数据，用于选中值回显（默认上级节点预先缓存）
const cacheData = shallowRef<FlowDefinitionTreeResponse[]>([getTopParentNode()])

/**
 * 树节点属性配置
 * 分类（category）类型存在下级且可选择，其他类型为叶子节点且不可选
 */
const flowDefinitionTreeProps: TreeOptionProps = {
  label: 'definitionName',
  isLeaf: (data) => data.definitionType !== 'category',
  disabled: (item: TreeNodeData) => {
    return !!(props.excludeId && item.id === props.excludeId)
  },
}

/**
 * 懒加载流程定义树节点
 * 顶级不传parentId，子级按parentId查询
 * @param node 树节点
 * @param resolve 加载完成回调
 */
const handleLoadNode: LoadFunction = async (node, resolve) => {
  try {
    loadingStatus.value = true
    const { data } = await queryFlowDefinitionList({ parentId: node.id || '0' })
    if (node.id + '' === '0') {
      const topParentNode = getTopParentNode()
      topParentNode.children = data || []
      return resolve([topParentNode])
    }
    resolve(data)
  } catch (error) {
    console.error('获取流程定义树数据失败:', error)
    resolve([])
  } finally {
    loadingStatus.value = false
  }
}
</script>

<template>
  <el-tree-select
    ref="flowDefinitionTreeRef"
    v-model="modelValue"
    v-loading="loadingStatus"
    lazy
    :load="handleLoadNode"
    :cache-data="cacheData"
    filterable
    empty-text="暂无流程定义数据"
    :props="flowDefinitionTreeProps"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    check-strictly
    highlight-current
    class="user-select-none"
    node-key="id"
  />
</template>

<style lang="scss" scoped></style>
