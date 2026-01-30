<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { SysDeptPostOperationRequest } from '@/service/model/system/dept.post.model'
import { SysDeptPostStatusEnums } from '@/service/model/system/dept.post.model'
import { sysDeptPostOperationForm, sysDeptPostOperationRules } from '@/views/system/dept-post/dept.post.data'
import { useMessage } from '@/hooks/use-message'
import { querySysDeptPostById, saveSysDeptPost, updateSysDeptPost } from '@/service/api/system/dept.post.api'
import { SystemFlagEnums } from '@/service/model/base.model'

defineOptions({ name: 'SysDeptAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysDeptPostOperationRequest>>({
  title: '增加部门岗位',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysDeptPostOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules = sysDeptPostOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改部门岗位'
      const { data } = await querySysDeptPostById(id)
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
          await saveSysDeptPost(addUpdateForm.value)
          useMessage().success(`新增部门岗位：${addUpdateForm.value.postName}成功`)
        } else {
          await updateSysDeptPost(addUpdateForm.value)
          useMessage().success(`修改部门岗位：${addUpdateForm.value.postName}成功`)
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
      :disabled="addUpdateForm.systemFlag === SystemFlagEnums.YES"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="100px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属部门" prop="deptId">
            <dept-tree-select v-model="addUpdateForm.deptId" placeholder="请选择岗位所属部门" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="岗位名称" prop="postName">
            <el-input v-model="addUpdateForm.postName" :maxlength="50" placeholder="请输入岗位名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input v-model="addUpdateForm.postCode" :maxlength="50" placeholder="请输入岗位编码" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位排序" prop="postSort">
            <el-input-number v-model="addUpdateForm.postSort" :max="999" :min="0" class="w100" placeholder="请输入岗位排序" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位限制" prop="postLimit">
            <el-input-number v-model="addUpdateForm.postLimit" :max="999" :min="1" class="w100" placeholder="请输入岗位限制人数">
              <template #suffix>
                <span>{{ addUpdateForm.postHave ? addUpdateForm.postHave : 0 }}/{{ addUpdateForm.postLimit }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位状态" prop="postStatus">
            <el-select v-model="addUpdateForm.postStatus" placeholder="请选择岗位状态">
              <el-option :value="SysDeptPostStatusEnums.NORMAL" label="正常" />
              <el-option :value="SysDeptPostStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位描述" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              :maxlength="200"
              :rows="5"
              placeholder="请输入岗位描述"
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

<style scoped></style>
