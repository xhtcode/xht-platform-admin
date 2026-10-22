<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { BLogQueryRequest, BLogResponse } from '@/service/model/monitor/blog.model'
import { queryBLogPage } from '@/service/api/monitor/blog.api'
import { bLogExecuteStatusEnum } from '@/service/enums/monitor/blog.enum'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { bLogColumnOption } from '@/views/monitor/blog/blog.data'
import { View, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'BLogViewIndex' })

const blogDetail = defineAsyncComponent(() => import('@/views/monitor/blog/components/blog-detail.vue'))
const blogDetailRef = useTemplateRef('blogDetailRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<BLogQueryRequest, BLogResponse>>({
  queryParams: {
    descName: 'executeTime',
  }, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery } = useTableQueryPageHooks<BLogQueryRequest, BLogResponse>(state, queryBLogPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<BLogResponse>>({
  ...bLogColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理查看详情
 */
const handleDetail = (row: BLogResponse) => {
  blogDetailRef.value?.show(row)
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="日志名称" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入日志名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="服务名称" prop="serviceName">
            <el-input v-model="queryParams.serviceName" placeholder="请输入服务名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="链路ID" prop="traceId">
            <el-input v-model="queryParams.traceId" placeholder="请输入链路ID" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="执行状态" prop="executeStatus">
            <xht-enum-select v-model="queryParams.executeStatus" :data="bLogExecuteStatusEnum" clearable placeholder="请选择执行状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <table-tool-bar
      v-model:column-data="columnOption"
      v-model:show-search="state.searchStatus"
      column-status
      refresh-status
      search-status
      @refresh="resetQuery"
    />
    <el-table v-loading="state.loadingStatus" :data="state.tableList" border row-key="id" empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！">
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.title?.visible" label="日志模块" min-width="220" prop="title">
        <template #default="{ row }">
          <div class="log-title-cell">
            <span class="log-title">{{ row.title }}</span>
            <span v-if="row.logDesc" class="log-desc" :title="row.logDesc">{{ row.logDesc }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.serviceName?.visible" label="服务名称" min-width="140" prop="serviceName" show-overflow-tooltip />
      <el-table-column v-if="columnOption.classMethod?.visible" label="类名.方法名" min-width="200" prop="classMethod" show-overflow-tooltip />
      <el-table-column v-if="columnOption.executeAccount?.visible" label="执行账号" prop="executeAccount" width="140" show-overflow-tooltip />
      <el-table-column v-if="columnOption.executeCost?.visible" label="执行耗时" prop="executeCost" width="100" />
      <el-table-column v-if="columnOption.executeStatus?.visible" label="执行状态" prop="executeStatus" width="100">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.executeStatus" :data="bLogExecuteStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.executeTime?.visible" label="执行时间" prop="executeTime" width="180" />
      <el-table-column v-if="columnOption.traceId?.visible" label="链路ID" min-width="180" prop="traceId" show-overflow-tooltip />
      <!-- @vue-generic {BLogResponse} -->
      <el-table-column label="操作" fixed="right" width="90">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button icon="View" link type="primary" @click="handleDetail(row)">详情</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <xht-pagination
      v-model:current-page="state.queryParams.current"
      v-model:page-size="state.queryParams.size"
      :page-count="state.pages"
      :total="state.total"
      @pagination="handlePageQuery"
    />
    <blog-detail ref="blogDetailRef" />
  </div>
</template>

<style lang="scss" scoped>
.log-title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.log-title {
  flex-shrink: 0;
  max-width: 50%;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.log-desc {
  min-width: 0;
  padding-left: 8px;
  border-left: 1px solid var(--el-border-color);
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
