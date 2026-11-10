<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { Delete, Link, Refresh, RefreshLeft, Search, View } from '@element-plus/icons-vue'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { useTableQueryPageHooks } from '@/hooks/use-crud-hooks'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import {
  hideSysFileShare,
  markSysFileShareRead,
  querySysFileSharePage,
  querySysFileShareReceivedPage,
  querySysFileShareReceivedUnreadCount,
  resetSysFileShareCode,
  revokeSysFileShare,
} from '@/service/api/system/file-share.api'
import { fileShareModeEnum, fileSharePermissionEnum, fileShareStatusEnum } from '@/service/enums/system/file.enum'
import type {
  SysFileShareQueryRequest,
  SysFileShareReceivedQueryRequest,
  SysFileShareReceivedResponse,
  SysFileShareResponse,
} from '@/service/model/system/file-share.model'
import { isShareExpired, sysFileReceivedColumnOption, sysFileShareColumnOption } from '@/views/system/file-share/file-share.data'

defineOptions({ name: 'FileShareViewIndex' })

const shareReceivers = defineAsyncComponent(() => import('@/views/system/file-share/components/share-receivers.vue'))
const receiversRef = useTemplateRef('receiversRef')
const router = useRouter()
const message = useMessage()

/**
 * 当前页签：我分享的 / 分享给我的
 */
const activeTab = ref<'created' | 'received'>('created')

/**
 * 未读分享数量（后端 Long 转字符串，展示前需转数字）
 */
const unreadCount = ref(0)

// ==================== 我分享的 ====================

const createdFormRef = useTemplateRef<FormInstance>('createdFormRef')

const createdState = reactive<TableQueryPageState<SysFileShareQueryRequest, SysFileShareResponse>>({
  queryParams: { descName: 'createTime' },
  total: 0,
  pages: 0,
  searchStatus: false,
  tableList: [],
  selectedRows: [],
  loadingStatus: false,
  singleStatus: true,
  multipleStatus: true,
})
const { handlePageQuery: queryCreatedPage } = useTableQueryPageHooks<SysFileShareQueryRequest, SysFileShareResponse>(
  createdState,
  querySysFileSharePage
)
const createdQueryParams = toRefs(createdState).queryParams
const createdColumnOption = ref<ColumnConfig<SysFileShareResponse>>({ ...sysFileShareColumnOption })

/**
 * 创建时间范围（仅表单用，查询时拆成 startTime / endTime）
 */
const createdTimeRange = ref<[string, string] | null>(null)

/**
 * 组装创建时间范围并查询
 */
const handleCreatedSearch = async () => {
  if (createdTimeRange.value?.length === 2) {
    createdQueryParams.value.startTime = createdTimeRange.value[0]
    createdQueryParams.value.endTime = createdTimeRange.value[1]
  } else {
    createdQueryParams.value.startTime = undefined
    createdQueryParams.value.endTime = undefined
  }
  await queryCreatedPage()
}

/**
 * 重置「我分享的」查询条件
 */
const resetCreatedQuery = async () => {
  createdFormRef.value?.resetFields()
  createdTimeRange.value = null
  createdQueryParams.value = { descName: 'createTime' }
  await queryCreatedPage()
}

// ==================== 分享给我的 ====================

const receivedFormRef = useTemplateRef<FormInstance>('receivedFormRef')

const receivedState = reactive<TableQueryPageState<SysFileShareReceivedQueryRequest, SysFileShareReceivedResponse>>({
  queryParams: { descName: 'expireAt', includeInvalid: false },
  total: 0,
  pages: 0,
  searchStatus: false,
  tableList: [],
  selectedRows: [],
  loadingStatus: false,
  singleStatus: true,
  multipleStatus: true,
})
const { handlePageQuery: queryReceivedPage } = useTableQueryPageHooks<SysFileShareReceivedQueryRequest, SysFileShareReceivedResponse>(
  receivedState,
  querySysFileShareReceivedPage
)
const receivedQueryParams = toRefs(receivedState).queryParams
const receivedColumnOption = ref<ColumnConfig<SysFileShareReceivedResponse>>({ ...sysFileReceivedColumnOption })

/**
 * 重置「分享给我的」查询条件
 */
const resetReceivedQuery = async () => {
  receivedFormRef.value?.resetFields()
  receivedQueryParams.value = { descName: 'expireAt', includeInvalid: false }
  await queryReceivedPage()
}

/**
 * 查询未读数量（失败不打断页面）
 */
const loadUnreadCount = async () => {
  try {
    const { data } = await querySysFileShareReceivedUnreadCount()
    unreadCount.value = Number(data) || 0
  } catch (error) {
    console.error('未读分享数量查询失败:', error)
  }
}

// ==================== 操作 ====================

