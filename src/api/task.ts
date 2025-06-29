import { http } from '@/utils/http'
import { IPaginationParams, IPaginationResponse, IBaseResponse } from '.'

// ==================== 任务相关 ====================
export interface ITask {
  result: Array<{
    id: number
    type: string
    label: string
    shopName: string
    detectionPlanld: number
    detectionPlanLabel: string
    detectionRuleldList: string
    stateEnum: string
    createdAt: string
  }>
}
export interface ITaskHistory {
  rows: Array<{
    id: number
    type: string
    label: string
    shopName: string
    detectionPlanld: number
    detectionPlanLabel: string
    detectionRuleldList: string
    stateEnum: string
    createdAt: string
  }>
}
export interface ITaskBoardDate {
  result: {
    manualDetectionTaskStateEnumTodoExtendedCount: number
    detectionTaskRectifiedStateEnumTodoExtendedAppealFailCount: number
    detectionTaskRectifiedStateEnumAppealingAppealSuccessCount: number
    detectionTaskRectifiedStateEnumAppealingCount: number
  }
}

// ==================== 请求参数 ====================

// ==================== API 接口函数 ====================

/**
 * 查询待办事项列表
 */
export const getTaskList = () => {
  return http.post<IBaseResponse<ITask>>('/app/gettodo')
}

/**
 * 查询看板统计数据
 */
export const getDashBoardStats = () => {
  return http.post<IBaseResponse<ITaskBoardDate>>('/app/getdashboardstats')
}

/**
 * 查询任务历史记录
 * @param params 查询参数
 * @param params.successDatetime 时间范围数组 [startTime, endTime]
 */
export const getHistoryTaskList = (params: { successDatetime: string[] }) => {
  return http.post<IBaseResponse<ITaskHistory>>('/app/getsuccess', params)
}
