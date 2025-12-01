<template>
  <el-drawer v-model="state.visibleStatus" :before-close="close" :title="state.title" append-to-body size="100%">
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="100px"
      scroll-to-error
    >
      <el-tabs v-model="activeName" stretch type="card">
        <el-tab-pane :name="1" label="表信息">
          <table-from-basic :table-info="addUpdateForm.tableInfo" />
          <code-example-view :column-info="addUpdateForm.columnInfos" :table-info="addUpdateForm.tableInfo" class="p-10px" />
        </el-tab-pane>
        <el-tab-pane :name="2" label="字段信息">
          <column-form-basic :column-info="addUpdateForm.columnInfos" />
        </el-tab-pane>
        <el-tab-pane :name="3" label="字段类型">
          <column-form-type :column-info="addUpdateForm.columnInfos" :db-type="addUpdateForm.tableInfo.dataBaseType" />
        </el-tab-pane>
        <el-tab-pane :name="4" label="表单字段">
          <column-form-edit :column-info="addUpdateForm.columnInfos" :table-info="addUpdateForm.tableInfo" />
        </el-tab-pane>
        <el-tab-pane :name="5" label="列表字段">
          <column-form-list :column-info="addUpdateForm.columnInfos" />
        </el-tab-pane>
        <el-tab-pane :name="6" label="查询字段">
          <column-form-query ref="columnFormQueryRef" :column-info="addUpdateForm.columnInfos" :table-info="addUpdateForm.tableInfo" />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryGenTableInfoById, updateGenTableInfo } from '@/service/api/generate/table.api'
import type { GenTableInfoOperationRequest } from '@/service/model/generate/table.model'
import { GenTableInfoOperationForm, GenTableInfoOperationRules } from '@/views/generate/table/table.data'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'GenTableInfoAddOrUpdate' })

const columnFormBasic = defineAsyncComponent(() => import('@/views/generate/table/components/column-form-basic.vue'))
const columnFormType = defineAsyncComponent(() => import('@/views/generate/table/components/column-form-type.vue'))
const columnFormEdit = defineAsyncComponent(() => import('@/views/generate/table/components/column-form-edit.vue'))
const columnFormQuery = defineAsyncComponent(() => import('@/views/generate/table/components/column-form-query.vue'))
const columnFormList = defineAsyncComponent(() => import('@/views/generate/table/components/column-form-list.vue'))
const tableFromBasic = defineAsyncComponent(() => import('@/views/generate/table/components/table-from-basic.vue'))
const codeExampleView = defineAsyncComponent(() => import('@/views/generate/table/components/code-example-view.vue'))

const state = reactive<AddUpdateOption<GenTableInfoOperationRequest>>({
  title: '代码配置',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...GenTableInfoOperationForm },
})
const activeName = ref<number>(1)
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const columnFormQueryRef = useTemplateRef('columnFormQueryRef')
const rules: FormRules = GenTableInfoOperationRules
/**
 * 打开显示
 */
const show = async (id: ModeIdType) => {
  state.visibleStatus = true
  state.loadingStatus = true
  await queryGenTableInfoById(id)
    .then((response) => {
      const { data } = JSON.parse(JSON.stringify(response))
      addUpdateForm.value = { ...data }
      state.title = '修改表信息'
    })
    .finally(() => {
      state.loadingStatus = false
    })
  await nextTick()
  columnFormQueryRef.value?.setData(addUpdateForm.value.queryColumns || [])
}
/**
 * 提交表单
 */
const submitForm = () => {
  state.visibleStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      //修改
      await updateGenTableInfo({
        ...addUpdateForm.value,
        queryColumns: columnFormQueryRef.value?.getData() || [],
      })
        .then((_) => {
          useMessage().success('修改数据成功')
          emits('success')
          close()
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
 * 关闭
 */
const close = () => {
  addUpdateForm.value = { ...GenTableInfoOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  activeName.value = 1
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>
