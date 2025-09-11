<template>
  <div class="main-container-none">
    <split-panes :push-other-panes="false">
      <split-pane-item min-size="20" size="20">
        <div class="flex-center">
          <el-button>aaa</el-button>
          <el-button>aaa</el-button>
          <el-button>aaa</el-button>
        </div>
        <el-scrollbar>
          <template-group-tree @node-click="handleNodeClick" ref="templateGroupRef" />
        </el-scrollbar>
      </split-pane-item>
      <split-pane-item min-size="80" size="80">
        <div class="main-container-auto main-container-view">
          <el-form
            ref="queryFormRef"
            :disabled="state.loadingStatus"
            :model="queryParams"
            class="user-select-display"
            label-width="120px"
          >
            <el-row>
              <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
                <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
          <table-tool-bar
            v-model:show-search="state.searchStatus"
            :column-data="[]"
            column-status
            refresh-status
            search-status
            @refresh="handleQuery"
          >
            <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
            <el-button
              :disabled="state.singleStatus"
              icon="Edit"
              size="small"
              type="success"
              @click="handleEdit(state.selectedRows[0])"
            >
              修改
            </el-button>
            <el-button
              :disabled="state.multipleStatus"
              icon="Delete"
              size="small"
              type="danger"
              @click="handleDelete(undefined)"
            >
              批量删除
            </el-button>
          </table-tool-bar>
          <el-table
            v-loading="state.loadingStatus"
            :cell-style="cellStyle"
            :data="state.tableList"
            :header-cell-style="headerCellStyle"
            class="flex-1"
            empty-text="系统暂无相关模板信息！"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column :index="createTableIndex" label="序号" type="index" width="55" />
            <el-table-column label="模板名称" prop="name" />
            <el-table-column label="文件类型" prop="fileType" />
            <el-table-column label="文件路径模板" prop="filePathTemplate" />
            <el-table-column label="文件名模板" prop="fileNameTemplate" />
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column label="更新时间" prop="updateTime" />
            <el-table-column align="center" label="操作" width="220px">
              <template #default="{ row }">
                <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
                <el-button icon="delete" link type="danger" @click="handleDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <xht-pagination
            v-model:current-page="state.queryParams.current"
            v-model:page-size="state.queryParams.size"
            :page-count="state.pages"
            :total="state.total"
            @pagination="handleQuery"
          />
        </div>
      </split-pane-item>
    </split-panes>
    <template-from ref="templateFromRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks, useTableToolHooks } from '@/hooks/use-crud-hooks'
import TemplateFrom from './components/template-from.vue'
import type { GenTemplateQueryRequest, GenTemplateResponse } from '@/model/generate/template.model'
import { queryGenTemplatePage, removeGenTemplateByIds } from '@/api/generate/template.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ModeIdArrayType } from '@/model/base.model'
import TemplateGroupTree from '@/views/generate/template/components/template-group-tree.vue'
import type { GenTemplateGroupResponse } from '@/model/generate/template.group.model'

defineOptions({ name: 'GenTemplateViewIndex' })

const state = reactive<TableQueryPageState<GenTemplateQueryRequest, GenTemplateResponse>>({
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
const { createTableIndex, handleQuery, handleSelectionChange } = useTableQueryPageHooks<
  GenTemplateQueryRequest,
  GenTemplateResponse
>(state, queryGenTemplatePage)
const { queryParams } = toRefs(state)

const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const templateGroupRef = useTemplateRef('templateGroupRef')
const templateFromRef = useTemplateRef('templateFromRef')
const { cellStyle, headerCellStyle } = useTableToolHooks()

/**
 * 重置表单
 */
const resetQuery = async () => {
  templateGroupRef.value?.resetHighlightCurrent()
  queryFormRef.value?.resetFields()
  await handleQuery()
}
/**
 * 处理新增
 */
const handleAdd = () => {
  templateFromRef.value?.show('add', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: GenTemplateResponse) => {
  templateFromRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = async (row?: GenTemplateResponse) => {
  state.loadingStatus = true
  let ids: ModeIdArrayType = []
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows.map((item) => item.id)
  }
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择模板信息数据')
    return
  }
  await useMessageBox()
    .confirm('此操作将永久删除模板信息, 是否继续?')
    .then(() => {
      removeGenTemplateByIds(ids).then(async () => {
        useMessage().success('删除模板信息成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}
const handleNodeClick = async (data: GenTemplateGroupResponse) => {
  queryParams.value.groupId = data.id
  await handleQuery()
}
onMounted(async () => {
  await handleQuery()
})
</script>
<style lang="scss" scoped></style>
