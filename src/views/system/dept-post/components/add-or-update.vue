<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :title="state.title"
    size="35vw"
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      :disabled="addUpdateForm.systemFlag === SystemFlagEnums.YES"
      element-loading-text="拼命加载中"
      label-width="100px"
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
            <el-input
              v-model="addUpdateForm.postName"
              :maxlength="50"
              show-word-limit
              placeholder="请输入岗位名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input
              v-model="addUpdateForm.postCode"
              :maxlength="50"
              show-word-limit
              placeholder="请输入岗位编码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位排序" prop="postSort">
            <el-input-number
              class="w100"
              :min="0"
              :max="999"
              v-model="addUpdateForm.postSort"
              placeholder="请输入岗位排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位限制" prop="postLimit">
            <el-input-number
              class="w100"
              :min="1"
              :max="999"
              v-model="addUpdateForm.postLimit"
              placeholder="请输入岗位限制人数"
            >
              <template #suffix>
                <span>
                  {{ addUpdateForm.postHave ? addUpdateForm.postHave : 0 }}/{{
                    addUpdateForm.postLimit
                  }}</span
                >
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位状态" prop="postStatus">
            <el-select v-model="addUpdateForm.postStatus" placeholder="请选择岗位状态">
              <el-option label="正常" :value="SysDeptPostStatusEnums.NORMAL" />
              <el-option label="停用" :value="SysDeptPostStatusEnums.DISABLE" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="岗位描述" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              type="textarea"
              resize="none"
              :maxlength="200"
              :rows="5"
              show-word-limit
              placeholder="请输入岗位描述"
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
import { AddUpdateOption } from '@/hooks/use-crud-hooks'
import type { SysDeptPostOperationRequest } from '@/model/system/dept.post.model'
import { SysDeptPostStatusEnums } from '@/model/system/dept.post.model'
import {
  SysDeptPostOperationForm,
  SysDeptPostOperationRules,
} from '@/views/system/dept-post/dept.post.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { errorFormParams } from '@/utils/moudle/element'
import {
  querySysDeptPostById,
  saveSysDeptPost,
  updateSysDeptPost,
} from '@/api/system/dept.post.api'
import { ModeIdType, SystemFlagEnums } from '@/model/base.model'

defineOptions({ name: 'SysDeptAddOrUpdate' })
const state = reactive<AddUpdateOption<SysDeptPostOperationRequest>>({
  title: '增加部门岗位',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...SysDeptPostOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = SysDeptPostOperationRules
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
    state.title = '修改部门'
    await querySysDeptPostById(id)
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
        await saveSysDeptPost(addUpdateForm.value)
          .then((_) => {
            useMessage().success('新增数据成功')
            emits('success')
            close()
          })
          .catch((err: any) => {
            errorFormParams(err, addUpdateFormRef, addUpdateForm)
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        //修改
        await updateSysDeptPost({ ...addUpdateForm.value })
          .then((_) => {
            useMessage().success('修改数据成功')
            emits('success')
            close()
          })
          .catch((err: any) => {
            errorFormParams(err, addUpdateFormRef, addUpdateForm)
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
  addUpdateForm.value = { ...SysDeptPostOperationForm }
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
