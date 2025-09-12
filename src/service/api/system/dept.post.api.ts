import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  SysDeptPostOperationRequest,
  SysDeptPostQueryRequest,
  SysDeptPostResponse,
} from '@/service/model/system/dept.post.model'
import type { ModeIdArrayType, ModeIdType, PageResponse } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/dept/post/add',
  UPDATE = '/sys/dept/post/update',
  DELETE = '/sys/dept/post/delete/',
  QUERY_ONE = '/sys/dept/post/get/',
  QUERY_PAGE = '/sys/dept/post/page',
  LIST_POST = '/sys/dept/post/list/',
}

/**
 * 保存部门岗位信息
 */
export const saveSysDeptPost = (data: SysDeptPostOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改部门岗位信息
 */
export const updateSysDeptPost = (data: SysDeptPostOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除部门岗位信息
 */
export const removeSysDeptPostById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 删除部门岗位信息
 */
export const removeSysDeptPostByIds = (ids: ModeIdArrayType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
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
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询部门岗位信息
 */
export const querySysDeptPostPage = (
  data?: SysDeptPostQueryRequest
): AxiosPromise<PageResponse<SysDeptPostResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
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
