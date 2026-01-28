import type { RouteRecordRaw } from 'vue-router'
/**
 * 定义静态路由（默认路由）
 * 前端添加路由，请在此处加
 */
const DynamicRouter: RouteRecordRaw[] = [
  {
    path: '/user',
    redirect: '/user/info',
    component: () => import('@/layout/index.vue'),
    meta: {
      hiddenStatus: false,
      title: '用户中心',
    },
    children: [
      {
        path: 'info',
        name: 'UserInfo',
        component: () => import('@/views/dashboard/user-info/index.vue'),
        meta: {
          icon: 'i-menu-user',
          hiddenStatus: false,
          keepAliveStatus: true,
          title: '用户信息',
        },
      },
      {
        path: 'safety',
        name: 'UpdatePassword',
        component: () => import('@/views/dashboard/safety/index.vue'),
        meta: {
          icon: 'i-login-password',
          hiddenStatus: false,
          keepAliveStatus: true,
          title: '安全设置',
        },
      },
      {
        path: 'message',
        name: 'MyMessage',
        component: () => import('@/views/dashboard/message/index.vue'),
        meta: {
          icon: 'i-menu-message',
          hiddenStatus: false,
          keepAliveStatus: true,
          title: '信息中心',
        },
      },
      {
        path: 'login/log',
        name: 'LoginLog',
        component: () => import('@/views/dashboard/login-log/index.vue'),
        meta: {
          icon: 'i-menu-system-log',
          hiddenStatus: false,
          keepAliveStatus: true,
          title: '登录日志',
        },
      },
    ],
  },
]
export default DynamicRouter
