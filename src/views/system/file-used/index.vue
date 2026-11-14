<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { querySysFileUsedPage, removeSysFileUsed } from '@/service/api/system/file-used.api'
import { fileUsedEnabledEnum } from '@/service/enums/system/file-used.enum'
import type { SysFileUsedQueryRequest, SysFileUsedResponse } from '@/service/model/system/file-used.model'
import { sysFileUsedColumnOption } from '@/views/system/file-used/file-used.data'

defineOptions({ name: 'FileUsedViewIndex' })

const fileUsedForm = defineAsyncComponent(() => import('@/views/system/file-used/components/file-used-form.vue'))
const fileUsedFormRef = useTemplateRef('fileUsedFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const message = useMessage()

const state = reactive<TableQueryPageState<SysFileUsedQueryRequest, SysFileUsedResponse>>({
  queryParams: {}, // 查询参数（服务端固定按 usedSort、id 升序）
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysFileUsedQueryRequest, SysFileUsedResponse>(state, querySysFileUsedPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysFileUsedResponse>>({ ...sysFileUsedColumnOption })

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 新增用途
 */
const handleAdd = () => {
  fileUsedFormRef.value?.show('create', null)
}

/**
 * 修改用途
 *
 * @param row 用途记录
 */
const handleEdit = (row: SysFileUsedResponse) => {
  fileUsedFormRef.value?.show('update', row.id)
}

/**
 * 删除用途（内置用途与有引用的用途不允许删除）
 *
 * @param row 用途记录
 */
const handleDelete = (row: SysFileUsedResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将删除用途「${row.usedName}」, 是否继续?`)
    .then(async () => {
      await removeSysFileUsed(row.id)
      await handlePageQuery()
      message.success('删除文件用途成功')
    })
    .catch(() => {
      // 取消、内置禁止删除或有引用（失败提示已由拦截器给出）
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="用途编码" prop="usedCode">
            <el-input v-model="queryParams.usedCode" :maxlength="32" clearable placeholder="请输入用途编码" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="用途名称" prop="usedName">
            <el-input v-model="queryParams.usedName" :maxlength="30" clearable placeholder="请输入用途名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="用途状态" prop="usedEnabled">
            <xht-enum-select v-model="queryParams.usedEnabled" :data="fileUsedEnabledEnum" clearable placeholder="请选择用途状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <table-tool-bar v-model:column-data="columnOption" v-model:show-search="state.searchStatus" column-status refresh-status @refresh="resetQuery">
      <el-button v-authorization="['sys:file:used:create']" :icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
      <el-button
        v-authorization="['sys:file:used:update']"
        :disabled="state.singleStatus"
        :icon="Edit"
        size="small"
        type="success"
        @click="handleEdit(state.selectedRows[0])"
      >
        修改
      </el-button>
    </table-tool-bar>

    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      empty-text="暂无文件用途配置"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" fixed="left" type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" fixed="left" />
      <el-table-column v-if="columnOption.usedCode?.visible" label="用途编码" min-width="160" prop="usedCode" show-overflow-tooltip />
      <el-table-column v-if="columnOption.usedName?.visible" label="用途名称" min-width="160" prop="usedName" show-overflow-tooltip />
      <el-table-column v-if="columnOption.usedEnabled?.visible" label="用途状态" prop="usedEnabled" width="100">
        <template #default="{ row }">
          <xht-enum-tag :data="fileUsedEnabledEnum" :filter-label="row.usedEnabled" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.usedSort?.visible" label="用途排序" prop="usedSort" width="100" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysFileUsedResponse} -->
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button v-authorization="['sys:file:used:update']" :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button v-authorization="['sys:file:used:remove']" :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
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
    <file-used-form ref="fileUsedFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
