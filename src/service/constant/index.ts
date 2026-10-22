/**
 * 默认主题色
 */
export const DefaultThemeColor = 'rgb(64, 158, 255)'

/**
 * 短信验证码默认重发间隔（秒）
 * 与后端短信发送频控一致，环境变量未配置或配置非法时使用该值
 */
const DEFAULT_SMS_RESEND_INTERVAL = 120

/**
 * 短信验证码重发间隔（秒）
 *
 * 通过环境变量 `VITE_SMS_RESEND_INTERVAL` 调整，修改后需与后端频控阈值保持一致，
 * 否则前端倒计时结束后仍会被后端拒绝。配置缺失、非数字或非正整数时回退为默认值，
 * 避免出现 `NaN`、`0` 导致按钮立即可点。
 */
export const SMS_RESEND_INTERVAL = ((): number => {
  const interval = Number(import.meta.env.VITE_SMS_RESEND_INTERVAL)
  return Number.isInteger(interval) && interval > 0 ? interval : DEFAULT_SMS_RESEND_INTERVAL
})()

/**
 * 404页面名字
 */
export const PAGE_PATH_404 = '/404'

/**
 * 登录页面名字
 */
export const PAGE_PATH_LOGIN = '/login'

/**
 * 首页页面名字
 */
export const HOME_PAGE_PATH = '/'

/**
 * 定义HTTP请求头中的Authorization字段常量
 */
export const HEADER_AUTHORIZATION = 'Authorization'

/**
 * 定义HTTP请求头中的Content-Type字段常量
 */
export const HEADER_CONTENT_TYPE = 'Content-Type'

/**
 * 定义HTTP请求头中的分布式链路ID字段常量
 */
export const HEADER_TRACE_ID = 'X-Trace-Id'

/**
 * 定义HTTP请求头中的用户名字段常量
 */
export const HEADER_USER_ACCOUNT = 'X-User-Account'

/**
 * 定义HTTP请求头中的用户ID字段常量
 */
export const HEADER_USER_ID = 'X-User-Id'
