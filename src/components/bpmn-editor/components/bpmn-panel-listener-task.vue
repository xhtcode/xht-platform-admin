<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { BellFilled, Plus } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import BpmnPanelListenerField from '@/components/bpmn-editor/components/bpmn-panel-listener-field.vue'

defineOptions({
  name: 'BpmnPanelListenerTask',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
const tableData = ref<TaskListenerForm[]>([])
const visibleStatus = ref<boolean>(false)
const loadingStatus = ref<boolean>(false)
const dataIndex = ref<number>(-1)
const addUpdateForm = ref<TaskListenerForm>({
  event: 'create',
  type: 'class',
  value: '',
  fields: [],
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules<Required<TaskListenerForm>> = {
  event: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  type: [{ required: true, message: '请选择监听器类型', trigger: 'change' }],
  value: [{ required: true, message: '请输入监听器值', trigger: 'change' }],
}
const valueInfoDef: Record<string, { label: string; placeholder: string }> = {
  class: {
    label: 'Java类',
    placeholder: '请输入Java类',
  },
  expression: {
    label: '表达式',
    placeholder: '请输入表达式',
  },
  delegateExpression: {
    label: '代理表达式',
    placeholder: '请输入代理表达式',
  },
}
const valueInfo = computed(() => valueInfoDef[addUpdateForm.value.type || 'class'])

/**
 * 打开添加任务监听器 Dialog
 */
const openAddDialog = () => {
  visibleStatus.value = true
  dataIndex.value = -1
}

/**
 * 打开修改任务监听器 Dialog
 */
const openUpdateDialog = (index: number, row: TaskListenerForm) => {
  visibleStatus.value = true
  addUpdateForm.value = { ...row }
  dataIndex.value = index
}

/**
 * 关闭任务监听器 Dialog
 */
const closeDialog = () => {
  if (loadingStatus.value) return
  addUpdateForm.value = {
    event: 'create',
    type: 'class',
    value: '',
    fields: [],
  }
  visibleStatus.value = false
}

/**
 * 新增任务监听器
 */
const addTaskListenerForm = () => {
  loadingStatus.value = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (dataIndex.value < 0) {
        tableData.value.push({
          ...addUpdateForm.value,
        })
        useMessage().success('新增任务监听器成功')
      } else {
        tableData.value.splice(dataIndex.value, 1, {
          ...addUpdateForm.value,
        })
        useMessage().success('修改任务监听器成功')
      }
      loadingStatus.value = false
      closeDialog()
    } else {
      if (dataIndex.value < 0) {
        useMessage().error('新增任务监听器失败')
      } else {
        useMessage().error('修改任务监听器失败')
      }
      loadingStatus.value = false
    }
  })
}

/**
 *  删除任务监听器
 * @param index 索引
 */
const removeTaskListenerForm = (index: any) => {
  useMessageBox()
    .confirm('是否要删除任务监听器')
    .then(() => {
      tableData.value.splice(index, 1)
      useMessage().success('删除任务监听器成功')
    })
}
</script>

<template>
  <el-collapse-item name="bpmn-panel-listener-task">
    <template #title>
      <div class="flex-center">
        <bpmn-panel-title class-name="flex-1" name="任务监听器">
          <BellFilled />
        </bpmn-panel-title>
        <el-tag size="small" round effect="dark" class="mr-1">{{ tableData?.length || 0 }}</el-tag>
      </div>
    </template>
    <el-table :data="tableData" size="small" border height="200" empty-text="暂无任务监听器,请添加任务监听器！">
      <xht-column-index type="step" :width="50" />
      <el-table-column label="事件类型" prop="event" width="80" show-overflow-tooltip />
      <el-table-column label="监听器类型" prop="type" width="80" show-overflow-tooltip>
        <template #default="{ row }">
          {{ valueInfoDef[row.type]?.label }}
        </template>
      </el-table-column>
      <el-table-column label="监听器" prop="value" min-width="220px" show-overflow-tooltip />
      <!-- @vue-generic {TaskListenerForm} -->
      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ $index, row }">
          <el-button type="success" size="small" text @click="openUpdateDialog($index, row)">修改</el-button>
          <el-button type="danger" size="small" text @click="removeTaskListenerForm($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="w-full flex justify-around">
      <el-button class="w-full mt-15px" type="primary" :icon="Plus" @click="openAddDialog()">内置任务监听器</el-button>
      <el-button class="w-full mt-15px" type="primary" :icon="Plus" @click="openAddDialog()">自定义任务监听器</el-button>
    </div>
    <el-drawer
      v-model="visibleStatus"
      :title="dataIndex < 0 ? '新增任务监听器' : '修改任务监听器'"
      size="45%"
      destroy-on-close
      append-to-body
      body-class="flex flex-col"
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
        <el-form-item label="事件类型" prop="event">
          <el-select v-model="addUpdateForm.event" placeholder="请选择事件类型">
            <el-option value="create" label="创建" />
            <el-option value="assignment" label="指派" />
            <el-option value="complete" label="完成" />
            <el-option value="delete" label="删除" />
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型" prop="type">
          <el-select v-model="addUpdateForm.type" placeholder="请选择监听器类型">
            <el-option value="class" label="Java类" />
            <el-option value="expression" label="表达式" />
            <el-option value="delegateExpression" label="代理表达式" />
          </el-select>
        </el-form-item>
        <el-form-item :label="valueInfo.label" prop="value">
          <el-input
            v-model="addUpdateForm.value"
            type="textarea"
            :rows="3"
            resize="none"
            clearable
            :maxlength="500"
            show-word-limit
            :placeholder="valueInfo.placeholder"
          />
        </el-form-item>
      </el-form>
      <el-divider content-position="left">注入字段</el-divider>
      <bpmn-panel-listener-field v-model="addUpdateForm.fields" />
      <template #footer>
        <el-button :loading="loadingStatus" size="default" @click="closeDialog()">取 消</el-button>
        <el-button :loading="loadingStatus" size="default" type="primary" @click="addTaskListenerForm()">提交</el-button>
      </template>
    </el-drawer>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
