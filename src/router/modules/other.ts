import type { RouteRecordRaw } from 'vue-router'

/**
 * 独立页面路由
 *
 * 不套后台框架布局（无侧边菜单、标签页），整页承载内容，用于文件预览等全屏场景。
 * 这类页面不出现在菜单中，但仍受登录校验保护。
 */
const OtherRouter: RouteRecordRaw[] = [
  {
    path: '/file-preview/:fileStorageKey',
    name: 'FilePreviewViewIndex',
    component: () => import('@/views/other/file-preview/index.vue'),
    meta: {
      title: '文件预览',
      hiddenStatus: true,
    },
  },
]

export default OtherRouter
