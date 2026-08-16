<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage, useMessageBox } from '@/hooks/use-message'

defineOptions({
  name: 'BpmnPanelListenerField',
  inheritAttrs: false,
})
const tableData = defineModel<ListenerField[]>('modelValue', {
  required: true,
})
const visibleStatus = ref<boolean>(false)
const loadingStatus = ref<boolean>(false)
const dataIndex = ref<number>(-1)
const addUpdateForm = ref<ListenerField>({
  name: '',
  type: 'string',
  value: '',
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules<Required<ListenerField>> = {
  name: [{ required: true, message: '请输入字段名', trigger: 'change' }],
  type: [{ required: true, message: '请输入字段类型', trigger: 'change' }],
  value: [{ required: true, message: '请输入字段值', trigger: 'change' }],
}

/**
 * 打开增加注入字段 Dialog
 */
const openAddDialog = () => {
  visibleStatus.value = true
  dataIndex.value = -1
}

/**
 * 打开修改注入字段 Dialog
 */
const openUpdateDialog = (index: number, row: ListenerField) => {
  visibleStatus.value = true
  addUpdateForm.value = { ...row }
  dataIndex.value = index
}
/**
 * 关闭注入字段 Dialog
 */
const closeDialog = () => {
  if (loadingStatus.value) return
  addUpdateForm.value = {
    name: '',
    type: 'string',
    value: '',
  }
  visibleStatus.value = false
}

/**
 * 新增注入字段
 */
const addListenerField = () => {
  loadingStatus.value = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (dataIndex.value < 0) {
        tableData.value.push({
          ...addUpdateForm.value,
        })
        useMessage().success('新增注入字段成功')
      } else {
        tableData.value.splice(dataIndex.value, 1, {
          ...addUpdateForm.value,
        })
        useMessage().success('修改注入字段成功')
      }
      loadingStatus.value = false
      closeDialog()
    } else {
      if (dataIndex.value < 0) {
        useMessage().error('新增注入字段失败')
      } else {
        useMessage().error('修改注入字段失败')
      }
      loadingStatus.value = false
    }
  })
}

/**
 *  删除注入字段
 * @param index 索引
 */
const removeListenerField = (index: number) => {
  useMessageBox()
    .confirm('是否要删除注入字段')
    .then(() => {
      tableData.value.splice(index, 1)
      useMessage().success('删除注入字段成功')
    })
}
</script>

<template>
  <el-table :data="tableData" size="small" border class="flex-1" empty-text="暂无注入字段,请添加注入字段！">
    <xht-column-index type="step" />
    <el-table-column>
      <template #header>
        <div class="w-full text-right p-1"><el-button type="primary" size="small" :icon="Plus" @click="openAddDialog()">添加注入字段</el-button></div>
      </template>
      <el-table-column prop="name" label="字段名" width="120" show-overflow-tooltip />
      <el-table-column prop="type" label="字段类型" min-width="120" show-overflow-tooltip />
      <el-table-column prop="value" label="字段值" min-width="120" show-overflow-tooltip />
      <!-- @vue-generic {ListenerField} -->
      <el-table-column label="操作" width="120">
        <template #default="{ row, $index }">
          <el-button type="success" size="small" text @click="openUpdateDialog($index, row)">修改</el-button>
          <el-button type="danger" size="small" text @click="removeListenerField($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="visibleStatus"
    :title="dataIndex < 0 ? '新增注入字段' : '修改注入字段'"
    width="45%"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    :show-close="!loadingStatus"
    :before-close="closeDialog"
  >
    <el-form
      ref="addUpdateFormRef"
      size="default"
      v-loading="loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
      scroll-to-error
    >
      <el-form-item label="字段名称" prop="name">
        <el-input v-model="addUpdateForm.name" clearable :maxlength="50" show-word-limit placeholder="请输入字段名" />
      </el-form-item>
      <el-form-item label="字段名称" prop="type">
        <el-select v-model="addUpdateForm.type" placeholder="请选择监听器类型">
          <el-option value="string" label="字符串" />
          <el-option value="expression" label="表达式" />
        </el-select>
      </el-form-item>
      <el-form-item :label="addUpdateForm.type == 'string' ? '字段值' : '表达式'" prop="value">
        <el-input
          v-model="addUpdateForm.value"
          type="textarea"
          :rows="3"
          resize="none"
          clearable
          :maxlength="200"
          show-word-limit
          :placeholder="`请输入字段值${addUpdateForm.type == 'string' ? '字段值' : '表达式'}`"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="loadingStatus" size="default" @click="closeDialog()">取 消</el-button>
      <el-button :loading="loadingStatus" size="default" type="primary" @click="addListenerField()">提交</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
