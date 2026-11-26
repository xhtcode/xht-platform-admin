<script lang="ts" setup>
import type { SysRoleTypeResponse } from '@/service/model/system/role-type.model'
import { querySysRoleTypeList } from '@/service/api/system/role-type.api'
import { Refresh } from '@element-plus/icons-vue'

defineOptions({ name: 'RoleTypeTree' })

const emits = defineEmits<{
  (e: 'select', type: SysRoleTypeResponse | null): void
}>()

const loadingStatus = ref<boolean>(false)
const filterText = ref<string>('')
const roleTypeList = ref<SysRoleTypeResponse[]>([])
const currentId = ref<ModeIdType>()

/**
 * 前端过滤分类列表（编码/名称模糊匹配）
 */
const filterList = computed<SysRoleTypeResponse[]>(() => {
  const keyword = filterText.value.trim().toLowerCase()
  if (!keyword) return roleTypeList.value
  return roleTypeList.value.filter((item) => item.typeName.toLowerCase().includes(keyword) || item.typeCode.toLowerCase().includes(keyword))
})

/**
 * 查询全部正常状态角色分类（list 接口，供过滤使用）
 */
const handleQuery = async () => {
  loadingStatus.value = true
  try {
    const { data } = await querySysRoleTypeList()
    roleTypeList.value = data || []
  } catch (error) {
    console.error('查询角色分类列表失败:', error)
  } finally {
    loadingStatus.value = false
  }
}

/**
 * 点击分类项：再次点击同一个分类取消选中
 */
const handleSelect = (item: SysRoleTypeResponse) => {
  if (currentId.value === item.id) {
    currentId.value = undefined
    emits('select', null)
    return
  }
  currentId.value = item.id
  emits('select', item)
}

/**
 * 重置选中状态（供父组件查询重置时调用）
 */
const resetCurrent = () => {
  currentId.value = undefined
}

defineExpose({
  resetCurrent,
  refresh: handleQuery,
})

onMounted(async () => {
  await handleQuery()
})
</script>

<template>
  <div class="role-type-container">
    <div class="role-type-tree-filter">
      <el-input v-model="filterText" size="default" clearable placeholder="请输入编码/名称">
        <template #append>
          <el-icon size="20" @click="handleQuery"><Refresh /></el-icon>
        </template>
      </el-input>
    </div>
    <div v-loading="loadingStatus" class="role-type-tree-list">
      <div
        v-for="item in filterList"
        :key="item.id"
        class="role-type-item"
        :class="{ 'is-active': currentId === item.id }"
        @click="handleSelect(item)"
      >
        <span class="role-type-item-name">{{ item.typeName }}</span>
        <span class="role-type-item-code">{{ item.typeCode }}</span>
      </div>
      <div v-if="!loadingStatus && filterList.length === 0" class="role-type-empty">暂无角色分类</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.role-type-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  background: var(--xht-bg-color);

  .role-type-tree-filter {
    padding-bottom: 6px;

    .el-icon {
      cursor: pointer;
      color: var(--el-text-color-secondary);
      transition: color 0.2s;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .role-type-tree-list {
    flex: 1;
    min-height: 0;
    padding-top: 6px;
    overflow-x: hidden;
    overflow-y: auto;
    background: var(--el-bg-color);
    border-top: 1px solid var(--xht-border-color);
  }

  .role-type-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    height: 32px;
    padding: 0 8px;
    margin: 1px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background: var(--el-fill-color-light);
    }

    &.is-active {
      background: var(--el-color-primary-light-9);

      .role-type-item-name {
        color: var(--el-color-primary);
      }

      .role-type-item-code {
        color: var(--el-color-primary-light-3);
      }
    }

    .role-type-item-name {
      flex: 1;
      min-width: 0;
      font-size: var(--el-font-size-small);
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.2s;
    }

    .role-type-item-code {
      flex-shrink: 0;
      font-size: 11px;
      color: var(--el-text-color-secondary);
      transition: color 0.2s;
    }
  }

  .role-type-empty {
    padding: 24px 0;
    font-size: var(--el-font-size-small);
    color: var(--el-text-color-secondary);
    text-align: center;
  }
}
</style>
