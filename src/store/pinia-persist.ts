/**
 * pinia持久化参数配置
 */
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

/** 持久化 key 前缀 */
const PERSIST_KEY_PREFIX = 'xht_'

/**
 * 登出时保留的本地偏好
 * 主题、布局等外观设置与账号无关，登出后应继续生效
 */
const PRESERVED_STORAGE_KEYS = new Set<string>([`${PERSIST_KEY_PREFIX}theme`])

/**
 * 清理与登录态相关的本地持久化数据
 *
 * 相比 localStorage.clear()，仅清理带项目前缀的键并保留外观偏好，
 * 避免用户每次登出后主题、布局被重置。
 */
export const clearSessionPersist = () => {
  const keysToRemove: string[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key && key.startsWith(PERSIST_KEY_PREFIX) && !PRESERVED_STORAGE_KEYS.has(key)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => window.localStorage.removeItem(key))
  // 会话级数据（如临时表单、页签运行态）整体清空
  window.sessionStorage.clear()
}

/**
 * @param key  缓存key的名称
 * @param pick 指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
 */
const pInIaPersistConfig = (key: string, pick?: string[]) => {
  const persist: PersistenceOptions = {
    key: `${PERSIST_KEY_PREFIX}${key}`,
    storage: window.localStorage,
    //storage: window.sessionStorage,
    debug: false,
    pick: pick,
  }
  return persist
}

export default pInIaPersistConfig
