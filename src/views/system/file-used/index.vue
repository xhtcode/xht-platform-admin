<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { Delete, Edit, Plus, Refresh, Search, VideoPause } from '@element-plus/icons-vue'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { disableSysFileUsed, querySysFileUsedPage, removeSysFileUsed } from '@/service/api/system/file-used.api'
import { fileAccessScopeEnum, fileWatermarkLevelEnum } from '@/service/enums/system/file.enum'
import { fileGateEnum, fileUsedBuiltInEnum, fileUsedEnabledEnum } from '@/service/enums/system/file-used.enum'
import type { SysFileUsedQueryRequest, SysFileUsedResponse } from '@/service/model/system/file-used.model'
import { sysFileUsedColumnOption } from '@/views/system/file-used/file-used.data'

defineOptions({ name: 'FileUsedViewIndex' })

const fileUsedForm = defineAsyncComponent(() => import('@/views/system/file-used/components/file-used-form.vue'))
const fileUsedFormRef = useTemplateRef('fileUsedFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const message = useMessage()

const state = reactive<TableQueryPageState<SysFileUsedQueryRequest, SysFileUsedResponse>>({
  queryParams: {}, // 查询参数（服务端固定按 sort、id 升序）
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
 * 停用用途
 *
 * @param row 用途记录
 */
const handleDisable = (row: SysFileUsedResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm(`停用后「${row.usedName}」将不能再被选用于新上传, 是否继续?`)
    .then(async () => {
      await disableSysFileUsed(row.id)
      await handlePageQuery()
      message.success('用途已停用')
    })
    .catch(() => {
      // 取消或失败（失败提示已由拦截器给出）
    })
    .finally(() => {
      state.loadingStatus = false
    })
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
            <el-input v-model="queryParams.usedCode" :maxlength="32" clearable placeholder="请输入编码（模糊）" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="用途名称" prop="usedName">
            <el-input v-model="queryParams.usedName" :maxlength="30" clearable placeholder="请输入名称（模糊）" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="状态" prop="enabled">
            <xht-enum-select v-model="queryParams.enabled" :data="fileUsedEnabledEnum" clearable placeholder="请选择状态" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="内置" prop="builtIn">
            <xht-enum-select v-model="queryParams.builtIn" :data="fileUsedBuiltInEnum" clearable placeholder="请选择内置标记" />
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
      <el-table-column v-if="columnOption.usedCode?.visible" label="用途编码" min-width="150" prop="usedCode" show-overflow-tooltip />
      <el-table-column v-if="columnOption.usedName?.visible" label="用途名称" min-width="150" prop="usedName" show-overflow-tooltip />
      <el-table-column v-if="columnOption.enabled?.visible" label="状态" prop="enabled" width="100">
        <template #default="{ row }">
          <xht-enum-tag :data="fileUsedEnabledEnum" :filter-label="row.enabled" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.accessScope?.visible" label="访问范围" prop="accessScope" width="110">
        <template #default="{ row }">
          <xht-enum-tag :data="fileAccessScopeEnum" :filter-label="row.accessScope" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.downloadAllowed?.visible" label="可下载" prop="downloadAllowed" width="100">
        <template #default="{ row }">
          <xht-enum-tag :data="fileGateEnum" :filter-label="row.downloadAllowed" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.printAllowed?.visible" label="可打印" prop="printAllowed" width="100">
        <template #default="{ row }">
          <xht-enum-tag :data="fileGateEnum" :filter-label="row.printAllowed" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.shareAllowed?.visible" label="可分享" prop="shareAllowed" width="100">
        <template #default="{ row }">
          <xht-enum-tag :data="fileGateEnum" :filter-label="row.shareAllowed" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.watermarkLevel?.visible" label="水印等级" prop="watermarkLevel" width="120">
        <template #default="{ row }">
          <xht-enum-tag :data="fileWatermarkLevelEnum" :filter-label="row.watermarkLevel" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.fileCount?.visible" label="引用文件数" prop="fileCount" width="120" />
      <el-table-column v-if="columnOption.builtIn?.visible" label="内置" prop="builtIn" width="90">
        <template #default="{ row }">
          <xht-enum-tag :data="fileUsedBuiltInEnum" :filter-label="row.builtIn" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.sort?.visible" label="排序" prop="sort" width="90" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysFileUsedResponse} -->
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button v-authorization="['sys:file:used:update']" :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button
              v-if="row.enabled === 1"
              v-authorization="['sys:file:used:disable']"
              :icon="VideoPause"
              link
              type="warning"
              @click="handleDisable(row)"
            >
              停用
            </el-button>
            <el-tooltip v-if="row.builtIn === 1" content="内置用途不允许删除" placement="top">
              <el-button :icon="Delete" link type="info" disabled>删除</el-button>
            </el-tooltip>
            <el-button v-else v-authorization="['sys:file:used:remove']" :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
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
