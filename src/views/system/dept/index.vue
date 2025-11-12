<template>
  <div class="xht-view-container">
    <div class="xht-view-main">
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
              <el-input
                v-model="queryParams.keyWord"
                placeholder="请输入关键字"
                :maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="text-center">
            <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
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
            <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-tool-bar
        v-model:show-search="state.searchStatus"
        v-model:column-data="columnOption"
        column-status
        refresh-status
        search-status
        @refresh="handleQuery"
      >
        <el-button icon="Plus" size="small" type="primary" @click="handleAdd">增加</el-button>
        <el-button icon="Sort" size="small" type="info" @click="handleExpandAll">
          折叠/展开
        </el-button>
      </table-tool-bar>
      <xht-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        class="flex-1"
        :default-expand-all="state.expandAllStatus"
        :tree-props="{ children: 'children' }"
        row-key="id"
        v-if="state.refreshTable"
      >
        <el-table-column
          label="部门名称"
          fixed="left"
          prop="deptName"
          min-width="260"
          v-if="columnOption.deptName?.visible"
        >
          <template #default="{ row }">
            {{ row.deptName }}
            <el-tag type="info" effect="plain">
              {{ row.deptCode }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="部门主管"
          prop="leaderName"
          min-width="160"
          align="center"
          v-if="columnOption.leaderName?.visible"
        />
        <el-table-column
          label="联系电话"
          prop="phone"
          min-width="160"
          align="center"
          v-if="columnOption.phone?.visible"
        />
        <el-table-column
          label="联系邮箱"
          prop="email"
          min-width="160"
          align="center"
          show-overflow-tooltip
          v-if="columnOption.email?.visible"
        >
          <template #default="{ row }">
            <ElLink>{{ row.email }}</ElLink>
          </template>
        </el-table-column>
        <el-table-column
          label="部门状态"
          prop="deptStatus"
          width="120"
          align="center"
          v-if="columnOption.deptStatus?.visible"
        >
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
        <el-table-column
          label="显示顺序"
          prop="deptSort"
          width="120"
          align="center"
          v-if="columnOption.deptSort?.visible"
        />
        <el-table-column
          label="部门描述"
          prop="remark"
          width="220"
          align="center"
          show-overflow-tooltip
          v-if="columnOption.remark?.visible"
        />
        <el-table-column
          label="创建人"
          prop="createBy"
          width="160"
          v-if="columnOption.createBy?.visible"
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="180"
          v-if="columnOption.createTime?.visible"
        />
        <el-table-column
          label="更新人"
          prop="updateBy"
          width="160"
          v-if="columnOption.updateBy?.visible"
        />
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="180"
          v-if="columnOption.updateTime?.visible"
        />
        <el-table-column fixed="right" label="操作" width="220px" align="center">
          <template #default="{ row }">
            <el-button icon="edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button icon="delete" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </xht-table>
    </div>
    <dept-form ref="deptFormRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import { querySysDeptTree, removeSysDeptById } from '@/service/api/system/dept.api'
import type {
  SysDeptQueryRequest,
  SysDeptResponse,
  SysDeptTreeResponse,
} from '@/service/model/system/dept.model'
import { DeptStatusEnums } from '@/service/model/system/dept.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { FormInstance } from 'element-plus'

import DeptForm from '@/views/system/dept/components/dept-form.vue'
import { SysDeptColumnOption } from '@/views/system/dept/dept.data'
import { ColumnConfig } from '@/components/table-tool-bar/types'

defineOptions({ name: 'SysDeptViewIndex' })
const deptFormRef = useTemplateRef('deptFormRef')

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
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const columnOption = ref<ColumnConfig<SysDeptResponse>>({
  ...SysDeptColumnOption,
})
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
  deptFormRef.value?.show('add', null)
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
