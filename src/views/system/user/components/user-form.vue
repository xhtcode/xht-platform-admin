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
      <el-divider>基础信息</el-divider>

      <div class="flex">
        <!-- 头像上传 -->
        <div class="flex-1">
          <el-form-item label="用户头像" prop="userAvatar">
            <el-upload action="/api/upload/avatar" :show-file-list="false" accept="image/*">
              <el-image
                :src="addUpdateForm.userAvatar"
                style="width: 100px; height: 100px; border-radius: 50%"
              />
            </el-upload>
          </el-form-item>
        </div>
        <div class="flex-1">
          <el-form-item label="登录账号" prop="userName">
            <el-input
              v-model="addUpdateForm.userName"
              placeholder="请输入用户账号"
              :maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input
              v-model="addUpdateForm.nickName"
              placeholder="请输入用户昵称"
              :maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="addUpdateForm.userType" placeholder="请选择用户类型" clearable>
              <el-option :label="'管理员'" :value="UserTypeEnums.ADMIN" />
              <el-option :label="'商家用户'" :value="UserTypeEnums.BUSINESS" />
              <el-option :label="'普通用户'" :value="UserTypeEnums.USER" />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户状态" prop="userStatus">
            <el-select v-model="addUpdateForm.userStatus" placeholder="请选择用户状态">
              <el-option :value="UserStatusEnums.NORMAL" label="账号正常" />
              <el-option :value="UserStatusEnums.UNACTIVATED" label="账号未激活" />
              <el-option :value="UserStatusEnums.DISABLED" label="账号禁用" />
              <el-option :value="UserStatusEnums.LOCKED" label="账号锁定" />
              <el-option :value="UserStatusEnums.EXPIRED" label="账号过期" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="手机号码" prop="userPhone">
            <el-input
              v-model="addUpdateForm.userPhone"
              placeholder="请输入手机号码"
              :maxlength="11"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider>详细信息</el-divider>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="真实姓名" prop="profile.realName">
            <el-input
              v-model="addUpdateForm.profile.realName"
              placeholder="请输入真实姓名"
              :maxlength="32"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="身份证号" prop="profile.idCard">
            <el-input
              v-model="addUpdateForm.profile.idCard"
              placeholder="请输入身份证号"
              :maxlength="18"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 出生日期（关联profile） -->
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="出生日期" prop="profile.birthDate">
            <el-date-picker
              v-model="addUpdateForm.profile.birthDate"
              type="date"
              placeholder="选择出生日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户年龄" prop="profile.age">
            <el-input-number
              v-model="addUpdateForm.profile.age"
              :min="0"
              :max="150"
              class="w-full!"
              placeholder="请输入用户年龄"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 性别（关联profile） -->
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户性别" prop="profile.gender">
            <el-select
              v-model="addUpdateForm.profile.gender"
              placeholder="请选择用户性别"
              clearable
            >
              <el-option :value="0" label="男" />
              <el-option :value="1" label="女" />
              <el-option :value="99" label="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 民族（关联profile） -->
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户民族" prop="profile.nation">
            <el-input
              v-model="addUpdateForm.profile.nation"
              placeholder="请输入民族"
              :maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 紧急联系人（关联profile） -->
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="联系人" prop="profile.emergencyContact">
            <el-input
              v-model="addUpdateForm.profile.emergencyContact"
              placeholder="请输入紧急联系人"
              :maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <!-- 紧急联系人电话（关联profile） -->
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="联系人电话" prop="profile.emergencyPhone">
            <el-input
              v-model="addUpdateForm.profile.emergencyPhone"
              placeholder="请输入紧急联系人电话"
              :maxlength="11"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 地址（关联profile） -->
        <el-col :span="24">
          <el-form-item label="用户地址" prop="profile.address">
            <el-input
              v-model="addUpdateForm.profile.address"
              placeholder="请输入详细地址"
              type="textarea"
              :rows="5"
              :maxlength="200"
              show-word-limit
              resize="none"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>职位信息</el-divider>
      <!-- 部门选择 -->
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="所属部门" prop="deptId">
            <dept-tree-select v-model="addUpdateForm.deptId" @click-node="handleDeptClick" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="所属部门" prop="deptName">
            <el-input v-model="addUpdateForm.deptName" @click-node="handleDeptClick" disabled />
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
import { querySysUserById, saveSysUser, updateSysUser } from '@/service/api/system/user.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import { SysUserOperationForm, SysUserOperationRules } from '@/views/system/user/user.data'

import {
  SysUserOperationRequest,
  UserStatusEnums,
  UserTypeEnums,
} from '@/service/model/system/user.model'
import type { ModeIdType } from '@/service/model/base.model'
import type { SysDeptResponse } from '@/service/model/system/dept.model'

const rules: FormRules = SysUserOperationRules
const state = reactive<AddUpdateOption<SysUserOperationRequest>>({
  title: '增加用户信息',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...SysUserOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
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
    state.title = '修改用户信息'
    await querySysUserById(id)
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
        await saveSysUser(addUpdateForm.value)
          .then((_) => {
            useMessageBox().success('新增数据成功')
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
        await updateSysUser({ ...addUpdateForm.value })
          .then((_) => {
            useMessageBox().success('修改数据成功')
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
  addUpdateForm.value = { ...SysUserOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'add'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}

const handleDeptClick = (data: SysDeptResponse) => {
  addUpdateForm.value.deptId = data.id
  addUpdateForm.value.deptName = data.deptName
}

defineExpose({
  show,
})
</script>

<style scoped></style>
