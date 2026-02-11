<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysNoticeQueryRequest, SysNoticeResponse } from '@/service/model/notice/base.model'
import {
  querySysNoticePage,
  removeSysNoticeById,
  updateSysNoticePublish,
  updateSysNoticeTop,
  updateSysNoticeUnderShelve,
} from '@/service/api/notice/base.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysNoticeColumnOption } from '@/views/notice/base/base.data'
import { BottomLeft, Delete, Edit, Plus, Refresh, Search, TopRight } from '@element-plus/icons-vue'
import { noticeJumpTypeEnums, noticeStatusEnums, noticeTimedPublishEnums, noticeTopEnums } from '@/service/enums/system/notice.enum'

defineOptions({ name: 'SysNoticeView' })

const noticeBaseFrom = defineAsyncComponent(() => import('@/views/notice/base/components/base-from.vue'))
const sysNoticeFormRef = useTemplateRef('sysNoticeFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysNoticeQueryRequest, SysNoticeResponse>>({
  queryParams: {
    descName: 't1.createTime',
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
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysNoticeQueryRequest, SysNoticeResponse>(state, querySysNoticePage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysNoticeResponse>>({
  ...sysNoticeColumnOption,
})

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理新增通知
 */
const handleAdd = () => {
  sysNoticeFormRef.value?.show('create', null)
}

/**
 * 处理编辑通知
 */
const handleEdit = (row: SysNoticeResponse) => {
  sysNoticeFormRef.value?.show('update', row.id)
}

/**
 * 处理删除通知
 */
const handleDelete = (row: SysNoticeResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除通知, 是否继续?')
    .then(async () => {
      await removeSysNoticeById(row.id)
      await handlePageQuery()
      useMessage().success('删除通知成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 发布通知
 */
const handleSysNoticePublish = (row: SysNoticeResponse) => {
  if (row && row.noticeStatus === noticeStatusEnums.NOT_PUBLISH.value) {
    state.loadingStatus = true
    useMessageBox()
      .confirm('此操作将发布通知, 是否继续?')
      .then(async () => {
        await updateSysNoticePublish(row.id)
        useMessage().success('通知发布成功!')
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
}

/**
 * 下架通知
 */
const handleSysNoticeUnderShelve = (row: SysNoticeResponse) => {
  if (row && row.noticeStatus === noticeStatusEnums.PUBLISH.value) {
    state.loadingStatus = true
    useMessageBox()
      .confirm('此操作将下架通知, 是否继续?')
      .then(async () => {
        await updateSysNoticeUnderShelve(row.id)
        useMessage().success('通知下架成功!')
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
}

/**
 * 置顶通知
 */
const handleSysNoticeTop = (row: SysNoticeResponse) => {
  if (row) {
    state.loadingStatus = true
    const noticeTop = row.noticeTop === noticeTopEnums.NO.value ? noticeTopEnums.NO.operate : noticeTopEnums.YES.operate
    useMessageBox()
      .confirm(`此操作通知将${noticeTop}, 是否继续?`)
      .then(async () => {
        await updateSysNoticeTop(row.id, row.noticeTop)
        useMessage().success(`通知${noticeTop}成功!`)
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
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
          <el-form-item label="通知标题" prop="noticeTitle">
            <el-input v-model="queryParams.noticeTitle" clearable :maxlength="100" show-word-limit placeholder="请输入通知标题" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="发布开始时间" prop="noticePublishTimeStart">
            <el-date-picker
              v-model="queryParams.noticePublishTimeStart"
              format="YYYY-MM-DD"
              placeholder="选择发布开始时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="发布结束时间" prop="noticePublishTimeEnd">
            <el-date-picker
              v-model="queryParams.noticePublishTimeEnd"
              format="YYYY-MM-DD"
              placeholder="选择发布结束时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="过期开始时间" prop="noticeExpireTimeStart">
            <el-date-picker
              v-model="queryParams.noticeExpireTimeStart"
              format="YYYY-MM-DD"
              placeholder="选择过期开始时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="过期结束时间" prop="noticeExpireTimeEnd">
            <el-date-picker
              v-model="queryParams.noticeExpireTimeEnd"
              format="YYYY-MM-DD"
              placeholder="选择过期结束时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="下架开始时间" prop="noticeOfflineTimeStart">
            <el-date-picker
              v-model="queryParams.noticeOfflineTimeStart"
              format="YYYY-MM-DD"
              placeholder="选择下架开始时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="下架结束时间" prop="noticeOfflineTimeEnd">
            <el-date-picker
              v-model="queryParams.noticeOfflineTimeEnd"
              format="YYYY-MM-DD"
              placeholder="选择下架结束时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
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
    >
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:notice:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['sys:notice:update']"
      >
        修改
      </el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed="left" align="center" type="selection" width="55" />
      <xht-column-index fixed="left" :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.noticeTypeName?.visible" label="通知类型" prop="noticeTypeName" width="120" />
      <el-table-column v-if="columnOption.noticeTitle?.visible" label="通知标题" prop="noticeTitle" width="260" show-overflow-tooltip />
      <el-table-column v-if="columnOption.noticeSummary?.visible" label="通知摘要" prop="noticeSummary" width="360" show-overflow-tooltip />
      <el-table-column v-if="columnOption.noticeStatus?.visible" label="通知状态" prop="noticeStatus" width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.noticeStatus" :data="noticeStatusEnums" placeholder="请选择通知状态" disabled />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.noticeOrder?.visible" label="通知排序" prop="noticeOrder" width="120" />
      <el-table-column v-if="columnOption.noticeTop?.visible" label="置顶状态" prop="noticeTop" width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.noticeTop" :data="noticeTopEnums" placeholder="请选择通知状态" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.noticeTimedPublish?.visible" label="定时发布" prop="noticeTimedPublish" width="180">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.noticeTimedPublish" :data="noticeTimedPublishEnums" placeholder="请选择通知状态" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.noticePublishTime?.visible" label="发布时间" prop="noticePublishTime" width="180" />
      <el-table-column v-if="columnOption.noticeExpireTime?.visible" label="过期时间" prop="noticeExpireTime" width="180" />
      <el-table-column v-if="columnOption.noticeOfflineTime?.visible" label="下架时间" prop="noticeOfflineTime" width="180" />
      <el-table-column v-if="columnOption.noticeJumpType?.visible" label="跳转类型" prop="noticeJumpType" width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.noticeJumpType" :data="noticeJumpTypeEnums" placeholder="请选择通知状态" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.noticeJumpUrl?.visible" label="跳转地址" prop="noticeJumpUrl" width="160" show-overflow-tooltip />
      <el-table-column v-if="columnOption.noticeReadCount?.visible" label="已读人数" prop="noticeReadCount" width="120" />
      <el-table-column v-if="columnOption.noticeClickCount?.visible" label="点击次数" prop="noticeClickCount" width="120" />
      <el-table-column v-if="columnOption.noticeRemark?.visible" label="备注" prop="noticeRemark" width="260" show-overflow-tooltip />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="TopRight" link type="warning" v-authorization="['sys:notice:update']" @click="handleSysNoticeTop(row)">置顶</el-button>
            <el-button
              :icon="TopRight"
              link
              type="primary"
              v-if="row.noticeStatus === noticeStatusEnums.NOT_PUBLISH.value"
              v-authorization="['sys:notice:update']"
              @click="handleSysNoticePublish(row)"
            >
              发布
            </el-button>
            <el-button
              :icon="BottomLeft"
              link
              type="primary"
              v-if="row.noticeStatus === noticeStatusEnums.PUBLISH.value"
              v-authorization="['sys:notice:update']"
              @click="handleSysNoticeUnderShelve(row)"
            >
              下架
            </el-button>
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:notice:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:notice:remove']">删除</el-button>
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
    <notice-base-from ref="sysNoticeFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
