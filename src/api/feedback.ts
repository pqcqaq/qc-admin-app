import { http } from '@/utils/http'
import { IBaseResponse } from '.'

export interface IFeedbackAddParams {
  text: string // 反馈内容
}

/**
 * 新增feedback
 */
export const addFeedback = (params: IFeedbackAddParams) => {
  return http.post<IBaseResponse>('/app/addfeedback', params)
}
