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
              <el-form-item label="操作模块" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入操作模块" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作人员" prop="operName">
                <el-input v-model="queryParams.operName" placeholder="请输入操作人员" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作类型" prop="businessType">
                <el-select
                  v-model="queryParams.businessType"
                  placeholder="请选择操作类型"
                  clearable
                >
                  <el-option :value="0" label="其它" />
                  <el-option :value="1" label="新增" />
                  <el-option :value="2" label="修改" />
                  <el-option :value="3" label="删除" />
                  <el-option :value="4" label="授权" />
                  <el-option :value="5" label="导出" />
                  <el-option :value="6" label="导入" />
                  <el-option :value="7" label="强退" />
                  <el-option :value="8" label="生成代码" />
                  <el-option :value="9" label="清空数据" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择操作状态" clearable>
                  <el-option :value="0" label="成功" />
                  <el-option :value="1" label="失败" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作时间" prop="operTime">
                <el-date-picker
                  v-model="queryParams.operTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="!footerStatus" :span="6" class="text-center">
              <el-button icon="Search" type="primary" @click="handleQuery">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
        </template>
      </xht-card>
    </el-form>
    <div class="main-container-auto main-container-view">
      <table-tool-bar refresh-status search-status @refresh="handleQuery">
        <el-button icon="Delete" type="danger" @click="handleClean">清空</el-button>
        <el-button icon="Download" type="warning" @click="handleExport">导出</el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        :header-cell-style="tableStyle.headerCellStyle"
        :cell-style="tableStyle.cellStyle"
      >
        <el-table-column label="日志编号" prop="operId" width="100" />
        <el-table-column label="操作模块" prop="title" min-width="120" />
        <el-table-column label="操作类型" prop="businessType" width="100">
          <template #default="{ row }">
            <el-tag :type="getBusinessTypeTag(row.businessType)">
              {{ getBusinessTypeLabel(row.businessType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求方式" prop="requestMethod" width="100" />
        <el-table-column label="操作人员" prop="operName" min-width="120" />
        <el-table-column label="操作地址" prop="operIp" min-width="120" />
        <el-table-column label="操作地点" prop="operLocation" min-width="120" />
        <el-table-column label="操作状态" prop="status" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="operTime" min-width="180" />
        <el-table-column fixed="right" label="操作" width="120px">
          <template #default="{ row }">
            <el-button icon="view" link type="primary" @click="handleDetail(row)">详细</el-button>
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

defineOptions({ name: 'SysOperLogViewIndex' })

interface QueryParams {
  pageNum: number
  pageSize: number
  title?: string
  operName?: string
  businessType?: number
  status?: number
  operTime?: string[]
}

interface State {
  loadingStatus: boolean
  total: number
  tableList: any[]
}

const state = reactive<State>({
  loadingStatus: false,
  total: 0,
  tableList: [],
})

const queryParams = reactive<QueryParams>({
  pageNum: 1,
  pageSize: 10,
})

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

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
 * 获取操作类型标签
 */
const getBusinessTypeLabel = (type: number) => {
  const types: Record<number, string> = {
    0: '其它',
    1: '新增',
    2: '修改',
    3: '删除',
    4: '授权',
    5: '导出',
    6: '导入',
    7: '强退',
    8: '生成代码',
    9: '清空数据',
  }
  return types[type] || '其它'
}

/**
 * 获取操作类型标签样式
 */
const getBusinessTypeTag = (type: number): any => {
  const types: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'primary',
    5: 'success',
    6: 'warning',
    7: 'danger',
    8: 'primary',
    9: 'danger',
  }
  return types[type] || 'info'
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
 * 处理清空
 */
const handleClean = () => {
  useMessageBox()
    .confirm('是否确认清空所有操作日志数据项?')
    .then(() => {
      // TODO: 调用清空接口
      console.log('清空日志')
    })
    .catch(() => {})
}

/**
 * 处理导出
 */
const handleExport = () => {
  // TODO: 调用导出接口
  console.log('导出日志')
}

/**
 * 处理详细
 */
const handleDetail = (row: any) => {
  // TODO: 显示详细信息
  console.log('查看详情', row)
}

onMounted(async () => {
  await handleQuery()
})
</script>

<style scoped lang="scss"></style>
