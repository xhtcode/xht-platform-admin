# 新增业务页面：完整模板

以"示例管理（`system/example`）"为例。把 `example / Example / SysExample` 按实际业务替换即可。
所有骨架均取自 `src/views/system/user/`、`src/service/**` 现有实现。

## 0. 文件清单

```
src/service/model/system/example.model.ts
src/service/enums/system/example.enum.ts
src/service/api/system/example.api.ts
src/views/system/example/index.vue
src/views/system/example/example.data.ts
src/views/system/example/components/example-form.vue
```

## 1. model

```ts
// src/service/model/system/example.model.ts

/**
 * 示例状态
 */
export type ExampleStatusType = 0 | 1

/**
 * 查询请求类型
 */
export interface SysExampleQueryRequest extends PageQueryRequest {
  exampleName?: string // 名称
  exampleStatus?: ExampleStatusType // 状态
}

/**
 * 响应类型
 */
export interface SysExampleResponse extends MetaResponse {
  id: ModeIdType // 主键
  exampleName: string // 名称
  exampleStatus: ExampleStatusType // 状态
  remark?: string // 备注
}

/**
 * 组合视图对象
 */
export interface SysExampleVo extends Partial<SysExampleResponse> {}

/**
 * 新增/修改入参
 */
export interface SysExampleOperationRequest extends SysExampleVo, BasicFormRequest {}
```

要点：
- `id` 用全局 `ModeIdType`，禁止 `string | number`。
- 查询入参 `extends PageQueryRequest`（自带 `size/current/ascName/descName/quick/keyWord`），响应 `extends MetaResponse`（自带 `createBy/createTime/updateBy/updateTime`）。

## 2. enum

```ts
// src/service/enums/system/example.enum.ts
import type { ExampleStatusType } from '@/service/model/system/example.model'

/**
 * 示例状态枚举
 */
export const exampleStatusEnum: DictEnum<ExampleStatusType, 'NORMAL' | 'DISABLED'> = {
  NORMAL: { label: '正常', value: 0, type: 'success' },
  DISABLED: { label: '已停用', value: 1, type: 'info' },
}
```

`DictEnum` 来自 `src/typings/global.d.ts`，无需 import；标签统一用 `type`（EP 语义色），不要写 `color: '#67C23A'`。

## 3. api

```ts
// src/service/api/system/example.api.ts
import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysExampleOperationRequest, SysExampleQueryRequest, SysExampleResponse } from '@/service/model/system/example.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/example/create',
  UPDATE = '/sys/example/update/',
  REMOVE = '/sys/example/remove/',
  QUERY_BY_ID = '/sys/example/get/',
  QUERY_PAGE = '/sys/example/page',
}

/**
 * 保存
 */
export const saveSysExample = (data: SysExampleOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({ url: Api.CREATE, baseURL, method: 'post', data: data })
}

/**
 * 修改数据
 */
export const updateSysExample = (data: SysExampleOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({ url: Api.UPDATE + `${data.id}`, baseURL, method: 'post', data: data })
}

/**
 * 删除
 */
export const removeSysExampleById = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({ url: Api.REMOVE + `${id}`, baseURL, method: 'post' })
}

/**
 * 根据ID查询
 */
export const querySysExampleById = (id: ModeIdType): Promise<ApiResponse<SysExampleResponse>> => {
  return request<SysExampleResponse>({ url: Api.QUERY_BY_ID + `${id}`, baseURL, method: 'get' })
}

/**
 * 分页查询
 */
export const querySysExamplePage = (data?: SysExampleQueryRequest): Promise<ApiResponse<PageResponse<SysExampleResponse>>> => {
  return request<PageResponse<SysExampleResponse>>({ url: Api.QUERY_PAGE, baseURL, method: 'post', data: data })
}
```

要点：路径写进 `enum Api`，不在函数体里撒裸字符串；带路径参数时保留后端要求的结尾斜杠；api 层只发请求，不做提示与状态变更。

## 4. data.ts

```ts
// src/views/system/example/example.data.ts
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { SysExampleOperationRequest, SysExampleResponse } from '@/service/model/system/example.model'

/**
 * 示例 表单初始值
 */
export const sysExampleOperationForm: SysExampleOperationRequest = {
  exampleName: undefined,
  exampleStatus: 0,
  remark: undefined,
}

/**
 * 示例 表单校验规则
 */
export const sysExampleOperationRules: FormRules<Required<SysExampleOperationRequest>> = {
  exampleName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

/**
 * 示例 列表显示配置
 */
export const sysExampleColumnOption: ColumnConfig<SysExampleResponse> = {
  exampleName: { desc: '名称', visible: true, disabled: true },
  exampleStatus: { desc: '状态', visible: true, disabled: false },
  remark: { desc: '备注', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: true, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
```

