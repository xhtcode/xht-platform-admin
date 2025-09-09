<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="160px"
    class="column-form"
    size="default"
  >
    <!-- 基本信息区域 -->
    <el-divider content-position="left">基本信息</el-divider>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="表ID" prop="tableId">
          <el-input v-model="formData.tableId" placeholder="请输入表ID" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="数据库字段名" prop="columnName">
          <el-input v-model="formData.columnName" placeholder="请输入数据库字段名" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="数据库字段类型" prop="dbDataType">
          <el-select v-model="formData.dbDataType" placeholder="请选择数据库类型" clearable>
            <el-option label="MySql" value="MySql" />
            <el-option label="Oracle" value="Oracle" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="字段注释" prop="columnComment">
          <el-input v-model="formData.columnComment" placeholder="请输入字段注释" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="字段默认值" prop="defaultValue">
          <el-input v-model="formData.defaultValue" placeholder="请输入字段默认值" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="字段排序" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" placeholder="请输入排序号" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="是否必填">
          <el-radio-group v-model="formData.isRequired">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="是否主键">
          <el-radio-group v-model="formData.isPrimary">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 扩展配置区域 -->
    <el-divider content-position="left">扩展配置</el-divider>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="表单项">
          <el-radio-group v-model="formData.extConfig.formItem">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="表单必填">
          <el-radio-group v-model="formData.extConfig.formRequired">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="表单类型" prop="extConfig.formType">
          <el-input v-model="formData.extConfig.formType" placeholder="请输入表单类型" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="表单效验" prop="extConfig.formValidator">
          <el-input
            v-model="formData.extConfig.formValidator"
            placeholder="请输入表单效验规则"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="列表项">
          <el-radio-group v-model="formData.extConfig.gridItem">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="列表排序">
          <el-radio-group v-model="formData.extConfig.gridSort">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="查询项">
          <el-radio-group v-model="formData.extConfig.queryItem">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="查询方式" prop="extConfig.queryType">
          <el-input v-model="formData.extConfig.queryType" placeholder="请输入查询方式" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="查询表单类型" prop="extConfig.queryFormType">
          <el-input
            v-model="formData.extConfig.queryFormType"
            placeholder="请输入查询表单类型"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 类型映射区域 -->
    <el-divider content-position="left">
      类型映射
      <el-button type="primary" size="small" class="add-mapping-btn" @click="addTypeMapping">
        <el-icon>
          <Plus />
        </el-icon>
        添加映射
      </el-button>
    </el-divider>

    <el-collapse v-model="activeMappingNames">
      <template v-for="(mapping, index) in formData.extConfig.typeMappings" :key="index">
        <el-collapse-item
          :title="`映射 ${index + 1} ${mapping.languageType || ''}`"
          :name="`mapping-${index}`"
        >
          <el-row :gutter="20" class="mapping-row">
            <el-col :span="6">
              <el-form-item
                :label="`语言类型`"
                :prop="`extConfig.typeMappings.${index}.languageType`"
              >
                <el-input v-model="mapping.languageType" placeholder="请输入语言类型" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item
                :label="`字段类型`"
                :prop="`extConfig.typeMappings.${index}.columnType`"
              >
                <el-input v-model="mapping.columnType" placeholder="请输入字段类型" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                :label="`导入包路径`"
                :prop="`extConfig.typeMappings.${index}.importPackage`"
              >
                <el-input
                  v-model="mapping.importPackage"
                  placeholder="如：java.time.LocalDateTime"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item
                :label="`默认值`"
                :prop="`extConfig.typeMappings.${index}.defaultValue`"
              >
                <el-input v-model="mapping.defaultValue" placeholder="请输入默认值" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="1" class="delete-col">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                circle
                @click="removeTypeMapping(index)"
              />
            </el-col>
          </el-row>
        </el-collapse-item>
      </template>
    </el-collapse>

    <!-- 提交按钮区域 -->
    <el-form-item class="form-actions">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button type="info" @click="cancelForm">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 定义ModeIdType类型
