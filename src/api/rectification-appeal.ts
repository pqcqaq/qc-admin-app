import { http } from '@/utils/http'
import { IBaseResponse } from '.'

/**
 * 根据人工巡检任务ID获取不合格列表
 */
export const getdetectiontaskrectifieddetailbydetectiontaskrectifiedid = (id: number) => {
  return http.post<IBaseResponse<any>>(
    '/app/getdetectiontaskrectifieddetailbydetectiontaskrectifiedid',
    { id },
  )
}

export const updatedetectiontaskrectifieddetail = (data: any) => {
  return http.post<IBaseResponse<any>>('/app/updatedetectiontaskrectifieddetail', data)
}
