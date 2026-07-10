import type { RouteRecordRaw } from 'vue-router'

/**
 * 静态路由
 */
const StaticRouter: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'LoginViewIndex',
    component: () => import('@/views/login/index.vue'),
    meta: { hiddenStatus: true, authStatus: true },
  },
  {
    path: '/process',
    name: 'ProcessIndex',
    component: () => import('@/views/process/index.vue'),
    meta: { hiddenStatus: true, authStatus: true },
  },
  {
    path: '/oauth2',
    name: 'Oauth2',
    component: () => import('@/views/oauth2/index.vue'),
    meta: {
      title: 'oauth2登录',
      breadCrumbStatus: true,
      hiddenStatus: true,
      authStatus: true,
    },
  },
  {
    path: '/redirect/:path(.*)',
    name: 'RedirectViewIndex',
    component: () => import('@/views/other/redirect.vue'),
    meta: { title: '用于同路由刷新', breadCrumbStatus: true, hiddenStatus: true },
  },
  {
    path: '/:path(.*)*',
    name: '404ViewIndex',
    component: () => import('@/views/other/404.vue'),
    meta: {
      breadCrumbStatus: true,
      hiddenStatus: true,
      authStatus: true,
    },
  },
]

export default StaticRouter
