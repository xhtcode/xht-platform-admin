/**
 * 验证码返回类型
 */
export interface CaptchaResponse {
  key: string
  code: string
}

/**
 * 账号密码登录参数类型
 */
export interface LoginRequest {
  username: string
  password: string
  captcha_code: string
  captcha_key: string
}

/**
 * 手机号验证码登录参数类型
 */
export interface PhoneLoginForm {
  /**
   * 手机号
   */
  phone: string
  /**
   * 手机号验证码
   */
  phoneCode: string
}
