<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowDefinitionById, saveFlowDefinition, updateFlowDefinition } from '@/service/api/workflow/definition.api'
import type { FlowDefinitionOperationRequest, FlowDefinitionResponse } from '@/service/model/workflow/definition.model'
import { flowDefinitionOperationForm, flowDefinitionOperationRules } from '@/views/workflow/definition/definition.data'
import { definitionStatusEnum, definitionTypeEnum } from '@/service/enums/workflow/definition.enum'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'FlowDefinitionAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<FlowDefinitionOperationRequest>>({
  title: '增加流程定义',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...flowDefinitionOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<FlowDefinitionOperationRequest>> = flowDefinitionOperationRules

/**
 * 打开显示
 * @param type 操作类型：create新增 update修改
 * @param id 流程定义主键（修改时必传）
 * @param parentRow 父级流程定义（新增子级时传）
 */
const show = async (type: 'create' | 'update', id: ModeIdType, parentRow?: FlowDefinitionResponse) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改流程定义'
      const { data } = await queryFlowDefinitionById(id)
      addUpdateForm.value = data
    } else {
      state.title = parentRow ? '新增下级流程定义' : '增加流程定义'
      addUpdateForm.value = {
        ...flowDefinitionOperationForm,
        parentId: parentRow?.id,
        definitionLevel: parentRow ? (parentRow.definitionLevel ?? 0) + 1 : 1,
      }
    }
    state.loadingStatus = false
  } catch {
    state.loadingStatus = false
  }
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (state.operationStatus === 'create') {
        saveFlowDefinition(addUpdateForm.value)
          .then(() => {
            emits('success')
            useMessage().success(`新增流程定义成功`)
            state.loadingStatus = false
            close()
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        updateFlowDefinition(addUpdateForm.value)
          .then(() => {
            emits('success')
            useMessage().success(`修改流程定义成功`)
            state.loadingStatus = false
            close()
          })
          .finally(() => {
            state.loadingStatus = false
          })
      }
    } else {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 上级流程定义选择变化
 * 根据选中的上级节点自动计算定义层级
 * @param node 选中的上级节点数据
 */
const handleParentChange = (node?: FlowDefinitionResponse) => {
  addUpdateForm.value.definitionLevel = node ? (node.definitionLevel ?? 0) + 1 : 1
}

// 清空上级选择时重置为顶级层级
watch(
  () => addUpdateForm.value.parentId,
  (val) => {
    if (!val) {
      addUpdateForm.value.definitionLevel = 1
    }
  }
)

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  addUpdateForm.value = { ...flowDefinitionOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    :title="state.title"
    size="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="120px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级流程定义" prop="parentId">
            <flow-definition-tree-select
              v-model="addUpdateForm.parentId"
              :exclude-id="state.operationStatus === 'update' ? addUpdateForm.id : undefined"
              placeholder="请选择上级流程定义"
              @change="handleParentChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定义编码" prop="definitionCode">
            <el-input v-model="addUpdateForm.definitionCode" clearable :maxlength="100" show-word-limit placeholder="请输入流程定义编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定义名称" prop="definitionName">
            <el-input v-model="addUpdateForm.definitionName" clearable :maxlength="200" show-word-limit placeholder="请输入流程定义名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定义类型" prop="definitionType">
            <xht-enum-select v-model="addUpdateForm.definitionType" :data="definitionTypeEnum" clearable placeholder="请选择流程定义类型" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定义状态" prop="definitionStatus">
            <xht-enum-select v-model="addUpdateForm.definitionStatus" :data="definitionStatusEnum" clearable placeholder="请选择流程定义状态" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定义排序" prop="definitionSort">
            <el-input-number
              v-model="addUpdateForm.definitionSort"
              :min="0"
              :max="999"
              class="w-full!"
              value-on-clear="min"
              placeholder="请输入流程定义排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定义描述" prop="definitionDesc">
            <el-input
              v-model="addUpdateForm.definitionDesc"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              :maxlength="500"
              show-word-limit
              placeholder="请输入流程定义描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
