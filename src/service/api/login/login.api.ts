import request from '@/utils/request'
import { CaptchaResponseType, LoginRequestType } from '@/service/model/login/login.model'
import type { ApiResponse } from 'axios'

const baseAdminURL = import.meta.env.VITE_ADMIN_API_PREFIX
const baseAuthURL = import.meta.env.VITE_AUTH_API_PREFIX

/**
 * 获取验证码信息
 */
export const generateCaptcha = (captchaKey: string): Promise<ApiResponse<CaptchaResponseType>> => {
  return request<CaptchaResponseType>({
    url: '/oauth2/login/captcha',
    baseURL: baseAuthURL,
    method: 'post',
    // 公开接口：不携带访问令牌
    skipToken: true,
    params: {
      captcha_key: captchaKey,
    },
  })
}

/**
 * 登录
 */
export const loginInPassWord = (data: LoginRequestType): Promise<ApiResponse<TokenInfoType>> => {
  // 密码加密
  return request<TokenInfoType>({
    url: '/login/form',
    baseURL: baseAdminURL,
    method: 'post',
    // 公开接口：不携带访问令牌
    skipToken: true,
    data: {
      ...data,
    },
  })
}
