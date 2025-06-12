import { http } from '@/utils/http'
import { IPaginationParams, IBaseResponse, IPaginationResponse } from '.'

// ==================== 巡检规则相关类型 ====================
export interface IDetectionRule {
  id: number
  industryId: number
  industryCategoryId: number
  customerOrganizationId: number
  name: string
  introduction: string
  require: string
  check: string
  enabled: number // 1启用，0未启用
  type?: string // 前端类别写死
  aiState?: number // ai状态：ai、no_ai、configuration
  created: number
  updated: number
}

// ==================== 请求参数类型 ====================
export interface IDetectionRuleListParams extends IPaginationParams {
  name: string
  enabled: number // -1为全部
  type: string
  state: string
}

export interface IDetectionRuleAddParams {
  name: string
  require: string // 判断标准
  type: string // 种类
  state: string // 状态：枚举：ai、no_ai、configuration
  numebr: string // 自定义编号（注意：原文档中拼写为numebr）
}

export interface IDetectionRuleUpdateParams {
  id: number
  name: string
  require: string // 判断标准
  type: string // 种类
  state: string // 状态：枚举：ai、no_ai、configuration
  number: string // 自定义编号
}

export interface IDetectionRuleDeleteParams {
  id: number
}

// ==================== API 接口函数 ====================

/**
 * 新版巡检规则列表
 */
export const getDetectionRuleList = (params: IDetectionRuleListParams) => {
  return http.post<IBaseResponse<IPaginationResponse<IDetectionRule>>>(
    '/customer/detectionrule/listnew',
    params,
  )
}

/**
 * 新增巡检规则
 */
export const addDetectionRule = (params: IDetectionRuleAddParams) => {
  return http.post<IBaseResponse>('/customer/detectionrule/add', params)
}

/**
 * 修改巡检规则
 */
export const updateDetectionRule = (params: IDetectionRuleUpdateParams) => {
  return http.post<IBaseResponse>('/customer/detectionrule/update', params)
}

/**
 * 删除巡检规则
 */
export const deleteDetectionRule = (params: IDetectionRuleDeleteParams) => {
  return http.post<IBaseResponse>('/customer/detectionrule/del', params)
}
