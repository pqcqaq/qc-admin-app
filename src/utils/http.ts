import { IBaseResponse } from '@/api'
import { CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store'

export const http = <T>(options: CustomRequestOptions) => {
  const userStore = useUserStore()
  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const responseData = res.data as IBaseResponse<any>

          // code: "not-login"
          // data: "/customer/dashboard/getdashboarddata?_token_="
          // message: "登录失效，请重新登录"
          // success: false
          if (responseData.code === 'not-login') {
            userStore.logout()
            return
          }

          // 判断业务状态码
          if (responseData.success === true || responseData.code === 0) {
            // 2.1 业务成功，提取核心数据
            // 他妈的接口没什么规范，只能直接返回这个了，类型每个接口自己写吧
            resolve(responseData as T)
          } else {
            // 业务失败，显示后端返回的错误信息
            // !options.hideErrorToast &&
            //   uni.showToast({
            //     icon: 'none',
            //     title: responseData.message || '请求失败',
            //   })
            let errorMessage = responseData.message || '请求失败'
            // switch (responseData.code) {
            //   case 'TOKEN_EXPIRED':
            //     userStore.logout()
            //     uni.navigateTo({ url: '/pages/login/login' })
            //     break
            // }
            !options.hideErrorToast &&
              uni.showToast({
                icon: 'none',
                title: errorMessage,
              })
            reject(responseData)
          }
        } else if (res.statusCode === 401) {
          // 401错误 -> 清理用户信息，跳转到登录页
          userStore.logout()
          const responseData = res.data as IBaseResponse<any>
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: '登录已过期，请重新登录',
            })
          reject(responseData)
        } else {
          // 其他HTTP错误 -> 根据后端错误信息轻提示
          const responseData = res.data as IBaseResponse<any>
          // !options.hideErrorToast &&
          //   uni.showToast({
          //     icon: 'none',
          //     title: responseData.message || '请求错误',
          //   })
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: `请求失败: ${res.statusCode}`,
            })
          reject(responseData)
        }
      },
      // 响应失败
      fail(err) {
        !options.hideErrorToast &&
          uni.showToast({
            icon: 'none',
            title: '网络错误，换个网络试试',
          })
        reject(err)
      },
    })
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
