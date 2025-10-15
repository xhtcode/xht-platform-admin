/**
 * 验证码返回类型
 */
export interface CaptchaResponseType {
  key: string
  code: string
}

/**
 * 账号密码登录参数类型
 */
export interface LoginRequestType {
  username: string
  password: string
  captcha_code: string
  captcha_key: string
}
