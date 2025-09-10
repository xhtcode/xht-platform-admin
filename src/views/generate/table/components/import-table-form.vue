<template>
  <el-dialog
    v-model="addUpdatePageInit.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    title="导入确定"
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="addUpdatePageInit.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="模板分组名称" prop="groupId">
            <template-group-select
              v-model="addUpdateForm.groupId"
              placeholder="请选择模板分组名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-space wrap size="small">
        <el-tag v-for="(item, index) in tableList" :key="index" size="small">
          {{ item }}
        </el-tag>
      </el-space>
    </el-form>
    <template #footer>
      <el-button :disabled="addUpdatePageInit.loadingStatus" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useMessageBox } from '@/hooks/use-message'
import { importTable } from '@/api/generate/table.api'

interface addUpdateOption {
  visibleStatus: boolean
  operationStatus: boolean
  loadingStatus: boolean
}

const rules: FormRules = {
  groupId: [{ required: true, message: '请选择模板分组名称', trigger: 'change' }],
}
const addUpdateForm = ref<any>({})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const tableList = ref<any[]>([])
const dataBaseInfo = ref<any>(null)
const emit = defineEmits(['success'])
const addUpdatePageInit = ref<addUpdateOption>({
  visibleStatus: false,
  operationStatus: true,
  loadingStatus: false,
})
/**
 * 打开显示
 */
const show = (tableData: any[], dbInfo: any) => {
  addUpdatePageInit.value.visibleStatus = true
  tableList.value = tableData || []
  dataBaseInfo.value = dbInfo || null
}

/**
 * 提交表单
 */
const submitForm = () => {
  addUpdatePageInit.value.visibleStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      //修改
      await importTable({
        tableNames: tableList.value,
        dbId: dataBaseInfo.value,
        ...addUpdateForm.value,
      })
        .then((_) => {
          useMessageBox().success('修改数据成功')
          emit('success')
          close()
        })
        .catch((_: any) => {
          useMessageBox().error('修改数据失败')
        })
        .finally(() => {
          addUpdatePageInit.value.loadingStatus = false
        })
    } else {
      addUpdatePageInit.value.loadingStatus = false
      useMessageBox().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  addUpdateForm.value = {}
  addUpdatePageInit.value = {
    visibleStatus: false,
    operationStatus: true,
    loadingStatus: false,
  }
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>
