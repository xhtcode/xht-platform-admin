import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysDeptPostOperationRequest, SysDeptPostQueryRequest, SysDeptPostResponse } from '@/service/model/system/dept.post.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/dept/post/create',
  UPDATE = '/sys/dept/post/update',
  REMOVE = '/sys/dept/post/remove/',
  QUERY_BY_ID = '/sys/dept/post/get/',
  QUERY_PAGE = '/sys/dept/post/page',
  LIST_POST = '/sys/dept/post/list/',
}

/**
 * 保存部门岗位信息
 */
export const saveSysDeptPost = (data: SysDeptPostOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改部门岗位信息
 */
export const updateSysDeptPost = (data: SysDeptPostOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除部门岗位信息
 */
export const removeSysDeptPostById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 删除部门岗位信息
 */
export const removeSysDeptPostByIds = (ids: ModeIdArrayType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个部门岗位信息
 */
export const querySysDeptPostById = (id: ModeIdType): AxiosPromise<SysDeptPostResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询部门岗位信息
 */
export const querySysDeptPostPage = (data?: SysDeptPostQueryRequest): AxiosPromise<PageResponse<SysDeptPostResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: data,
  })
}
/**
 * 根据部门ID查询部门岗位
 */
export const findListByDeptId = (deptId: ModeIdType): AxiosPromise<SysDeptPostResponse[]> => {
  return request({
    url: Api.LIST_POST + `${deptId}`,
    baseURL,
    method: 'get',
  })
}
