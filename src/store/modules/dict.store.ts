import { defineStore } from 'pinia'

export interface DictVo {
  label: string // 字典项标签
  value: string // 字典项值
  color?: string // 显示颜色
}

export interface DictStore {
  setDict: (dictCode: string, data: DictVo[]) => void
  removeDict: (dictCode: string) => void
  getDict: (dictCode: string) => DictVo[]
}

const useDictStore = defineStore('dict', (): DictStore => {
  /**
   * 字典数据
   */
  const dictData = reactive<Map<string, DictVo[]>>(new Map())

  /**
   * 设置字典数据
   * @param dictCode 字典项编码
   * @param values 字典项数据
   */
  const setDict = (dictCode: string, values: DictVo[]) => {
    dictData.set(dictCode, values)
  }

  /**
   * 移除字典数据
   * @param dictCode 字典项编码
   */
  const removeDict = (dictCode: string) => {
    dictData.delete(dictCode)
  }

  /**
   * 获取字典数据
   * @param dictCode 字典项编码
   * @returns 字典项数据
   */
  const getDict = (dictCode: string) => {
    return (dictCode && dictData.get(dictCode)) || []
  }

  return {
    setDict,
    removeDict,
    getDict,
  }
})

export { useDictStore }