/**
 * 复制分享链接（服务端返回站内相对路径，需补站点源）
 *
 * @param row 分享记录
 */
const handleCopyLink = async (row: SysFileShareResponse) => {
  if (!row.shareUrl) {
    message.warning('该分享没有可复制的链接')
    return
  }
  const url = `${window.location.origin}${row.shareUrl}`
  try {
    await navigator.clipboard.writeText(url)
    message.success('分享链接已复制')
  } catch (error) {
    console.error('分享链接复制失败:', error)
    message.error('复制失败，请手动选择复制')
  }
}

/**
 * 重置提取码：新提取码只展示一次
 *
 * @param row 分享记录
 */
const handleResetCode = (row: SysFileShareResponse) => {
  createdState.loadingStatus = true
  useMessageBox()
    .confirm('重置后旧提取码立即失效，是否继续?')
    .then(async () => {
      const { data } = await resetSysFileShareCode(row.shareId)
      await queryCreatedPage()
      // 新提取码只展示一次：先复制到剪贴板，再在提示框里回显，便于用户直接粘贴
      let copiedStatus = false
      try {
        await navigator.clipboard.writeText(data)
        copiedStatus = true
      } catch (error) {
        console.error('提取码复制失败:', error)
      }
      useMessageBox().success(`新提取码：${data}（仅展示这一次${copiedStatus ? '，已复制到剪贴板' : '，请手动记录'}）`)
    })
    .catch(() => {
      // 取消操作或接口失败（失败提示已由拦截器给出），不做处理
    })
    .finally(() => {
      createdState.loadingStatus = false
    })
}

/**
 * 查看接收人
 *
 * @param row 分享记录
 */
const handleViewReceivers = (row: SysFileShareResponse) => {
  receiversRef.value?.show(row.shareId, row.fileName)
}

/**
 * 撤销分享
 *
 * @param row 分享记录
 */
const handleRevoke = (row: SysFileShareResponse) => {
  createdState.loadingStatus = true
  useMessageBox()
    .confirm(`撤销后「${row.fileName}」的分享链接立即失效, 是否继续?`)
    .then(async () => {
      await revokeSysFileShare(row.shareId)
      await queryCreatedPage()
      message.success('分享已撤销')
    })
    .catch(() => {
      // 取消或失败（失败提示已由拦截器给出）
    })
    .finally(() => {
      createdState.loadingStatus = false
    })
}

/**
 * 打开指定用户分享
 *
 * @param row 分享记录
 */
const handleOpenReceived = async (row: SysFileShareReceivedResponse) => {
  if (row.status !== 1 || isShareExpired(row.expireAt)) {
    message.warning('该分享已失效')
    return
  }
  await router.push({ name: 'ShareUserViewIndex', params: { shareId: row.shareId } })
}

/**
 * 从「分享给我的」列表移除（不影响链接有效性）
 *
 * @param row 分享记录
 */
const handleHideReceived = (row: SysFileShareReceivedResponse) => {
  receivedState.loadingStatus = true
  useMessageBox()
    .confirm('移除后该分享将不再出现在列表中, 是否继续?')
    .then(async () => {
      await hideSysFileShare(row.shareId)
      await queryReceivedPage()
      message.success('已从列表移除')
    })
    .catch(() => {
      // 取消或失败
    })
    .finally(() => {
      receivedState.loadingStatus = false
    })
}

/**
 * 把当前页未读记录标记为已读
 *
 * 后端未提供批量接口，只能逐条调用；未读记录可能分布在其它页，这里只处理当前页。
 */
const handleMarkAllRead = () => {
  if (!unreadCount.value) {
    message.info('没有未读分享')
    return
  }
  receivedState.loadingStatus = true
  const unreadRows = receivedState.tableList.filter((item) => item.readStatus === 0)
  Promise.all(unreadRows.map((item) => markSysFileShareRead(item.shareId)))
    .then(async () => {
      await queryReceivedPage()
      await loadUnreadCount()
      message.success('已标记为已读')
    })
    .catch((error) => {
      console.error('标记已读失败:', error)
    })
    .finally(() => {
      receivedState.loadingStatus = false
    })
}

/**
 * 页签切换：切换后按当前页签加载数据
 */
const handleTabChange = async (name: string | number) => {
  if (name === 'received') {
    await queryReceivedPage()
    await loadUnreadCount()
    return
  }
  await queryCreatedPage()
}

/**
 * 分享状态展示（正常但已过有效期时按「已过期」呈现）
 *
 * @param row 分享记录
 */
const shareStatusOf = (row: SysFileShareResponse | SysFileShareReceivedResponse) => {
  if (row.status === 1 && isShareExpired(row.expireAt)) {
    return { label: '已过期', type: 'warning' as const }
  }
  const matched = Object.values(fileShareStatusEnum).find((item) => item.value === row.status)
  return { label: matched?.label ?? '未知', type: matched?.type ?? ('info' as const) }
}

