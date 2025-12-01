<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
      <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="80px">
        <el-row>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="批次号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入生成批次号" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="模板分组" prop="groupId">
              <template-group-select v-model="queryParams.groupId" />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="生成时间" prop="generateTimeStart">
              <el-date-picker
                v-model="queryParams.generateTimeStart"
                placeholder="请选择开始时间"
                style="width: 100%"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="生成时间" prop="generateTimeEnd">
              <el-date-picker
                v-model="queryParams.generateTimeEnd"
                placeholder="请选择结束时间"
                style="width: 100%"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22" class="text-right">
            <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-tool-bar
        v-model:column-data="columnOption"
        v-model:show-search="state.searchStatus"
        column-status
        refresh-status
        @refresh="handleQuery"
      />
      <xht-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        class="flex-1"
        empty-text="系统相关日志！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <xht-column-index :current="queryParams.current" :size="queryParams.size" />
        <el-table-column align="center" label="生成批次号" prop="batchNo" />
        <el-table-column align="center" label="生成时间" prop="generateTime" />
        <el-table-column align="center" label="生成文件数量" prop="fileCount" />
        <el-table-column align="center" label="生成状态" prop="status" />
        <el-table-column align="center" label="错误信息" prop="errorMsg" />
      </xht-table>
      <xht-pagination
        v-model:current-page="state.queryParams.current"
        v-model:page-size="state.queryParams.size"
        :page-count="state.pages"
        :total="state.total"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { GenLogQueryRequest, GenLogResponse } from '@/service/model/generate/log.model'
import { queryGenLogPage } from '@/service/api/generate/log.api'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { GenDataSourceResponse } from '@/service/model/generate/datasource.model'
import { GenLogColumnOption } from '@/views/generate/log/log.data'

defineOptions({ name: 'GenLogViewIndex' })

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<GenLogQueryRequest, GenLogResponse>>({
  queryParams: {
    current: 1,
    size: 10,
  },
  loadingStatus: false,
  total: 0,
  pages: 0,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<GenLogQueryRequest, GenLogResponse>(state, queryGenLogPage)
const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<GenDataSourceResponse>>({
  ...GenLogColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  await handleQuery()
}

onMounted(async () => {
  await handleQuery()
})
</script>
<style lang="scss" scoped></style>
