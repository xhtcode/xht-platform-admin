<template>
  <div class="main-container-none">
    <el-form
      ref="queryFormRef"
      :disabled="state.loadingStatus"
      :model="queryParams"
      class="user-select-display"
      label-width="100px"
    >
      <xht-card>
        <template #default="{ footerStatus }">
          <el-row>
            <el-col :span="6">
              <el-form-item label="IP地址" prop="ipaddr">
                <el-input v-model="queryParams.ipaddr" placeholder="请输入IP地址" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="text-center" v-if="!footerStatus">
              <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
        </template>
      </xht-card>
    </el-form>
    <div class="main-container-auto main-container-view">
      <table-tool-bar
        :column-data="[]"
        column-status
        refresh-status
        search-status
        @refresh="handleQuery"
      >
        <el-button
          icon="Delete"
          type="danger"
          :disabled="!state.selectedRows.length"
          @click="handleBatchForceLogout"
        >
          批量强退
        </el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        :header-cell-style="tableStyle.headerCellStyle"
        :cell-style="tableStyle.cellStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="会话编号" prop="tokenId" min-width="220" />
        <el-table-column label="用户名称" prop="userName" min-width="120" />
        <el-table-column label="部门" prop="deptName" min-width="120" />
        <el-table-column label="主机" prop="ipaddr" min-width="120" />
        <el-table-column label="登录地点" prop="loginLocation" min-width="120" />
        <el-table-column label="浏览器" prop="browser" min-width="120" />
        <el-table-column label="操作系统" prop="os" min-width="120" />
        <el-table-column label="登录时间" prop="loginTime" min-width="180" />
        <el-table-column fixed="right" label="操作" width="120px">
          <template #default="{ row }">
            <el-button icon="delete" link type="danger" @click="handleForceLogout(row)"
              >强退
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="state.total > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="state.total"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useMessageBox } from '@/hooks/use-message'

defineOptions({ name: 'SysUserOnlineViewIndex' })

interface QueryParams {
  pageNum: number
  pageSize: number
  ipaddr?: string
  userName?: string
}

interface State {
  loadingStatus: boolean
  total: number
  tableList: any[]
  selectedRows: any[]
}

const state = reactive<State>({
  loadingStatus: false,
  total: 0,
  tableList: [],
  selectedRows: [],
})

const queryParams = reactive<QueryParams>({
  pageNum: 1,
  pageSize: 10,
})

const queryFormRef = ref<FormInstance>()

const tableStyle: TableStyle = {
  cellStyle: { 'text-align': 'center' },
  headerCellStyle: {
    textAlign: 'center',
    background: 'var(--el-table-row-hover-bg-color)',
    color: 'var(--el-text-color-primary)',
    userSelect: 'none',
  },
}

/**
 * 查询数据列表
 */
const handleQuery = async () => {
  state.loadingStatus = true
  try {
    // TODO: 调用查询接口
    state.loadingStatus = false
  } catch (error) {
    state.loadingStatus = false
  }
}

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  await handleQuery()
}

/**
 * 处理选择变化
 */
const handleSelectionChange = (selection: any[]) => {
  state.selectedRows = selection
}

/**
 * 处理强退
 */
const handleForceLogout = (row: any) => {
  useMessageBox()
    .confirm('是否确认强退该用户?')
    .then(() => {
      // TODO: 调用强退接口
      console.log('强退', row)
    })
    .catch(() => {})
}

/**
 * 处理批量强退
 */
const handleBatchForceLogout = () => {
  useMessageBox()
    .confirm('是否确认强退选中的用户?')
    .then(() => {
      // TODO: 调用批量强退接口
      console.log('批量强退', state.selectedRows)
    })
    .catch(() => {})
}

onMounted(async () => {
  await handleQuery()
})
</script>

<style scoped lang="scss"></style>
