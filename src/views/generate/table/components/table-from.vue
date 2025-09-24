<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :title="state.title"
    append-to-body
    size="100%"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    >
      <el-tabs type="card" v-model="activeName" stretch>
        <el-tab-pane label="表信息" :name="1">
          <div class="flex">
            <table-from-basic class="flex-1" :table-info="addUpdateForm.tableInfo" />
            <code-example-view
              class="flex-2 p-10px"
              :table-info="addUpdateForm.tableInfo"
              :column-info="addUpdateForm.columnInfos"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="字段信息" :name="2">
          <column-form-basic :column-info="addUpdateForm.columnInfos" />
        </el-tab-pane>
        <el-tab-pane label="字段类型" :name="3">
          <column-form-type
            :db-type="addUpdateForm.tableInfo.dataBaseType"
            :column-info="addUpdateForm.columnInfos"
          />
        </el-tab-pane>
        <el-tab-pane label="表单字段" :name="4">
          <column-form-edit
            :table-info="addUpdateForm.tableInfo"
            :column-info="addUpdateForm.columnInfos"
          />
        </el-tab-pane>
        <el-tab-pane label="列表字段" :name="5">
          <column-form-list :column-info="addUpdateForm.columnInfos" />
        </el-tab-pane>
        <el-tab-pane label="查询字段" :name="6">
          <column-form-query
            :table-info="addUpdateForm.tableInfo"
            :column-info="addUpdateForm.columnInfos"
            ref="columnFormQueryRef"
          />
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
import {
  GenTableInfoOperationForm,
  GenTableInfoOperationRules,
} from '@/views/generate/table/table.data'
import { useMessage } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/service/model/base.model'
import ColumnFormBasic from '@/views/generate/table/components/column-form-basic.vue'
import ColumnFormType from '@/views/generate/table/components/column-form-type.vue'
import ColumnFormEdit from '@/views/generate/table/components/column-form-edit.vue'
import ColumnFormQuery from '@/views/generate/table/components/column-form-query.vue'
import ColumnFormList from '@/views/generate/table/components/column-form-list.vue'
import TableFromBasic from '@/views/generate/table/components/table-from-basic.vue'
import CodeExampleView from '@/views/generate/table/components/code-example-view.vue'

defineOptions({ name: 'GenTableInfoAddOrUpdate' })
const state = reactive<AddUpdateOption<GenTableInfoOperationRequest>>({
  title: '代码配置',
  visibleStatus: false,
  operationStatus: 'add',
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
        .catch((err: any) => {
          handleFormErrors(err, addUpdateFormRef, addUpdateForm)
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
  state.operationStatus = 'add'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>
