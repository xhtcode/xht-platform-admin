<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :title="state.title"
    size="45vw"
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="上级部门" prop="parentId">
            <dept-tree-select
              v-model="addUpdateForm.parentId"
              show-top-dept
              placeholder="请选择上级部门"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门主管" prop="leaderName">
            <el-input v-model="addUpdateForm.leaderName" readonly placeholder="请选择部门主管">
              <template #append>
                <el-button type="primary" :icon="Search" @click="showDeptUser" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="addUpdateForm.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input v-model="addUpdateForm.deptCode" placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门状态" prop="deptStatus">
            <el-select v-model="addUpdateForm.deptStatus" placeholder="请选择部门状态">
              <el-option :value="DeptStatusEnums.NORMAL" label="正常" />
              <el-option :value="DeptStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="显示顺序" prop="deptSort">
            <el-input-number
              v-model="addUpdateForm.deptSort"
              class="w100"
              :min="0"
              :max="999"
              placeholder="请输入显示顺序"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="addUpdateForm.phone"
              maxlength="11"
              show-word-limit
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="联系邮箱" prop="email">
            <el-input
              v-model="addUpdateForm.email"
              maxlength="50"
              show-word-limit
              placeholder="请输入联系邮箱"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门备注" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              type="textarea"
              :rows="5"
              resize="none"
              maxlength="200"
              show-word-limit
              placeholder="请输入部门备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
    <dept-user-form
      ref="deptUserDialog"
      v-model="addUpdateForm.leaderUserId"
      @change="handleDeptUser"
    />
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysDeptById, saveSysDept, updateSysDept } from '@/service/api/system/dept.api'

import type { SysDeptOperationRequest } from '@/service/model/system/dept.model'
import { DeptStatusEnums } from '@/service/model/system/dept.model'
import { SysDeptOperationForm, SysDeptOperationRules } from '@/views/system/dept/dept.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/service/model/base.model'
import DeptUserForm from '@/views/system/dept/components/dept-user-form.vue'
import { Search } from '@element-plus/icons-vue'
import type { UserSimpleVo } from '@/service/model/system/user.model'

defineOptions({ name: 'SysDeptAddOrUpdate' })

const state = reactive<AddUpdateOption<SysDeptOperationRequest>>({
  title: '增加部门',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...SysDeptOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = SysDeptOperationRules
const useDeptUserDialog = useTemplateRef('deptUserDialog')
const currentUser = ref<UserSimpleVo>()
/**
 * 打开部门主管选择
 */
const showDeptUser = () => {
  useDeptUserDialog.value?.show(addUpdateForm.value.id)
}

/**
 * 部门主管选择
 * @param user 用户信息
 */
const handleDeptUser = (user: UserSimpleVo) => {
  currentUser.value = user
  addUpdateForm.value.leaderUserId = user.userId
  addUpdateForm.value.leaderName = user.userName
}

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
    state.title = '修改SysDept'
    await querySysDeptById(id)
      .then((response) => {
        const { data } = JSON.parse(JSON.stringify(response))
        addUpdateForm.value = { ...data }
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
        await saveSysDept(addUpdateForm.value)
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
        await updateSysDept({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...SysDeptOperationForm }
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
