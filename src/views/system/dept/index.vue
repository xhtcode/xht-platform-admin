<template>
  <div class="main-container-none">
    <div class="main-container-auto main-container-view">
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        :model="queryParams"
        class="user-select-display"
        label-width="80px"
      >
        <el-row v-if="!state.searchStatus">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="queryParams.keyWord" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input v-model="queryParams.deptCode" placeholder="请输入部门编码" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="部门状态" prop="deptStatus">
              <el-select v-model="queryParams.deptStatus" placeholder="请选择部门状态">
                <el-option :value="DeptStatusEnums.NORMAL" label="正常" />
                <el-option :value="DeptStatusEnums.DISABLE" label="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery()"> 查询</el-button>
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
        @refresh="handleQuery"
      >
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">增加</el-button>
        <el-button icon="Sort" size="small" type="info" @click="handleExpandAll">
          折叠/展开
        </el-button>
      </table-tool-bar>
      <el-table
        v-if="state.refreshTable"
        ref="tableRef"
        v-loading="state.loadingStatus"
        :data="state.tableList"
        :default-expand-all="state.expandAllStatus"
        :header-cell-style="tableStyle.headerCellStyle"
        class="flex-1"
        :tree-props="{ children: 'children' }"
        row-key="id"
      >
        <el-table-column label="部门名称" fixed="left" prop="deptName" width="220">
          <template #default="{ row }">
            {{ row.deptName }}
            <el-tag type="info" effect="plain">
              {{ row.deptCode }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="部门主管" prop="leaderName" width="160" align="center" />
        <el-table-column label="联系电话" prop="phone" width="160" align="center" />
        <el-table-column label="联系邮箱" prop="email" width="160" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <ElLink>{{ row.email }}</ElLink>
          </template>
        </el-table-column>
        <el-table-column label="部门状态" prop="deptStatus" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.deptStatus"
              :active-value="DeptStatusEnums.NORMAL"
              active-text="正常"
              inline-prompt
              :inactive-value="DeptStatusEnums.DISABLE"
              inactive-text="停用"
            />
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" prop="deptSort" width="80" align="center" />
        <el-table-column label="部门描述" prop="remark" width="220" align="center" show-overflow-tooltip/>
        <el-table-column label="创建时间" prop="createTime" width="160" align="center" />
        <el-table-column label="更新时间" prop="updateTime" width="160" align="center" />
        <el-table-column label="创建人" prop="createBy" width="160" align="center" />
        <el-table-column label="更新人" prop="updateBy" width="160" align="center" />
        <el-table-column fixed="right" label="操作" width="220px" align="center">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-or-update ref="addUpdateRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import { querySysDeptTree, removeSysDeptById } from '@/api/system/dept.api'
import {
  DeptStatusEnums,
  SysDeptQueryRequest,
  SysDeptResponse,
  SysDeptTreeResponse,
} from '@/model/system/dept.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { FormInstance } from 'element-plus'
import { TableStyle } from '@/hooks/use-crud-hooks'
import AddOrUpdate from '@/views/system/dept/components/add-or-update.vue'

defineOptions({ name: 'SysDeptViewIndex' })
const addUpdateRef = ref()
/**
 * 定义表格通用样式
 * @returns  css
 */
const tableStyle: TableStyle = {
  cellStyle: { 'text-align': 'center' },
  headerCellStyle: {
    textAlign: 'center',
    background: 'var(--el-table-row-hover-bg-color)',
    color: 'var(--el-text-color-primary)',
    userSelect: 'none',
  },
}

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
const queryFormRef = ref<FormInstance>()
const tableRef = ref()

/**
 * 查询数据列表
 */
const handleQuery = async () => {
  state.loadingStatus = true
  querySysDeptTree(state.queryParams)
    .then((res) => {
      state.tableList = res.data
    })
    .finally(() => {
      state.loadingStatus = false
    })
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
  addUpdateRef.value?.show('add', null)
}
/**
 * 处理编辑
 */
const handleEdit = (row: SysDeptResponse) => {
  addUpdateRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = async (row: any) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除部门, 是否继续?')
    .then(() => {
      removeSysDeptById(row.id).then(async () => {
        useMessage().success('删除部门成功!')
        await handleQuery()
      })
    })
    .catch((_) => {})
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

<style scoped lang="scss"></style>
