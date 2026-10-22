/**
 * 系统日志执行状态
 */
export type BLogExecuteStatus = 0 | 1 | 2

/**
 * 系统日志查询请求类型
 */
export interface BLogQueryRequest extends PageQueryRequest {
  title?: string // 日志名称
  logDesc?: string // 日志描述
  traceId?: string // 链路ID
  serviceName?: string // 服务名称
  executeStatus?: string // 执行状态（0其他 1正常 2错误），可用值:0,1,2
}

/**
 * 系统日志响应类型
 */
export interface BLogResponse extends BasicResponse {
  id: ModeIdType // 主键ID
  title: string // 日志名称
  logDesc: string // 日志描述
  traceId: string // 链路ID
  serviceName: string // 服务名称
  classMethod: string // 类名加方法名
  requestParams: string // 调用参数
  serverAddr: string // 服务器地址
  requestIp: string // 请求IP
  requestHeaders: string // 请求头信息
  executeAccount: string // 执行账号
  requestType: string // 请求类型
  requestUrl: string // 请求地址
  executeTime: string // 执行时间
  executeCost: number // 执行耗时（毫秒）
  executeStatus: BLogExecuteStatus // 执行状态（0其他 1正常 2错误），可用值:0,1,2
  executeException: string // 执行异常信息
}
