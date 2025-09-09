<template>
  <el-drawer
    v-model="state.visibleStatus"
    size="100%"
    fullscreen
    title="字段信息列表"
    destroy-on-close
  >
    <el-table v-loading="loading" :data="filteredColumns" border>
      <el-table-column>
        <template #header>
          <div class="text-right">
            <el-button type="primary" @click="addNewColumn">
              <el-icon>
                <Plus />
              </el-icon>
              添加字段
            </el-button>
          </div>
        </template>
        <el-table-column
          type="index"
          label="序号"
          :index="(index) => index + 1"
          width="55"
          align="center"
        />
        <el-table-column prop="columnName" label="字段名" align="left">
          <template #default="scope">
            <el-input
              v-model="scope.row.columnName"
              size="small"
              :disabled="scope.row.isPrimary === 1"
              placeholder="请输入字段名"
            />
          </template>
        </el-table-column>
        <el-table-column prop="dbDataType" label="数据库类型" align="center" />
        <el-table-column prop="columnComment" label="字段注释" align="left">
          <template #default="scope">
            <el-input v-model="scope.row.columnComment" size="small" placeholder="请输入注释" />
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" align="left">
          <template #default="scope">
            <el-input v-model="scope.row.defaultValue" size="small" placeholder="默认值" />
          </template>
        </el-table-column>
        <el-table-column prop="isRequired" label="必填" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.isRequired" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column prop="isPrimary" label="主键" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isPrimary"
              active-value="1"
              inactive-value="0"
              :disabled="scope.row.isPrimary === 1 && columns.length <= 1"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" align="center">
          <template #default="scope">
            <el-input-number v-model="scope.row.sortOrder" :min="0" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">
              <el-icon>
                <Edit />
              </el-icon>
              详情
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.isPrimary === 1 && columns.length <= 1"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <!-- 详情编辑弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="字段详情配置"
      :width="dialogWidth"
      :before-close="handleDialogClose"
    >
      <GenColumnInfoForm ref="columnFormRef" :initial-data="currentColumn" @save="handleFormSave" />
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import GenColumnInfoForm from './GenColumnInfoForm.vue'
import type { GenColumnInfoOperationRequest } from '@/model/generate/column.model'
import type { ModeIdType } from '@/model/base.model'

const state = reactive<any>({
  visibleStatus: true,
})

// 定义props
const props = defineProps<{
  // 字段数组
  columns: GenColumnInfoOperationRequest[]
  // 表格宽度
  tableWidth?: string
  // 表ID
  tableId?: ModeIdType
}>()

// 内部维护的字段数组，深拷贝防止直接修改props
const columns = ref<GenColumnInfoOperationRequest[]>(
  JSON.parse(JSON.stringify(props.columns || []))
)

// 搜索关键词
const searchKeyword = ref('')
// 加载状态
const loading = ref(false)
// 详情弹窗可见性
const detailDialogVisible = ref(false)
// 当前编辑的字段
const currentColumn = ref<GenColumnInfoOperationRequest | null>(null)
// 表单引用
const columnFormRef = ref<any>(null)
// 过滤后的字段列表
const filteredColumns = computed(() => {
  if (!searchKeyword.value) return columns.value

  const keyword = searchKeyword.value.toLowerCase()
  return columns.value.filter(
    (col) =>
      col.columnName.toLowerCase().includes(keyword) ||
      col.columnComment.toLowerCase().includes(keyword)
  )
})

// 弹窗宽度
const dialogWidth = computed(() => {
  return window.innerWidth > 1024 ? '800px' : '90%'
})

// 添加新字段
const addNewColumn = () => {
  const newId = Date.now().toString()
  const newColumn: GenColumnInfoOperationRequest = {
    id: newId,
    tableId: props.tableId || '',
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
      gridItem: '0',
      gridSort: '0',
      queryItem: '0',
      queryType: '',
      queryFormType: '',
      typeMappings: [],
    },
    sortOrder: columns.value.length,
  }

  columns.value.push(newColumn)

  // 自动打开详情编辑
  nextTick(() => {
    handleEdit(newColumn)
  })
}

// 处理编辑详情
const handleEdit = (row: GenColumnInfoOperationRequest) => {
  currentColumn.value = JSON.parse(JSON.stringify(row))
  detailDialogVisible.value = true
}

// 处理表单保存
const handleFormSave = (formData: GenColumnInfoOperationRequest) => {
  // 找到对应的索引并更新
  const index = columns.value.findIndex((col) => col.id === formData.id)

  if (index !== -1) {
    // 检查是否有变化
    if (JSON.stringify(columns.value[index]) !== JSON.stringify(formData)) {
      columns.value[index] = { ...formData }
    }
  } else {
    // 如果是新添加的且之前未找到（可能是在弹窗中新建的情况）
    columns.value.push({ ...formData })
  }

  detailDialogVisible.value = false
  ElMessage.success('字段信息已保存')
}

// 处理删除
const handleDelete = (index: number, row: GenColumnInfoOperationRequest) => {
  ElMessageBox.confirm(`确定要删除字段"${row.columnName || '未命名字段'}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      columns.value.splice(index, 1)
      ElMessage.success('字段已删除')
    })
    .catch(() => {
      // 取消删除
    })
}

// 处理弹窗关闭
const handleDialogClose = () => {
  detailDialogVisible.value = false
  currentColumn.value = null
}
</script>
