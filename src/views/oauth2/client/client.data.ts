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
  clientId: [{ required: true, message: '请输入客户端ID', trigger: ['blur', 'change'] }],
  clientIdIssuedAt: [{ required: true, message: '请输入客户端发布时间', trigger: ['blur', 'change'] }],
  clientSecret: [{ required: true, message: '请输入客户端密钥', trigger: ['blur', 'change'] }],
  clientSecretExpiresAt: [{ required: true, message: '请输入客户端过期时间', trigger: ['blur', 'change'] }],
  clientName: [{ required: true, message: '请输入客户端名称', trigger: ['blur', 'change'] }],
  clientAuthenticationMethods: [{ required: true, message: '请输入客户认证方式', trigger: ['blur', 'change'] }],
  authorizationGrantTypes: [{ required: true, message: '请输入客户端授权类型', trigger: ['blur', 'change'] }],
  redirectUris: [{ required: true, message: '请输入授权后重定向URI', trigger: ['blur', 'change'] }],
  postLogoutRedirectUris: [{ required: true, message: '请输入登出后重定向URI', trigger: ['blur', 'change'] }],
  scopes: [{ required: true, message: '请输入客户端作用域', trigger: ['blur', 'change'] }],
  accessTokenValidity: [{ required: true, message: '请输入请求令牌有效时间', trigger: ['blur', 'change'] }],
  refreshTokenValidity: [{ required: true, message: '请输入刷新令牌有效时间', trigger: ['blur', 'change'] }],
  additionalInformation: [{ required: true, message: '请输入扩展信息', trigger: ['blur', 'change'] }],
  autoApprove: [{ required: true, message: '请输入是否自动放行', trigger: ['blur', 'change'] }],
  remark: [{ required: true, message: '请输入备注', trigger: ['blur', 'change'] }],
}

/**
 * 系统管理-客户端管理 列表显示配置
 */
export const sysOauth2ClientColumnOption: ColumnConfig<SysOauth2ClientResponse> = {
  clientId: { desc: '客户端ID', visible: true, disabled: true },
  clientIdIssuedAt: { desc: '客户端发布时间', visible: true, disabled: true },
  clientSecret: { desc: '客户端密钥', visible: true, disabled: true },
  clientSecretExpiresAt: { desc: '客户端过期时间', visible: true, disabled: true },
  clientName: { desc: '客户端名称', visible: true, disabled: true },
  clientAuthenticationMethods: { desc: '客户认证方式', visible: true, disabled: true },
  authorizationGrantTypes: { desc: '客户端授权类型', visible: true, disabled: true },
  redirectUris: { desc: '授权后重定向URI', visible: true, disabled: true },
  postLogoutRedirectUris: { desc: '登出后重定向URI', visible: true, disabled: true },
  scopes: { desc: '客户端作用域', visible: true, disabled: true },
  accessTokenValidity: { desc: '请求令牌有效时间', visible: true, disabled: true },
  refreshTokenValidity: { desc: '刷新令牌有效时间', visible: true, disabled: true },
  additionalInformation: { desc: '扩展信息', visible: true, disabled: true },
  autoApprove: { desc: '是否自动放行', visible: true, disabled: true },
  remark: { desc: '备注', visible: true, disabled: true },
}
