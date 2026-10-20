import { HOME_PAGE_PATH, PAGE_PATH_LOGIN } from '@/service/constant'
import type { LocationQuery, LocationQueryValue } from 'vue-router'

/**
 * 解析登录成功后的跳转地址
 *
 * 会话失效时拦截器会写入 `/login?redirect=原地址`，登录成功后应回到该地址。
 * 仅接受站内绝对路径，并拒绝协议相对地址（`//host`）与登录页自身，
 * 避免开放重定向与登录页死循环。
 *
 * @param query 当前登录页的路由查询参数
 * @returns 站内跳转路径，非法时回退到首页
 */
export const resolveLoginRedirect = (query: LocationQuery): string => {
  const rawRedirect = query.redirect
  const redirect: LocationQueryValue | LocationQueryValue[] | undefined = Array.isArray(rawRedirect) ? rawRedirect[0] : rawRedirect
  if (typeof redirect !== 'string') {
    return HOME_PAGE_PATH
  }
  if (!redirect.startsWith('/') || redirect.startsWith('//') || redirect === PAGE_PATH_LOGIN) {
    return HOME_PAGE_PATH
  }
  return redirect
}
