<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysFileQueryRequest, SysFileResponse } from '@/service/model/system/file.model'
import { querySysFilePage, removeSysFileById } from '@/service/api/system/file.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysFileColumnOption } from '@/views/system/file/base.data'
import { handleDownloadSysFile } from '@/views/system/file/file.utils'
import { fileStatusEnum, fileStorageTypeEnum } from '@/service/enums/system/file.enum'
import { Delete, Document, Download, Refresh, Search, Upload, View } from '@element-plus/icons-vue'

defineOptions({ name: 'SysFileViewIndex' })

const fileUpload = defineAsyncComponent(() => import('@/views/system/file/components/file-upload.vue'))
const filePreview = defineAsyncComponent(() => import('@/views/system/file/components/file-preview.vue'))
const fileDetail = defineAsyncComponent(() => import('@/views/system/file/components/file-detail.vue'))
const sysFileUploadRef = useTemplateRef('sysFileUploadRef')
const sysFileDetailRef = useTemplateRef('sysFileDetailRef')
const sysFilePreviewRef = useTemplateRef('sysFilePreviewRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysFileQueryRequest, SysFileResponse>>({
  queryParams: {
    descName: 'createTime',
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
const { handlePageQuery } = useTableQueryPageHooks<SysFileQueryRequest, SysFileResponse>(state, querySysFilePage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysFileResponse>>({
  ...sysFileColumnOption,
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
 * 处理上传文件
 */
const handleUpload = () => {
  sysFileUploadRef.value?.show()
}

/**
 * 处理预览文件
 */
const handlePreview = (row: SysFileResponse) => {
  sysFilePreviewRef.value?.show(row)
}

/**
 * 处理详情文件
 */
const handleDetail = (row: SysFileResponse) => {
  sysFileDetailRef.value?.show(row)
}

/**
 * 处理下载文件
 */
const handleDownload = async (row: SysFileResponse) => {
  state.loadingStatus = true
  try {
    const successStatus = await handleDownloadSysFile(row.fileStorageKey)
    if (successStatus) {
      useMessage().success('文件下载成功!')
    }
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 处理删除文件记录
 */
const handleDelete = (row: SysFileResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将删除文件记录, 是否继续?')
    .then(async () => {
      await removeSysFileById(row.id)
      await handlePageQuery()
      useMessage().success('删除文件记录成功!')
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
          <el-form-item label="文件后缀" prop="fileSuffix">
            <el-input v-model="queryParams.fileSuffix" clearable :maxlength="50" show-word-limit placeholder="请输入文件后缀（精确查询）" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="存储key" prop="fileStorageKey">
            <el-input v-model="queryParams.fileStorageKey" clearable :maxlength="100" show-word-limit placeholder="请输入文件存储key" />
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
      <el-button :icon="Upload" size="small" type="primary" @click="handleUpload">上传文件</el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧"
    >
      <xht-column-index fixed="left" :current="queryParams.current" :size="queryParams.size" />
      <el-table-column
        v-if="columnOption.fileOriginalName?.visible"
        label="文件原始名称"
        prop="fileOriginalName"
        width="260"
        show-overflow-tooltip
      />
      <el-table-column v-if="columnOption.fileType?.visible" label="文件类型" prop="fileType" width="160" show-overflow-tooltip />
      <el-table-column v-if="columnOption.fileSuffix?.visible" label="文件后缀" prop="fileSuffix" width="100" />
      <el-table-column v-if="columnOption.fileSizeInfo?.visible" label="文件大小" prop="fileSizeInfo" width="120" />
      <el-table-column v-if="columnOption.fileStatus?.visible" label="文件状态" prop="fileStatus" width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.fileStatus" :data="fileStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.fileUsed?.visible" label="文件用途" prop="fileUsed" width="120" show-overflow-tooltip />
      <el-table-column v-if="columnOption.fileStorageType?.visible" label="存储类型" prop="fileStorageType" width="120">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.fileStorageType" :data="fileStorageTypeEnum" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnOption.fileStorageName?.visible"
        label="存储名称"
        prop="fileStorageName"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="columnOption.fileStorageKey?.visible"
        label="存储Key"
        prop="fileStorageKey"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="columnOption.fileStoragePath?.visible"
        label="存储路径"
        prop="fileStoragePath"
        width="240"
        show-overflow-tooltip
      />
      <el-table-column v-if="columnOption.fileHash?.visible" label="文件hash" prop="fileHash" width="220" show-overflow-tooltip />
      <el-table-column v-if="columnOption.fileUploadTime?.visible" label="上传时间" prop="fileUploadTime" width="180" />
      <el-table-column v-if="columnOption.fileUploadUser?.visible" label="上传用户" prop="fileUploadUser" width="120" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysFileResponse} -->
      <el-table-column label="操作" fixed="right" width="260">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="View" link type="primary" @click="handlePreview(row)">预览</el-button>
            <el-button :icon="Download" link type="primary" @click="handleDownload(row)">下载</el-button>
            <el-button :icon="Document" link type="success" @click="handleDetail(row)">详情</el-button>
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
    <file-upload ref="sysFileUploadRef" @success="handlePageQuery" />
    <file-preview ref="sysFilePreviewRef" />
    <file-detail ref="sysFileDetailRef" />
  </div>
</template>

<style lang="scss" scoped></style>
