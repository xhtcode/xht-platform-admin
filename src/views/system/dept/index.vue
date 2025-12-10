<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
      <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-display" label-width="80px">
        <el-row v-if="!state.searchStatus">
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
            <el-button :icon="Search" type="primary" @click="handleQuery()">查询</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input v-model="queryParams.deptCode" placeholder="请输入部门编码" />
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="部门状态" prop="deptStatus">
              <el-select v-model="queryParams.deptStatus" placeholder="请选择部门状态">
                <el-option :value="DeptStatusEnums.NORMAL" label="正常" />
                <el-option :value="DeptStatusEnums.DISABLE" label="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
            <el-button :icon="Search" type="primary" @click="handleQuery()">查询</el-button>
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
        @refresh="handleQuery"
      >
        <el-button :icon="Plus" size="small" type="primary" @click="handleAdd">增加</el-button>
        <el-button :icon="Sort" size="small" type="info" @click="handleExpandAll">折叠/展开</el-button>
      </table-tool-bar>
      <xht-table
        v-if="state.refreshTable"
        v-loading="state.loadingStatus"
        :data="state.tableList"
        :default-expand-all="state.expandAllStatus"
        :cell-style="{ padding: '6px' }"
        :tree-props="{ children: 'children' }"
        class="flex-1"
        row-key="id"
      >
        <el-table-column v-if="columnOption.deptName?.visible" fixed="left" label="部门名称" min-width="260" prop="deptName">
          <template #default="{ row }">
            {{ row.deptName }}
            <el-tag effect="plain" type="info">
              {{ row.deptCode }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column v-if="columnOption.leaderName?.visible" align="center" label="部门主管" min-width="160" prop="leaderName" />
        <el-table-column v-if="columnOption.phone?.visible" align="center" label="联系电话" min-width="160" prop="phone" />
        <el-table-column v-if="columnOption.email?.visible" align="center" label="联系邮箱" min-width="160" prop="email" show-overflow-tooltip>
          <template #default="{ row }">
            <ElLink>{{ row.email }}</ElLink>
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.deptStatus?.visible" align="center" label="部门状态" prop="deptStatus" width="120">
          <template #default="{ row }">
            <el-switch
              :active-value="DeptStatusEnums.NORMAL"
              :inactive-value="DeptStatusEnums.DISABLE"
              :model-value="row.deptStatus"
              active-text="正常"
              inactive-text="停用"
              inline-prompt
            />
          </template>
        </el-table-column>
        <el-table-column v-if="columnOption.deptSort?.visible" align="center" label="显示顺序" prop="deptSort" width="120" />
        <el-table-column v-if="columnOption.remark?.visible" align="center" label="部门描述" prop="remark" show-overflow-tooltip width="220" />
        <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
        <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
        <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
        <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
        <el-table-column align="center" fixed="right" label="操作" width="220px">
          <template #default="{ row }">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </xht-table>
    </div>
    <dept-form ref="deptFormRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import { querySysDeptTree, removeSysDeptById } from '@/service/api/system/dept.api'
import type { SysDeptQueryRequest, SysDeptResponse, SysDeptTreeResponse } from '@/service/model/system/dept.model'
import { DeptStatusEnums } from '@/service/model/system/dept.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { FormInstance } from 'element-plus'
import { SysDeptColumnOption } from '@/views/system/dept/dept.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { Delete, Edit, Plus, Refresh, Search, Sort } from '@element-plus/icons-vue'

defineOptions({ name: 'SysDeptViewIndex' })

const deptForm = defineAsyncComponent(() => import('@/views/system/dept/components/dept-form.vue'))
const deptFormRef = useTemplateRef('deptFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

/**
 * 定义表格通用样式
 * @returns  css
 */
interface CrudOption {
  total: number
  pages: number
  loadingStatus: boolean
  refreshTable: boolean
  expandAllStatus: boolean
  searchStatus: boolean
  queryParams: SysDeptQueryRequest
  tableList: SysDeptTreeResponse
}

const state = reactive<CrudOption>({
  total: 0,
  pages: 1,
  loadingStatus: false,
  refreshTable: true,
  expandAllStatus: false,
  searchStatus: false,
  queryParams: {},
  tableList: [],
})

const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<SysDeptResponse>>({
  ...SysDeptColumnOption,
})
/**
 * 查询数据列表
 */
const handleQuery = async () => {
  try {
    state.loadingStatus = true
    const { data } = await querySysDeptTree(state.queryParams)
    state.tableList = data
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  await handleQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  deptFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysDeptResponse) => {
  deptFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row: any) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除部门, 是否继续?')
    .then(async () => {
      await removeSysDeptById(row.id)
      useMessage().success('删除部门成功!')
      await handleQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理展开/折叠
 */
const handleExpandAll = () => {
  state.refreshTable = false
  state.expandAllStatus = !state.expandAllStatus
  nextTick(() => {
    state.refreshTable = true
  })
}

onMounted(async () => {
  await handleQuery()
})
</script>

<style lang="scss" scoped></style>
