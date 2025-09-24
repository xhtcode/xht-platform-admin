<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    title="导入表结构"
    size="75%"
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="queryParams"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="表名" prop="tableName">
            <el-input v-model="queryParams.tableName" placeholder="请输入表名" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数据库" prop="dataSourceId">
            <datasource-select v-model="queryParams.dataSourceId" placeholder="请选择配置名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: center">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="tableRef"
      v-loading="state.loadingStatus"
      :cell-style="tableStyle.cellStyle"
      :data="state.tableList"
      height="65vh"
      :header-cell-style="tableStyle.headerCellStyle"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :index="createTableIndex" label="序号" type="index" width="55" />
      <el-table-column label="表名" prop="tableName" />
      <el-table-column label="引擎" prop="engineName" />
      <el-table-column label="描述" prop="tableComment" />
      <el-table-column label="创建时间" prop="tableCreateTime" />
      <el-table-column label="更新时间" prop="tableUpdateTime" />
    </el-table>
    <template #footer>
      <el-button
        :disabled="state.loadingStatus || (state.checkData && state.checkData.length === 0)"
        type="primary"
        @click="submitForm"
      >
        提交
      </el-button>
      <el-button @click="close">取 消</el-button>
    </template>
    <import-table-form ref="importTableFormRef" @success="handleSuccess" />
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryNoExistsPage } from '@/service/api/generate/table.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { queryGenDataSourceList } from '@/service/api/generate/datasource.api'
import ImportTableForm from '@/views/generate/table/components/import-table-form.vue'
import { useTableToolHooks } from '@/hooks/use-crud-hooks'
import type {
  GenTableInfoQueryRequest,
  GenTableInfoResponse,
} from '@/service/model/generate/table.model'
import type { GenDataSourceResponse } from '@/service/model/generate/datasource.model'
const tableStyle = useTableToolHooks()
/**
 * 自定义表格索引生成
 */
const createTableIndex = (index: number) => {
  return ((state.queryParams.current || 1) - 1) * (state.queryParams.size || 0) + index + 1
}
const dataBaseList = ref<GenDataSourceResponse[]>([])
const rules: FormRules = {
  dataSourceId: [{ required: true, message: '请选择配置名称', trigger: ['blur', 'change'] }],
}
const importTableFormRef = ref<any>({})
const addUpdateForm = ref<any>({})
const addUpdateFormRef = ref<FormInstance>()
const emit = defineEmits(['success'])

interface CrudOption {
  visibleStatus: boolean
  operationStatus: true
  checkData: any[]
  loadingStatus: boolean
  queryParams: GenTableInfoQueryRequest
  tableList: GenTableInfoResponse[]
}

const state = reactive<CrudOption>({
  visibleStatus: false,
  operationStatus: true,
  checkData: [],
  loadingStatus: false,
  queryParams: {
    descName: 'id',
    dataSourceId: '',
  },
  tableList: [],
})
const { queryParams } = toRefs(state)

/**
 * 多选框选中数据
 * @param selection 选中信息
 */
const handleSelectionChange = (selection: any[]) => {
  state.checkData = selection.map((item: any) => item.tableName)
}
/**
 * 查询
 */
const handleQuery = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      state.tableList = []
      queryNoExistsPage(queryParams.value)
        .then((response) => {
          state.tableList = response.data || []
        })
        .finally(() => {
          state.loadingStatus = false
        })
    } else {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}
/**
 * 重置表单
 */
const resetQuery = () => {
  addUpdateFormRef.value?.resetFields()
  handleQuery()
}
/**
 * 打开显示
 */
const show = () => {
  state.visibleStatus = true
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.visibleStatus = true
  importTableFormRef.value.show(state.checkData, state.queryParams.dataSourceId)
}
const handleSuccess = () => {
  emit('success')
  close()
}
/**
 * 关闭
 */
const close = () => {
  addUpdateForm.value = {}
  state.visibleStatus = false
  state.operationStatus = true
  state.loadingStatus = false
  state.queryParams = {}
  state.checkData = []
  state.tableList = []
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
onMounted(() => {
  queryGenDataSourceList().then((response) => {
    dataBaseList.value = response.data
  })
})
defineExpose({
  show,
})
</script>

<style scoped></style>
