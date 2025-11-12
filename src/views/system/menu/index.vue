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
            <el-space>
              <el-button icon="Search" type="primary" @click="handleQuery()">查询</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-space>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="菜单类型" prop="menuType">
              <el-select v-model="queryParams.menuType" placeholder="请选择菜单类型" clearable>
                <el-option :value="MenuTypeEnums.M" label="目录" />
                <el-option :value="MenuTypeEnums.C" label="菜单" />
                <el-option :value="MenuTypeEnums.B" label="按钮" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="菜单状态" prop="menuStatus">
              <el-select v-model="queryParams.menuStatus" placeholder="请选择菜单状态" clearable>
                <el-option :value="MenuStatusEnums.NORMAL" label="正常" />
                <el-option :value="MenuStatusEnums.DISABLE" label="停用" />
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
        v-if="state.refreshTable"
        ref="tableRef"
        v-loading="state.loadingStatus"
        :default-expand-all="state.expandAllStatus"
        :data="state.tableList"
        :tree-props="{ children: 'children' }"
        row-key="id"
        class="flex-1"
      >
        <el-table-column
          label="菜单类型"
          fixed="left"
          min-width="160"
          prop="menuType"
          v-if="columnOption.menuType?.visible"
        >
          <template #default="{ row }">
            <el-tag
              :type="
                row.menuType === MenuTypeEnums.M
                  ? 'success'
                  : row.menuType === MenuTypeEnums.C
                    ? 'warning'
                    : 'info'
              "
            >
              {{
                row.menuType === MenuTypeEnums.M
                  ? '目录'
                  : row.menuType === MenuTypeEnums.C
                    ? '菜单'
                    : '按钮'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="left"
          :show-overflow-tooltip="true"
          label="菜单名称"
          prop="menuName"
          width="200"
          align="center"
          v-if="columnOption.menuName?.visible"
        />
        <el-table-column
          label="菜单图标"
          prop="menuIcon"
          min-width="120"
          align="center"
          v-if="columnOption.menuIcon?.visible"
        >
          <template #default="{ row }">
            <div
              :class="`icon-menu-${row.menuIcon}`"
              class="color-[var(--xht-svg-color)] text-16px"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="显示状态"
          prop="menuHidden"
          min-width="120"
          align="center"
          v-if="columnOption.menuHidden?.visible"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.menuHidden"
              active-text="显示"
              inline-prompt
              :active-value="MenuHiddenEnums.SHOW"
              :inactive-value="MenuHiddenEnums.HIDE"
              inactive-text="隐藏"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="缓存状态"
          prop="menuCache"
          min-width="120"
          align="center"
          v-if="columnOption.menuCache?.visible"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.menuCache"
              active-text="是"
              inline-prompt
              :active-value="MenuCacheEnums.YES"
              :inactive-value="MenuCacheEnums.NO"
              inactive-text="否"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="菜单状态"
          prop="menuStatus"
          min-width="120"
          align="center"
          v-if="columnOption.menuStatus?.visible"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.menuStatus"
              :active-value="MenuStatusEnums.NORMAL"
              active-text="正常"
              inline-prompt
              :inactive-value="MenuStatusEnums.DISABLE"
              inactive-text="停用"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="权限标识"
          prop="menuAuthority"
          min-
          width="150"
          align="center"
          v-if="columnOption.menuAuthority?.visible"
        />
        <el-table-column
          label="排序"
          min-width="80"
          prop="menuSort"
          align="center"
          v-if="columnOption.menuSort?.visible"
        />
        <el-table-column
          label="组件视图"
          min-width="360"
          width="400"
          prop="viewPath"
          align="center"
          show-overflow-tooltip
          v-if="columnOption.viewPath?.visible"
        >
          <template #default="{ row }">
            <ElTag v-if="row.viewName" type="warning">{{ row.viewName }}</ElTag>
            <ElLink v-if="row.viewName" type="primary">{{ row.viewPath }}</ElLink>
          </template>
        </el-table-column>
        <el-table-column
          label="外链"
          min-width="80"
          prop="frameFlag"
          align="center"
          v-if="columnOption.frameFlag?.visible"
        >
          <template #default="{ row }">
            <el-switch
              v-model="row.frameFlag"
              inline-prompt
              :active-value="MenuLinkEnums.YES"
              :inactive-value="MenuLinkEnums.NO"
              active-text="是"
              inactive-text="否"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="路由地址"
          prop="menuPath"
          min-width="220"
          width="260"
          align="center"
          show-overflow-tooltip
          v-if="columnOption.menuPath?.visible"
        >
          <template #default="{ row }">
            <el-link type="default">{{ row.menuPath }}</el-link>
          </template>
        </el-table-column>
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
    <menu-form ref="menuFormRef" @success="handleQuery()" />
  </div>
</template>

<script lang="ts" setup>
import { querySysMenuTree, removeSysMenuById } from '@/service/api/system/menu.api'
import type {
  SysMenuQueryRequest,
  SysMenuResponse,
  SysMenuTreeResponse,
} from '@/service/model/system/menu.model'
import {
  MenuCacheEnums,
  MenuHiddenEnums,
  MenuLinkEnums,
  MenuStatusEnums,
  MenuTypeEnums,
} from '@/service/model/system/menu.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { FormInstance } from 'element-plus'
import MenuForm from '@/views/system/menu/components/menu-form.vue'
import { SysMenuColumnOption } from '@/views/system/menu/menu.data'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

defineOptions({ name: 'SysMenuViewIndex' })

interface CrudOption {
  total: number
  pages: number
  loadingStatus: boolean
  refreshTable: boolean
  expandAllStatus: boolean
  searchStatus: boolean
  queryParams: SysMenuQueryRequest
  tableList: SysMenuTreeResponse
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
const tableRef = useTemplateRef('tableRef')
const menuFormRef = useTemplateRef('menuFormRef')
const columnOption = ref<ColumnConfig<SysMenuResponse>>({
  ...SysMenuColumnOption,
})
/**
 * 查询数据列表
 */
const handleQuery = async () => {
  state.loadingStatus = true
  querySysMenuTree(state.queryParams)
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
  menuFormRef.value?.show('add', null)
}
/**
 * 处理编辑
 */
const handleEdit = (row: SysMenuResponse) => {
  menuFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = async (row: any) => {
  state.loadingStatus = true
  await useMessageBox()
    .confirm('此操作将永久删除菜单, 是否继续?')
    .then(() => {
      removeSysMenuById(row.id).then(async () => {
        useMessage().success('删除菜单成功!')
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
