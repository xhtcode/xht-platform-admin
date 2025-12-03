<template>
  <el-dialog v-model="state.visibleStatus" :before-close="close" append-to-body width="auto">
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
      :row-class-name="
        ({ row }) => {
          return row.deptId ? '' : 'no-dept-row'
        }
      "
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
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { ModeIdType } from '@/service/model/base.model'
import { getBindUser } from '@/service/api/tools.api'
import type { UserSimpleVo } from '@/service/model/system/user.model'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'DeptUserForm' })
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

interface DeptUserProps {
  modelValue?: any
}

const props = withDefaults(defineProps<DeptUserProps>(), {
  modelValue: undefined,
})

const tableRef = useTemplateRef<any>('tableRef')
const emits = defineEmits<{
  (e: 'change', user: UserSimpleVo): void
}>()
/**
 * 显示对话框
 */
const show = async (deptId: ModeIdType) => {
  state.visibleStatus = true
  state.loadingStatus = true
  await getBindUser(deptId)
    .then((res) => {
      state.userList = res.data
      for (const item of res.data) {
        if (item.userId === props.modelValue) {
          tableRef.value?.setCurrentRow(item)
          break
        }
      }
    })
    .finally(() => {
      state.loadingStatus = false
    })
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
const handleCurrentChange = (val: UserSimpleVo | null) => {
  state.currentRow = val
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
