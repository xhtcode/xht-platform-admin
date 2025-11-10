<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    title="文件下载"
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
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="包名" prop="packageName">
            <el-input v-model="addUpdateForm.packageName" placeholder="请输入包名" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <xht-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      empty-text="系统相关表信息！"
    >
      <xht-column-index type="step" />
      <el-table-column label="引擎名称" prop="engineName" width="100" />
      <el-table-column label="数据库表名" align="left" prop="tableName" width="220" sortable />
      <el-table-column label="表注释" prop="tableComment" width="260" show-overflow-tooltip />
    </xht-table>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'
import { downloadFileApi } from '@/service/api/generate/table.api'
import { useMessage } from '@/hooks/use-message'

interface CrudOption {
  visibleStatus: boolean
  loadingStatus: boolean
  tableList: GenTableInfoResponse[]
}

const rules: FormRules = {
  packageName: [{ required: true, message: '请填写包名', trigger: ['blur', 'change'] }],
}
const addUpdateForm = ref<{
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
      downloadFileApi(
        state.tableList.map((item) => item.id),
        addUpdateForm.value.packageName
      )
        .then((data) => {
          console.log(data)
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
  addUpdateForm.value = {
    packageName: 'com.xht.demo',
  }
  state.visibleStatus = false
  state.loadingStatus = false
  state.tableList = []
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>

<style scoped></style>
