<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { Check, CopyDocument } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/use-message'
import { createSysFileShare } from '@/service/api/system/file-share.api'
import { querySysUserPage } from '@/service/api/system/user.api'
import { querySysDeptTree } from '@/service/api/system/dept.api'
import { querySysRolePage } from '@/service/api/system/role.api'
import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model'
import type { FileShareMode, FileSharePermission, FileShareReceiverType, SysFileShareResponse } from '@/service/model/system/file-share.model'
import { useUserInfoStore } from '@/store/modules/user.store'

defineOptions({ name: 'FileShareCreate' })

const emits = defineEmits(['success'])
const message = useMessage()
const userStore = useUserInfoStore()

/**
 * 有效期快捷项（天）
 */
const EXPIRE_PRESETS = [1, 7, 15, 30]

/**
 * 接收人上限（与后端 share.receiver.max-count 默认值一致，超出由服务端拒绝）
 */
const RECEIVER_MAX = 500

const state = reactive({
  title: '创建分享',
  visibleStatus: false,
  loadingStatus: false,
  submittedStatus: false, // 是否已提交成功（切换为结果视图）
  result: null as SysFileShareResponse | null,
  // 创建分享依赖的预览会话能力位
  session: null as SysFilePreviewInitResponse | null,
})

const form = reactive({
  shareMode: 'LINK' as FileShareMode,
  permission: 'VIEW_DOWNLOAD' as FileSharePermission,
  expireDays: 7,
  requireCode: true,
  accessCode: '',
  maxAccessCount: 0,
  receiverType: 'USER' as FileShareReceiverType,
  receiverIds: [] as string[],
})
const formRef = useTemplateRef<FormInstance>('formRef')

// ==================== 接收人选项 ====================

const userOptions = ref<{ value: string; label: string }[]>([])
const userLoading = ref(false)
const roleOptions = ref<{ value: string; label: string }[]>([])
const deptTree = ref<{ value: string; label: string; children?: any[] }[]>([])

/**
 * 远程搜索用户（排除自己：后端不允许把分享发给创建人）
 *
 * @param keyword 关键字（账号 / 昵称）
 */
const searchUser = async (keyword: string) => {
  userLoading.value = true
  try {
    const { data } = await querySysUserPage({ current: 1, size: 20, keyWord: keyword })
    userOptions.value = data.records
      .filter((item) => `${item.id}` !== `${userStore.userInfo?.userId ?? ''}`)
      .map((item) => ({ value: `${item.id}`, label: `${item.nickName || item.userName}（${item.userName}）` }))
  } catch (error) {
    console.error('用户查询失败:', error)
  } finally {
    userLoading.value = false
  }
}

/**
 * 加载部门树（一次加载，前端映射成树选择所需结构）
 */
const loadDeptTree = async () => {
  if (deptTree.value.length) return
  try {
    const { data } = await querySysDeptTree()
    const mapTree = (nodes: any[]): any[] =>
      nodes.map((node) => ({
        value: `${node.id}`,
        label: node.deptName,
        children: node.children?.length ? mapTree(node.children) : undefined,
      }))
    deptTree.value = mapTree(data)
  } catch (error) {
    console.error('部门查询失败:', error)
  }
}

/**
 * 加载角色列表
 */
const loadRoles = async () => {
  if (roleOptions.value.length) return
  try {
    const { data } = await querySysRolePage({ current: 1, size: 200 })
    roleOptions.value = data.records.map((item) => ({ value: `${item.id}`, label: item.roleName }))
  } catch (error) {
    console.error('角色查询失败:', error)
  }
}

/**
 * 接收人类型切换：清空已选，避免不同类型的 ID 混在一起
 */
watch(
  () => form.receiverType,
  (type) => {
    form.receiverIds = []
    if (type === 'DEPT') void loadDeptTree()
    if (type === 'ROLE') void loadRoles()
  }
)

// ==================== 能力位联动 ====================

/**
 * 该文件是否允许下载（决定「查看+下载」「仅下载」是否可选）
 */
const downloadAllowed = computed(() => state.session?.capabilities.download !== false)

/**
 * 文件是否支持在线预览（不支持时只能选「仅下载」，否则后端拒绝）
 */
const previewAllowed = computed(() => state.session?.capabilities.preview !== false)

/**
 * 权限选项的可选性
 *
 * @param value 权限值
 */
const permissionDisabled = (value: FileSharePermission): boolean => {
  if (value === 'VIEW') return !previewAllowed.value
  if (value === 'VIEW_DOWNLOAD') return !previewAllowed.value || !downloadAllowed.value
  return !downloadAllowed.value
}

// ==================== 提取码校验 ====================

/**
 * 提取码校验（与后端规则一致）
 *
 * @param value 提取码
 */
