// ==================== 用户管理 ====================
export * from './user'

// ==================== 认证和组织管理 ====================
export * from './auth'
// ==================== 常用类型导出 ====================
export interface IBaseResponse<T = any> {
  success: boolean
  code?: number | string
  message?: string
  data: T
}

export interface IPaginationParams {
  current: number
  pageSize: number
}

export interface IPaginationResponse<T = any> {
  rows: T[]
  total: number
}

export type Pagination = {
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总记录数 */
  total: number
  /** 总页数 */
  totalPages: number
  /** 是否有下一页 */
  hasNext: boolean
  /** 是否有上一页 */
  hasPrev: boolean
}
