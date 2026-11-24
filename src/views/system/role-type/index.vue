<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysRoleTypeQueryRequest, SysRoleTypeResponse } from '@/service/model/system/role-type.model'
import { querySysRoleTypePage, removeSysRoleTypeById } from '@/service/api/system/role-type.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { roleTypeStatusEnum } from '@/service/enums/system/role-type.enum'
import { sysRoleTypeColumnOption } from '@/views/system/role-type/role-type.data'
import { Delete, Edit, Plus, Refresh, Search, Setting } from '@element-plus/icons-vue'

defineOptions({ name: 'SysRoleTypeViewIndex' })

const roleTypeForm = defineAsyncComponent(() => import('@/views/system/role-type/components/role-type-form.vue'))
const menuRoleTypeForm = defineAsyncComponent(() => import('@/views/system/role-type/components/menu-role-type-form.vue'))
const roleTypeFormRef = useTemplateRef('roleTypeFormRef')
const menuRoleTypeFormRef = useTemplateRef('menuRoleTypeFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysRoleTypeQueryRequest, SysRoleTypeResponse>>({
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
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysRoleTypeQueryRequest, SysRoleTypeResponse>(state, querySysRoleTypePage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysRoleTypeResponse>>({
  ...sysRoleTypeColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  roleTypeFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysRoleTypeResponse) => {
  roleTypeFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 *
 * 已分配角色的类型由后端拒绝删除，错误提示由请求拦截器统一给出
 */
const handleDelete = (row: SysRoleTypeResponse) => {
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将永久删除该角色类型, 是否继续?')
    .then(async () => {
      await removeSysRoleTypeById(row.id)
      await handlePageQuery()
      useMessage().success('删除角色类型成功!')
    })
    .catch((error) => console.error('删除角色类型失败:', error))
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理绑定菜单
 */
const handleBindMenu = (row: SysRoleTypeResponse) => {
  menuRoleTypeFormRef.value?.show(row.id, row.typeName)
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入编码/名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="类型编码" prop="typeCode">
            <el-input v-model="queryParams.typeCode" placeholder="请输入类型编码" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="类型名称" prop="typeName">
            <el-input v-model="queryParams.typeName" placeholder="请输入类型名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="状态" prop="typeStatus">
            <xht-enum-select v-model="queryParams.typeStatus" :data="roleTypeStatusEnum" clearable placeholder="请选择状态" />
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:roleType:create']">新增</el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column v-if="columnOption.typeCode?.visible" label="类型编码" min-width="160" prop="typeCode" />
      <el-table-column v-if="columnOption.typeName?.visible" label="类型名称" min-width="140" prop="typeName" />
      <el-table-column v-if="columnOption.typeStatus?.visible" align="center" label="类型状态" prop="typeStatus" width="100">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.typeStatus" :data="roleTypeStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.typeSort?.visible" label="显示顺序" prop="typeSort" width="100" />
      <el-table-column v-if="columnOption.remark?.visible" label="类型备注" min-width="180" prop="remark" show-overflow-tooltip />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysRoleTypeResponse} -->
      <el-table-column label="操作" fixed="right" width="240">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:roleType:updateById']">修改</el-button>
            <el-button :icon="Setting" link type="warning" @click="handleBindMenu(row)" v-authorization="['sys:roleType:menu:bind']">
              绑定菜单
            </el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:roleType:remove']">删除</el-button>
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
    <role-type-form ref="roleTypeFormRef" @success="handlePageQuery" />
    <menu-role-type-form ref="menuRoleTypeFormRef" />
  </div>
</template>

<style lang="scss" scoped></style>
