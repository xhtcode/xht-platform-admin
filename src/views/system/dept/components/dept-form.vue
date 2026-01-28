<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysDeptById, saveSysDept, updateSysDept } from '@/service/api/system/dept.api'
import type { SysDeptOperationRequest } from '@/service/model/system/dept.model'
import { DeptStatusEnums } from '@/service/model/system/dept.model'
import type { UserSimpleVo } from '@/service/model/system/user.model'
import type { ModeIdType } from '@/service/model/base.model'
import { sysDeptOperationForm, sysDeptOperationRules } from '@/views/system/dept/dept.data'
import { useMessage } from '@/hooks/use-message'
import { Search } from '@element-plus/icons-vue'

defineOptions({ name: 'SysDeptAddOrUpdate' })

const emits = defineEmits(['success'])

const DeptUserForm = defineAsyncComponent(() => import('@/views/system/dept/components/dept-user-form.vue'))

const state = reactive<AddUpdateOption<SysDeptOperationRequest>>({
  title: '增加部门',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysDeptOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysDeptOperationRequest>> = sysDeptOperationRules
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
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改系统部门'
      const { data } = await querySysDeptById(id)
      addUpdateForm.value = data
    }
  } finally {
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
          await saveSysDept(addUpdateForm.value)
          useMessage().success(`新增部门:${addUpdateForm.value.deptName}成功`)
        } else {
          await updateSysDept(addUpdateForm.value)
          useMessage().success(`修改部门:${addUpdateForm.value.deptName}成功`)
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
          <el-form-item label="上级部门" prop="parentId">
            <dept-tree-select v-model="addUpdateForm.parentId" placeholder="请选择上级部门" show-top-dept />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="部门主管" prop="leaderName">
            <el-input v-model="addUpdateForm.leaderName" placeholder="请选择部门主管" readonly>
              <template #append>
                <el-button :icon="Search" type="primary" @click="showDeptUser" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="addUpdateForm.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input v-model="addUpdateForm.deptCode" placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="部门状态" prop="deptStatus">
            <el-select v-model="addUpdateForm.deptStatus" placeholder="请选择部门状态">
              <el-option :value="DeptStatusEnums.NORMAL" label="正常" />
              <el-option :value="DeptStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="显示顺序" prop="deptSort">
            <el-input-number v-model="addUpdateForm.deptSort" :max="999" :min="0" class="w100" placeholder="请输入显示顺序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addUpdateForm.phone" maxlength="11" placeholder="请输入联系电话" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="addUpdateForm.email" maxlength="50" placeholder="请输入联系邮箱" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门备注" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              :rows="5"
              maxlength="200"
              placeholder="请输入部门备注"
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
    <dept-user-form ref="deptUserDialog" v-model="addUpdateForm.leaderUserId" @change="handleDeptUser" />
  </el-drawer>
</template>

<style scoped></style>
