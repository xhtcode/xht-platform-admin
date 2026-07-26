<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type { SysDictItemQueryRequest, SysDictItemResponse } from '@/service/model/system/dict.item.model'
import { querySysDictItemPage, removeSysDictItemById } from '@/service/api/system/dict.item.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { useRoute } from 'vue-router'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysDictItemColumnOption } from '@/views/system/dict-item/dict.item.data'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { sysDictStatusEnum } from '@/service/enums/system/dict.enum'

defineOptions({ name: 'SysDictItemViewIndex' })

const dictItemForm = defineAsyncComponent(() => import('@/views/system/dict-item/components/dict-item-form.vue'))
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const dictItemFormRef = useTemplateRef('dictItemFormRef')

const route = useRoute()
const state = reactive<TableQueryPageState<SysDictItemQueryRequest, SysDictItemResponse>>({
  queryParams: {
    dictId: undefined,
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

const handleGetSysDictItemPage = (data?: SysDictItemQueryRequest) => {
  state.queryParams.dictId = route.params?.id
  return querySysDictItemPage(data)
}

const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysDictItemQueryRequest, SysDictItemResponse>(
  state,
  handleGetSysDictItemPage
)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysDictItemResponse>>({
  ...sysDictItemColumnOption,
})

/**
 * 重置表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {
    dictId: route.params?.id,
  }
  await handlePageQuery()
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
      await handlePageQuery()
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
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
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
            <xht-enum-select v-model="queryParams.status" :data="sysDictStatusEnum" clearable placeholder="请选择字典项状态" />
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:dict:item:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['sys:dict:item:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleDelete(undefined)"
        v-authorization="['sys:dict:item:remove']"
      >
        批量删除
      </el-button>
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
      <!-- @vue-generic {SysDictItemResponse} -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:dict:item:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:dict:item:remove']">删除</el-button>
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
    <dict-item-form ref="dictItemFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
