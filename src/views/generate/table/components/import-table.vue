<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { GenTableInfoQueryRequest, GenTableInfoResponse } from '@/service/model/generate/table.model'
import { queryNoExistsPage } from '@/service/api/generate/table.api'
import { useMessage } from '@/hooks/use-message'

defineOptions({
  name: 'ImportTable',
})

const emit = defineEmits(['success'])

const importTableForm = defineAsyncComponent(() => import('@/views/generate/table/components/import-table-form.vue'))

const rules: FormRules = {
  dataSourceId: [{ required: true, message: '请选择配置名称', trigger: ['blur', 'change'] }],
}
const importTableFormRef = useTemplateRef<any>('importTableFormRef')
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
interface CrudOption {
  visibleStatus: boolean
  operationStatus: true
  checkData: string[]
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
const handleSelectionChange = (selection: GenTableInfoResponse[]) => {
  state.checkData = selection.map((item: GenTableInfoResponse) => item.tableName)
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
  state.loadingStatus = true
  importTableFormRef.value.show(state.checkData, state.queryParams.dataSourceId)
  state.loadingStatus = false
}

/**
 * 成功回调
 */
const handleSuccess = () => {
  emit('success')
  close()
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.operationStatus = true
  state.loadingStatus = false
  state.checkData = []
  state.tableList = []
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    title="导入表结构"
    size="75%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="queryParams"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="100px"
      scroll-to-error
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
    <xht-table
      ref="tableRef"
      row-key="tableName"
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      height="65vh"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" />
      <el-table-column label="表名" prop="tableName" />
      <el-table-column label="引擎" prop="engineName" />
      <el-table-column label="描述" prop="tableComment" />
      <el-table-column label="创建时间" prop="tableCreateTime" />
      <el-table-column label="更新时间" prop="tableUpdateTime" />
    </xht-table>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus || (state.checkData && state.checkData.length === 0)" type="primary" @click="submitForm">
        提交
      </el-button>
    </template>
    <import-table-form ref="importTableFormRef" @success="handleSuccess" />
  </el-drawer>
</template>

<style scoped></style>
