import request from '@/utils/request'
import { CaptchaResponseType, LoginRequestType } from '@/service/model/login/login.model'
import type { AxiosPromise } from 'axios'

const baseAdminURL = import.meta.env.VITE_ADMIN_API_PREFIX
const baseAuthURL = import.meta.env.VITE_AUTH_API_PREFIX

/**
 * 获取验证码信息
 */
export const generateCaptcha = (captchaKey: any): AxiosPromise<CaptchaResponseType> => {
  return request({
    url: '/oauth2/login/captcha',
    baseURL: baseAuthURL,
    method: 'post',
    headers: {
      skipToken: true,
    },
    params: {
      captchaKey,
    },
  })
}

/**
 * 登录
 */
export const loginInPassWord = (data: LoginRequestType): AxiosPromise<TokenInfoType> => {
  // 密码加密
  return request({
    url: '/login/form',
    baseURL: baseAdminURL,
    method: 'post',
    headers: {
      skipToken: true,
    },
    data: {
      ...data,
    },
  })
}
