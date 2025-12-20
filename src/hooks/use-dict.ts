import { DictVo, useDictStore } from '@/store/modules/dict.store'

/**
 * 字典
 * @param dictCode 字典项编码
 */
export const useDictHooks = (
  dictCode: string
): {
  dictData: ComputedRef<DictVo[]>
} => {
  /**
   * 字典Store
   */
  const dictStore = useDictStore()

  const dictData = computed<DictVo[]>(() => dictStore.getDict(dictCode))

  onMounted(async () => {
    await dictStore.refreshDict(dictCode)
  })

  return {
    dictData,
  }
}