const validateAccessCode = (value: string): string => {
  if (!/^[A-Za-z0-9]{4,8}$/.test(value)) return '提取码必须为 4~8 位字母数字'
  if (/^(.)\1+$/.test(value)) return '提取码不能为重复字符'
  if (value.length < 6 && (!/[A-Za-z]/.test(value) || !/\d/.test(value))) return '4~5 位提取码必须同时包含字母和数字'
  return ''
}

const rules: FormRules = {
  permission: [{ required: true, message: '请选择分享权限', trigger: 'change' }],
  expireDays: [{ required: true, message: '请设置有效期', trigger: 'blur' }],
  accessCode: [
    {
      validator: (_rule, value, callback) => {
        // 留空由服务端随机生成，仅在填了自定义值时才校验
        if (!form.requireCode || !value) {
          callback()
          return
        }
        const error = validateAccessCode(value)
        callback(error ? new Error(error) : undefined)
      },
      trigger: 'blur',
    },
  ],
  receiverIds: [
    {
      validator: (_rule, value, callback) => {
        if (form.shareMode === 'USER' && (!value || !value.length)) {
          callback(new Error('请选择分享接收人'))
          return
        }
        callback()
      },
      trigger: 'change',
    },
  ],
}

// ==================== 交互 ====================

/**
 * 完整分享链接（服务端返回站内相对路径，拼上当前站点源）
 */
const shareUrl = computed(() => {
  if (!state.result?.shareUrl) return ''
  return `${window.location.origin}${state.result.shareUrl}`
})

/**
 * 打开弹窗
 *
 * @param session 预览会话（提供 previewId 与能力位）
 */
const show = (session: SysFilePreviewInitResponse) => {
  state.session = session
  state.result = null
  state.submittedStatus = false
  state.visibleStatus = true
  Object.assign(form, {
    shareMode: 'LINK' as FileShareMode,
    // 默认给「查看+下载」；不允许下载时退化为「仅查看」，不预览时退化为「仅下载」
    permission: (!downloadAllowed.value ? 'VIEW' : previewAllowed.value ? 'VIEW_DOWNLOAD' : 'DOWNLOAD') as FileSharePermission,
    expireDays: 7,
    requireCode: true,
    accessCode: '',
    maxAccessCount: 0,
    receiverType: 'USER' as FileShareReceiverType,
    receiverIds: [],
  })
  void searchUser('')
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.session = null
  state.result = null
  formRef.value?.resetFields()
}

/**
 * 提交创建
 */
const submit = () => {
  if (!state.session) return
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      message.error('表单校验未通过，请重新检查提交内容')
      return
    }
    state.loadingStatus = true
    try {
      const { data } = await createSysFileShare({
        previewId: state.session!.previewId,
        shareMode: form.shareMode,
        permission: form.permission,
        expireDays: form.expireDays,
        requireCode: form.requireCode,
        accessCode: form.requireCode ? form.accessCode || undefined : undefined,
        // 访问上限只对链接分享生效
        maxAccessCount: form.shareMode === 'LINK' ? form.maxAccessCount : undefined,
        receiverType: form.shareMode === 'USER' ? form.receiverType : undefined,
        receiverIds: form.shareMode === 'USER' ? form.receiverIds : undefined,
      })
      state.result = data
      state.submittedStatus = true
      emits('success', data)
    } catch (error) {
      // 失败提示由请求拦截器给出，保留弹窗内容便于调整后重试
      console.error('创建分享失败:', error)
    } finally {
      state.loadingStatus = false
    }
  })
}

/**
 * 复制文本
 *
 * @param text 待复制内容
 * @param tip 成功提示
 */
