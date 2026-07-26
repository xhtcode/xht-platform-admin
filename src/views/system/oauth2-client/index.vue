<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import type {
  SysOauth2ClientOperationRequest,
  SysOauth2ClientQueryRequest,
  SysOauth2ClientResponse,
} from '@/service/model/system/oauth2.client.model'
import { querySysOauth2ClientPage, removeSysOauth2ClientByIdBatch, updateSysOauth2ClientSecret } from '@/service/api/system/oauth2.client.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysOauth2ClientColumnOption, sysOauth2ClientOperationRules } from '@/views/system/oauth2-client/oauth2.client.data'
import { Delete, Edit, Plus, Refresh, Search, Lock } from '@element-plus/icons-vue'
import { authorizationGrantTypesEnum, clientAuthenticationMethodsEnum } from '@/service/enums/system/oauth2.enum'

defineOptions({ name: 'SysOauth2ClientViewIndex' })

const oauth2ClientFrom = defineAsyncComponent(() => import('@/views/system/oauth2-client/components/oauth2-client-from.vue'))
const sysOauth2ClientFormRef = useTemplateRef('sysOauth2ClientFormRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const updateStatus = ref<boolean>(false)
const updateData = ref<ModeIdType>()
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules<Required<SysOauth2ClientOperationRequest>> = sysOauth2ClientOperationRules

const state = reactive<TableQueryPageState<SysOauth2ClientQueryRequest, SysOauth2ClientResponse>>({
  queryParams: {}, // 查询参数
  total: 0, // 总条目数
  pages: 0, // 总页数
  searchStatus: false, // 是否显示搜索区域
  tableList: [], // 表格数据列表
  selectedRows: [], // 选中行数据
  loadingStatus: false, // 加载状态
  singleStatus: true, // 单个操作禁用状态
  multipleStatus: true, // 多个操作禁用状态
})

const { handlePageQuery, handleSelectionChange } = useTableQueryPageHooks<SysOauth2ClientQueryRequest, SysOauth2ClientResponse>(
  state,
  querySysOauth2ClientPage
)
const { queryParams } = toRefs(state)

const columnOption = ref<ColumnConfig<SysOauth2ClientResponse>>({
  ...sysOauth2ClientColumnOption,
})

/**
 * 重置查询表单
 */
const resetQuery = async () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {}
  await handlePageQuery()
}

/**
 * 处理新增客户端
 */
const handleAdd = () => {
  sysOauth2ClientFormRef.value?.show('create', null)
}

/**
 * 处理编辑客户端
 */
const handleEdit = (row: SysOauth2ClientResponse) => {
  sysOauth2ClientFormRef.value?.show('update', row.id)
}

/**
 * 删除客户端
 */
