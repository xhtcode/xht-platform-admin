<template>
  <div class="dept-tree-container">
    <div class="dept-tree-container-filter">
      <el-input v-model="filterText" placeholder="请输入部门名称">
        <template #append>
          <el-icon @click="toggleRowExpansionAll(!expandAll)" size="20">
            <CaretTop v-if="expandAll" />
            <CaretBottom v-else />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="dept-tree-container-tree">
      <el-scrollbar class="w100">
        <el-tree
          ref="treeRef"
          v-loading="loading"
          :check-strictly="true"
          :expand-on-click-node="false"
          :current-node-key="modelValue"
          :data="treeData"
          :filter-node-method="filterNode"
          :props="defaultProps"
          highlight-current
          node-key="id"
          :default-expand-all="expandAll"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ElTree } from 'element-plus'
import { useVModel } from '@vueuse/core'
import { querySysDeptTree } from '@/api/system/dept.api.ts'
import type {
  SysDeptQueryRequest,
  SysDeptResponse,
  SysDeptTreeResponse,
} from '@/model/system/dept.model.ts'
import { DeptStatusEnums } from '@/model/system/dept.model.ts'
import type { AxiosResponse } from 'axios'
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'

defineOptions({ name: 'DeptSelectComponent' })
const expandAll = ref<boolean>(true)

interface DeptSelectTreeProps {
  modelValue?: any
}

const props = withDefaults(defineProps<DeptSelectTreeProps>(), {
  modelValue: undefined,
})

const defaultProps: any = {
  children: 'children',
  label: 'deptName',
}

const emits = defineEmits<{
  (e: 'clickNode', data: SysDeptResponse): void
  (e: 'update:modelValue', value: any): void
}>()
const modelValue = useVModel(props, 'modelValue', emits)
const loading = ref<boolean>(false)
const filterText = ref<string>('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<SysDeptTreeResponse>([])
const queryParams = ref<SysDeptQueryRequest>({
  deptStatus: DeptStatusEnums.NORMAL,
})

const resetHighlightCurrent = () => {
  treeRef.value?.setCurrentKey(undefined)
}
/**
 * 切换所有节点的展开/收起状态。
 *
 * @param status 目标状态，true 为展开，false 为收起。
 */
const toggleRowExpansionAll = (status: boolean) => {
  expandAll.value = status
  const nodes = treeRef.value?.store._getAllNodes()
  if (nodes) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].expanded = status
    }
  }
}
/**
 * 点击事件
 * @param data
 */
const handleNodeClick = (data: SysDeptResponse) => {
  emits('clickNode', data)
}

/**
 * 定义查询事件
 * @param value
 * @param data
 */
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.deptName.includes(value)
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/**
 * 获取表单信息
 */
const handleQuery = async () => {
  loading.value = true
  await querySysDeptTree(queryParams.value).then((res: AxiosResponse<SysDeptTreeResponse>) => {
    treeData.value = res.data
    loading.value = false
  })
}
onMounted(() => {
  handleQuery()
})
defineExpose({
  resetHighlightCurrent,
})
</script>
<style lang="scss" scoped>
.dept-tree-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  background: var(--xht-bg-color);
  padding: 8px;

  .dept-tree-container-filter {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    .el-icon {
      cursor: pointer;

      &:hover {
        font-weight: bold;
        color: var(--el-color-primary) !important;
      }
    }
  }

  .dept-tree-container-tree {
    display: flex;
    flex: 1;
    width: 100%;
    overflow: hidden;
  }
}
</style>
