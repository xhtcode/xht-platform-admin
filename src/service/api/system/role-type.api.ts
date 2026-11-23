import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type {
  RoleTypeSelectedMenuResponse,
  SysRoleTypeMenuBindForm,
  SysRoleTypeOperationRequest,
  SysRoleTypeOption,
  SysRoleTypeQueryRequest,
  SysRoleTypeResponse,
} from '@/service/model/system/role-type.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/sys/roleType/create', // 创建角色类型
  REMOVE = '/sys/roleType/remove/', // 根据主键`id`删除角色类型
  UPDATE = '/sys/roleType/update/', // 根据主键`id`更新角色类型
  QUERY_BY_ID = '/sys/roleType/get/', // 根据主键`id`查询角色类型
  QUERY_PAGE = '/sys/roleType/page', // 分页查询角色类型
  QUERY_LIST = '/sys/roleType/list', // 查询全部正常状态角色类型
  BIND_MENU = '/sys/roleType/menu/bind', // 角色类型绑定菜单
  SELECT_MENU = '/sys/roleType/select/menu/', // 查询角色类型已选菜单
}

/**
 * 创建角色类型
 *
 * @param data 角色类型表单请求参数
 */
export const saveSysRoleType = (data: SysRoleTypeOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除角色类型
 *
 * @param id 角色类型主键
 */
export const removeSysRoleTypeById = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 更新角色类型
 *
 * @param data 角色类型表单请求参数
 */
export const updateSysRoleType = (data: SysRoleTypeOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 查询单个角色类型
 *
 * @param id 角色类型主键
 */
export const querySysRoleTypeById = (id: ModeIdType): Promise<ApiResponse<SysRoleTypeResponse>> => {
  return request<SysRoleTypeResponse>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询角色类型
 *
 * @param data 角色类型查询请求参数
 */
export const querySysRoleTypePage = (data?: SysRoleTypeQueryRequest): Promise<ApiResponse<PageResponse<SysRoleTypeResponse>>> => {
  return request<PageResponse<SysRoleTypeResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 查询全部角色类型（仅正常状态，按 typeSort 倒序，供下拉框使用）
 */
export const querySysRoleTypeList = (): Promise<ApiResponse<SysRoleTypeOption[]>> => {
  return request<SysRoleTypeOption[]>({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
  })
}

/**
 * 角色类型绑定菜单
 *
 * @param data 角色类型绑定菜单数据
 */
export const roleTypeMenuBind = (data: SysRoleTypeMenuBindForm): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.BIND_MENU,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 查询角色类型的已选菜单（绑定弹窗回显）
 *
 * @param roleTypeId 角色类型主键
 */
export const selectMenuIdByRoleTypeId = (roleTypeId: ModeIdType): Promise<ApiResponse<RoleTypeSelectedMenuResponse>> => {
  return request<RoleTypeSelectedMenuResponse>({
    url: Api.SELECT_MENU + `${roleTypeId}`,
    baseURL,
    method: 'get',
  })
}
