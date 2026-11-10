import type { RouteRecordRaw } from 'vue-router'

/**
 * 独立页面路由
 *
 * 不套后台框架布局（无侧边菜单、标签页），整页承载内容，用于文件预览、分享访问等全屏场景。
 * 这类页面不出现在菜单中；分享访问页对匿名开放（凭证是链接里的 token），其余仍受登录校验保护。
 */
const OtherRouter: RouteRecordRaw[] = [
  {
    path: '/file-preview/:fileStorageKey',
    name: 'FilePreviewViewIndex',
    component: () => import('@/views/other/file-preview/index.vue'),
    meta: {
      title: '文件预览',
      hiddenStatus: true,
      ignoreAuth: true,
    },
  },
  {
    path: '/s/:token',
    name: 'ShareLinkViewIndex',
    component: () => import('@/views/share/link.vue'),
    meta: {
      title: '文件分享',
      hiddenStatus: true,
      // 链接分享天然面向未登录用户，凭证是链接中的 token
      ignoreAuth: true,
    },
  },
  {
    path: '/share/user/:shareId',
    name: 'ShareUserViewIndex',
    component: () => import('@/views/share/user.vue'),
    meta: {
      title: '文件分享',
      hiddenStatus: true,
    },
  },
]

export default OtherRouter
