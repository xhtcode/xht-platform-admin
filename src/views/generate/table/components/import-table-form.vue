<template>
  <el-dialog
    v-model="addUpdatePageInit.visibleStatus"
    title="导入确定"
    width="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!addUpdatePageInit.loadingStatus"
    :before-close="close"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="addUpdatePageInit.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      class="h-350px"
      element-loading-text="拼命加载中"
      inline-message
      label-width="120px"
      scroll-to-error
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="模板分组名称" prop="groupId">
            <template-group-select v-model="addUpdateForm.groupId" placeholder="请选择模板分组名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-space size="small" wrap>
        <el-tag v-for="(item, index) in tableNames" :key="index" size="small">
          {{ item }}
        </el-tag>
      </el-space>
    </el-form>
    <template #footer>
      <el-button :disabled="addUpdatePageInit.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="addUpdatePageInit.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { importTableInfo } from '@/service/api/generate/table.api'
import type { ModeIdType } from '@/service/model/base.model'

interface AddUpdateOption {
  visibleStatus: boolean
  operationStatus: boolean
  loadingStatus: boolean
}

const rules: FormRules = {
  groupId: [{ required: true, message: '请选择模板分组名称', trigger: ['blur', 'change'] }],
}
const addUpdateForm = ref<{
  groupId: ModeIdType
}>({
  groupId: null,
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const tableNames = ref<string[]>([])
const dataSourceId = ref<ModeIdType>(null)
const emit = defineEmits(['success'])
const addUpdatePageInit = ref<AddUpdateOption>({
  visibleStatus: false,
  operationStatus: true,
  loadingStatus: false,
})

/**
 * 打开显示
 */
const show = (tableData: string[], dbInfo: ModeIdType) => {
  addUpdatePageInit.value.visibleStatus = true
  tableNames.value = tableData || []
  dataSourceId.value = dbInfo
}

/**
 * 提交表单
 */
const submitForm = () => {
  addUpdatePageInit.value.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await importTableInfo({
          tableNames: tableNames.value,
          dataSourceId: dataSourceId.value,
          groupId: addUpdateForm.value.groupId,
        })
        useMessage().success('修改数据成功')
        emit('success')
        addUpdatePageInit.value.loadingStatus = false
        close()
      } catch {
        addUpdatePageInit.value.loadingStatus = false
      }
    } else {
      addUpdatePageInit.value.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  if (addUpdatePageInit.value.loadingStatus) return
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
