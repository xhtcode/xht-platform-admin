import type { RouteRecordRaw } from 'vue-router'

export const Layout = () => import('@/layout/index.vue')
/**
 * 工作台路由
 */
export const HomeDynamicRouter: RouteRecordRaw = {
  name: 'HomeViewComponentIndex',
  path: '/home',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '工作台',
    activeMenuPath: '/',
    icon: 'dashboard',
    affixStatus: true,
    keepAliveStatus: true,
    hiddenStatus: true,
  },
}
/**
 * 定义静态路由（默认路由）
 * 前端添加路由，请在此处加
 */
const DynamicRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'LayoutComponent',
    component: Layout,
    redirect: '/home',
    meta: {
      title: '工作台',
      activeMenuPath: '/',
      icon: 'dashboard',
      hiddenStatus: false,
      breadCrumbStatus: true,
      keepAliveStatus: true,
      affixStatus: true,
    },
    children: [HomeDynamicRouter],
  },
]
export default DynamicRouter
