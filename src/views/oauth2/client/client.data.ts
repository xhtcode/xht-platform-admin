import type { SysOauth2ClientOperationRequest, SysOauth2ClientResponse } from '@/service/model/oauth2/client.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 系统管理-客户端管理 增改页面 表单类型 默认值
 */
export const sysOauth2ClientOperationForm: SysOauth2ClientOperationRequest = {}

/**
 * 系统管理-客户端管理 增改页面 表单类型 表单校验
 */
export const sysOauth2ClientOperationRules: FormRules<Required<SysOauth2ClientOperationRequest>> = {
  clientId: [{ required: true, message: '请输入客户端标识', trigger: ['blur', 'change'] }],
  clientSecret: [{ required: true, message: '请输入客户端密钥', trigger: ['blur', 'change'] }],
  clientName: [{ required: true, message: '请输入客户端名称', trigger: ['blur', 'change'] }],
  clientAuthenticationMethods: [{ required: true, message: '请输入客户认证方式', trigger: ['blur', 'change'] }],
  authorizationGrantTypes: [{ required: true, message: '请输入客户端授权类型', trigger: ['blur', 'change'] }],
  redirectUris: [{ required: true, message: '请输入授权后重定向URI', trigger: ['blur', 'change'] }],
  scopes: [{ required: true, message: '请输入客户端作用域', trigger: ['blur', 'change'] }],
  accessTokenValidity: [{ required: true, message: '请输入请求令牌有效时间', trigger: ['blur', 'change'] }],
  refreshTokenValidity: [{ required: true, message: '请输入刷新令牌有效时间', trigger: ['blur', 'change'] }],
  autoApprove: [{ required: true, message: '请输入是否自动放行', trigger: ['blur', 'change'] }],
}

/**
 * 系统管理-客户端管理 列表显示配置
 */
export const sysOauth2ClientColumnOption: ColumnConfig<SysOauth2ClientResponse> = {
  clientId: { desc: '客户端标识', visible: true, disabled: true },
  clientIdIssuedAt: { desc: '发布时间', visible: false, disabled: false },
  clientSecretExpiresAt: { desc: '过期时间', visible: false, disabled: false },
  clientName: { desc: '名称', visible: true, disabled: true },
  accessTokenValidity: { desc: '令牌有效时间', visible: true, disabled: true },
  refreshTokenValidity: { desc: '刷新有效时间', visible: true, disabled: true },
  clientAuthenticationMethods: { desc: '认证方式', visible: true, disabled: true },
  authorizationGrantTypes: { desc: '授权类型', visible: true, disabled: true },
  redirectUris: { desc: '重定向URI', visible: false, disabled: false },
  scopes: { desc: '作用域', visible: false, disabled: false },
  autoApprove: { desc: '是否自动放行', visible: false, disabled: false },
  remark: { desc: '备注', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