type ModeIdType = string | number

// 定义LanguageTypeEnums类型
enum LanguageTypeEnums {
  JAVA = 'java',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  // 可以根据实际需求添加更多语言类型
}

// 定义ColumnInfoTypeMapping接口
interface ColumnInfoTypeMapping {
  languageType: LanguageTypeEnums | string
  columnType: string
  importPackage: string
  defaultValue: string
}

// 定义GenColumnInfoExtConfig接口
interface GenColumnInfoExtConfig {
  formItem: string
  formRequired: string
  formType: string
  formValidator: string
  gridItem: string
  gridSort: string
  queryItem: string
  queryType: string
  queryFormType: string
  typeMappings: ColumnInfoTypeMapping[]
}

// 定义GenColumnInfoOperationRequest接口
interface GenColumnInfoOperationRequest {
  id: ModeIdType
  tableId: ModeIdType
  columnName: string
  dbDataType: string
  columnComment: string
  defaultValue: string
  isRequired: number
  isPrimary: number
  extConfig: GenColumnInfoExtConfig
  sortOrder: number
}

// 表单引用
const formRef = ref<InstanceType<typeof ElForm>>()

// 初始化表单数据
const formData = reactive<GenColumnInfoOperationRequest>({
  id: '',
  tableId: '',
  columnName: '',
  dbDataType: '',
  columnComment: '',
  defaultValue: '',
  isRequired: 0,
  isPrimary: 0,
  extConfig: {
    formItem: '0',
    formRequired: '0',
    formType: '',
    formValidator: '',
    gridItem: '0',
    gridSort: '0',
    queryItem: '0',
    queryType: '',
    queryFormType: '',
    typeMappings: [],
  },
  sortOrder: 0,
})

// 展开的映射项
const activeMappingNames = ref<string[]>([])

// 表单验证规则
const formRules = reactive({
  tableId: [{ required: true, message: '请输入表ID', trigger: 'blur' }],
  columnName: [
    { required: true, message: '请输入数据库字段名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      message: '字段名只能包含字母、数字和下划线，且不能以数字开头',
      trigger: 'blur',
    },
  ],
  dbDataType: [{ required: true, message: '请选择数据库字段类型', trigger: 'change' }],
  'extConfig.formType': [
    {
      required: computed(() => formData.extConfig.formItem === '1'),
      message: '请输入表单类型',
      trigger: 'blur',
    },
  ],
  'extConfig.queryType': [
    {
      required: computed(() => formData.extConfig.queryItem === '1'),
      message: '请输入查询方式',
      trigger: 'blur',
    },
  ],
})

// 添加类型映射
const addTypeMapping = () => {
  const newMapping: ColumnInfoTypeMapping = {
    languageType: '',
    columnType: '',
    importPackage: '',
    defaultValue: '',
  }

  formData.extConfig.typeMappings.push(newMapping)

  // 自动展开新添加的映射项
  activeMappingNames.value.push(`mapping-${formData.extConfig.typeMappings.length - 1}`)
}

// 移除类型映射
const removeTypeMapping = (index: number) => {
  formData.extConfig.typeMappings.splice(index, 1)

  // 更新展开的映射项名称
  activeMappingNames.value = activeMappingNames.value
    .filter((name) => {
      const num = parseInt(name.split('-')[1])
      return num !== index
    })
    .map((name) => {
      const num = parseInt(name.split('-')[1])
      return num > index ? `mapping-${num - 1}` : name
    })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 这里可以添加表单提交逻辑
    console.log('表单数据:', formData)

    // 模拟提交成功
    ElMessage.success('表单提交成功')
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('表单验证失败，请检查输入')
  }
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ElMessage.info('表单已重置')
}

// 取消表单
const cancelForm = () => {
  // 这里可以添加取消逻辑，如关闭弹窗等
  ElMessage.info('已取消')
}

// 组件挂载时初始化一个类型映射
onMounted(() => {
  if (formData.extConfig.typeMappings.length === 0) {
    addTypeMapping()
  }
})
</script>
