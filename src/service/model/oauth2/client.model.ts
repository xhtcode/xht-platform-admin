/**
 * 系统管理-客户端管理查询请求参数类型
 */
export interface SysOauth2ClientQueryRequest extends PageQueryRequest {
  clientId?: string // 客户端ID
  clientIdIssuedAtStart?: string // 客户端发布开始时间
  clientIdIssuedAtEnd?: string // 客户端发布结束时间
  clientSecret?: string // 客户端密钥
  clientSecretExpiresAtStart?: string // 客户端过期开始时间
  clientSecretExpiresAtEnd?: string // 客户端过期结束时间
  clientName?: string // 客户端名称
  remark?: string // 备注
}

/**
 * 系统管理-客户端管理响应类型
 */
export interface SysOauth2ClientResponse extends MetaResponse {
  id: ModeIdType // ID
  clientId: string // 客户端ID
  clientIdIssuedAt: string // 客户端发布时间
  clientSecret: string // 客户端密钥
  clientSecretExpiresAt: string // 客户端过期时间
  clientName: string // 客户端名称
  clientAuthenticationMethods: string // 客户认证方式
  authorizationGrantTypes: string // 客户端授权类型
  redirectUris: string // 授权后重定向URI
  postLogoutRedirectUris: string // 登出后重定向URI
  scopes: string // 客户端作用域
  accessTokenValidity: number // 请求令牌有效时间
  refreshTokenValidity: number // 刷新令牌有效时间
  additionalInformation: string // 扩展信息
  autoApprove: number // 是否自动放行
  remark: string // 备注
}

/**
 * 系统管理-客户端管理表单请求参数类型
 */
export interface SysOauth2ClientOperationRequest extends Partial<SysOauth2ClientResponse>, BasicFormRequest {}
