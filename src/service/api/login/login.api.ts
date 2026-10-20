import request from '@/utils/request'
import { CaptchaResponseType, LoginRequestType, PhoneLoginFormType } from '@/service/model/login/login.model'
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
    // 公开接口：不携带访问令牌，也不参与 424/401 的会话失效流程
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

/**
 * 生成手机号验证码
 *
 * 由鉴权服务下发短信验证码，手机号通过 query 传递。
 *
 * @param phone 手机号
 */
export const generatePhoneSmsCode = (phone: string): Promise<ApiResponse<void>> => {
  return request<void>({
    url: '/oauth2/login/smsCode',
    baseURL: baseAuthURL,
    method: 'post',
    // 公开接口：不携带访问令牌
    skipToken: true,
    params: {
      phone,
    },
  })
}

/**
 * 手机号验证码登录
 *
 * @param data 手机号与验证码
 * @returns 访问令牌、刷新令牌与有效期
 */
export const loginInPhone = (data: PhoneLoginFormType): Promise<ApiResponse<TokenInfoType>> => {
  return request<TokenInfoType>({
    url: '/login/phone',
    baseURL: baseAdminURL,
    method: 'post',
    // 公开接口：不携带访问令牌
    skipToken: true,
    data: {
      ...data,
    },
  })
}

/**
 * 注销并删除令牌
 *
 * 服务端会依据请求头中的访问令牌删除对应的令牌记录，
 * 因此调用时机必须在清理本地令牌之前。
 */
export const logoutToken = (): Promise<ApiResponse<void>> => {
  return request<void>({
    url: '/token/logout',
    baseURL: baseAuthURL,
    method: 'post',
  })
}
