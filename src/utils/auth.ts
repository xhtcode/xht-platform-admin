// 访问 token 缓存的 key
const ACCESS_TOKEN_KEY = 'access_token'

/**
 * 从本地存储中获取访问 token
 * @returns {string} 返回存储的访问 token，如果不存在则返回空字符串
 */
function getAccessToken(): string {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

/**
 * 将访问 token 存储到本地存储中
 * @param {string} token - 要存储的访问 token
 */
function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

/**
 * 清除本地存储中的访问 token
 */
function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export { getAccessToken, setAccessToken, clearToken }
