<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'
import { downloadFileApi } from '@/service/api/generate/table.api'
import { useMessage } from '@/hooks/use-message'
import { handleBlobFile } from '@/utils'

interface CrudOption {
  visibleStatus: boolean
  loadingStatus: boolean
  tableList: GenTableInfoResponse[]
}

const rules: FormRules = {
  packageName: [{ required: true, message: '请填写包名', trigger: ['blur', 'change'] }],
}
const addUpdateForm = reactive<{
  packageName: string
}>({
  packageName: 'com.xht.demo',
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const state = reactive<CrudOption>({
  visibleStatus: false,
  loadingStatus: false,
  tableList: [],
})

/**
 * 打开显示
 */
const show = (tableList: GenTableInfoResponse[]) => {
  if (tableList && tableList.length > 0) {
    state.visibleStatus = true
    state.tableList = [...tableList]
  }
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      await downloadFileApi(
        state.tableList.map((item) => item.id),
        addUpdateForm.packageName
      )
        .then((data) => {
          handleBlobFile(new Blob([data as any]), 'ZZZ.zip')
          useMessage().success('下载文件成功!')
        })
        .finally(() => {
          state.loadingStatus = false
        })
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
  state.loadingStatus = false
  state.tableList = []
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    title="文件下载"
    size="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <div class="h-full flex flex-col overflow-hidden" style="">
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
          <el-col :span="24">
            <el-form-item label="包名" prop="packageName">
              <el-input v-model="addUpdateForm.packageName" placeholder="请输入包名" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="state.loadingStatus" :data="state.tableList" border row-key="id" empty-text="系统相关表信息！">
        <xht-column-index type="step" />
        <el-table-column :resizable="false" label="引擎名称" prop="engineName" width="120" />
        <el-table-column :resizable="false" align="left" label="数据库表名" prop="tableName" sortable width="220" />
        <el-table-column :resizable="false" label="表注释" prop="tableComment" />
      </el-table>
    </div>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style scoped></style>
