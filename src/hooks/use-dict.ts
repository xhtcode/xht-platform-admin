import { useDictStore } from '@/store/modules/dict.store'
import { queryByDictCode } from '@/service/api/system/dict.item.api'

let timer: any

/**
 * 字典
 * @param dictCode 字典项编码
 * @param loadingStatus 加载状态
 */
export const useDictHooks = (dictCode: string, loadingStatus: boolean) => {
  /**
   * 字典Store
   */
  const dictStore = useDictStore()

  const dictData = computed(() => dictStore.getDict(dictCode))

  const initData = () => {
    loadingStatus = true
    queryByDictCode(dictCode)
      .then((res) => {
        dictStore.setDict(dictCode, res.data)
      })
      .finally(() => {
        loadingStatus = true
      })
  }
  onMounted(() => {
    initData()
  })
  return dictData
}
