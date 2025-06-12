import { http } from '@/utils/http'
import { IPaginationParams, IBaseResponse, IPaginationResponse } from '.'

// ==================== 门店相关类型 ====================
export interface IShop {
  id: number
  customerOrganizationId: number
  industryId: number
  name: string
  cityAreaCode: number
  cityAreaCodeList: string
  address: string
  enabled: boolean
  number: string
  provinceId: number
  cityId: number
  created: number
  updated: number
  deleted: number
  cameraList?: IShopCamera[]
  customerList?: IShopCustomer[]
}

export interface IShopCamera {
  id: number
  customerOrganizationId: number
  shopId: number
  shop: IShop
  name: string
  enabled: number
  workStatus: string
  detectionRuleIdList: string
  videoStreamAddress: string
  platformVideoStreamAddress: string
  platformVideoStreamAddressExpired: number
  listVideoPushRate: string
  promptId: number
  workServerId: number
  sourceDataForm: string
  cameraPlatformId: number
  cameraPlatform: {
    id: number
    name: string
    platformType: string
    enabled: number
  }
  serialNo: string
  captureType: string
  deviceType: string
  created: number
  updated: number
  deleted: number
  detectionRuleCount: number
  detectionRuleList: null
}

export interface IShopCustomer {
  id: number
  customerOrganizationId: number
  phoneNumber: string
  nickname: string
  name: string
  role: string
  password: string
  shopIdList: string
  enabled: number
  gender: number
  avatarUrl: string
  webSid: string
  logined: number
  employeeStringId: string
  created: number
  updated: number
  deleted: number
}

export interface IShopDetail {
  row: IShop
}

// ==================== 请求参数类型 ====================
export interface IShopListParams extends IPaginationParams {
  enabled: number
  keyword: string
}

export interface IShopDetailParams {
  id: number
}

export interface IShopAddParams {
  name: string
  address: string
  enabled: number
  number: string
  provinceId: number
  cityId: number
}

export interface IShopUpdateParams extends IShopAddParams {
  id: number
}

export interface IShopAllParams {
  keyword?: string // 门店名或门店编码
}

// ==================== API 接口函数 ====================

/**
 * 获取门店列表（分页）
 */
export const getShopList = (params: IShopListParams) => {
  return http.post<IBaseResponse<IPaginationResponse<IShop>>>('/customer/shop/getallbypage', params)
}

/**
 * 获取门店详情
 */
export const getShopDetail = (params: IShopDetailParams) => {
  return http.post<IBaseResponse<IShopDetail>>('/customer/shop/getonebyid', params)
}

/**
 * 新增门店
 */
export const addShop = (params: IShopAddParams) => {
  return http.post<IBaseResponse>('/customer/shop/add', params)
}

/**
 * 修改门店
 */
export const updateShop = (params: IShopUpdateParams) => {
  return http.post<IBaseResponse>('/customer/shop/update', params)
}

/**
 * 查询全部门店
 */
export const getAllShops = (params?: IShopAllParams) => {
  return http.post<IBaseResponse>('/customer/shop/getall', params || {})
}
