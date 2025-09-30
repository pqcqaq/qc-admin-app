import { IBaseResponse } from '@/api'
import { CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store'

// 请求白名单，不需要token的接口
const whiteList = [
  '/api/auth/refresh-token',
  '/api/auth/login',
  '/api/auth/phone-login',
  '/api/auth/register',
  '/api/auth/send-verify-code',
  '/api/auth/verify-code',
  '/api/auth/reset-password',
]

// 防止重复刷新token
let isRefreshing = false
// token过期后，暂存待执行的请求
let requests: Array<(token: string) => void> = []

// 格式化token
const formatToken = (token: string) => `Bearer ${token}`

// 重连原始请求
const retryOriginalRequest = (options: CustomRequestOptions): Promise<CustomRequestOptions> => {
  return new Promise((resolve) => {
    requests.push((token: string) => {
      options.header = {
        ...options.header,
        Authorization: formatToken(token),
      }
      resolve(options)
    })
  })
}

export const http = <T>(options: CustomRequestOptions) => {
  const userStore = useUserStore()

  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    const makeRequest = async (requestOptions: CustomRequestOptions) => {
      uni.request({
        ...requestOptions,
        dataType: 'json',
        // #ifndef MP-WEIXIN
        responseType: 'json',
        // #endif
        // 响应成功
        success(res) {
          // 状态码 2xx，参考 axios 的设计
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const responseData = res.data as IBaseResponse<any>
            // 判断业务状态码
            if (responseData.success === true || responseData.code === 0) {
              // 2.1 业务成功，提取核心数据
              resolve(responseData as T)
            } else {
              // 业务失败，显示后端返回的错误信息
              let errorMessage = responseData.data || '请求失败'
              !requestOptions.hideErrorToast &&
                uni.showToast({
                  icon: 'none',
                  title: errorMessage,
                })
              reject(responseData)
            }
          } else if (res.statusCode === 401) {
            // 401错误 -> 尝试刷新token
            const tokenData = userStore.getToken()
            if (tokenData && !isRefreshing) {
              isRefreshing = true

              userStore
                .handRefreshToken({ refreshToken: tokenData.refreshToken })
                .then((res) => {
                  const token = res.data.token
                  // 更新请求头
                  requestOptions.header = {
                    ...requestOptions.header,
                    Authorization: formatToken(token.accessToken),
                  }

                  // 处理所有等待的请求
                  requests.forEach((cb) => cb(token.accessToken))
                  requests = []

                  // 重新发起原始请求
                  makeRequest(requestOptions)
                })
                .catch(() => {
                  // 刷新失败，清理用户信息，跳转到登录页
                  userStore.logout()
                  !requestOptions.hideErrorToast &&
                    uni.showToast({
                      icon: 'none',
                      title: '登录已过期，请重新登录',
                    })
                  reject(res.data)
                })
                .finally(() => {
                  isRefreshing = false
                })
            } else if (isRefreshing) {
              // 正在刷新token，等待刷新完成后重试
              retryOriginalRequest(requestOptions).then(makeRequest)
            } else {
              // 没有token或刷新失败，清理用户信息，跳转到登录页
              userStore.logout()
              !requestOptions.hideErrorToast &&
                uni.showToast({
                  icon: 'none',
                  title: '登录已过期，请重新登录',
                })
              reject(res.data)
            }
          } else {
            // 其他HTTP错误 -> 根据后端错误信息轻提示
            const responseData = res.data as IBaseResponse<any>
            !requestOptions.hideErrorToast &&
              uni.showToast({
                icon: 'none',
                title: `请求失败: ${res.statusCode}`,
              })
            reject(responseData)
          }
        },
        // 响应失败
        fail(err) {
          !requestOptions.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: '网络错误，换个网络试试',
            })
          reject(err)
        },
      })
    }

    // 检查是否在白名单中
    const isWhiteList = whiteList.some((url) => options.url.endsWith(url))

    // 添加token到请求头
    if (!isWhiteList) {
      const tokenData = userStore.getToken()
      if (tokenData) {
        const now = new Date().getTime()
        const expired = parseInt(tokenData.expires.toString()) - now <= 0

        if (expired) {
          // token过期，需要刷新
          if (!isRefreshing) {
            isRefreshing = true

            userStore
              .handRefreshToken({ refreshToken: tokenData.refreshToken })
              .then((res) => {
                const token = res.data.token
                options.header = {
                  ...options.header,
                  Authorization: formatToken(token.accessToken),
                }

                // 处理所有等待的请求
                requests.forEach((cb) => cb(token.accessToken))
                requests = []

                // 发起请求
                makeRequest(options)
              })
              .catch(() => {
                // 刷新失败，清理用户信息
                userStore.logout()
                reject(new Error('Token refresh failed'))
              })
              .finally(() => {
                isRefreshing = false
              })
            return
          } else {
            // 正在刷新token，等待刷新完成后重试
            retryOriginalRequest(options).then(makeRequest)
            return
          }
        } else {
          // token未过期，直接使用
          options.header = {
            ...options.header,
            Authorization: formatToken(tokenData.accessToken),
          }
        }
      }
    }

    // 如果不是token刷新流程，直接发起请求
    if (!isRefreshing || isWhiteList) {
      makeRequest(options)
    }
  })
}

/**
 * 请求
 */
export const httpRequest = <T>(
  method: 'post' | 'get' | 'put' | 'delete',
  url: string,
  data?: {
    data?: Record<string, any>
    params?: any
    header?: Record<string, any>
  },
) => {
  let trueMethod = method.toUpperCase() as 'POST' | 'GET' | 'PUT' | 'DELETE'

  return http<T>({
    url,
    method: trueMethod,
    data: data?.data,
    header: data?.header,
    query: data?.params,
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export const httpGet = <T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    method: 'GET',
    header,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    header,
  })
}

/**
 * PUT 请求
 */
export const httpPut = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    data,
    query,
    method: 'PUT',
    header,
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export const httpDelete = <T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    method: 'DELETE',
    header,
  })
}

// 绑定方法到http对象上
http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete
http.request = httpRequest
