/* eslint-disable no-param-reassign */
import qs from 'qs'
import { useUserStore } from '@/store'
import { platform } from '@/utils/platform'
import { getEnvBaseUrl } from '@/utils'

declare const __VITE_APP_PROXY__: string | undefined

// 用户信息类型定义
export interface IUserInfo {
  token?: string
  id?: number
  name?: string
  phoneNumber?: string
  role?: string
  [key: string]: any
}

// 文件上传参数类型定义
export interface IUniUploadFileOptions {
  files?: UniApp.UploadFileOptionFiles[]
  file?: File
  filePath?: string
  name?: string
  formData?: any
}

// 自定义请求选项类型
export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = getEnvBaseUrl()

// 拦截配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 如果是/static开头，直接返回
    if (options.url.startsWith('/static')) {
      return
    }

    const userStore = useUserStore()

    // header添加token
    if (userStore.token) {
      options.header = {
        ...options.header,
        Authorization: `Bearer ${userStore.token}`,
      }
    }

    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }

    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      // try {
      //   if (typeof __VITE_APP_PROXY__ !== 'undefined' && JSON.parse(__VITE_APP_PROXY__)) {
      //     // 自动拼接代理前缀
      //     options.url = import.meta.env.VITE_APP_PROXY_PREFIX + options.url
      //   } else {
      //     options.url = baseUrl + options.url
      //   }
      // } catch (error) {
      //   // 如果解析代理配置失败，使用baseUrl
      // options.url = baseUrl + options.url
      // }
      // #endif

      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif

      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }

    // 1. 请求超时
    options.timeout = 10000 // 10s

    // 2. 添加请求头
    options.header = {
      platform, // 可选，与 uniapp 定义的平台一致，告诉后台来源
      ...options.header,
    }

    // 3. 添加 token 请求头标识
    // try {
    //   const userStore = useUserStore()
    //   const userInfo = userStore.userInfo as IUserInfo

    //   if (userInfo?.token) {
    //     options.header.Authorization = `Bearer ${userInfo.token}`
    //   }
    // } catch (error) {
    //   // 如果获取用户信息失败，继续请求但不添加token
    //   console.warn('获取用户信息失败:', error)
    // }
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