const copyText = async (text: string, tip: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    message.success(tip)
  } catch (error) {
    console.error('复制失败:', error)
    message.error('复制失败，请手动选择复制')
  }
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :title="state.submittedStatus ? '分享创建成功' : '创建分享'"
    align-center
    append-to-body
    width="560px"
  >
    <!-- 创建结果：提取码与链接只在此处展示一次 -->
    <div v-if="state.submittedStatus && state.result" class="share-result">
      <el-result icon="success" title="分享已创建">
        <template #sub-title>
          <div class="share-result-body">
            <div class="share-result-row">
              <span class="share-result-label">文件名</span>
              <span class="share-result-value">{{ state.result.fileName }}</span>
            </div>
            <div class="share-result-row">
              <span class="share-result-label">有效期至</span>
              <span class="share-result-value">{{ state.result.expireAt }}</span>
            </div>
            <template v-if="state.result.shareUrl">
              <div class="share-result-row">
                <span class="share-result-label">分享链接</span>
                <span class="share-result-value is-mono">{{ shareUrl }}</span>
                <el-button :icon="CopyDocument" link type="primary" @click="copyText(shareUrl, '分享链接已复制')">复制</el-button>
              </div>
            </template>
            <div v-if="state.result.accessCode" class="share-result-row">
              <span class="share-result-label">提取码</span>
              <span class="share-result-value is-code">{{ state.result.accessCode }}</span>
              <el-button :icon="CopyDocument" link type="primary" @click="copyText(state.result.accessCode ?? '', '提取码已复制')">复制</el-button>
            </div>
            <el-alert
              v-if="state.result.accessCode"
              class="share-result-tip"
              type="warning"
              :closable="false"
              title="提取码只展示这一次，关闭后无法再次查看，请立即复制告知对方"
              show-icon
            />
          </div>
        </template>
      </el-result>
    </div>

    <!-- 创建表单 -->
    <el-form v-else ref="formRef" v-loading="state.loadingStatus" :model="form" :rules="rules" inline-message label-width="96px" scroll-to-error>
      <el-form-item label="分享方式" prop="shareMode">
        <el-radio-group v-model="form.shareMode">
          <el-radio value="LINK">链接分享</el-radio>
          <el-radio value="USER">指定用户</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="分享权限" prop="permission">
        <el-radio-group v-model="form.permission">
          <el-radio value="VIEW" :disabled="permissionDisabled('VIEW')">仅查看</el-radio>
          <el-radio value="VIEW_DOWNLOAD" :disabled="permissionDisabled('VIEW_DOWNLOAD')">查看+下载</el-radio>
          <el-radio value="DOWNLOAD" :disabled="permissionDisabled('DOWNLOAD')">仅下载</el-radio>
        </el-radio-group>
        <div v-if="!downloadAllowed" class="form-tip">该文件不允许下载，无法选择含下载的权限</div>
      </el-form-item>

      <el-form-item label="有效期" prop="expireDays">
        <div class="expire-field">
          <el-input-number v-model="form.expireDays" :min="1" :max="3650" class="expire-input" />
          <span class="expire-unit">天</span>
          <el-button
            v-for="day in EXPIRE_PRESETS"
            :key="day"
            :type="form.expireDays === day ? 'primary' : 'default'"
            link
            @click="form.expireDays = day"
          >
            {{ day }} 天
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="提取码">
        <el-switch v-model="form.requireCode" active-text="开启" inactive-text="关闭" />
        <el-input
          v-if="form.requireCode"
          v-model="form.accessCode"
          class="access-code-input"
          :maxlength="8"
          placeholder="留空自动生成 6 位"
          clearable
        />
      </el-form-item>

      <el-form-item v-if="form.shareMode === 'LINK'" label="访问上限">
        <el-input-number v-model="form.maxAccessCount" :min="0" :max="999999" />
        <span class="form-suffix">次（0 表示不限）</span>
      </el-form-item>

      <template v-else>
        <el-form-item label="接收范围" prop="receiverType">
          <el-radio-group v-model="form.receiverType">
            <el-radio value="USER">用户</el-radio>
            <el-radio value="DEPT">部门</el-radio>
            <el-radio value="ROLE">角色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接收人" prop="receiverIds">
          <el-select
            v-if="form.receiverType === 'USER'"
            v-model="form.receiverIds"
            :loading="userLoading"
            :multiple-limit="RECEIVER_MAX"
            filterable
            multiple
            placeholder="输入账号或昵称搜索"
            remote
            reserve-keyword
            class="receiver-select"
            :remote-method="searchUser"
          >
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-tree-select
            v-else-if="form.receiverType === 'DEPT'"
            v-model="form.receiverIds"
            :data="deptTree"
            :multiple-limit="RECEIVER_MAX"
            check-strictly
            multiple
            placeholder="请选择部门"
            show-checkbox
            class="receiver-select"
          />
          <el-select
            v-else
            v-model="form.receiverIds"
            :multiple-limit="RECEIVER_MAX"
            filterable
            multiple
            placeholder="请选择角色"
            class="receiver-select"
          >
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div class="form-tip">最多 {{ RECEIVER_MAX }} 个接收对象，创建时按快照展开</div>
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <template v-if="state.submittedStatus">
        <el-button type="primary" :icon="Check" @click="close">完 成</el-button>
      </template>
      <template v-else>
        <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
        <el-button :loading="state.loadingStatus" type="primary" @click="submit">创 建</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form-tip {
  width: 100%;
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.form-suffix {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.expire-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expire-input {
  width: 90px;
}

.expire-unit {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.access-code-input {
  width: 200px;
  margin-left: 12px;
}

.receiver-select {
  width: 100%;
}

.share-result-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.share-result-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.share-result-label {
  flex-shrink: 0;
  width: 64px;
  color: var(--el-text-color-secondary);
}

.share-result-value {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--el-text-color-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-result-value.is-mono {
  font-family: Consolas, Monaco, 'Courier New', monospace;
}

.share-result-value.is-code {
  color: var(--el-color-primary);
  font-weight: 600;
  letter-spacing: 2px;
}

.share-result-tip {
  margin-top: 4px;
}
</style>
