import { http } from '@/utils/http'
import { IBaseResponse } from '.'
import { getEnvBaseUrl } from '@/utils'
import { useUserStore } from '@/store'
// 请求基准地址
const baseUrl = getEnvBaseUrl()
/**
 * 根据人工巡检任务ID获取检测规则列表
 */
export const getDetectionRuleListByManualDetectionTaskId = (id: number) => {
  return http.post<IBaseResponse<any>>('/app/getdetectionrulelistbymanualdetectiontaskid', { id })
}

export interface DetectionBatchItem {
  manualDetectionTaskId: number
  detectionRuleId: number
  imageUrl: string
}

export interface DetectionBatchPayload {
  dataList: DetectionBatchItem[]
}

export const createdetectionbatchformanualdetectiontask = (data: DetectionBatchPayload) => {
  return http.post<IBaseResponse<any>>('/app/createdetectionbatchformanualdetectiontask', { data })
}

/**
 * 上传巡检图片
 * @param filePath 本地图片路径
 * @param fileObj 文件对象
 * @returns Promise<string> 图片url
 */
export const uploadManualDetectionImage = (filePath: string, fileObj?: File) => {
  // 每次调用时获取最新token
  const userStore = useUserStore()
  const token = userStore.token
  // 校验token有效性
  if (!token) {
    uni.showToast({ icon: 'none', title: '登录失效，请重新登录' })
    return Promise.reject(new Error('登录失效，请重新登录'))
  }
  return new Promise<string>((resolve, reject) => {
    // #ifdef H5
    if (typeof window !== 'undefined' && fileObj) {
      const formData = new FormData()
      formData.append('image', fileObj)
      fetch(baseUrl + '/customer/manualdetectiontask/imageupload?_token_=' + token, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 0 && res.data?.result) {
            resolve(res.data.result)
          } else {
            uni.showToast({ icon: 'none', title: res.message || '上传失败' })
            reject(res)
          }
        })
        .catch((err) => {
          uni.showToast({ icon: 'none', title: '网络错误，上传失败' })
          reject(err)
        })
      return
    }
    // #endif
    // #ifndef H5
    uni.uploadFile({
      url: baseUrl + '/customer/manualdetectiontask/imageupload?_token_=' + token,
      filePath,
      name: 'image',
      success: (uploadFileRes) => {
        try {
          const res = JSON.parse(uploadFileRes.data)
          if (res.code === 0 && res.data?.result) {
            resolve(res.data.result)
          } else {
            uni.showToast({ icon: 'none', title: res.message || '上传失败' })
            reject(res)
          }
        } catch (e) {
          uni.showToast({ icon: 'none', title: '上传失败' })
          reject(e)
        }
      },
      fail: (err) => {
        uni.showToast({ icon: 'none', title: '网络错误，上传失败' })
        reject(err)
      },
    })
    // #endif
  })
}
