import request from '@/utils/request'
import type { CaptchaResponseType } from '@/service/model/login/login.model'
import type { AxiosPromise } from 'axios'

const baseAuthURL = import.meta.env.VITE_AUTH_API_PREFIX
const basicAuth = 'Basic ' + window.btoa('oidc-client:secret')

/**
 * 获取验证码信息
 */
export const generateCaptcha = (captchaKey: any): AxiosPromise<CaptchaResponseType> => {
  return request({
    url: '/login/captcha',
    baseURL: baseAuthURL,
    method: 'get',
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
export const loginInPassWord = (data: any): AxiosPromise<TokenInfoType> => {
  const encPassword = data.password
  // 密码加密
  const { username, captchaCode, captchaKey } = data
  return request({
    url: '/oauth2/token',
    method: 'post',
    baseURL: baseAuthURL,
    params: {},
    data: {
      username: username,
      password: encPassword,
      grant_type: 'password',
      scope: 'openid',
      captcha_code: captchaCode,
      captchaKey: captchaKey,
    },
    headers: {
      auth: true,
      Authorization: basicAuth,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  })
}
