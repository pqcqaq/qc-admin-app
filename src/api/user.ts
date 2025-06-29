import { http } from '@/utils/http'
import { IPaginationParams, IBaseResponse, IShop } from '.'

// ==================== 用户相关类型 ====================
export interface IUser {
  id: number
  customerOrganizationId?: number
  phoneNumber?: string
  nickname?: string
  name?: string
  role?: string // manage，area-manage，store-manage，clerk
  password?: string
  shopIdList?: string
  enabled?: number
  gender?: number // 1男，0女，2未填写
  avatarUrl?: string
  webSid?: string
  logined?: number
  employeeStringId?: string
  created?: number
  updated?: number
  deleted?: number
}

// ==================== 请求参数类型 ====================
export interface IUserAddParams {
  phoneNumber: string // 手机号
  name: string // 姓名
  shopIdList: string // 关联的门店，用逗号分隔多个门店编号
  enabled: number // 是否已启用
  gender: number // 1男，0女，如果用户没填写，必须传递2
  employeeStringId: string // 工号
}

export interface IUserListParams extends IPaginationParams {
  role?: string
  enabled: number
  keyword: string
}

export interface IUserDetailParams {
  id: number
}

export interface INicknameParams {
  nickname: string // 昵称
}

export interface IUserUpdateParams {
  id: number
  nickname: string
  name: string
  phoneNumber: string
  gender: number
  role: string // manage，area-manage，store-manage，clerk
  employeeStringId: string
  enabled: number
  shopIdList: string
}

export interface IUserAuditListParams extends IPaginationParams {}

export interface IUserAuditCommitParams {
  idList: number
  successState: number
}

// ==================== API 接口函数 ====================

/**
 * 新增用户
 */
export const addUser = (params: IUserAddParams) => {
  return http.post<IBaseResponse>('/customer/customer/add', params)
}

/**
 * 分页查询用户
 */
export const getUserList = (params: IUserListParams) => {
  return http.post<IBaseResponse>('/customer/customer/getallbypage', params)
}

/**
 * 查询单个用户
 */
export const getUserDetail = (params: IUserDetailParams) => {
  return http.post<IBaseResponse>('/customer/customer/getonebyid', params)
}

/**
 * 修改用户
 */
export const updateUser = (params: IUserUpdateParams) => {
  return http.post<IBaseResponse>('/customer/customer/update', params)
}

/**
 * 查询用户审核列表
 */
export const getUserAuditList = (params: IUserAuditListParams) => {
  return http.post<IBaseResponse>('/customer/customer/getallcustomerinformationauditbypage', params)
}

/**
 * 提交用户信息审核
 */
export const commitUserAudit = (params: IUserAuditCommitParams) => {
  return http.post<IBaseResponse>('/customer/customer/commitcustomerinformationaudit', params)
}

export type IOrganization = {
  id: number
  dealerId: number
  name: string
  enabled: boolean
  expired: number
  industryId: number
  phoneNumber: string
  contactName: string
  invitationCode: string
  license: string
  licenseImg: string
  logoImg: string
  provinceId: number
  cityId: number
  address: string
  nameOfLegalEntity: string
  created: number
  updated: number
}

export type UserInfoWithShop = {
  row: IUser & {
    customerOrganization: IOrganization
  }
  shops: IShop[]
}

/**
 * 查询单个用户带shop信息
 */
export const getUserDetailWithShop = (params: IUserDetailParams) => {
  return http.post<IBaseResponse<UserInfoWithShop>>(
    '/customer/customer/getonebyidwithshops',
    params,
  )
}

/**
 * 更新用户昵称
 */
export const updateNickname = (params: INicknameParams) => {
  return http.post<IBaseResponse>('/customer/customer/updatenicknamebyself', params)
}
