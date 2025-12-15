<template>
  <el-dialog
    v-model="state.visibleStatus"
    width="auto"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <el-text size="large" tag="b">部门主管筛选</el-text>
        <div v-if="state.currentRow" class="h100 items-center flex">
          <el-text size="small">已选择:</el-text>
          <el-tag effect="dark" size="small">{{ state.currentRow?.userName }}:{{ state.currentRow?.nickName }}</el-tag>
        </div>
      </div>
    </template>
    <xht-table
      ref="tableRef"
      v-loading="state.loadingStatus"
      :data="state.userList"
      :row-class-name="handleRowClassName"
      border
      empty-text="暂无用户数据"
      height="65vh"
      highlight-current-row
      row-key="userId"
      @row-dblclick="submitForm"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="用户头像" prop="avatarUrl" width="100">
        <template #default="{ row }">
          <el-avatar :src="row.avatarUrl" alt="用户头像" />
        </template>
      </el-table-column>
      <el-table-column label="用户账号" prop="userName" width="160" />
      <el-table-column label="用户昵称" prop="nickName" width="160" />
      <el-table-column label="账号状态" prop="userStatus" width="120">
        <template #default="{ row }">
          <user-status-tag :status="row.userStatus" />
        </template>
      </el-table-column>
    </xht-table>
    <template #footer>
      <span>
        <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { ModeIdType } from '@/service/model/base.model'
import { getBindUser } from '@/service/api/tools.api'
import { DeptUserProps, UserSimpleVo } from '@/service/model/system/user.model'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'DeptUserForm' })

const tableRef = useTemplateRef<any>('tableRef')
const state = reactive<{
  visibleStatus: boolean
  loadingStatus: boolean
  userList: UserSimpleVo[]
  currentRow: UserSimpleVo | null
}>({
  visibleStatus: false,
  loadingStatus: false,
  userList: [] as any[],
  currentRow: null,
})
const props = withDefaults(defineProps<DeptUserProps>(), {
  modelValue: undefined,
})
const emits = defineEmits<{
  (e: 'change', user: UserSimpleVo): void
}>()

/**
 * 显示对话框
 */
const show = async (deptId: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.loadingStatus = true
    const { data } = await getBindUser(deptId)
    state.userList = data
    for (const item of data) {
      if (item.userId === props.modelValue) {
        tableRef.value?.setCurrentRow(item)
        break
      }
    }
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭对话框
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.currentRow = null
  tableRef.value?.setCurrentRow(null)
}

/**
 * 当前行变化
 */
const handleCurrentChange = (val: UserSimpleVo | null) => {
  state.currentRow = val
}

/**
 * 表格行样式
 */
const handleRowClassName = (data: any) => {
  const { row } = data
  return row?.deptId ? '' : 'no-dept-row'
}

/**
 * 提交
 */
const submitForm = () => {
  if (state.currentRow) {
    emits('change', state.currentRow)
    close()
  } else {
    useMessage().error('暂未选择部门主管')
  }
}

defineExpose({
  show,
})
</script>

<style lang="scss" scoped>
:deep(.no-dept-row) {
  user-select: none;
  color: var(--el-color-danger) !important;
}

:deep(.cell) {
  user-select: none;
}
</style>
