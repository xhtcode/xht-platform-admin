<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysRoleTypeById, saveSysRoleType, updateSysRoleType } from '@/service/api/system/role-type.api'
import type { SysRoleTypeOperationRequest } from '@/service/model/system/role-type.model'
import { roleTypeStatusEnum } from '@/service/enums/system/role-type.enum'
import { sysRoleTypeOperationForm, sysRoleTypeOperationRules } from '@/views/system/role-type/role-type.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'SysRoleTypeAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysRoleTypeOperationRequest>>({
  title: '新增角色类型',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysRoleTypeOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysRoleTypeOperationRequest>> = sysRoleTypeOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.title = type === 'create' ? '新增角色类型' : '修改角色类型'
    state.loadingStatus = true
    if (type === 'update') {
      const { data } = await querySysRoleTypeById(id)
      addUpdateForm.value = data
    }
    state.loadingStatus = false
  } catch (error) {
    state.loadingStatus = false
    console.error('查询角色类型详情失败:', error)
  }
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      const request = state.operationStatus === 'create' ? saveSysRoleType : updateSysRoleType
      request(addUpdateForm.value)
        .then(() => {
          emits('success')
          useMessage().success(`${state.title}成功`)
          close()
        })
        .catch((error) => console.error('提交角色类型失败:', error))
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
  if (state.loadingStatus) return
  addUpdateForm.value = { ...sysRoleTypeOperationForm }
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
      label-width="100px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="类型编码" prop="typeCode">
            <el-input v-model="addUpdateForm.typeCode" :maxlength="50" clearable placeholder="请输入类型编码，如 AUDIT" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型名称" prop="typeName">
            <el-input v-model="addUpdateForm.typeName" :maxlength="50" clearable placeholder="请输入类型名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型状态" prop="typeStatus">
            <xht-enum-select v-model="addUpdateForm.typeStatus" :data="roleTypeStatusEnum" placeholder="请选择类型状态" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="显示顺序" prop="typeSort">
            <el-input-number
              v-model="addUpdateForm.typeSort"
              class="w-full!"
              :max="999"
              :min="0"
              placeholder="请输入类型显示顺序"
              value-on-clear="min"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型备注" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              :maxlength="200"
              :rows="5"
              placeholder="请输入类型备注"
              resize="none"
              show-word-limit
              type="textarea"
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
