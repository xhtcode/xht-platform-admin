<script lang="ts" setup>
/**
 * 系统管理 - 行政区划管理页面
 * 采用左右分栏布局：左侧为懒加载行政区划树，右侧为对应节点的详情表单
 * 支持对行政区划的新增、修改、删除、刷新等操作
 */
import type { FormInstance, FormRules } from 'element-plus'
import type { SysAreaOperationRequest, SysAreaQueryRequest, SysAreaResponse, SysAreaTreeResponse } from '@/service/model/system/area.model'
import { querySysAreaById, querySysAreaList, removeSysAreaById, saveSysArea, updateSysArea } from '@/service/api/system/area.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { Delete, Edit, Plus, Refresh } from '@element-plus/icons-vue'
import { useTemplateRef } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { TreeData } from 'element-plus/es/components/tree/src/tree.type'
import { sysAreaOperationForm, sysAreaOperationRules } from '@/views/system/area/area.data'
import { sysAreaHashChildEnum } from '@/service/enums/system/area.enum'

/** 组件名称，用于 keep-alive 缓存识别 */
defineOptions({ name: 'SysAreaViewIndex' })

/** 页面响应式状态 */
const state = reactive<TableQueryListState<SysAreaQueryRequest, SysAreaTreeResponse>>({
  loadingStatus: false, // 加载状态
  refreshTable: true, // 是否刷新表格（控制表单是否可编辑）
  expandAllStatus: true, // 展开所有节点状态
  searchStatus: false, // 是否显示搜索区域
  create: false, // 是否处于新增模式
  update: false, // 是否处于修改模式
  parentName: '', // 当前选中节点的上级名称显示
  queryParams: {
    parentAreaCode: '-1', // 默认查询根节点（国家级）
  }, // 查询参数
  tableList: [], // 树形表格数据列表
})
/** 树组件 DOM 引用 */
const treeRef = useTemplateRef('treeRef')
/** 新增/修改表单数据模型 */
const addUpdateForm = ref<SysAreaOperationRequest>({ ...sysAreaOperationForm })
/** 表单实例引用，用于调用 validate、resetFields 等方法 */
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
/** 表单校验规则 */
const rules: FormRules<Required<SysAreaOperationRequest>> = sysAreaOperationRules
/** 树组件属性配置：定义子节点字段、显示标签字段、是否叶子节点判断逻辑 */
const areaTreeProps: any = {
  children: 'children',
  label: 'areaName',
  isLeaf: (item: any) => {
    return item.hasChild === sysAreaHashChildEnum.NO_CHILD.value
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
    parentAreaCode: rootNode.data.areaCode || '-1',
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
 * 点击树节点时获取区划详情并回显到右侧表单
 * @param node 被点击的节点数据
 * @param parent 父节点上下文，用于显示上级信息
 */
const getAreaInfo = async (node: SysAreaResponse, { parent }: any) => {
  try {
    state.loadingStatus = true
    state.refreshTable = true
    state.create = false
    state.update = false
    if (parent && parent.data && node.parentAreaCode !== '-1') {
      state.parentName = `${parent.data?.areaName}(${parent.data?.areaCode})`
    } else {
      state.parentName = '国家'
    }
    state.parentId = node.id
    const { data } = await querySysAreaById(node.id)
    addUpdateForm.value = data
    state.loadingStatus = false
  } catch {
    state.loadingStatus = false
  }
}
/**
 * 进入新增模式
 * 将当前选中节点的 areaCode 作为新节点的父级编码，重置表单字段
 */
const create = () => {
  addUpdateForm.value = { ...sysAreaOperationForm, parentAreaCode: addUpdateForm.value.areaCode }
  addUpdateFormRef.value?.resetFields()
  state.refreshTable = false
  state.create = true
  state.update = false
}
/**
 * 进入修改模式（仅在已选中节点时可用）
 */
const update = () => {
  if (addUpdateForm.value.id) {
    state.refreshTable = false
    state.create = false
    state.update = true
  }
}
/**
 * 刷新加载：重新请求根节点数据，重置所有表单和交互状态
 */
const refreshLoad = async () => {
  state.loadingStatus = true
  state.refreshTable = true
  state.create = false
  state.update = false
  treeRef.value?.setCurrentKey(undefined)
  const { data } = await querySysAreaList({
    parentAreaCode: '-1',
  })
  state.parentName = null
  state.tableList = data
  addUpdateForm.value = { ...sysAreaOperationForm }
  addUpdateFormRef.value?.resetFields()
  state.loadingStatus = false
}
/**
 * 取消操作：关闭表单编辑状态，恢复为只读展示
 */
const close = () => {
  state.refreshTable = true
  addUpdateForm.value = { ...sysAreaOperationForm }
  state.create = false
  state.update = false
  treeRef.value?.setCurrentKey(undefined)
  addUpdateFormRef.value?.resetFields()
}
/**
 * 提交表单（新增或修改）
 * 先进行表单校验，通过后调用对应的 API 接口，成功后刷新树数据
 * @param operationStatus 操作类型：'create' 新增 | 'update' 修改
 */
const submitForm = (operationStatus: 'create' | 'update') => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (operationStatus === 'create') {
        saveSysArea(addUpdateForm.value)
          .then(() => {
            useMessage().success(`新增系统管理-行政区划成功`)
            state.loadingStatus = false
            return refreshLoad()
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        updateSysArea(addUpdateForm.value)
          .then(() => {
            useMessage().success(`修改系统管理-行政区划成功`)
            state.loadingStatus = false
            return refreshLoad()
          })
          .finally(() => {
            state.loadingStatus = false
          })
      }
    } else {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}
/**
 * 删除当前选中的行政区划
 * 弹出确认框后调用删除接口，成功后刷新树数据
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
    <!-- 左侧：懒加载行政区划树 -->
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
            <el-text size="large" tag="b" class="user-select-none">
              {{ data.areaName }}
            </el-text>
            <el-text size="small" type="info" class="user-select-none float-right">
              {{ data.areaCode }}
            </el-text>
          </div>
        </template>
      </el-tree>
    </div>
    <!-- 右侧：区划详情表单及操作按钮 -->
    <div class="xht-view-container flex-[2]">
      <!-- 操作按钮栏：删除、增加、修改、刷新 -->
      <div class="pb-10px text-right">
        <el-button type="danger" :icon="Delete" :disabled="!addUpdateForm.id" size="small" @click="handleDelete">删除</el-button>
        <el-button type="primary" :icon="Plus" :disabled="!addUpdateForm.id" size="small" @click="create">增加</el-button>
        <el-button type="success" :icon="Edit" :disabled="!addUpdateForm.id" size="small" @click="update">修改</el-button>
        <el-button type="info" :icon="Refresh" size="small" @click="refreshLoad">刷新</el-button>
      </div>
      <!-- 区划信息表单（新增/修改模式下可编辑） -->
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
        <!-- 表单提交/取消按钮区域 -->
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
