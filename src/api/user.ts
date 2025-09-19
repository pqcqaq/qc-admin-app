import { http } from '@/utils/http'
import { Pagination } from '.'

export type User = {
  /** 用户ID */
  id: string
  /** 用户名 */
  name: string
  /** 年龄 */
  age?: number
  /** 性别 */
  sex?: string
  /** 状态 */
  status?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 头像ID */
  avatarId?: string
  /** 头像URL */
  avatar?: string
}

export type UserListResult = {
  success: boolean
  data: Array<User>
  pagination: Pagination
}

/** 获取用户列表 */
export const getUserList = (data?: object) => {
  return http.request<UserListResult>('get', '/api/users', {
    params: data,
  })
}

/** 获取用户分页列表 */
export const getUserListWithPagination = (data?: object) => {
  return http.request<UserListResult>('get', '/api/users/page', {
    params: data,
  })
}

/** 配置用户头像 */
export const setUserAvatar = (userid: string, attachmentId: string) => {
  return http.request<any>('post', `/api/users/${userid}/avatar/${attachmentId}`)
}