const handleDelete = (row?: SysOauth2ClientResponse) => {
  const ids = row ? [row.id] : state.selectedRows.map((item) => item.id)
  if (!ids || ids.length <= 0) {
    useMessage().error('请选择客户端数据')
  }
  state.loadingStatus = true
  useMessageBox()
    .confirm('此操作将删除客户端, 是否继续?')
    .then(async () => {
      await removeSysOauth2ClientByIdBatch(ids)
      await handlePageQuery()
      useMessage().success('删除客户端管理成功!')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 打开修改密码
 * @param row
 */
const openPwdDialog = (row: SysOauth2ClientResponse) => {
  updateData.value = row
  updateStatus.value = true
}

/**
 * 提交修改密码
 */
const submitPwdDialog = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await updateSysOauth2ClientSecret(updateData.value?.id, updateData.value?.clientSecret)
        useMessage().success(`客户端密钥修改成功`)
        closePwdDialog()
        state.loadingStatus = false
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
 * 关闭修改密码
 */
const closePwdDialog = () => {
  updateData.value = {}
  updateStatus.value = false
}

onMounted(async () => {
  await handlePageQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-form ref="queryFormRef" :disabled="state.loadingStatus" :model="queryParams" class="user-select-none" label-width="100px">
      <el-row v-if="!state.searchStatus">
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="queryParams.keyWord" :maxlength="100" placeholder="请输入关键字" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
          <el-button :icon="Search" type="primary" @click="handlePageQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="客户端标识" prop="clientId">
            <el-input v-model="queryParams.clientId" clearable :maxlength="100" show-word-limit placeholder="请输入客户端标识" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-form-item label="客户端名称" prop="clientName">
            <el-input v-model="queryParams.clientName" clearable :maxlength="100" show-word-limit placeholder="请输入客户端名称" />
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
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
      <el-button :icon="Plus" size="small" type="primary" @click="handleAdd" v-authorization="['sys:oauth2:client:create']">新增</el-button>
      <el-button
        :icon="Edit"
        size="small"
        type="success"
        :disabled="state.singleStatus"
        @click="handleEdit(state.selectedRows[0])"
        v-authorization="['sys:oauth2:client:update']"
      >
        修改
      </el-button>
      <el-button
        :icon="Delete"
        size="small"
        type="danger"
        :disabled="state.multipleStatus"
        @click="handleDelete()"
        v-authorization="['sys:oauth2:client:remove']"
      >
        批量删除
      </el-button>
    </table-tool-bar>
    <el-table
      v-loading="state.loadingStatus"
      :data="state.tableList"
      border
      row-key="id"
      empty-text="暂无匹配数据 🔍 试试调整筛选条件吧"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" fixed="left" width="55" />
      <xht-column-index :current="queryParams.current" fixed="left" :size="queryParams.size" />
      <el-table-column v-if="columnOption.clientId?.visible" fixed="left" label="客户端标识" prop="clientId" min-width="160" />
      <el-table-column v-if="columnOption.clientName?.visible" label="客户端名称" prop="clientName" min-width="160" />
      <el-table-column v-if="columnOption.accessTokenValidity?.visible" label="令牌有效时间" prop="accessTokenValidity" width="120" />
      <el-table-column v-if="columnOption.refreshTokenValidity?.visible" label="刷新有效时间" prop="refreshTokenValidity" width="120" />
      <el-table-column v-if="columnOption.clientIdIssuedAt?.visible" label="发布时间" prop="clientIdIssuedAt" width="180" />
      <el-table-column v-if="columnOption.clientSecretExpiresAt?.visible" label="过期时间" prop="clientSecretExpiresAt" width="180" />
      <el-table-column v-if="columnOption.clientAuthenticationMethods?.visible" label="认证方式" prop="clientAuthenticationMethods" width="160">
        <template #default="{ row }">
          <xht-enum-tag
            :filter-label="row.clientAuthenticationMethods"
            :data="clientAuthenticationMethodsEnum"
            space-size="small"
            wrap
            alignment="center"
            fill
            :fill-ratio="45"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.authorizationGrantTypes?.visible" label="授权类型" prop="authorizationGrantTypes" width="220">
        <template #default="{ row }">
          <xht-enum-tag
            :filter-label="row.authorizationGrantTypes"
            :data="authorizationGrantTypesEnum"
            space-size="small"
            wrap
            alignment="center"
            fill
            :fill-ratio="45"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.redirectUris?.visible" label="重定向URI" prop="redirectUris" width="260">
        <template #default="{ row }">
          <el-link v-for="item in row.redirectUris" :key="item" effect="dark">
            {{ item }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column v-if="columnOption.scopes?.visible" label="作用域" prop="scopes" width="220">
        <template #default="{ row }">
          <el-space class="user-select-none" space-size="small" wrap alignment="center" fill :fill-ratio="45">
            <el-tag v-for="item in row.scopes" :key="item" effect="dark">
              {{ item }}
            </el-tag>
          </el-space>
        </template>
      </el-table-column>

      <el-table-column v-if="columnOption.autoApprove?.visible" label="自动放行" prop="autoApprove" width="120" />
      <el-table-column v-if="columnOption.remark?.visible" label="备注" prop="remark" />
      <el-table-column v-if="columnOption.createBy?.visible" label="创建人" prop="createBy" width="160" />
      <el-table-column v-if="columnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
      <el-table-column v-if="columnOption.updateBy?.visible" label="更新人" prop="updateBy" width="160" />
      <el-table-column v-if="columnOption.updateTime?.visible" label="更新时间" prop="updateTime" width="180" />
      <!-- @vue-generic {SysOauth2ClientResponse} -->
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-space wrap class="flex-center">
            <el-button :icon="Lock" link type="primary" @click="openPwdDialog(row)" v-authorization="['sys:oauth2:client:update']">
              密钥修改
            </el-button>
            <el-button :icon="Edit" link type="success" @click="handleEdit(row)" v-authorization="['sys:oauth2:client:update']">修改</el-button>
            <el-button :icon="Delete" link type="danger" @click="handleDelete(row)" v-authorization="['sys:oauth2:client:remove']">删除</el-button>
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
    <el-dialog v-model="updateStatus" title="密钥修改" width="45%" :before-close="closePwdDialog" draggable>
      <el-form
        ref="addUpdateFormRef"
        v-loading="state.loadingStatus"
        :model="updateData"
        :rules="rules"
        element-loading-text="拼命加载中"
        inline-message
        label-width="120px"
        scroll-to-error
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户端标识" prop="clientId">
              <el-input v-model="updateData.clientId" clearable :maxlength="100" show-word-limit placeholder="请输入客户端标识" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户端名称" prop="clientName">
              <el-input v-model="updateData.clientName" clearable :maxlength="100" show-word-limit placeholder="请输入客户端名称" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户端密钥" prop="clientSecret">
              <el-input v-model="updateData.clientSecret" type="password" show-password placeholder="请输入客户端密钥" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button :disabled="state.loadingStatus" @click="closePwdDialog">取 消</el-button>
        <el-button :disabled="state.loadingStatus" type="primary" @click="submitPwdDialog">提交</el-button>
      </template>
    </el-dialog>
    <oauth2-client-from ref="sysOauth2ClientFormRef" @success="handlePageQuery" />
  </div>
</template>

<style lang="scss" scoped></style>
