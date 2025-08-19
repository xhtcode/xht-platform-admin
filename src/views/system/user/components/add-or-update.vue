<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
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
      <el-divider>基础信息</el-divider>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addUpdateForm.userName" disabled placeholder="请输入用户账号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="注册时间" prop="createTime">
            <el-date-picker
              disabled
              v-model="addUpdateForm.createTime"
              type="date"
              placeholder="请选择出生日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="addUpdateForm.nickName" placeholder="请输入用户昵称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户状态" prop="userStatus">
            <el-select v-model="addUpdateForm.userStatus" placeholder="请选择用户状态">
              <el-option :value="UserStatusEnums.NORMAL" label="正常状态" />
              <el-option :value="UserStatusEnums.DISABLE" label="禁用状态" />
              <el-option :value="UserStatusEnums.LOCKED" label="锁定状态" />
              <el-option :value="UserStatusEnums.EXPIRED" label="过期状态" />
              <el-option :value="UserStatusEnums.FORBIDDEN" label="禁止登录状态" />
              <el-option :value="UserStatusEnums.UNREGISTER" label="未注册状态" />
              <el-option :value="UserStatusEnums.OTHER" label="其他状态" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="真实姓名" prop="profile.realName">
            <el-input v-model="addUpdateForm.profile.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="身份证号" prop="profile.idCardNumber">
            <el-input v-model="addUpdateForm.profile.idCardNumber" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户性别" prop="profile.gender">
            <el-select
              v-model="addUpdateForm.profile.gender"
              placeholder="请选择用户性别"
              clearable
            >
              <el-option :value="1" label="男" />
              <el-option :value="2" label="女" />
              <el-option :value="3" label="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="邮政编码" prop="profile.postalCode">
            <el-input v-model="addUpdateForm.profile.postalCode" placeholder="请输入邮政编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="出生日期" prop="profile.birthDate">
            <el-date-picker
              v-model="addUpdateForm.profile.birthDate"
              type="date"
              placeholder="请选择出生日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="用户年龄" prop="profile.age">
            <el-input-number
              class="w100"
              v-model="addUpdateForm.profile.age"
              :min="0"
              :max="150"
              placeholder="请输入用户年龄"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="家庭地址" prop="profile.address">
            <el-input
              :rows="5"
              :resize="'none'"
              v-model="addUpdateForm.profile.address"
              type="textarea"
              placeholder="请输入家庭地址"
              :maxlength="120"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>职位信息</el-divider>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门编码" prop="dept.deptCode">
            <el-input v-model="addUpdateForm.dept.deptCode" disabled placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门名称" prop="dept.deptName">
            <el-input v-model="addUpdateForm.dept.deptName" disabled placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门状态" prop="dept.deptStatus">
            <el-select
              v-model="addUpdateForm.dept.deptStatus"
              disabled
              placeholder="请选择部门状态"
            >
              <el-option :value="0" label="启用" />
              <el-option :value="1" label="禁用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="部门主管" prop="dept.leaderName">
            <el-input
              disabled
              v-model="addUpdateForm.dept.leaderName"
              maxlength="11"
              show-word-limit
              placeholder="暂无主管"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="联系电话" prop="dept.phone">
            <el-input
              disabled
              v-model="addUpdateForm.dept.phone"
              maxlength="11"
              show-word-limit
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="联系邮箱" prop="dept.email">
            <el-input
              disabled
              v-model="addUpdateForm.dept.email"
              maxlength="50"
              show-word-limit
              placeholder="请输入联系邮箱"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="职位编码" prop="post.postCode">
            <el-input v-model="addUpdateForm.dept.deptName" disabled placeholder="请输入职位编码" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="职位名称" prop="post.postName">
            <el-input v-model="addUpdateForm.post.postName" disabled placeholder="请输入职位名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="职位状态" prop="post.postStatus">
            <el-select
              v-model="addUpdateForm.post.postStatus"
              disabled
              placeholder="请选择职位状态"
            >
              <el-option :value="0" label="启用" />
              <el-option :value="1" label="禁用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="岗位限制" prop="post.postLimit">
            <el-input
              disabled
              class="w100"
              :input-style="{ 'text-align': 'center' }"
              v-model="postHave"
              placeholder="请输入岗位限制人数"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">
        提交
      </el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysUserById, saveSysUser, updateSysUser } from '@/api/system/user.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import { SysUserOperationForm, SysUserOperationRules } from '@/views/system/user/user.data'

import type { SysUserOperationRequest } from '@/model/system/user.model'
import { UserStatusEnums } from '@/model/system/user.model'
import type { ModeIdType } from '@/model/base.model'

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
const postHave = computed<string>(
  () =>
    `${addUpdateForm.value.post.postHave ? addUpdateForm.value.post.postHave : 0}/${addUpdateForm.value.post.postLimit}`,
)
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
  addUpdateForm.value = { ...SysUserOperationForm }
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