/**
 * 是否可打开（未撤销、未失效、未过期）
 *
 * @param row 分享记录
 */
const canOpen = (row: SysFileShareReceivedResponse) => row.status === 1 && !isShareExpired(row.expireAt)

onMounted(async () => {
  await queryCreatedPage()
  await loadUnreadCount()
})
</script>

<template>
  <div class="xht-view-container">
    <el-tabs v-model="activeTab" class="share-tabs" @tab-change="handleTabChange">
      <!-- ==================== 我分享的 ==================== -->
      <el-tab-pane label="我分享的" name="created">
        <el-form ref="createdFormRef" :disabled="createdState.loadingStatus" :model="createdQueryParams" class="user-select-none" label-width="100px">
          <el-row :gutter="0">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="分享方式" prop="shareMode">
                <el-select v-model="createdQueryParams.shareMode" clearable placeholder="请选择分享方式">
                  <el-option v-for="item in fileShareModeEnum" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="分享权限" prop="permission">
                <el-select v-model="createdQueryParams.permission" clearable placeholder="请选择分享权限">
                  <el-option v-for="item in fileSharePermissionEnum" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="状态" prop="status">
                <el-select v-model="createdQueryParams.status" clearable placeholder="请选择状态">
                  <el-option v-for="item in fileShareStatusEnum" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="16" :sm="24" :xs="24">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="createdTimeRange"
                  type="datetimerange"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
              <el-button :icon="Search" type="primary" @click="handleCreatedSearch">查询</el-button>
              <el-button :icon="Refresh" @click="resetCreatedQuery">重置</el-button>
            </el-col>
          </el-row>
        </el-form>

        <table-tool-bar
          v-model:column-data="createdColumnOption"
          v-model:show-search="createdState.searchStatus"
          column-status
          refresh-status
          search-status
          @refresh="resetCreatedQuery"
        />

        <el-table
          v-loading="createdState.loadingStatus"
          :data="createdState.tableList"
          border
          row-key="shareId"
          empty-text="暂无分享记录 🔍 试试调整筛选条件吧"
        >
          <el-table-column label="文件名" min-width="220" prop="fileName" show-overflow-tooltip />
          <el-table-column v-if="createdColumnOption.shareMode?.visible" label="分享方式" prop="shareMode" width="120">
            <template #default="{ row }">
              <xht-enum-tag :data="fileShareModeEnum" :filter-label="row.shareMode" />
            </template>
          </el-table-column>
          <el-table-column v-if="createdColumnOption.permission?.visible" label="分享权限" prop="permission" width="120">
            <template #default="{ row }">
              <xht-enum-tag :data="fileSharePermissionEnum" :filter-label="row.permission" />
            </template>
          </el-table-column>
          <el-table-column v-if="createdColumnOption.receiverCount?.visible" label="接收人数" prop="receiverCount" width="100" />
          <el-table-column v-if="createdColumnOption.accessCount?.visible" label="访问次数" prop="accessCount" width="120">
            <template #default="{ row }">{{ row.accessCount }} / {{ row.maxAccessCount || '不限' }}</template>
          </el-table-column>
          <el-table-column v-if="createdColumnOption.requireCode?.visible" label="提取码" prop="requireCode" width="90">
            <template #default="{ row }">{{ row.requireCode ? '需要' : '不需要' }}</template>
          </el-table-column>
          <el-table-column v-if="createdColumnOption.expireAt?.visible" label="有效期至" prop="expireAt" width="180" />
          <!-- @vue-generic {SysFileShareResponse} -->
          <el-table-column v-if="createdColumnOption.status?.visible" label="状态" prop="status" width="110">
            <template #default="{ row }">
              <el-tag :type="shareStatusOf(row).type" size="small">{{ shareStatusOf(row).label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="createdColumnOption.createTime?.visible" label="创建时间" prop="createTime" width="180" />
          <!-- @vue-generic {SysFileShareResponse} -->
          <el-table-column fixed="right" label="操作" width="280">
            <template #default="{ row }">
              <el-space wrap class="flex-center">
                <el-button v-if="row.shareMode === 'LINK' && row.status === 1" :icon="Link" link type="primary" @click="handleCopyLink(row)">
                  复制链接
                </el-button>
                <el-button
                  v-if="row.requireCode && row.status === 1"
                  v-authorization="['sys:file:share:reset-code']"
                  :icon="RefreshLeft"
                  link
                  type="warning"
                  @click="handleResetCode(row)"
                >
                  重置提取码
                </el-button>
                <el-button v-if="row.shareMode === 'USER'" :icon="View" link type="success" @click="handleViewReceivers(row)">接收人</el-button>
                <el-button
                  v-if="row.status === 1"
                  v-authorization="['sys:file:share:remove']"
                  :icon="Delete"
                  link
                  type="danger"
                  @click="handleRevoke(row)"
                >
                  撤销
                </el-button>
              </el-space>
            </template>
          </el-table-column>
        </el-table>

        <xht-pagination
          v-model:current-page="createdQueryParams.current"
          v-model:page-size="createdQueryParams.size"
          :page-count="createdState.pages"
          :total="createdState.total"
          @pagination="queryCreatedPage"
        />
      </el-tab-pane>

      <!-- ==================== 分享给我的 ==================== -->
      <el-tab-pane name="received">
        <template #label>
          <el-badge :hidden="!unreadCount" :max="99" :value="unreadCount" class="share-tab-badge">分享给我的</el-badge>
        </template>

        <el-form
          ref="receivedFormRef"
          :disabled="receivedState.loadingStatus"
          :model="receivedQueryParams"
          class="user-select-none"
          label-width="100px"
        >
          <el-row :gutter="0">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="已读状态" prop="readStatus">
                <el-select v-model="receivedQueryParams.readStatus" clearable placeholder="请选择已读状态">
                  <el-option label="未读" :value="0" />
                  <el-option label="已读" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="包含失效" prop="includeInvalid">
                <el-switch v-model="receivedQueryParams.includeInvalid" />
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24" class="text-center">
              <el-button :icon="Search" type="primary" @click="queryReceivedPage">查询</el-button>
              <el-button :icon="Refresh" @click="resetReceivedQuery">重置</el-button>
            </el-col>
          </el-row>
        </el-form>

        <table-tool-bar
          v-model:column-data="receivedColumnOption"
          v-model:show-search="receivedState.searchStatus"
          column-status
          refresh-status
          search-status
          @refresh="resetReceivedQuery"
        >
          <el-button :icon="View" :disabled="!unreadCount" size="small" type="primary" @click="handleMarkAllRead">标记本页已读</el-button>
        </table-tool-bar>

        <el-table v-loading="receivedState.loadingStatus" :data="receivedState.tableList" border row-key="receiverId" empty-text="暂无分享给我的文件">
          <el-table-column label="文件名" min-width="220" prop="fileName" show-overflow-tooltip />
          <el-table-column v-if="receivedColumnOption.creatorName?.visible" label="分享人" prop="creatorName" width="140" />
          <el-table-column v-if="receivedColumnOption.permission?.visible" label="分享权限" prop="permission" width="120">
            <template #default="{ row }">
              <xht-enum-tag :data="fileSharePermissionEnum" :filter-label="row.permission" />
            </template>
          </el-table-column>
          <el-table-column v-if="receivedColumnOption.readStatus?.visible" label="已读状态" prop="readStatus" width="100">
            <template #default="{ row }">
              <el-tag :type="row.readStatus === 1 ? 'success' : 'info'" size="small">{{ row.readStatus === 1 ? '已读' : '未读' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="receivedColumnOption.firstViewTime?.visible" label="首次查看" prop="firstViewTime" width="180">
            <template #default="{ row }">{{ row.firstViewTime || '—' }}</template>
          </el-table-column>
          <el-table-column v-if="receivedColumnOption.expireAt?.visible" label="有效期至" prop="expireAt" width="180" />
          <!-- @vue-generic {SysFileShareReceivedResponse} -->
          <el-table-column v-if="receivedColumnOption.status?.visible" label="状态" prop="status" width="110">
            <template #default="{ row }">
              <el-tag :type="shareStatusOf(row).type" size="small">{{ shareStatusOf(row).label }}</el-tag>
            </template>
          </el-table-column>
          <!-- @vue-generic {SysFileShareReceivedResponse} -->
          <el-table-column fixed="right" label="操作" width="180">
            <template #default="{ row }">
              <el-space wrap class="flex-center">
                <el-button :disabled="!canOpen(row)" :icon="View" link type="primary" @click="handleOpenReceived(row)">打开</el-button>
                <el-button :icon="Delete" link type="danger" @click="handleHideReceived(row)">移除</el-button>
              </el-space>
            </template>
          </el-table-column>
        </el-table>

        <xht-pagination
          v-model:current-page="receivedQueryParams.current"
          v-model:page-size="receivedQueryParams.size"
          :page-count="receivedState.pages"
          :total="receivedState.total"
          @pagination="queryReceivedPage"
        />
      </el-tab-pane>
    </el-tabs>

    <share-receivers ref="receiversRef" />
  </div>
</template>

<style lang="scss" scoped>
.share-tabs {
  height: 100%;
}

.share-tab-badge {
  :deep(.el-badge__content) {
    transform: translateY(-2px);
  }
}
</style>
