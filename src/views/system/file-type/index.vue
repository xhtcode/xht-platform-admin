<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { querySysFileTypePage, removeSysFileTypeById } from '@/service/api/system/file-type.api'
import { filePreviewSourceEnum, filePreviewTypeEnum } from '@/service/enums/system/file.enum'
import type { SysFileTypeQueryRequest, SysFileTypeResponse } from '@/service/model/system/file-type.model'
import { sysFileTypeColumnOption } from '@/views/system/file-type/file-type.data'

defineOptions({ name: 'SysFileTypeViewIndex' })

const fileTypeForm = defineAsyncComponent(() => import('@/views/system/file-type/components/file-type-form.vue'))
const fileTypeFormRef = useTemplateRef('fileTypeFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysFileTypeQueryRequest, SysFileTypeResponse>>({
  queryParams: {}, // 查询参数（后端默认按 id 升序）
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysFileTypeQueryRequest, SysFileTypeResponse>(state, querySysFileTypePage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysFileTypeResponse>>({
  ...sysFileTypeColumnOption,
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
 * 新增预览类型配置
 */
const handleAdd = () => {
  fileTypeFormRef.value?.show('create', null)
}

/**
 * 修改预览类型配置
 */
const handleEdit = (row: SysFileTypeResponse) => {
  fileTypeFormRef.value?.show('update', row.id)
}

/**
 * 删除预览类型配置
 */
const handleDelete = (row: SysFileTypeResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将删除文件后缀「${row.fileSuffix ?? '未配置'}」的预览类型配置, 是否继续?`)
    .then(async () => {
      await removeSysFileTypeById(row.id)
      await handlePageQuery()
      useMessage().success('删除预览类型配置成功!')
    })
    .catch(() => {
      // 取消删除或删除失败（失败提示已由请求拦截器给出），不做处理
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
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="110px">
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="预览类型" prop="previewType">
            <xht-enum-select v-model="queryParams.previewType" :data="filePreviewTypeEnum" clearable placeholder="请选择预览类型" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="预览类型名称" prop="previewName">
            <el-input v-model="queryParams.previewName" :maxlength="30" clearable placeholder="请输入名称（模糊）" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="文件后缀" prop="fileSuffix">
            <el-input v-model="queryParams.fileSuffix" :maxlength="30" clearable placeholder="请输入后缀（精确）" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <table-tool-bar v-model:column-data="columnOption" v-model:show-search="state.searchStatus" column-status refresh-status @refresh="resetQuery">
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
      <el-button :disabled="state.singleStatus" :icon="Edit" size="small" type="success" @click="handleEdit(state.selectedRows[0])">修改</el-button>
    </table-tool-bar>

    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" fixed="left" type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" fixed="left" />
      <el-table-column v-if="columnOption.previewType?.visible" label="预览类型" prop="previewType" width="120">
        <template #default="{ row }">
          <xht-enum-tag :data="filePreviewTypeEnum" :filter-label="row.previewType" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.previewName?.visible" label="预览类型名称" min-width="180" prop="previewName" show-overflow-tooltip />
      <el-table-column v-if="columnOption.fileSuffix?.visible" label="文件后缀" prop="fileSuffix" width="140">
        <template #default="{ row }">
          {{ row.fileSuffix || '未配置' }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.previewSource?.visible" label="预览来源" prop="previewSource" width="120">
        <template #default="{ row }">
          <xht-enum-tag :data="filePreviewSourceEnum" :filter-label="row.previewSource || 'original'" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.convertTarget?.visible" label="转换目标" prop="convertTarget" width="110">
        <template #default="{ row }">{{ row.convertTarget || '—' }}</template>
      </el-table-column>
      <el-table-column v-if="columnOption.enabled?.visible" label="状态" prop="enabled" width="100">
        <template #default="{ row }">
          <el-tag :type="row.enabled === 0 ? 'info' : 'success'" size="small">{{ row.enabled === 0 ? '停用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.sort?.visible" label="排序" prop="sort" width="90" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="140" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="140" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysFileTypeResponse} -->
      <el-table-column fixed="right" label="操作" width="160">
        <template #default="{ row }">
          <el-space class="flex-center" wrap>
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
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
    <file-type-form ref="fileTypeFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped>
.file-suffix-empty {
  color: var(--el-text-color-secondary);
}
</style>
