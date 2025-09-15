<template>
  <div class="template-group-tree">
    <el-button type="primary" @click="handleTemplateGroupAdd">添加</el-button>
    <template v-if="state.tableList && state.tableList.length > 0">
      <div
        v-for="item in state.tableList"
        class="template-group-item"
        :class="index === item.id ? 'node-item-active' : ''"
        :key="item.id"
        @click="handleNodeClick(item)"
      >
        <div>{{ item.groupName }}</div>
        <el-space>
          <el-icon class="delete-icon" @click="handleTemplateGroupUpdate(item)">
            <Edit />
          </el-icon>
          <el-icon class="delete-icon" @click="handleTemplateGroupRemove(item)">
            <Delete />
          </el-icon>
        </el-space>
      </div>
    </template>
    <el-empty description="暂无相关模板数据" v-else />
    <template-group-form ref="templateGroupFormRef" @success="refreshTreeDate()" />
  </div>
</template>

<script lang="ts" setup>
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { GenTemplateGroupResponse } from '@/service/model/generate/template.group.model'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ModeIdType } from '@/service/model/base.model'
import { queryGenTemplateGroupList } from '@/service/api/generate/group.api'
import TemplateGroupForm from '@/views/generate/template/components/template-group-form.vue'
import { removeGenTemplateByIds } from '@/service/api/generate/template.api'

/**
 * 数据源组件状态
 */
export interface GenTemplateGroupTreeState {
  /**
   * 数据源列表
   */
  tableList: GenTemplateGroupResponse[]

  /**
   * 加载状态
   */
  loading: boolean
}

/**
 * 定义组件选项
 */
defineOptions({
  name: 'TemplateGroupTree',
  inheritAttrs: false,
})

/**
 * 组件状态管理
 */
const state = reactive<GenTemplateGroupTreeState>({
  tableList: [],
  loading: false,
})
const emits = defineEmits(['nodeClick'])
const index = ref<ModeIdType>(null)
const templateGroupFormRef = useTemplateRef('templateGroupFormRef')
/**
 * 选择时进行数据双向绑定
 */
const handleNodeClick = (data: GenTemplateGroupResponse) => {
  index.value = data.id
  emits('nodeClick', data)
}

const resetHighlightCurrent = () => {
  index.value = null
}
/**
 * 查询模板分组信息列表
 */
const refreshTreeDate = async () => {
  // 设置加载状态
  state.loading = true
  try {
    resetHighlightCurrent()
    const res = await queryGenTemplateGroupList()
    state.tableList = res.data || []
    if (state.tableList.length === 0) {
      useMessage().info('未查询到模板分组信息信息')
    }
  } catch (error) {
    useMessage().error('查询模板分组信息失败，请稍后重试')
  } finally {
    // 重置加载状态
    state.loading = false
  }
}
const handleTemplateGroupAdd = () => {
  templateGroupFormRef.value?.show('add', null)
}
const handleTemplateGroupUpdate = (row: GenTemplateGroupResponse) => {
  templateGroupFormRef.value?.show('update', row.id)
}
const handleTemplateGroupRemove = async (row: GenTemplateGroupResponse) => {
  state.loading = true
  await useMessageBox()
    .confirm('此操作将永久删除模板信息, 是否继续?')
    .then(() => {
      removeGenTemplateByIds(row.id).then(async () => {
        useMessage().success('删除模板信息成功!')
        await refreshTreeDate()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loading = false
    })
}
/**
 * 组件挂载时查询数据
 */
onMounted(() => {
  refreshTreeDate()
})
defineExpose({
  resetHighlightCurrent,
  refreshTreeDate,
})
</script>

<style lang="scss" scoped>
.template-group-tree {
  border: 1px solid var(--el-border-color);
  border-radius: var(--xht-border-radius-base);

  .template-group-item {
    height: 35px;
    display: flex;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    border-radius: var(--xht-border-radius-base);

    .delete-icon {
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    &:hover {
      font-size: 18px;
      background: var(--el-color-primary-light-9);
    }
  }

  .template-group-item-active {
    background: var(--el-color-primary-light-9);
  }
}
</style>
