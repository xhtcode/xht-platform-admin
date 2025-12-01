<template>
  <el-drawer v-model="state.visibleStatus" :before-close="close" :title="state.title" append-to-body size="45vw">
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
          <el-form-item label="字典项标签" prop="itemLabel">
            <el-input v-model="addUpdateForm.itemLabel" :maxlength="50" placeholder="请输入字典项标签" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="字典项值" prop="itemValue">
            <el-input v-model="addUpdateForm.itemValue" :maxlength="50" placeholder="请输入字典项值" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="显示颜色" prop="itemColor">
            <el-color-picker
              v-model="addUpdateForm.itemColor"
              :predefine="predefineColors"
              class="w100"
              color-format="hex"
              placeholder="请输入显示颜色"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="排序序号" prop="sortOrder">
            <el-input-number v-model="addUpdateForm.sortOrder" :max="999" :min="0" class="w100" placeholder="请输入排序序号" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status">
            <el-select v-model="addUpdateForm.status" placeholder="请选择字典状态">
              <el-option :value="DictItemStatusEnums.ENABLED" label="启用" />
              <el-option :value="DictItemStatusEnums.DISABLED" label="禁用" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="字典项描述" prop="remark">
            <el-input v-model="addUpdateForm.remark" :maxlength="200" :rows="5" placeholder="请输入" resize="none" show-word-limit type="textarea" />
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
import { querySysDictItemById, saveSysDictItem, updateSysDictItem } from '@/service/api/system/dict.item.api'
import type { SysDictItemOperationRequest } from '@/service/model/system/dict.item.model'
import { DictItemStatusEnums } from '@/service/model/system/dict.item.model'
import { SysDictItemOperationForm, SysDictItemOperationRules } from '@/views/system/dict-item/dict.item.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { useRoute } from 'vue-router'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'SysDictItemAddOrUpdate' })

const state = reactive<AddUpdateOption<SysDictItemOperationRequest>>({
  title: '增加字典项',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...SysDictItemOperationForm },
})
const route = useRoute()
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = SysDictItemOperationRules
const predefineColors = ref(['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#303133', '#CDD0D6', '#E6E8EB', '#000000', '#F2F6FC'])
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
      if (state.operationStatus === 'create') {
        //增加
        await saveSysDictItem(addUpdateForm.value)
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
        await updateSysDictItem({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...SysDictItemOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>
