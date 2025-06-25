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
    path: '/oauth2/authorize',
    component: () => import('@/views/oauth2/index.vue'),
  },

  {
    path: '/oauth2/pkce',
    name: 'PkceRedirect',
    component: () => import('@/views/oauth2/pkce-redirect.vue'),
  },
  {
    path: '/redirect/:path(.*)',
    name: 'RedirectViewIndex',
    component: () => import('@/views/other/redirect.vue'),
    meta: { breadCrumbStatus: true, hiddenStatus: true },
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
