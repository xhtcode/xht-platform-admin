import request from '@/utils/request'
import { CaptchaResponseType, LoginRequestType } from '@/service/model/login/login.model'
import type { AxiosPromise } from 'axios'

const baseURL = import.meta.env.VITE_AUTH_API_PREFIX
const basicAuth = 'Basic ' + window.btoa('oidc-client:secret')

/**
 * 获取验证码信息
 */
export const generateCaptcha = (captchaKey: any): AxiosPromise<CaptchaResponseType> => {
  return request({
    url: '/login/captcha',
    baseURL,
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
  const encPassword = data.password
  // 密码加密
  return request({
    url: '/oauth2/token',
    baseURL,
    method: 'post',
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      'Content-Type': 'multipart/form-data;',
    },
    data: {
      ...data,
      password: encPassword,
      grant_type: 'password',
      scope: 'openid',
    },
  })
}
