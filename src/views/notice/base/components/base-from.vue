<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysNoticeById, saveSysNotice, updateSysNotice, updateSysNoticePublish, updateSysNoticeUnderShelve } from '@/service/api/notice/base.api'
import type { SysNoticeOperationRequest } from '@/service/model/notice/base.model'
import { sysNoticeOperationForm, sysNoticeOperationRules } from '@/views/notice/base/base.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { noticeJumpTypeEnums, noticeStatusEnums, noticeTimedPublishEnums, noticeTopEnums } from '@/service/enums/system/notice.enum'

defineOptions({ name: 'SysNoticeAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysNoticeOperationRequest>>({
  title: '增加通知',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysNoticeOperationForm },
  attachments: [],
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm, attachments } = toRefs(state)
const rules: FormRules<Required<SysNoticeOperationRequest>> = sysNoticeOperationRules
const activeNames = ref<string[]>(['1', '2', '3', '4', '5'])

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改通知'
      const { data } = await querySysNoticeById(id)
      addUpdateForm.value = data.notice
      attachments.value = data.attachments || []
    }
    state.loadingStatus = false
  } catch {
    state.loadingStatus = false
    close()
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
          await saveSysNotice(addUpdateForm.value)
          useMessage().success(`新增通知成功`)
        } else {
          await updateSysNotice(addUpdateForm.value)
          useMessage().success(`修改通知成功`)
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
 * 发布通知
 */
const handleSysNoticePublish = () => {
  if (state.operationStatus === 'update' && addUpdateForm.value.noticeStatus === noticeStatusEnums.NOT_PUBLISH.value) {
    state.loadingStatus = true
    useMessageBox()
      .confirm('此操作将发布通知, 是否继续?')
      .then(async () => {
        await updateSysNoticePublish(addUpdateForm.value.id)
        useMessage().success('通知发布成功!')
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
}

/**
 * 下架通知
 */
const handleSysNoticeUnderShelve = () => {
  if (state.operationStatus === 'update' && addUpdateForm.value.noticeStatus === noticeStatusEnums.PUBLISH.value) {
    state.loadingStatus = true
    useMessageBox()
      .confirm('此操作将下架通知, 是否继续?')
      .then(async () => {
        await updateSysNoticeUnderShelve(addUpdateForm.value.id)
        useMessage().success('通知下架成功!')
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
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
    size="75%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="close"
  >
    <template #header>
      <div>{{ state.title }}</div>
      <div>
        <el-button
          type="success"
          v-if="state.operationStatus === 'update' && addUpdateForm.noticeStatus === noticeStatusEnums.NOT_PUBLISH.value"
          @click="handleSysNoticePublish"
        >
          发布
        </el-button>
        <el-button
          type="danger"
          v-if="state.operationStatus === 'update' && addUpdateForm.noticeStatus === noticeStatusEnums.PUBLISH.value"
          @click="handleSysNoticeUnderShelve"
        >
          下架
        </el-button>
      </div>
    </template>
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="120px"
      scroll-to-error
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="1" disabled>
          <template #title>
            <h3 class="notice-header-title xht-instruction">基础信息</h3>
          </template>
          <el-row>
            <el-col :span="24">
              <el-form-item label="通知标题" prop="noticeTitle">
                <el-input v-model="addUpdateForm.noticeTitle" clearable :maxlength="200" show-word-limit placeholder="请输入通知标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通知类型" prop="noticeTypeId">
                <notice-type-select v-model="addUpdateForm.noticeTypeId" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通知状态" prop="noticeStatus">
                <xht-enum-select v-model="addUpdateForm.noticeStatus" :data="noticeStatusEnums" placeholder="请选择通知状态" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="置顶状态" prop="noticeTop">
                <xht-enum-select v-model="addUpdateForm.noticeTop" :data="noticeTopEnums" placeholder="请选择置顶状态" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通知排序" prop="noticeOrder">
                <el-input-number
                  v-model="addUpdateForm.noticeOrder"
                  :min="1"
                  :max="999"
                  class="w-full!"
                  value-on-clear="min"
                  placeholder="请输入通知排序"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="noticeRemark">
                <el-input
                  v-model="addUpdateForm.noticeRemark"
                  type="textarea"
                  :rows="5"
                  resize="none"
                  clearable
                  :maxlength="500"
                  show-word-limit
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="通知内容" name="2">
          <template #title>
            <h3 class="xht-instruction">通知内容</h3>
          </template>
          <el-row>
            <el-col :span="24">
              <el-form-item label="通知摘要" prop="noticeSummary">
                <el-input
                  v-model="addUpdateForm.noticeSummary"
                  type="textarea"
                  :rows="5"
                  resize="none"
                  :maxlength="500"
                  show-word-limit
                  placeholder="请输入通知摘要"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="通知内容" prop="noticeContent">
                <el-input
                  v-model="addUpdateForm.noticeContent"
                  type="textarea"
                  :rows="15"
                  resize="none"
                  :maxlength="3000"
                  show-word-limit
                  placeholder="请输入通知内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="显示设置" name="3">
          <template #title>
            <h3 class="xht-instruction">显示设置</h3>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="过期时间" prop="noticeExpireTime">
                <el-date-picker
                  class="w-full!"
                  v-model="addUpdateForm.noticeExpireTime"
                  format="YYYY-MM-DD"
                  placeholder="选择过期时间"
                  type="date"
                  disabled
                  value-format="YYYY-MM-DD hh:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下架时间" prop="noticeOfflineTime">
                <el-date-picker
                  class="w-full!"
                  v-model="addUpdateForm.noticeOfflineTime"
                  format="YYYY-MM-DD"
                  placeholder="选择下架时间"
                  type="date"
                  disabled
                  value-format="YYYY-MM-DD hh:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="定时发布" prop="noticeTimedPublish">
                <xht-enum-select v-model="addUpdateForm.noticeTimedPublish" :data="noticeTimedPublishEnums" placeholder="请选择定时发布状态" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="addUpdateForm.noticeTimedPublish === noticeTimedPublishEnums.PUBLISH.value">
              <el-form-item label="发布时间" prop="noticePublishTime">
                <el-date-picker
                  class="w-full!"
                  v-model="addUpdateForm.noticePublishTime"
                  format="YYYY-MM-DD"
                  placeholder="选择发布时间"
                  type="date"
                  value-format="YYYY-MM-DD hh:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="跳转配置" name="4">
          <template #title>
            <h3 class="xht-instruction">跳转配置</h3>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="跳转类型" prop="noticeJumpType">
                <xht-enum-select v-model="addUpdateForm.noticeJumpType" :data="noticeJumpTypeEnums" placeholder="请选择跳转类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="addUpdateForm.noticeJumpType !== noticeJumpTypeEnums.NO_JUMP.value">
              <el-form-item label="跳转地址" prop="noticeJumpUrl">
                <el-input v-model="addUpdateForm.noticeJumpUrl" clearable :maxlength="100" show-word-limit placeholder="请输入跳转地址" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="附件信息" name="5" disabled>
          <template #title>
            <h3 class="notice-header-title">附件信息</h3>
          </template>
        </el-collapse-item>
      </el-collapse>
      <el-row></el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">关闭</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.notice-header-title {
  color: var(--xht-text-color) !important;
}
</style>
