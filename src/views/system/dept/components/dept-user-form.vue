<script lang="ts" setup>
import { DeptUserProps, UserSimpleVo } from '@/service/model/system/user.model'
import { useMessage } from '@/hooks/use-message'
import { userStatusEnums } from '@/service/enums/system/user.enum'

defineOptions({ name: 'DeptUserForm' })

const props = withDefaults(defineProps<DeptUserProps>(), {
  modelValue: undefined,
})
const emits = defineEmits<{
  (e: 'change', user: UserSimpleVo): void
}>()
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
/**
 * 显示对话框
 */
const show = async (deptId: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.loadingStatus = true
    // const { data } = await getBindUser(deptId)
    // state.userList = data
    // for (const item of data) {
    //   if (item.userId === props.modelValue) {
    //     tableRef.value?.setCurrentRow(item)
    //     break
    //   }
    // }
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

<template>
  <el-dialog
    v-model="state.visibleStatus"
    width="80%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <el-text size="large" tag="b">部门主管筛选</el-text>
        <div v-if="state.currentRow" class="h100 flex items-center">
          <el-text size="small">已选择:</el-text>
          <el-tag effect="dark" size="small">{{ state.currentRow?.userName }}:{{ state.currentRow?.nickName }}</el-tag>
        </div>
      </div>
    </template>
    <el-table
      ref="tableRef"
      v-loading="state.loadingStatus"
      :data="state.userList"
      :row-class-name="handleRowClassName"
      empty-text="暂无用户数据"
      highlight-current-row
      border
      row-key="userId"
      @row-dblclick="submitForm"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="序号" type="index" />
      <el-table-column label="用户头像" prop="avatarUrl">
        <template #default="{ row }">
          <el-avatar :src="row.avatarUrl" alt="用户头像" />
        </template>
      </el-table-column>
      <el-table-column label="用户账号" prop="userName" />
      <el-table-column label="用户昵称" prop="nickName" />
      <el-table-column label="账号状态" prop="userStatus">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.userStatus" :data="userStatusEnums" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span>
        <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.no-dept-row) {
  user-select: none;
  color: var(--el-color-danger) !important;
}

:deep(.cell) {
  user-select: none;
}
</style>
