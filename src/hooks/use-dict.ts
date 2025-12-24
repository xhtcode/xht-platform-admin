import { DictVo, useDictStore } from '@/store/modules/dict.store'

/**
 * 字典
 * @param dictCode 字典项编码
 */
export const useDictHooks = (
  dictCode: string
): {
  dictData: ComputedRef<DictVo[]>
  loadingStatus: Ref<boolean>
} => {
  /**
   * 字典加载状态
   */
  const loadingStatus = ref<boolean>(false)

  /**
   * 字典Store
   */
  const dictStore = useDictStore()

  const dictData = computed<DictVo[]>(() => dictStore.getDict(dictCode))

  onMounted(async () => {
    loadingStatus.value = true
    await dictStore.refreshDict(dictCode)
    loadingStatus.value = false
  })

  return {
    loadingStatus,
    dictData,
  }
}
