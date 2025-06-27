import { http } from '@/utils/http'
import { IBaseResponse } from '.'

export interface IDashboardResponse {
  detectionPlanCount: number
  shopCount: number
  detectionTaskCount: number
  detectionTaskIsPassCount: number
  manualDetectionTaskStateEnumTodoExtendedCount: number
  detectionTaskRectifiedStateEnumTodoExtendedAppealFailCount: number
  detectionTaskRectifiedStateEnumAppealingAppealSuccessCount: number
  detectionTaskRectifiedStateEnumAppealingCount: number
  todoList: {
    id: number
    type: string
    label: string
    detectionPlanId: number
    detectionPlanLabel: string
    detectionRuleIdList: string
    stateEnum: string
    createdAt: string
  }[]
  questionList: {
    detectionRuleId: number
    detectionRuleName: number
    count: number
  }[]
  shopPassRate: {
    Name: string
    PassRateByDatetimeRange: number
    PassRateByDatetimeAll: number
  }[]
}
export interface IDashboardParams {
  detectionTimeStart: string[]
}
export const getDashboard = (params: IDashboardParams) => {
  return http.post<IBaseResponse<IDashboardResponse>>(
    '/customer/dashboard/getdashboarddata',
    params,
  )
}
