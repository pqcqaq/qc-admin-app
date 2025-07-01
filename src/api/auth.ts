import { http } from '@/utils/http'
import { IBaseResponse } from '.'

// ==================== 认证相关类型 ====================
export interface ILoginParams {
  accountName: string
  password: string
}
export interface IGetSmsCodeParams {
  phoneNumber: string
  smsCode: string
}

export interface ILoginResponse {
  id: number
  nickname: string
  gender: number // 1男，0女，2未填写
  avatarUrl: string
  sid: string
}

// ==================== 组织管理相关类型 ====================
export interface IInvitationCodeResponse {
  // 根据实际邀请码响应结构定义
  invitationCode?: string
  // 添加其他邀请码相关字段
}

// ==================== API 接口函数 ====================

/**
 * 用户登录
 */
export const login = (params: ILoginParams) => {
  return http.post<IBaseResponse<ILoginResponse>>('/customer/auth/loginaccount', params)
}

/**
 * 验证码登录
 */
export const loginBySmsCode = (params: IGetSmsCodeParams) => {
  return http.post<IBaseResponse<ILoginResponse>>('/customer/auth/loginaccountbysmscode', params)
}

/**
 * 公司生成邀请码
 * 如果已存在就重新生成覆盖旧的
 */
export const generateInvitationCode = () => {
  return http.post<IBaseResponse<IInvitationCodeResponse>>(
    '/customer/customerorganization/generateinvitationcode',
  )
}

/**
 * 公司获取邀请码
 */
export const getInvitationCode = () => {
  return http.post<IBaseResponse<IInvitationCodeResponse>>(
    '/customer/customerorganization/getinvitationcode',
  )
}

/**
 * 验证码
 */

export const getsmscode = (params: { phoneNumber: string }) => {
  return http.post<IBaseResponse<IInvitationCodeResponse>>('/customer/auth/getsmscode', params)
}
