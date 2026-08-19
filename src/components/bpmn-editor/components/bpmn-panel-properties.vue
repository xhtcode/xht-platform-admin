<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { Briefcase, Plus } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { usePropertiesHooks } from '@/components/bpmn-editor/components/bpmn.properties.hooks'

defineOptions({
  name: 'BpmnPanelProperties',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElementId } = storeToRefs(bpmnStore)
const { getExtensionProperties, addExtensionProperty, removeExtensionProperty, updateExtensionProperty } = usePropertiesHooks()
const tableData = ref<BpmnProperties[]>([])
const dataIndex = ref<number>(-1)
const visibleStatus = ref<boolean>(false)
const loadingStatus = ref<boolean>(false)
const addUpdateForm = ref<BpmnProperties>({
  name: '',
  value: '',
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules<Required<BpmnProperties>> = {
  name: [{ required: true, message: '请输入属性名', trigger: 'change' }],
  value: [{ required: true, message: '请输入属性值', trigger: 'change' }],
}

/**
 * 打开扩展属性 Dialog
 */
const openAddDialog = () => {
  visibleStatus.value = true
  dataIndex.value = -1
}

/**
 * 打开修改扩展属性 Dialog
 */
const openUpdateDialog = (index: number, row: BpmnProperties) => {
  visibleStatus.value = true
  addUpdateForm.value = { ...row }
  dataIndex.value = index
}

/**
 * 关闭扩展属性 Dialog
 */
const closeDialog = () => {
  if (loadingStatus.value) return
  addUpdateFormRef.value?.resetFields()
  addUpdateForm.value = {
    name: '',
    value: '',
  }
  visibleStatus.value = false
}

/**
 * 新增扩展属性
 */
const addProperties = () => {
  loadingStatus.value = true
  addUpdateFormRef.value?.validate(async (valid) => {
    try {
      if (valid) {
        if (dataIndex.value < 0) {
          addExtensionProperty({
            ...addUpdateForm.value,
          })
          tableData.value.push({
            ...addUpdateForm.value,
          })
          useMessage().success('新增扩展属性成功')
        } else {
          updateExtensionProperty(
            {
              ...addUpdateForm.value,
            },
            dataIndex.value
          )
          tableData.value.splice(dataIndex.value, 1, {
            ...addUpdateForm.value,
          })
          useMessage().success('修改扩展属性成功')
        }

        loadingStatus.value = false
        closeDialog()
      } else {
        if (dataIndex.value < 0) {
          useMessage().error('新增扩展属性失败')
        } else {
          useMessage().error('修改扩展属性失败')
        }
        loadingStatus.value = false
      }
    } catch (e) {
      console.error(e)
      loadingStatus.value = false
      useMessage().error('系统错误，新增扩展属性失败')
    }
  })
}

/**
 *  删除扩展属性
 * @param index 索引
 */
const removeProperties = (index: any) => {
  useMessageBox()
    .confirm('是否要删除扩展属性')
    .then(() => {
      removeExtensionProperty({
        ...tableData.value[index],
      })
      tableData.value = getExtensionProperties()
      useMessage().success('删除扩展属性成功')
    })
}
watch(
  () => activeElementId.value,
  () => {
    tableData.value = getExtensionProperties()
  }
)
</script>

<template>
  <el-collapse-item name="bpmn-panel-properties">
    <template #title>
      <div class="flex-center">
        <bpmn-panel-title class-name="flex-1" name="扩展属性">
          <Briefcase />
        </bpmn-panel-title>
        <el-tag size="small" round effect="dark" class="mr-1">{{ tableData?.length || 0 }}</el-tag>
      </div>
    </template>
    <el-table :data="tableData" size="small" border height="200" empty-text="暂无扩展属性,请添加扩展属性！">
      <xht-column-index type="step" />
      <el-table-column label="属性名" prop="name" width="120" show-overflow-tooltip />
      <el-table-column label="属性值" prop="value" width="200" show-overflow-tooltip />
      <!-- @vue-generic {BpmnProperties} -->
      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ $index, row }">
          <el-button type="success" size="small" text @click="openUpdateDialog($index, row)">修改</el-button>
          <el-button type="danger" size="small" text @click="removeProperties($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="w-full mt-15px" type="primary" :icon="Plus" @click="openAddDialog()">添加扩展属性</el-button>
    <el-dialog
      v-model="visibleStatus"
      :title="dataIndex < 0 ? '新增扩展属性' : '修改扩展属性'"
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
        <el-form-item label="属性名" prop="name">
          <el-input v-model="addUpdateForm.name" clearable :maxlength="50" show-word-limit placeholder="请输入属性名" />
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="addUpdateForm.value" clearable :maxlength="50" show-word-limit placeholder="请输入属性值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="loadingStatus" size="default" @click="closeDialog()">取 消</el-button>
        <el-button :loading="loadingStatus" size="default" type="primary" @click="addProperties()">提交</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
