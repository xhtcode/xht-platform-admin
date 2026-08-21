<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { SysAreaOperationRequest, SysAreaQueryRequest, SysAreaResponse, SysAreaTreeResponse } from '@/service/model/system/area.model'
import { querySysAreaById, querySysAreaList, removeSysAreaById, saveSysArea, updateSysArea } from '@/service/api/system/area.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { Delete, Edit, Plus, Refresh } from '@element-plus/icons-vue'
import { useTemplateRef } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { TreeData } from 'element-plus/es/components/tree/src/tree.type'
import { sysAreaOperationForm, sysAreaOperationRules } from '@/views/system/area/area.data'

defineOptions({ name: 'SysAreaViewIndex' })

const state = reactive<TableQueryListState<SysAreaQueryRequest, SysAreaTreeResponse>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 刷新表格状态
  expandAllStatus: true, // 展开所有状态
  searchStatus: false, // 是否显示搜索区域
  create: false,
  update: false,
  parentName: '',
  queryParams: {
    parentId: 1,
  }, // 查询参数
  tableList: [], // 表格数据列表
})
const treeRef = useTemplateRef('treeRef')
const addUpdateForm = ref<SysAreaOperationRequest>({ ...sysAreaOperationForm })
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules<Required<SysAreaOperationRequest>> = sysAreaOperationRules
const areaTreeProps: any = {
  children: 'children',
  label: 'areaName',
  isLeaf: (item: any) => {
    return item.hasChild === 0
  },
}
/**
 * 加载树数据
 * @param rootNode 节点数据
 * @param loadedCallback 回调函数
 */
const loadTreeData = (rootNode: Node, loadedCallback: (data: TreeData) => void) => {
  state.loadingStatus = true
  state.queryParams = {
    parentId: rootNode.data.id || 0,
  }
  querySysAreaList(state.queryParams)
    .then((res) => {
      loadedCallback(res.data)
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 打开显示
 */
const getAreaInfo = async (node: SysAreaResponse) => {
  try {
    state.loadingStatus = true
    state.refreshTable = true
    state.create = false
    state.update = false
    state.parentName = `${node.areaName}(${node.areaCode})`
    state.parentId = node.id
    const { data } = await querySysAreaById(node.id)
    addUpdateForm.value = data
    state.loadingStatus = false
  } catch {
    state.loadingStatus = false
  }
}
const create = () => {
  addUpdateForm.value = { ...sysAreaOperationForm, parentId: addUpdateForm.value.id }
  addUpdateFormRef.value?.resetFields()
  state.refreshTable = false
  state.create = true
  state.update = false
}
const update = () => {
  if (addUpdateForm.value.id) {
    state.refreshTable = false
    state.create = false
    state.update = true
  }
}
const refreshLoad = async () => {
  state.loadingStatus = true
  state.refreshTable = true
  state.create = false
  state.update = false
  treeRef.value?.setCurrentKey(undefined)
  const { data } = await querySysAreaList({
    parentId: 0,
  })
  state.parentName = null
  state.tableList = data
  addUpdateForm.value = { ...sysAreaOperationForm }
  addUpdateFormRef.value?.resetFields()
  state.loadingStatus = false
}
const close = () => {
  state.refreshTable = true
  addUpdateForm.value = { ...sysAreaOperationForm }
  state.create = false
  state.update = false
  treeRef.value?.setCurrentKey(undefined)
  addUpdateFormRef.value?.resetFields()
}
/**
 * 提交表单
 */
const submitForm = (operationStatus: 'create' | 'update') => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (operationStatus === 'create') {
          await saveSysArea(addUpdateForm.value)
          useMessage().success(`新增系统管理-行政区划成功`)
        } else {
          await updateSysArea(addUpdateForm.value)
          useMessage().success(`修改系统管理-行政区划成功`)
        }
        state.loadingStatus = false
        await refreshLoad()
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
 * 处理删除系统管理-行政区划
 */
const handleDelete = () => {
  state.loadingStatus = true
  useMessageBox()
    .confirm(`此操作将永久删除${addUpdateForm.value.areaName}, 是否继续?`)
    .then(async () => {
      await removeSysAreaById(addUpdateForm.value.id)
      await refreshLoad()
      useMessage().success('删除系统管理-行政区划成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}
</script>

<template>
  <div class="h-full flex gap-1">
    <div class="xht-view-container flex-1">
      <el-tree
        ref="treeRef"
        v-loading="state.loadingStatus"
        :check-strictly="false"
        lazy
        :data="state.tableList"
        :load="loadTreeData"
        :props="areaTreeProps"
        :expand-on-click-node="false"
        highlight-current
        @node-click="getAreaInfo"
        empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
        node-key="id"
      >
        <template #default="{ data }">
          <div class="flex flex-1 items-center justify-between pr-18px">
            <el-text size="large" tag="b" class="user-select-none">{{ data.areaName }}</el-text>
            <el-text size="small" type="info" class="user-select-none float-right">{{ data.areaCode }}</el-text>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="xht-view-container flex-[2]">
      {{ addUpdateForm.parentId }}
      <div class="pb-10px text-right">
        <el-button type="danger" :icon="Delete" :disabled="!addUpdateForm.id" @click="handleDelete">删除</el-button>
        <el-button type="primary" :icon="Plus" :disabled="!addUpdateForm.id" @click="create">增加</el-button>
        <el-button type="success" :icon="Edit" :disabled="!addUpdateForm.id" @click="update">修改</el-button>
        <el-button type="info" :icon="Refresh" @click="refreshLoad">刷新</el-button>
      </div>
      <el-form
        v-loading="state.loadingStatus"
        ref="addUpdateFormRef"
        :model="addUpdateForm"
        :rules="rules"
        inline-message
        :disabled="state.refreshTable"
        label-width="120px"
        scroll-to-error
      >
        <el-form-item label="上级信息">
          <el-input v-model="state.parentName" disabled clearable :maxlength="100" show-word-limit placeholder="请输入上级" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区划编码" prop="areaCode">
              <el-input v-model="addUpdateForm.areaCode" clearable :maxlength="6" show-word-limit placeholder="请输入区划编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区划名称" prop="areaName">
              <el-input v-model="addUpdateForm.areaName" clearable :maxlength="100" show-word-limit placeholder="请输入区划名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="areaLongitude">
              <el-input v-model="addUpdateForm.areaLongitude" clearable :maxlength="10" show-word-limit placeholder="请输入经度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="areaLatitude">
              <el-input v-model="addUpdateForm.areaLatitude" clearable :maxlength="10" show-word-limit placeholder="请输入纬度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮政编码" prop="areaPostCode">
              <el-input v-model="addUpdateForm.areaPostCode" clearable :maxlength="6" show-word-limit placeholder="请输入邮政编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="areaSort">
              <el-input-number v-model="addUpdateForm.areaSort" :min="0" :max="999" class="w-full!" value-on-clear="min" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="text-right">
          <el-button :disabled="state.loadingStatus" v-if="state.update || state.create" @click="close">取 消</el-button>
          <el-button :disabled="state.loadingStatus" v-if="state.create" type="primary" @click="submitForm('create')">增加</el-button>
          <el-button :disabled="state.loadingStatus" v-if="state.update" type="primary" @click="submitForm('update')">修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
