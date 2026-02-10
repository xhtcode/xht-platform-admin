import { AppLanguageEnums, ComponentSizeEnums } from '@/service/enums'
import type { UserStatusType } from '@/service/model/system/user.model'

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
    access_token?: string
    /**
     * 刷新令牌
     */
    refresh_token?: string
    /**
     * 权限范围
     */
    scope: string[]
    /**
     * 令牌类型
     */
    token_type?: string
    /**
     * 过期时间
     */
    expires_in?: number
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
  interface UserStoreType {
    /**
     * 用户信息状态
     * 包含用户的基本信息、角色和权限
     */
    userInfo: Ref<UserInfoType>
    /**
     * 认证令牌状态
     * 包含访问令牌、刷新令牌等认证信息
     */
    token: Ref<TokenInfoType>
    /**
     * 是否为管理员的计算属性
     * 检查用户是否拥有admin角色
     */
    isAdmin: ComputedRef<boolean>
    /**
     * 是否存在访问令牌的计算属性
     * 检查当前是否已登录
     */
    hasToken: ComputedRef<boolean>
    /**
     * 是否存在角色的计算属性
     * 检查用户是否有分配的角色
     */
    hasRoles: ComputedRef<boolean>
    /**
     * 获取访问令牌的计算属性
     * 返回当前的访问令牌
     */
    getAccessToken: ComputedRef<string>
    /**
     * 获取用户信息页面的计算属性
     */
    getUserInfoPage: ComputedRef<string>
    /**
     * 用户登录方法
     * 通过用户名密码进行登录，获取认证令牌
     */
    login: (data: LoginRequestType) => Promise<void>
    /**
     * 用户登出方法
     * 清除用户认证信息并重置路由
     */
    logout: () => Promise<void>
    /**
     * 获取用户信息方法
     * 从服务端获取当前登录用户的信息
     */
    getUserInfos: () => Promise<void>
  }

  interface UserInfoType {
    /**
     * 用户ID
     */
    userId?: number
    /**
     * 用户类型
     */
    userType?: UserTypeEnums
    /**
     * 用户名
     */
    userName?: string
    /**
     * 用户昵称
     */
    nickName?: string
    /**
     * 账号状态(0-正常,1-未激活,2-禁用,3-锁定,4-过期)
     */
    userStatus?: UserStatusType
    /**
     * 手机号
     */
    userPhone?: string
    /**
     * 头像
     */
    userAvatar?: string
    /**
     * 部门id
     */
    deptId?: number
    /**
     * 部门名称
     */
    deptName?: string
    /**
     * 注册日期
     */
    registerDate?: string
    /**
     * 角色列表
     */
    roleCodes: string[]
    /**
     * 权限列表
     */
    menuButtonCodes: string[]
    /**
     * 数据范围(1-全部数据权限,2-自定数据权限,3-本部门数据权限,4-本部门及以下数据权限,5-仅本人数据权限)
     */
    dataScope?: number
    /**
     * 岗位名称
     */
    postName?: string
  }

  /**
   * 标签页store类型
   * 管理浏览器标签页的状态
   */
  interface TagsStoreType {
    /**
     * 当前激活的标签页
     */
    activeName: any
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
