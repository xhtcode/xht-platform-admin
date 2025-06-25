<script setup lang="ts">
import router from '../../router'
import { getToken } from '@/api/user'
import { generateCodeChallenge, generateCodeVerifier } from '@/utils/oauth2'
import { useMessage } from '@/hooks/use-message'

/**
 * 根据参数name获取地址栏的参数
 * @param name 地址栏参数的key
 * @returns key对用的值
 */
function getQueryString(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')

  const r = window.location.search.substring(1).match(reg)

  if (r != null) {
    return decodeURIComponent(r[2])
  }

  return null
}

// 生成CodeVerifier
let codeVerifier: string = generateCodeVerifier()
// codeChallenge
let codeChallenge: string = generateCodeChallenge(codeVerifier)
// 生成state
let state: string = generateCodeVerifier()

// 获取地址栏授权码
const code = getQueryString('code')

if (code) {
  // 从缓存中获取 codeVerifier
  const state = localStorage.getItem('state')
  // 校验state，防止cors
  const urlState = getQueryString('state')
  if (urlState !== state) {
    useMessage().warning('state校验失败.')
  } else {
    // 从缓存中获取 codeVerifier
    const code_verifier = localStorage.getItem('codeVerifier')
    getToken({
      grant_type: 'authorization_code',
      client_id: 'oidc-client',
      redirect_uri: 'http://127.0.0.1:3000/login',
      code,
      code_verifier,
      state,
    })
      .then((res: any) => {
        localStorage.setItem('accessToken', JSON.stringify(res))
   //     router.push({ path: '/' })
      })
      .catch((e: any) => {
        useMessage().warning(`请求token失败：${e.data.error || e.message || e.statusText}`)
      })
  }
} else {
  // 缓存state
  localStorage.setItem('state', state)
  // 缓存codeVerifier
  localStorage.setItem('codeVerifier', codeVerifier)
  window.location.href = `http://127.0.0.1:9000/oauth2/authorize?response_type=code&client_id=oidc-client&redirect_uri=${encodeURIComponent(
    'http://127.0.0.1:3000/login',
  )}&scope=openid&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`
}
</script>

<template>加载中...</template>
