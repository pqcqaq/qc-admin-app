import { http } from '@/utils/http'
import { IPaginationParams, IPaginationResponse, IBaseResponse } from '.'

// ==================== 设备平台相关 ====================
export interface ICameraPlatform {
  id: number
  name: string
  platformType: string
  enabled: number // 1启用，0未启用
}

export interface ICameraPlatformListParams extends IPaginationParams {}

export interface ICameraPlatformListResponse extends IPaginationResponse<ICameraPlatform> {}

// ==================== 设备相关 ====================
export interface ICamera {
  id: number
  customerOrganizationId: number
  workServerId: number
  name: string
  enabled: boolean
  sourceDataForm: string
  detectionRuleIdList: number[]
  videoStreamAddress: string
  platformVideoStreamAddress: string
  platformVideoStreamAddressExpired: number
  listVideoPushRate: string[]
  workStatus: string
  serialNo: string
  created: number
  updated: number
  shopInfo: {
    id: number
    name: string
    enabled: boolean
  }
  customerOrganizationBaseInfo: {
    name: string
    enabled: boolean
    expired: number
    contactName: string
  }
}

export interface ICameraListParams extends IPaginationParams {
  enabled: number // -1全部，1已启用，0未启用
  keyword: string
  cameraPlatformId: number
}

export interface ICameraDeleteParams {
  id: number
}

export interface ICameraDetailParams {
  id: number
}

export interface ICameraDetail {
  id: number
  customerOrganizationId: number
  shopId: number
  workServerId: number
  name: string
  workStatus: string
  enabled: boolean
  sourceDataForm: string
  cameraPlatformId: number
  detectionRuleList: {
    id: number
    industryId: number
    industryCategoryId: number
    customerOrganizationId: number
    introduction: string
    name: string
    require: string
    check: string
    enabled: boolean
    created: number
    updated: number
    industryBaseInfo: {
      id: number
      name: string
      color: string
      enabled: boolean
    }
  }[]
  videoStreamAddress: string
  platformVideoStreamAddress: string
  platformVideoStreamAddressExpired: number
  listVideoPushRate: string[]
  serialNo: string
  created: number
}

export interface ICameraCreateParams {
  id?: number // 没有就新增，有就修改
  shopId: number
  name: string
  enabled: number
  cameraPlatformId: number
  serialNo: string
  deviceType: string
  ip?: string // 直连摄像头的参数
  port?: string // 直连摄像头的参数
  username?: string // 直连摄像头的参数
  password?: string // 直连摄像头的参数
  model?: string // 直连摄像头的参数
}

export interface ICameraByShopParams {
  id: number // 门店ID
}

// ==================== API 接口函数 ====================

/**
 * 获取设备平台列表
 */
export const getCameraPlatformList = (params: ICameraPlatformListParams) => {
  return http.post<IBaseResponse<ICameraPlatformListResponse>>('/cameraplatform/list', params)
}

/**
 * 删除设备
 */
export const deleteCamera = (params: ICameraDeleteParams) => {
  return http.post<IBaseResponse>('/customer/camera/del', params)
}

/**
 * 新版获取设备列表
 */
export const getCameraList = (params: ICameraListParams) => {
  return http.post<IBaseResponse>('/customer/camera/getallbypage', params)
}

/**
 * 新版获取设备详情
 */
export const getCameraDetail = (params: ICameraDetailParams) => {
  return http.post<IBaseResponse>('/customer/camera/detailnew', params)
}

/**
 * 新版新增和修改设备
 */
export const createOrUpdateCamera = (params: ICameraCreateParams) => {
  return http.post<IBaseResponse>('/customer/camera/createnew', params)
}

/**
 * 根据门店编号查询所有设备
 */
export const getCamerasByShop = (params: ICameraByShopParams) => {
  return http.post<IBaseResponse>('/customer/camera/getallbyshopid', params)
}
