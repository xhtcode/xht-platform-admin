import { AppLanguageEnums, ComponentSizeEnums } from '@/common/enums'

/**
 * pinia自定义ts类型
 */
declare global {
  interface TokenInfoType {
    access_token: string | null
    refresh_token: string | null
    scope: string[]
    token_type: string | null
    expires_in: number | null
    additional_parameters: Record<string, any>
  }

  /**
   * 主题pina
   */
  interface ThemeStoreType {
    device: Ref<DeviceEnum> // 设备类型
    sidebarStatus: Ref<boolean> // 侧边栏状态
    darkStatus: Ref<boolean> // 暗黑模式
    menuStatus: Ref<boolean> // 菜单状态
    breadcrumb: Ref<boolean> // 面包屑显示状态
    tagsViewStatus: Ref<boolean> // tags图标显示状态
    footerStatus: Ref<boolean> // footer 显示
    watermarkContent: Ref<string> // 水印内容
    languageType: Ref<AppLanguageEnums> // 语言类型
    sizeType: Ref<ComponentSizeEnums> // UI组件大小类型
    colorType: Ref<string> // 默认主题颜色
    mournModeStatus: Ref<boolean> //  悼念模式
    colorWeaknessModeStatus: Ref<boolean> // 色弱模式
  }

  /**
   * 用户信息store
   */
  interface UserInfoStoreType {
    userId: ModeIdType // 用户id
    userName: string | null // 用户名称
    userAccount: string | null // 用户账号
    dataScope: number | null // 数据权限
    roles: string[] // 角色code
    authorities: string[] // 权限code
    token: TokenInfoType // token信息
  }

  interface TagsStoreType {
    visitedViews: Ref<TagsViewType[]> // 访问过的路由
    cachedViews: string[] | any // 缓存的路由
    addVisitedViews: (view: TagsViewType) => void // 添加访问过的路由
    removeVisitedView: (view: TagsViewType) => void // 删除访问过路由
    removeAllVisitedViews: () => void // 删除所有访问过路由
    removeLeftVisitedViews: (view: TagsViewType) => void // 删除左侧访问过路由
    removeRightVisitedViews: (view: TagsViewType) => void // 删除右侧访问过路由
    removeOtherVisitedViews: (view: TagsViewType) => void // 删除其他访问过路由
  }

  interface TagsViewType {
    path: string
    title: string
    name: string | symbol | undefined
    icon: string
    affixStatus: boolean
    cacheStatus?: boolean //是否缓存
    query?: any //查询参数
  }
}

export {}