`disabled: true` 表示该列不允许用户在"列设置"里关闭（通常是主标识列）。

## 5. index.vue（列表页）

```vue
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { querySysExamplePage, removeSysExampleById } from '@/service/api/system/example.api'
import { exampleStatusEnum } from '@/service/enums/system/example.enum'
import type { SysExampleQueryRequest, SysExampleResponse } from '@/service/model/system/example.model'
import { sysExampleColumnOption } from '@/views/system/example/example.data'

defineOptions({ name: 'SysExampleViewIndex' })

const exampleForm = defineAsyncComponent(() => import('@/views/system/example/components/example-form.vue'))
const exampleFormRef = useTemplateRef('exampleFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')

const state = reactive<TableQueryPageState<SysExampleQueryRequest, SysExampleResponse>>({
  queryParams: {
    descName: 'createTime',
  }, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})
const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysExampleQueryRequest, SysExampleResponse>(state, querySysExamplePage)
const { queryParams } = toRefs(state)
const columnOption = ref<ColumnConfig<SysExampleResponse>>({ ...sysExampleColumnOption })

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 新增
 */
const handleAdd = () => {
  exampleFormRef.value?.show('create', null)
}

/**
 * 修改
 */
const handleEdit = (row: SysExampleResponse) => {
  exampleFormRef.value?.show('update', row.id)
}

/**
 * 删除
 */
const handleDelete = (row: SysExampleResponse) => {
  useMessageBox()
    .confirm('此操作将永久删除该数据, 是否继续?')
    .then(async () => {
      await removeSysExampleById(row.id)
      await handlePageQuery()
      useMessage().success('删除成功!')
    })
    .catch(() => {
      // 取消删除，不做处理
    })
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container h-full">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="80px">
      <el-row v-if="!state.searchStatus">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
          <el-form-item label="名称" prop="exampleName">
            <el-input v-model="queryParams.exampleName" :maxlength="50" placeholder="请输入名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
          <el-form-item label="状态" prop="exampleStatus">
            <xht-enum-select v-model="queryParams.exampleStatus" :data="exampleStatusEnum" clearable placeholder="请选择状态" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <table-tool-bar
      v-model:column-data="columnOption"
      v-model:show-search="state.searchStatus"
      column-status
      refresh-status
      search-status
      @refresh="resetQuery"
    >
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:example:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        v-authorization="['sys:example:update']"
        @click="handleEdit(state.selectedRows[0])"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        v-authorization="['sys:example:remove']"
        @click="handleDelete(state.selectedRows[0])"
      >
        删除
      </el-button>
    </table-tool-bar>

    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧！"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" fixed="left" />
      <xht-column-index :current="queryParams.current" :size="queryParams.size" fixed="left" />
      <el-table-column v-if="columnOption.exampleName?.visible" label="名称" min-width="160" prop="exampleName" show-overflow-tooltip />
      <el-table-column v-if="columnOption.exampleStatus?.visible" label="状态" min-width="100" prop="exampleStatus">
        <template #default="{ row }">
          <xht-enum-tag :filter-label="row.exampleStatus" :data="exampleStatusEnum" />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.remark?.visible" label="备注" min-width="200" prop="remark" show-overflow-tooltip />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column label="操作" fixed="right" width="180">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:example:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:example:remove']">删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <xht-pagination
      v-model:current-page="state.queryParams.current"
      v-model:page-size="state.queryParams.size"
      :page-count="state.pages"
      :total="state.total"
      @pagination="handlePageQuery"
    />
    <example-form ref="exampleFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
```

要点：
- `xht-enum-select` / `xht-enum-tag` / `xht-column-index` / `xht-pagination` / `table-tool-bar` 都是自动注册的全局组件，**不要 import**。
- `defineOptions` 必须是 `SysXxxViewIndex` 形式；`user-form` 之类模块内组件用 `defineAsyncComponent` 懒加载。
- 查询条件全部挂在 `state.queryParams` 上，否则翻页会丢条件。
- 权限串 `sys:<模块>:create|update|remove` 必须与后端菜单按钮编码一致；超管自动放行。

## 6. components/example-form.vue（抽屉表单）

