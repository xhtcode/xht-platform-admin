import type { AxiosPromise } from 'axios'
import type { SysMenuTreeResponse } from '@/service/model/system/menu.model'
import request from '@/utils/request'
import type { SysRoleResponse } from '@/service/model/system/role.model'
import type { ModeIdType } from '@/service/model/base.model'
import type { UserSimpleVo } from '@/service/model/system/user.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 专用于组件调用的api
 */
enum Api {
  QUERY_MENU_TREE = '/sys/menu/tree/',
  QUERY_ROLE_LIST = '/sys/role/list',
  GET_BIND_USER = '/sys/user/dept/getBindUser',
}

/**
 * 查询树形结构菜单
 */
export const queryToolsMenuTree = (type: 'ALL' | 'M' | 'C' | 'B'): AxiosPromise<SysMenuTreeResponse> => {
  return request({
    url: Api.QUERY_MENU_TREE + type,
    baseURL,
    method: 'get',
  })
}
/**
 * 查询树形结构菜单
 */
export const queryToolsRoleList = (): AxiosPromise<SysRoleResponse[]> => {
  return request({
    url: Api.QUERY_ROLE_LIST,
    baseURL,
    method: 'get',
  })
}
/**
 * 获取已绑定的用户信息
 * @param {string} deptId
 * @returns
 */
export const getBindUser = (deptId: ModeIdType): AxiosPromise<UserSimpleVo[]> => {
  return request({
    url: Api.GET_BIND_USER,
    baseURL,
    method: 'get',
    params: {
      deptId,
    },
  })
}
