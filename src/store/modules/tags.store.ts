import { defineStore } from 'pinia'
import pInIaPersistConfig from '@/store/pinia-persist'

/**
 * tags store
 */
const useTagsStore = defineStore(
  'tags',
  (): TagsStore => {
    /**
     * 当前激活的视图名称
     */
    const activeName = ref<any>(null)

    /**
     * 已访问视图列表
     */
    const visitedViews = ref<TagsView[]>([])
    /**
     * 缓存视图列表
     */
    const cachedViews = computed<string[] | any>(() => visitedViews.value.filter((item) => item.cacheStatus).map((item) => item.name))
    /**
     * 添加已访问视图到已访问视图列表中
     */
    const addVisitedViews = (view: TagsView) => {
      if (!view) return
      if (visitedViews.value.some((v) => v.path === view.path)) return
      visitedViews.value.push(view)
    }

    /**
     * 从已访问视图列表中删除指定的视图（删除数据不包括固定的）
     */
    const removeVisitedView = (view: TagsView) => {
      if (view.affixStatus) return
      for (const [i, v] of visitedViews.value.entries()) {
        // 找到与指定视图路径匹配的视图，在已访问视图列表中删除该视图
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
    }

    /**
     * 从已访问视图列表中删除全部的视图（删除数据不包括固定的）
     */
    const removeAllVisitedViews = () => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v.affixStatus
      })
    }

    /**
     * 从已访问视图列表中删除其他的视图（删除数据不包括固定的）
     */
    const removeOtherVisitedViews = (view: TagsView) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v.affixStatus || v.path === view.path
      })
    }

    /**
     * 从已访问视图列表中删除它左侧的视图（删除数据不包括固定的）
     */
    const removeLeftVisitedViews = (view: TagsView) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path)
      if (currIndex === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, index) => !!(index >= currIndex || item?.affixStatus))
    }

    /**
     * 从已访问视图列表中删除它右侧的视图（删除数据不包括固定的）
     */
    const removeRightVisitedViews = (view: TagsView) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path)
      if (currIndex === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, index) => !!(index <= currIndex || item?.affixStatus))
    }

    return {
      activeName,
      visitedViews,
      cachedViews,
      addVisitedViews,
      removeVisitedView,
      removeAllVisitedViews,
      removeLeftVisitedViews,
      removeRightVisitedViews,
      removeOtherVisitedViews,
    }
  },
  { persist: pInIaPersistConfig('tags', ['activeName', 'visitedViews']) }
)
export default useTagsStore
