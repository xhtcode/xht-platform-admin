import { defineStore } from 'pinia'
import { queryByDictCode } from '@/service/api/system/dict.item.api'

export interface DictVo {
  label: string // 字典项标签
  value: string // 字典项值
  disabled: boolean // 禁用选项
  color?: string // 显示颜色
}

export interface DictStore {
  refreshDict: (dictCode: string) => Promise<void>
  removeDict: (dictCode: string) => void
  clearDict: () => void
  getDict: (dictCode: string) => DictVo[]
}

const useDictStore = defineStore('dict', (): DictStore => {
  /**
   * 字典数据
   */
  const dictMap = ref<Map<string, DictVo[]>>(new Map())

  /**
   *  请求队列（防止重复请求）
   */
  const requestQueue: Record<string, Promise<void>> = {}

  /**
   * 设置字典数据
   * @param dictCode 字典项编码
   */
  const refreshDict = async (dictCode: string) => {
    if (dictMap.value.get(dictCode)) return
    // 防止重复请求
    if (!requestQueue[dictCode]) {
      requestQueue[dictCode] = queryByDictCode(dictCode)
        .then((res) => {
          dictMap.value.set(dictCode, res.data || [])
          Reflect.deleteProperty(requestQueue, dictCode)
        })
        .catch(() => {
          Reflect.deleteProperty(requestQueue, dictCode)
        })
    }
    await requestQueue[dictCode]
  }

  /**
   * 移除字典数据
   * @param dictCode 字典项编码
   */
  const removeDict = (dictCode: string) => {
    dictMap.value.delete(dictCode)
  }

  /**
   * 清空字典数据
   */
  const clearDict = () => {
    dictMap.value.clear()
  }

  /**
   * 获取字典数据
   * @param dictCode 字典项编码
   * @returns 字典项数据
   */
  const getDict = (dictCode: string) => {
    return (dictCode && dictMap.value.get(dictCode)) || []
  }

  return {
    refreshDict,
    removeDict,
    clearDict,
    getDict,
  }
})

export { useDictStore }