```vue
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysExampleById, saveSysExample, updateSysExample } from '@/service/api/system/example.api'
import { useMessage } from '@/hooks/use-message'
import type { SysExampleOperationRequest } from '@/service/model/system/example.model'
import { sysExampleOperationForm, sysExampleOperationRules } from '@/views/system/example/example.data'
import { exampleStatusEnum } from '@/service/enums/system/example.enum'

defineOptions({ name: 'ExampleForm' })

const emits = defineEmits(['success'])
const rules: FormRules<Required<SysExampleOperationRequest>> = sysExampleOperationRules
const state = reactive<AddUpdateOption<SysExampleOperationRequest>>({
  title: '增加示例信息',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysExampleOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改示例信息'
      const { data } = await querySysExampleById(id)
      addUpdateForm.value = { ...data }
    }
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  addUpdateForm.value = { ...sysExampleOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (!valid) {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
      return
    }
    try {
      if (state.operationStatus === 'create') {
        await saveSysExample(addUpdateForm.value)
        useMessage().success('新增成功')
      } else {
        await updateSysExample(addUpdateForm.value)
        useMessage().success('修改成功')
      }
      emits('success')
      close()
    } finally {
      state.loadingStatus = false
    }
  })
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    :title="state.title"
    size="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      inline-message
      label-width="100px"
      scroll-to-error
    >
      <el-form-item label="名称" prop="exampleName">
        <el-input v-model="addUpdateForm.exampleName" :maxlength="50" placeholder="请输入名称" show-word-limit />
      </el-form-item>
      <el-form-item label="状态" prop="exampleStatus">
        <xht-enum-select v-model="addUpdateForm.exampleStatus" :data="exampleStatusEnum" placeholder="请选择状态" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="addUpdateForm.remark" :maxlength="200" :rows="3" placeholder="请输入备注" show-word-limit type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取消</el-button>
      <el-button :loading="state.loadingStatus" type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
```

要点：
- `defineExpose({ show })` 必须写，否则父页 `ref.value?.show()` 无效。
- 成功后 `emits('success')`，父页靠它刷新列表。
- 不要 import `ref/reactive/toRefs`，auto-import 已提供。
- 提交失败不要重复弹错（拦截器已提示），`finally` 只负责复位 loading。

## 7. 路由与菜单对齐

业务路由由后端下发，无需在前端写路由文件。后端菜单新增一条：

| 字段 | 值 |
| --- | --- |
| 菜单类型 `menuType` | `C`（菜单，指向页面）/ `M`（目录，指向布局） |
| 路径 `path` | `/system/example` |
| 组件 `component` | `/system/example/index` ← **必须与 `src/views` 真实路径逐字符一致** |
| 按钮权限 | `sys:example:create`、`sys:example:update`、`sys:example:remove` |

映射逻辑在 `src/store/modules/routes.store.ts`：`import.meta.glob('../../views/**/*.{vue,tsx}')` 用 `../..${component}` 取组件。对不上就白屏。

## 8. 交付前自检

```bash
# 结构 + 规范扫描（本目录自带脚本，零依赖）
node doc/skills/scripts/check-module.mjs system/example

# 类型 + lint（仓库无 pre-commit 钩子，必须手动跑）
pnpm type-check
pnpm lint
```

扫描器会按文件给出 `:行号  规则名  说明`，常见输出与改法：

| 规则 | 含义 | 改法 |
| --- | --- | --- |
| `no-explicit-vue-import` | 显式 `import { ref } from 'vue'` | 删掉；只留 `import type { ... } from 'vue'` |
| `use-message-hook` | 直接 `ElMessage.success()` | 改 `const message = useMessage(); message.success()` |
| `no-literal-color` | `color: '#67C23A'` / `rgba(...)` | 枚举里用 `type: 'success'`，样式里用 `var(--el-color-success)` |
| `no-inline-dto` | `.vue` 里写了 `interface XxxResponse` | 挪到 `src/service/model/...` |
| `require-name-property` | 缺 `defineOptions({ name })` | 按 `Sys<模块>ViewIndex` 补 |
| `block-order` / `padding-line-between-blocks` | 块顺序或空行不对 | `script → template → style`，块之间空一行 |
| `missing-file` | 结构文件缺 | 按第 0 节清单补齐 |
| `data-name-mismatch` | `xxx.data.ts` 前缀与目录名不符 | 改成 `<目录名>.data.ts` |

退出码非 0 就是还有 error，逐条改完再提交。
