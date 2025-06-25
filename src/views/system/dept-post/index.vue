<template>
  <div class="main-container-none">
    <split-panes>
      <split-pane-item min-size="20" size="20">
        <div class="h100">
          <dept-tree-click ref="deptTreeRef" @click-node="handleDeptClick" />
        </div>
      </split-pane-item>
      <split-pane-item min-size="80" size="80">
        <div class="main-container-auto main-container-view">
          <el-form
            ref="queryFormRef"
            :disabled="state.loadingStatus"
            :model="queryParams"
            class="user-select-display"
            label-width="80px"
          >
            <el-row v-if="!state.searchStatus">
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <el-form-item label="关键字" prop="keyWord">
                  <el-input v-model="queryParams.keyWord" placeholder="请输入关键字" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
                <el-button icon="Search" type="primary" @click="queryPostData">查询</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <el-form-item label="岗位编码" prop="postCode">
                  <el-input
                    class="w100"
                    v-model="queryParams.postCode"
                    :maxlength="50"
                    show-word-limit
                    placeholder="请输入岗位编码"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <el-form-item label="岗位名称" prop="postName">
                  <el-input
                    class="w100"
                    v-model="queryParams.postName"
                    :maxlength="50"
                    show-word-limit
                    placeholder="请输入岗位名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <el-form-item label="岗位状态" prop="postStatus">
                  <el-select
                    class="w100"
                    v-model="queryParams.postStatus"
                    placeholder="请选择岗位状态"
                  >
                    <el-option label="正常" :value="SysDeptPostStatusEnums.NORMAL" />
                    <el-option label="停用" :value="SysDeptPostStatusEnums.DISABLE" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
                <el-form-item label="系统内置" prop="systemFlag">
                  <el-select
                    class="w100"
                    v-model="queryParams.systemFlag"
                    placeholder="请选择系统内置"
                  >
                    <el-option label="正常" :value="SystemFlagEnums.YES" />
                    <el-option label="停用" :value="SystemFlagEnums.NO" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :offset="8" :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
                <el-button icon="Search" type="primary" @click="queryPostData">查询</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
          <table-tool-bar
            :column-data="[]"
            column-status
            refresh-status
            search-status
            v-model:show-search="state.searchStatus"
            @refresh="queryPostData"
          >
            <el-button icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
            <el-button
              icon="Edit"
              size="small"
              type="success"
              :disabled="state.singleStatus"
              @click="handleEdit(state.selectedRows[0])"
              >修改
            </el-button>
            <el-button
              icon="Delete"
              size="small"
              type="danger"
              :disabled="state.multipleStatus"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </table-tool-bar>
          <el-table
            v-loading="state.loadingStatus"
            :data="state.tableList"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            class="flex-1"
            current-row-key="id"
            border
            :empty-text="queryParams.deptId ? '该部门下未添加岗位信息' : '未选择要查询的部门'"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :index="createTableIndex" label="序号" type="index" width="55" />
            <el-table-column prop="postCode" label="岗位编码" width="120" />
            <el-table-column prop="postName" label="岗位名称" width="220" />
            <el-table-column prop="postLimit" label="员工统计" width="120">
              <template #default="{ row }">
                <el-tag :type="row.postHave >= row.postLimit ? 'danger' : 'success'">
                  {{ row.postHave }} /
                  {{ row.postLimit ? row.postLimit : '异常' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="postStatus" label="岗位状态" width="120">
              <template #default="{ row }">
                <el-tag v-if="row.postStatus === 0" type="success">启用</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="systemFlag" label="系统内置" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.systemFlag === 0" type="success">是</el-tag>
                <el-tag v-else type="danger">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="postSort" label="岗位排序" width="100" />
            <el-table-column prop="remark" label="岗位描述" width="260" show-overflow-tooltip />
            <el-table-column label="创建时间" prop="createTime" width="160" />
            <el-table-column label="更新时间" prop="updateTime" width="160" />
            <el-table-column label="创建人" prop="createBy" width="160" />
            <el-table-column label="更新人" prop="updateBy" width="160" />
            <el-table-column fixed="right" label="操作" width="260px">
              <template #default="{ row }">
                <el-button icon="edit" link type="success" @click="handleEdit(row)"
                  >修改
                </el-button>
                <el-button icon="delete" link type="danger" @click="handleDelete(row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <xht-pagination
            v-model:current-page="state.queryParams.current"
            v-model:page-size="state.queryParams.size"
            :page-count="state.pages"
            :total="state.total"
            @pagination="queryPostData"
          />
        </div>
      </split-pane-item>
      <add-or-update ref="addUpdateRef" @success="queryPostData" />
    </split-panes>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import {
  type TableQueryPageState,
  useTableQueryPageHooks,
  useTableToolHooks,
} from '@/hooks/use-crud-hooks'
import AddOrUpdate from './components/add-or-update.vue'
import type { SysDeptPostQueryRequest, SysDeptPostResponse } from '@/model/system/dept.post.model'
import { SysDeptPostStatusEnums } from '@/model/system/dept.post.model'
import {
  querySysDeptPostPage,
  removeSysDeptPostById,
  removeSysDeptPostByIds,
} from '@/api/system/dept.post.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { SysDeptResponse } from '@/model/system/dept.model'
import { SystemFlagEnums } from '@/model/base.model'

defineOptions({ name: 'SysDeptPostViewIndex' })

const state = reactive<TableQueryPageState<SysDeptPostQueryRequest, SysDeptPostResponse>>({
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
  SysDeptPostQueryRequest,
  SysDeptPostResponse
>(state, querySysDeptPostPage)
const { queryParams } = toRefs(state)

const queryFormRef = ref<FormInstance>()
const addUpdateRef = ref()
const deptTreeRef = ref()
const { cellStyle, headerCellStyle } = useTableToolHooks()
const queryPostData = async () => {
  await handleQuery()
}
/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  deptTreeRef.value?.resetHighlightCurrent()
  queryParams.value.deptId = undefined
  await queryPostData()
}
/**
 * 处理新增
 */
const handleAdd = () => {
  addUpdateRef.value?.show('add')
}

/**
 * 处理编辑
 */
const handleEdit = (row: any) => {
  addUpdateRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = async (row: any) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除部门岗位, 是否继续?')
    .then(() => {
      removeSysDeptPostById(row.id).then(async () => {
        useMessage().success('删除部门岗位成功!')
        await queryPostData()
      })
    })
    .catch((_) => {})
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择部门岗位数据')
  }
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将批量删除部门岗位, 是否继续?')
    .then(() => {
      removeSysDeptPostByIds(ids).then(async () => {
        useMessage().success('批量删除部门岗位成功!')
        await queryPostData()
      })
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 部门点击事件
 * @param data
 */
const handleDeptClick = (data: SysDeptResponse) => {
  queryParams.value.deptId = data.id
  queryPostData()
}
onMounted(async () => {})
</script>

<style lang="scss" scoped>
:deep(.splitpanes--vertical .splitpanes__splitter) {
  cursor: auto !important;
}
</style>
