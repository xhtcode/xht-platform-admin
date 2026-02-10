<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysDeptPostQueryRequest, SysDeptPostResponse } from '@/service/model/system/dept.post.model'
import { querySysDeptPostPage, removeSysDeptPostById, removeSysDeptPostByIds } from '@/service/api/system/dept.post.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { SysDeptResponse } from '@/service/model/system/dept.model'
import { SystemFlagEnums } from '@/service/model/base.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysDeptPostColumnOption } from '@/views/system/dept-post/dept.post.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { sysDeptPostStatusEnums } from '@/service/enums/system/dept.post.enum'

defineOptions({ name: 'SysDeptPostViewIndex' })

const deptPostForm = defineAsyncComponent(() => import('@/views/system/dept-post/components/dept-post-form.vue'))
const deptPostFormRef = useTemplateRef('deptPostFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const deptTreeRef = useTemplateRef('deptTreeRef')

const state = reactive<TableQueryPageState<SysDeptPostQueryRequest, SysDeptPostResponse>>({
  queryParams: {}, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysDeptPostQueryRequest, SysDeptPostResponse>(state, querySysDeptPostPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysDeptPostResponse>>({
  ...sysDeptPostColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  deptTreeRef.value?.resetHighlightCurrent()
  queryParams.value = {
    deptId: undefined,
  }
  await handlePageQuery()
}
/**
 * 处理新增
 */
const handleAdd = () => {
  deptPostFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysDeptPostResponse) => {
  deptPostFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row: SysDeptPostResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除部门岗位, 是否继续?')
    .then(async () => {
      await removeSysDeptPostById(row.id)
      useMessage().success('删除部门岗位成功!')
      await handlePageQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理批量删除
 */
const handleBatchDelete = () => {
  const ids = state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择部门岗位数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将批量删除部门岗位, 是否继续?')
    .then(async () => {
      await removeSysDeptPostByIds(ids)
      await handlePageQuery()
      useMessage().success('批量删除部门岗位成功!')
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
  handlePageQuery()
}
</script>

<template>
  <div class="h-full flex gap-1">
    <div class="xht-view-container-none flex-1 overflow-hidden">
      <dept-tree ref="deptTreeRef" @click-node="handleDeptClick" />
    </div>
    <div class="xht-view-container flex-[4]">
      <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
        <el-row v-if="!state.searchStatus">
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24" class="text-center">
            <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="岗位编码" prop="postCode">
              <el-input v-model="queryParams.postCode" :maxlength="50" class="w100" placeholder="请输入岗位编码" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="岗位名称" prop="postName">
              <el-input v-model="queryParams.postName" :maxlength="50" class="w100" placeholder="请输入岗位名称" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="岗位状态" prop="postStatus">
              <xht-enum-select v-model="queryParams.postStatus" :data="sysDeptPostStatusEnums" clearable placeholder="请选择岗位状态" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :sm="12" :xl="4" :xs="24">
            <el-form-item label="系统内置" prop="systemFlag">
              <el-select v-model="queryParams.systemFlag" class="w100" placeholder="请选择系统内置">
                <el-option :value="SystemFlagEnums.YES" label="正常" />
                <el-option :value="SystemFlagEnums.NO" label="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="8" :offset="8" :sm="12" :xl="4" :xs="24" class="text-center">
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
        <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:dict:create']">新增</el-button>
        <el-button
          :icon="Edit"
          size="small"
          type="success"
          :disabled="state.singleStatus"
          @click="handleEdit(state.selectedRows[0])"
          v-authorization="['sys:post:update']"
        >
          修改
        </el-button>
        <el-button
          :icon="Delete"
          size="small"
          type="danger"
          :disabled="state.multipleStatus"
          @click="handleBatchDelete"
          v-authorization="['sys:post:remove']"
        >
          批量删除
        </el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        border
        row-key="id"
        current-row-key="id"
        :empty-text="queryParams.deptId ? '该部门下未添加岗位信息' : '未选择要查询的部门'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <xht-column-index :current="queryParams.current" :size="queryParams.size" />
        <el-table-column v-if="columnOption.postCode?.visible" label="岗位编码" prop="postCode" width="120" />
        <el-table-column v-if="columnOption.postName?.visible" label="岗位名称" min-width="180" prop="postName" />
        <el-table-column v-if="columnOption.postLimit?.visible" label="员工统计" prop="postLimit" width="120">
          <template #default="{ row }">
            <el-tag :type="row.postHave >= row.postLimit ? 'danger' : 'success'">
              {{ row.postHave }} /
              {{ row.postLimit ? row.postLimit : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.postStatus?.visible" label="岗位状态" prop="postStatus" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.postStatus === 0" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.systemFlag?.visible" label="系统内置" prop="systemFlag" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.systemFlag === 0" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.postSort?.visible" label="岗位排序" prop="postSort" width="100" />
        <el-table-column v-if="columnOption.remark?.visible" label="岗位描述" min-width="220" prop="remark" show-overflow-tooltip />
        <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
        <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
        <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
        <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{ row }">
            <el-space wrap class="flex-center">
              <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:post:update']">修改</el-button>
              <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:post:remove']">删除</el-button>
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
    </div>
    <dept-post-form ref="deptPostFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
