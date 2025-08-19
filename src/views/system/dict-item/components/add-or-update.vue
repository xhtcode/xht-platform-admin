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
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="字典项标签" prop="itemLabel">
            <el-input
              v-model="addUpdateForm.itemLabel"
              :maxlength="50"
              show-word-limit
              placeholder="请输入字典项标签"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="字典项值" prop="itemValue">
            <el-input
              v-model="addUpdateForm.itemValue"
              :maxlength="50"
              show-word-limit
              placeholder="请输入字典项值"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="显示颜色" prop="itemColor">
            <el-color-picker
              v-model="addUpdateForm.itemColor"
              class="w100"
              color-format="hex"
              :predefine="predefineColors"
              placeholder="请输入显示颜色"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="排序序号" prop="sortOrder">
            <el-input-number
              v-model="addUpdateForm.sortOrder"
              class="w100"
              :min="0"
              :max="999"
              placeholder="请输入排序序号"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="addUpdateForm.status" placeholder="请选择字典状态">
              <el-option label="启用" :value="DictItemStatusEnums.ENABLED" />
              <el-option label="禁用" :value="DictItemStatusEnums.DISABLED" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="字典项描述" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              type="textarea"
              resize="none"
              :rows="5"
              :maxlength="200"
              show-word-limit
              placeholder="请输入"
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
import {
  querySysDictItemById,
  saveSysDictItem,
  updateSysDictItem,
} from '@/api/system/dict.item.api'

import type { SysDictItemOperationRequest } from '@/model/system/dict.item.model'
import { DictItemStatusEnums } from '@/model/system/dict.item.model'
import {
  SysDictItemOperationForm,
  SysDictItemOperationRules,
} from '@/views/system/dict-item/dict.item.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import { useRoute } from 'vue-router'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'SysDictItemAddOrUpdate' })
const state = reactive<AddUpdateOption<SysDictItemOperationRequest>>({
  title: '增加字典项',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...SysDictItemOperationForm },
})
const route = useRoute()
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = SysDictItemOperationRules
const predefineColors = ref([
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#303133',
  '#CDD0D6',
  '#E6E8EB',
  '#000000',
  '#F2F6FC',
])
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
    state.title = '修改字典项'
    await querySysDictItemById(id)
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
      addUpdateForm.value.dictId = route.params?.id
      if (state.operationStatus === 'add') {
        //增加
        await saveSysDictItem(addUpdateForm.value)
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
        await updateSysDictItem({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...SysDictItemOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'add'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>
