/**
 * 客户端授权类型
 */
export type AuthorizationGrantTypes = 'refresh_token' | 'password' | 'client_credentials' | 'phone' | 'authorization_code'

/**
 * 客户认证方式
 */
export type ClientAuthenticationMethods =
  | 'client_secret_basic'
  | 'client_secret_post'
  | 'client_secret_jwt'
  | 'private_key_jwt'
  | 'none'
  | 'tls_client_auth'
  | 'self_signed_tls_client_auth'

/**
 * 是否自动放行
 */
export type AutoApprove = 0 | 1

/**
 * 系统管理-客户端管理查询请求参数类型
 */
export interface SysOauth2ClientQueryRequest extends PageQueryRequest {
  clientId?: string // 客户端标识
  clientSecret?: string // 客户端密钥
  clientName?: string // 客户端名称
}

/**
 * 系统管理-客户端管理响应类型
 */
export interface SysOauth2ClientResponse extends MetaResponse {
  id: ModeIdType // ID
  clientId: string // 客户端标识
  clientIdIssuedAt: string // 客户端发布时间
  clientSecret: string // 客户端密钥
  clientSecretExpiresAt: string // 客户端过期时间
  clientName: string // 客户端名称
  clientAuthenticationMethods: ClientAuthenticationMethods[] // 客户认证方式
  authorizationGrantTypes: AuthorizationGrantTypes[] // 客户端授权类型
  redirectUris: string[] // 授权后重定向URI
  postLogoutRedirectUris: string[] // 登出后重定向URI
  scopes: string[] // 客户端作用域
  accessTokenValidity: number // 请求令牌有效时间
  refreshTokenValidity: number // 刷新令牌有效时间
  autoApprove: AutoApprove // 是否自动放行
  remark: string // 备注
}

/**
 * 系统管理-客户端管理表单请求参数类型
 */
export interface SysOauth2ClientOperationRequest extends Partial<SysOauth2ClientResponse>, BasicFormRequest {}
