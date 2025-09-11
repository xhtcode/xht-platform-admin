<template>
  <el-dialog v-model="state.visibleStatus" :before-close="close" width="auto" append-to-body>
    <template #header>
      <div class="flex justify-between items-center">
        <el-text tag="b" size="large">部门主管筛选</el-text>
        <div v-if="state.currentRow" class="h100 items-center flex">
          <el-text size="small">已选择:</el-text>
          <el-tag effect="dark" size="small">
            {{ state.currentRow?.userName }}:{{ state.currentRow?.nickName }}
          </el-tag>
        </div>
      </div>
    </template>
    <el-table
      ref="tableRef"
      v-loading="state.loadingStatus"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      border
      height="65vh"
      row-key="userId"
      empty-text="暂无用户数据"
      highlight-current-row
      :data="state.userList"
      :row-class-name="
        ({ row }) => {
          return row.deptId ? '' : 'no-dept-row'
        }
      "
      @row-dblclick="onSubmit"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="avatarUrl" label="用户头像" width="100">
        <template #default="{ row }">
          <el-avatar :src="row.avatarUrl" alt="用户头像" />
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户账号" width="160" />
      <el-table-column prop="nickName" label="用户昵称" width="160" />
      <el-table-column prop="userStatus" label="账号状态" width="120">
        <template #default="{ row }">
          <user-status-tag :status="row.userStatus" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { ModeIdType } from '@/model/base.model'
import { getBindUser } from '@/api/tools.api'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import type { UserSimpleVo } from '@/model/system/user.model'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'DeptUserFrom' })
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

const { cellStyle, headerCellStyle } = useTableToolHooks()
const tableRef = useTemplateRef('tableRef')
const emits = defineEmits<{
  (e: 'change', user: UserSimpleVo): void
}>()
/**
 * 显示对话框
 */
const show = (deptId: ModeIdType) => {
  state.visibleStatus = true
  state.loadingStatus = true
  getBindUser(deptId)
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
const onSubmit = () => {
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
