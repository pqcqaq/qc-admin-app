import { http } from '@/utils/http'
import { IBaseResponse } from '@/api/index'

interface GetaAuditDetailResponse {
  id: number
  approveState: 0 | 1 | 2
  imageUrlList: string[]
  text: string
  appealState: 0 | 1
  detectionTask: {
    id: number
    detectionImageUrl: string
    detectionMessage: string
    isPassed: 0 | 1
    detectionRule: {
      type: string
    }
  }
  rows: any[]
}
/**
 * 根据巡检任务整改编号查询巡检任务整改细节列表
 */
export const getAuditDetail = (params: { id: number }) => {
  return http.post<IBaseResponse<GetaAuditDetailResponse>>(
    '/app/getdetectiontaskrectifieddetailbydetectiontaskrectifiedid',
    params,
  )
}
/**
 * 修改巡检任务整改细节审核状态
 */
export const updateAuditApprovestate = (params: {
  detectionTaskRectifiedDetailId: number
  approveState: 1 | 2
  lastDetailFlag: Boolean
}) => {
  return http.post<IBaseResponse>('/app/updatedetectiontaskrectifieddetailapprovestate', params)
}
