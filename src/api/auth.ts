import { http } from '@/utils/http'

export type TokenInfo = {
  accessToken: string
  refreshToken: string
  accessExpiredIn: number
  refreshExpiredIn: number
}

export type UserResult = {
  success: boolean
  data: {
    user: {
      /** 用户ID */
      id: string
      /** 用户名 */
      name: string
      /** 状态 */
      status: string
      /** 创建时间 */
      createTime: string
      /** 更新时间 */
      updateTime: string
      /** 当前登录用户的角色 */
      roles: Array<any>
      /** 按钮级别权限 */
      permissions: Array<any>
      /** 头像 */
      avatar: string
      /** 性别 */
      sex: 'male' | 'female' | 'unknown'
    }
    /** `token` */
    token: TokenInfo
    /** 消息 */
    message: string
  }
}

export type RefreshTokenResult = {
  success: boolean
  data: {
    /** `token` */
    token: TokenInfo
    /** 消息 */
    message: string
  }
}

export type UserInfo = {
  /** 用户ID */
  id: string
  /** 用户名 */
  name: string
  /** 状态 */
  status: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 当前登录用户的角色 */
  roles: Array<any>
  /** 按钮级别权限 */
  permissions: Array<any>
  /** 头像 */
  avatar: string
  /** 性别 */
  sex: 'male' | 'female' | 'unknown'
}

export type UserInfoResult = {
  success: boolean
  data: UserInfo
}

type ResultTable = {
  success: boolean
  data?: {
    /** 列表数据 */
    list: Array<any>
    /** 总条目数 */
    total?: number
    /** 每页显示条目个数 */
    pageSize?: number
    /** 当前页数 */
    currentPage?: number
  }
}

/** 登录 */
export const getLogin = (data?: {
  credentialType: string
  identifier: string
  secret: string
  verifyCode?: string
}) => {
  return http.request<UserResult>('post', '/api/auth/login', {
    data: Object.assign(data, {
      clientCode: import.meta.env.VITE_CLIENT_CODE,
    }),
  })
}

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>('post', '/api/auth/refresh-token', {
    data,
  })
}

/** 注册 */
export const registerApi = (data?: {
  credentialType: string
  identifier: string
  secret: string
  verifyCode: string
  username: string
}) => {
  return http.request<any>('post', '/api/auth/register', {
    data: Object.assign(data, {
      clientCode: import.meta.env.VITE_CLIENT_CODE,
    }),
  })
}

/** 发送验证码 */
export const sendVerifyCodeApi = (data?: {
  senderType: string
  identifier: string
  purpose: string
}) => {
  return http.request<any>('post', '/api/auth/send-verify-code', {
    data: Object.assign(data, {
      clientCode: import.meta.env.VITE_CLIENT_CODE,
    }),
  })
}

/** 验证验证码 */
export const verifyCodeApi = (data?: {
  identifier: string
  code: string
  purpose: string
  senderType: string
}) => {
  return http.request<any>('post', '/api/auth/verify-code', {
    data: Object.assign(data, {
      clientCode: import.meta.env.VITE_CLIENT_CODE,
    }),
  })
}

/** 重置密码 */
export const resetPasswordApi = (data?: {
  credentialType: string
  identifier: string
  newPassword: string
  verifyCode?: string
  oldPassword?: string
}) => {
  return http.request<any>('post', '/api/auth/reset-password', {
    data: Object.assign(data, {
      clientCode: import.meta.env.VITE_CLIENT_CODE,
    }),
  })
}

/** 获取用户信息 */
export const getUserInfoApi = (data?: object) => {
  return http.request<UserInfoResult>('get', '/api/auth/user-info', {
    data,
  })
}

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>('get', '/mine', {
    data,
  })
}

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>('get', '/mine-logs', { data })
}
