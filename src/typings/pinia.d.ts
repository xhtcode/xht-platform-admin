import { AppLanguageEnums, ComponentSizeEnums } from '@/service/enums'

/**
 * pinia自定义ts类型
 */
declare global {
  /**
   * Token信息类型
   * 用于定义用户认证token的相关信息
   */
  interface TokenInfoType {
    /**
     * 访问令牌
     */
    access_token: string | null
    /**
     * 刷新令牌
     */
    refresh_token: string | null
    /**
     * 权限范围
     */
    scope: string[]
    /**
     * 令牌类型
     */
    token_type: string | null
    /**
     * 过期时间
     */
    expires_in: number | null
    /**
     * 附加参数
     */
    additional_parameters: Record<string, any>
  }

  /**
   * 主题pina
   * 存储应用的主题相关配置状态
   */
  interface ThemeStoreType {
    layoutType: Ref<'default' | 'columns'>
    /**
     * 设备类型
     */
    device: Ref<DeviceEnum>
    /**
     * 侧边栏状态
     */
    sidebarStatus: Ref<boolean>
    /**
     * 暗黑模式
     */
    darkStatus: Ref<boolean>
    /**
     * 菜单状态
     */
    menuStatus: Ref<boolean>
    /**
     * 面包屑显示状态
     */
    breadcrumb: Ref<boolean>
    /**
     * tags图标显示状态
     */
    tagsViewStatus: Ref<boolean>
    /**
     * footer 显示
     */
    footerStatus: Ref<boolean>
    /**
     * 水印内容
     */
    watermarkContent: Ref<string>
    /**
     * 语言类型
     */
    languageType: Ref<AppLanguageEnums>
    /**
     * UI组件大小类型
     */
    sizeType: Ref<ComponentSizeEnums>
    /**
     * 默认主题颜色
     */
    colorType: Ref<string>
    /**
     * 悼念模式
     */
    mournModeStatus: Ref<boolean>
    /**
     * 色弱模式
     */
    colorWeaknessModeStatus: Ref<boolean>
  }

  /**
   * 用户信息store
   * 存储当前登录用户的信息
   */
  interface UserInfoStoreType {
    /**
     * 用户id
     */
    userId: ModeIdType
    /**
     * 用户名称
     */
    userName: string | null
    /**
     * 用户账号
     */
    userAccount: string | null
    /**
     * 数据权限
     */
    dataScope: number | null
    /**
     * 角色code
     */
    roles: string[]
    /**
     * 权限code
     */
    authorities: string[]
    /**
     * token信息
     */
    token: TokenInfoType
  }

  /**
   * 标签页store类型
   * 管理浏览器标签页的状态
   */
  interface TagsStoreType {
    /**
     * 访问过的路由
     */
    visitedViews: Ref<TagsViewType[]>
    /**
     * 缓存的路由
     */
    cachedViews: string[] | any
    /**
     * 添加访问过的路由
     */
    addVisitedViews: (view: TagsViewType) => void
    /**
     * 删除访问过路由
     */
    removeVisitedView: (view: TagsViewType) => void
    /**
     * 删除所有访问过路由
     */
    removeAllVisitedViews: () => void
    /**
     * 删除左侧访问过路由
     */
    removeLeftVisitedViews: (view: TagsViewType) => void
    /**
     * 删除右侧访问过路由
     */
    removeRightVisitedViews: (view: TagsViewType) => void
    /**
     * 删除其他访问过路由
     */
    removeOtherVisitedViews: (view: TagsViewType) => void
  }

  /**
   * 标签页视图类型
   * 定义标签页中每个路由视图的属性
   */
  interface TagsViewType {
    /**
     * 路由路径
     */
    path: string
    /**
     * 页面标题
     */
    title: string
    /**
     * 路由名称
     */
    name: string | symbol | undefined
    /**
     * 图标
     */
    icon: string
    /**
     * 是否固定标签
     */
    affixStatus: boolean
    /**
     * 是否缓存
     *
     */
    cacheStatus?: boolean
    /**
     * 查询参数
     */
    query?: any
  }

  /**
   * 路由状态
   * 管理路由加载和刷新状态

   */
  interface RouterStatus {
    /**
     * 加载状态
     */
    loadingStatus: boolean
    /**
     * 刷新状态
     */
    refreshStatus: boolean
  }
}

export {}
