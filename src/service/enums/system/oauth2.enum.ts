import type { AuthorizationGrantTypes, AutoApprove, ClientAuthenticationMethods } from '@/service/model/system/oauth2.client.model'

/**
 * 客户端授权类型
 */
export const authorizationGrantTypesEnums: DictEnum<AuthorizationGrantTypes> = {
  refresh_token: {
    label: '刷新Token',
    value: 'refresh_token',
    type: 'info',
  },
  password: {
    label: '密码模式',
    value: 'password',
    type: 'primary',
  },
  client_credentials: {
    label: '客户端模式',
    value: 'client_credentials',
    type: 'success',
  },
  phone: {
    label: '手机号',
    value: 'phone',
    type: 'warning',
  },
  authorization_code: {
    label: '授权码模式',
    value: 'authorization_code',
    type: 'danger',
  },
}

/**
 * 客户认证方式
 */
export const clientAuthenticationMethodsEnums: DictEnum<ClientAuthenticationMethods> = {
  client_secret_basic: { label: 'client_secret_basic', value: 'client_secret_basic' },
  client_secret_post: { label: 'client_secret_post', value: 'client_secret_post' },
  client_secret_jwt: { label: 'client_secret_jwt', value: 'client_secret_jwt' },
  private_key_jwt: { label: 'private_key_jwt', value: 'private_key_jwt' },
  none: { label: 'none', value: 'none' },
  tls_client_auth: { label: 'tls_client_auth', value: 'tls_client_auth' },
  self_signed_tls_client_auth: { label: 'self_signed_tls_client_auth', value: 'self_signed_tls_client_auth' },
}

/**
 * 是否自动放行
 */
export const autoApproveEnums: DictEnum<AutoApprove> = {
  NO: {
    label: '否',
    value: 0,
    type: 'info',
  },
  YES: {
    label: '是',
    value: 1,
    type: 'primary',
  },
}
