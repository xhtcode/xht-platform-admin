<template>
  <el-drawer v-model="state.visibleStatus" :before-close="close" :title="state.title" append-to-body size="45%">
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
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { SysDeptPostStatusEnums } from '@/service/model/system/dept.post.model'
import { SysDeptPostOperationForm, SysDeptPostOperationRules } from '@/views/system/dept-post/dept.post.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { querySysDeptPostById, saveSysDeptPost, updateSysDeptPost } from '@/service/api/system/dept.post.api'
import type { ModeIdType } from '@/service/model/base.model'
import type { SysDeptPostOperationRequest } from '@/service/model/system/dept.post.model'
import { SystemFlagEnums } from '@/service/model/base.model'

defineOptions({ name: 'SysDeptAddOrUpdate' })

const state = reactive<AddUpdateOption<SysDeptPostOperationRequest>>({
  title: '增加部门岗位',
  visibleStatus: false,
  operationStatus: 'create',
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
const show = async (type: 'create' | 'update', id: ModeIdType) => {
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
      if (state.operationStatus === 'create') {
        //增加
        await saveSysDeptPost(addUpdateForm.value)
          .then((_) => {
            useMessage().success('新增数据成功')
            emits('success')
            close()
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
  addUpdateForm.value = { ...SysDeptPostOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>

<style scoped></style>
