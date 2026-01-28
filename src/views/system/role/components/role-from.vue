<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysRoleById, saveSysRole, updateSysRole } from '@/service/api/system/role.api'
import type { SysRoleOperationRequest } from '@/service/model/system/role.model'
import { RoleStatusEnums } from '@/service/model/system/role.model'
import { sysRoleOperationForm, sysRoleOperationRules } from '@/views/system/role/role.data'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'SysRoleAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysRoleOperationRequest>>({
  title: '增加角色',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysRoleOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysRoleOperationRequest>> = sysRoleOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改角色'
      const { data } = await querySysRoleById(id)
      addUpdateForm.value = data
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
      try {
        if (state.operationStatus === 'create') {
          await saveSysRole(addUpdateForm.value)
          useMessage().success(`新增角色：${addUpdateForm.value.roleName}成功`)
        } else {
          await updateSysRole(addUpdateForm.value)
          useMessage().success(`修改角色：${addUpdateForm.value.roleName}成功`)
        }
        emits('success')
        state.loadingStatus = false
        close()
      } catch {
        state.loadingStatus = false
      }
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
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addUpdateForm.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="addUpdateForm.roleCode" placeholder="请输入角色编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="角色状态" prop="roleStatus">
            <el-select v-model="addUpdateForm.roleStatus" clearable placeholder="请选择角色状态">
              <el-option :value="RoleStatusEnums.NORMAL" label="正常" />
              <el-option :value="RoleStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="角色排序" prop="roleSort">
            <el-input-number v-model="addUpdateForm.roleSort" :max="999" :min="0" class="w100!" value-on-clear="min" placeholder="请输入角色排序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addUpdateForm.remark" :rows="5" placeholder="请输入角色备注" resize="none" type="textarea" />
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

<style scoped></style>
