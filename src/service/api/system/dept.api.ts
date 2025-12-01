import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysDeptOperationRequest, SysDeptQueryRequest, SysDeptResponse, SysDeptTreeResponse } from '@/service/model/system/dept.model'
import type { ModeIdType } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/dept/create',
  UPDATE = '/sys/dept/update',
  DELETE = '/sys/dept/remove/',
  QUERY_ONE = '/sys/dept/get/',
  QUERY_TREE = '/sys/dept/tree',
}

/**
 * 保存
 */
export const saveSysDept = (data: SysDeptOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改数据
 */
export const updateSysDept = (data: SysDeptOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除
 */
export const removeSysDeptById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个
 */
export const querySysDeptById = (id: ModeIdType): AxiosPromise<SysDeptResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部
 */
export const querySysDeptTree = (data?: SysDeptQueryRequest): AxiosPromise<SysDeptTreeResponse> => {
  return request({
    url: Api.QUERY_TREE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
