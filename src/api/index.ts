// ==================== 设备管理 ====================
export * from './device'

// ==================== 门店管理 ====================
export * from './shop'

// ==================== 巡检规则管理 ====================
export * from './detectionRule'

// ==================== 用户管理 ====================
export * from './user'

// ==================== 认证和组织管理 ====================
export * from './auth'

// ==================== 常用类型导出 ====================
export interface IBaseResponse<T = any> {
  success: boolean
  serverTime: number
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
