<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :title="state.title"
    size="45%"
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
      scroll-to-error
      inline-message
    >
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addUpdateForm.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="addUpdateForm.roleCode" placeholder="请输入角色编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="角色状态" class="w100" prop="roleStatus">
            <el-select v-model="addUpdateForm.roleStatus" placeholder="请选择角色状态">
              <el-option label="正常" :value="RoleStatusEnums.NORMAL" />
              <el-option label="停用" :value="RoleStatusEnums.DISABLE" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="角色排序" prop="roleSort">
            <el-input-number
              v-model="addUpdateForm.roleSort"
              :min="0"
              :max="999"
              value-on-clear="min"
              class="w100"
              placeholder="请输入角色排序"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              type="textarea"
              :rows="5"
              resize="none"
              placeholder="请输入角色备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysRoleById, saveSysRole, updateSysRole } from '@/service/api/system/role.api'

import type { SysRoleOperationRequest } from '@/service/model/system/role.model'
import { RoleStatusEnums } from '@/service/model/system/role.model'
import { SysRoleOperationForm, SysRoleOperationRules } from '@/views/system/role/role.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'SysRoleAddOrUpdate' })
const state = reactive<AddUpdateOption<SysRoleOperationRequest>>({
  title: '增加角色',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...SysRoleOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = SysRoleOperationRules
/**
 * 打开显示
 */
const show = async (type: 'add' | 'update', id: ModeIdType) => {
  state.visibleStatus = true
  await nextTick(() => {
    addUpdateFormRef.value?.resetFields()
  })
  state.operationStatus = type
  if (type === 'update') {
    state.loadingStatus = true
    state.title = '修改角色'
    await querySysRoleById(id)
      .then((response) => {
        const { data } = JSON.parse(JSON.stringify(response))
        addUpdateForm.value = { ...data }
      })
      .catch(() => {
        useMessage().error('数据初始化加载失败')
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
}
/**
 * 提交表单
 */
const submitForm = () => {
  state.visibleStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (state.operationStatus === 'add') {
        //增加
        await saveSysRole(addUpdateForm.value)
          .then((_) => {
            useMessage().success('新增数据成功')
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
        //修改
        await updateSysRole({ ...addUpdateForm.value })
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
      }
    } else {
      state.loadingStatus = false
      useMessageBox().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  addUpdateForm.value = { ...SysRoleOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'add'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>

<style scoped></style>
