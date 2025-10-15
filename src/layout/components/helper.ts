import { RouteRecordRaw, useRouter } from 'vue-router'
import RegularUtil from '@/utils/RegularUtils'
import { useMessage } from '@/hooks/use-message'

const router = useRouter()

/**
 * 菜单点击
 * @param subItem
 */
export const handleClickMenu = async (subItem: any) => {
  if (subItem.meta?.linkStatus) {
    if (RegularUtil.isExternal(subItem.path)) {
      return window.open(subItem.path, '_blank')
    }
    const href = router.resolve({
      path: subItem.path,
    })
    return window.open(href.href, '_blank')
  }
  await router.push(subItem.path).catch((_) => {
    useMessage().error('路由错误，请联系管理员!' + subItem.path)
  })
}
