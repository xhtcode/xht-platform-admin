<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysDictItemQueryRequest, SysDictItemResponse } from '@/service/model/system/dict.item.model'
import { DictItemStatusEnums } from '@/service/model/system/dict.item.model'
import { querySysDictItemPage, removeSysDictItemById } from '@/service/api/system/dict.item.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ModeIdArrayType } from '@/service/model/base.model'
import { useRoute } from 'vue-router'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { SysDictItemColumnOption } from '@/views/system/dict-item/dict.item.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'

defineOptions({ name: 'SysDictItemViewIndex' })

const dictItemForm = defineAsyncComponent(() => import('@/views/system/dict-item/components/dict-item-form.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const dictItemFormRef = useTemplateRef('dictItemFormRef')

const route = useRoute()
const state = reactive<TableQueryPageState<SysDictItemQueryRequest, SysDictItemResponse>>({
  queryParams: {
    current: 1,
    size: 10,
    dictId: undefined,
  },
  loadingStatus: false,
  total: 0,
  pages: 0,
  tableList: [],
  selectedRows: [],
  singleStatus: true, // 单个禁用
  multipleStatus: true, // 多个禁用
})
const handleGetSysDictItemPage = (data: SysDictItemQueryRequest) => {
  state.queryParams.dictId = route.params?.id
  return querySysDictItemPage(data)
}
const { handleQuery, handleSelectionChange } = useTableQueryPageHooks<SysDictItemQueryRequest, SysDictItemResponse>(state, handleGetSysDictItemPage)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysDictItemResponse>>({
  ...SysDictItemColumnOption,
})

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
  dictItemFormRef.value?.show('create', null)
}

/**
 * 处理编辑
 */
const handleEdit = (row: SysDictItemResponse) => {
  dictItemFormRef.value?.show('update', row.id)
}

/**
 * 处理删除
 */
const handleDelete = (row?: SysDictItemResponse) => {
  state.loadingStatus = true
  let ids: ModeIdArrayType = []
  if (row) {
    ids = [row.id]
  } else {
    ids = state.selectedRows.map((item) => item.id)
  }
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择字典项数据')
    return
  }
  useMessageBox()
    .confirm('此操作将永久删除字典项, 是否继续?')
    .then(async () => {
      await removeSysDictItemById(ids)
      useMessage().success('删除字典项成功!')
      await handleQuery()
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

onMounted(async () => {
  await handleQuery()
})
</script>

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
            <el-button :icon="Search" type="primary" @click="handleQuery">查询</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="字典项Label" prop="itemLabel">
              <el-input v-model="queryParams.itemLabel" :maxlength="50" placeholder="请输入字典项标签" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="字典项Value" prop="itemValue">
              <el-input v-model="queryParams.itemValue" :maxlength="50" placeholder="请输入字典项值" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="字典项状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择字典项状态">
                <el-option :value="DictItemStatusEnums.ENABLED" label="启用" />
                <el-option :value="DictItemStatusEnums.DISABLED" label="禁用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
            <el-button :icon="Search" type="primary" @click="handleQuery">查询</el-button>
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
        <el-button :icon="Plus" size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button :disabled="state.singleStatus" :icon="Edit" size="small" type="success" @click="handleEdit(state.selectedRows[0])">修改</el-button>
        <el-button :disabled="state.multipleStatus" :icon="Delete" size="small" type="danger" @click="handleDelete(undefined)">批量删除</el-button>
      </table-tool-bar>
      <el-table
        v-loading="state.loadingStatus"
        :data="state.tableList"
        border
        row-key="id"
        empty-text="系统暂无字典项！"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <xht-column-index :current="queryParams.current" :size="queryParams.size" />
        <el-table-column label="字典项编码" prop="dictCode" width="160" />
        <el-table-column label="字典项标签" prop="itemLabel" width="160" />
        <el-table-column label="字典项值" prop="itemValue" width="160" />
        <el-table-column label="显示颜色" prop="itemColor" width="120">
          <template #default="{ row }">
            <div
              :style="{ background: row.itemColor }"
              style="width: 22px; height: 22px; border: 1px var(--xht-border-color) solid; margin: 0 auto; border-radius: 5px"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sortOrder" width="55" />
        <el-table-column label="描述" prop="remark" show-overflow-tooltip width="220" />
        <el-table-column label="状态" prop="status" width="160">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createBy" width="160" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="更新人" prop="updateBy" width="160" />
        <el-table-column label="更新时间" prop="updateTime" width="180" />
        <el-table-column fixed="right" label="操作" width="260px">
          <template #default="{ row }">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)">删除</el-button>
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
    <dict-item-form ref="dictItemFormRef" @success="handleQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
