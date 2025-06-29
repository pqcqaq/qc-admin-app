<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '任务看板',
  },
  layout: 'tabbar',
}
</route>

<template>
  <view class="task-page">
    <!-- 任务看板标题区域 -->
    <view class="task-board-container">
      <view class="task-board">
        <view class="board-title-container">
          <view class="title-line"></view>
          <h2 class="board-title">{{ t('task_board') }}</h2>
        </view>
        <!-- 数据统计区域 -->
        <view class="stats-container">
          <!-- 待检查项 -->
          <view class="stat-item">
            <image class="icon" src="/static/icon/task_check.svg"></image>
            <view class="stat-content">
              <view class="stat-label">{{ t('task_pending_check_item') }}</view>
              <view class="stat-value-wrap">
                <text class="stat-value">
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingAppealSuccessCount }}
                </text>
                <text>{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
          <!-- 待整改项 -->
          <view class="stat-item">
            <image class="icon" src="/static/icon/task_check.svg"></image>
            <view class="stat-content">
              <view class="stat-label">{{ t('task_rectify_item') }}</view>
              <view class="stat-value-wrap">
                <text class="stat-value">
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingCount }}
                </text>
                <text>{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
          <!-- 已延期项 -->
          <view class="stat-item">
            <image class="icon" src="/static/icon/task_audit.svg"></image>
            <view class="stat-content">
              <view class="stat-label">{{ t('task_extended_item') }}</view>
              <view class="stat-value-wrap">
                <text class="stat-value">
                  {{ taskBoardDate?.manualDetectionTaskStateEnumTodoExtendedCount }}
                </text>
                <text>{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
          <!-- 待审核项 -->
          <view class="stat-item">
            <image class="icon" src="/static/icon/task_appeal.svg"></image>
            <view class="stat-content">
              <view class="stat-label">{{ t('task_pending_appeal_item') }}</view>
              <view class="stat-value-wrap">
                <text class="stat-value">
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumTodoExtendedAppealFailCount }}
                </text>
                <text>{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 任务列表 -->
    <view class="task-list">
      <view v-if="filteredTasks.length === 0" class="empty-state"></view>
      <TaskItem
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        :type="task.type"
        :id="task.id"
        :label="task.label"
        :shopName="task.shopName"
        :detectionplanId="task.detectionplanId"
        :detectionPlanLabel="task.detectionPlanLabel"
        :detectionRuleIdList="task.detectionRuleIdList"
        :stateEnum="task.stateEnum"
        :createdAt="task.createdAt"
        :role="userRole"
        @submit="handleTaskSubmit(task)"
      />
    </view>

    <!-- 查看历史记录 -->
    <view class="history-link" @click="handlerViewHistory">
      <text>{{ t('task_view_history_record') }} ></text>
    </view>
  </view>
</template>

<script setup lang="ts">
import TaskItem from '@/components/taskItem/index.vue'
import { useI18n } from 'vue-i18n'
import { getTaskList, getDashBoardStats } from '@/api'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

// 使用storeToRefs解构userInfo
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// 正式使用
// const userRole = userInfo.value?.role || ''
// 测试使用
const userRole = 'clerk'
// const userRole = 'area-manage'
// 国际化
const i18n = useI18n()
const t = i18n.t

const handlerViewHistory = () => {
  uni.navigateTo({
    url: '/pages/task/history/index',
  })
}

enum EnumRole {
  MNAGE = 'manage',
  AREAMANAGE = 'area-manage',
  STOREMANAGE = 'store-manage',
  CLERK = 'clerk',
}

// 任务数据
const tasks = ref([])
// 过滤后的任务列表
const filteredTasks = computed(() => {
  // 获取用户角色

  // 根据用户角色过滤任务
  return tasks.value.filter((task) => {
    // 店长和店员可以看到所有类型的任务
    if (userRole === EnumRole.STOREMANAGE || userRole === EnumRole.CLERK) {
      return true
    }
    // 督导只看到问题整改类型的任务
    else if (userRole === EnumRole.AREAMANAGE || userRole === EnumRole.MNAGE) {
      return (
        task.type === 'detection_task_rectified' &&
        (task.stateEnum === 'rectified_submitted' || task.stateEnum === 'rectified_success')
      )
    }
    return false
  })
})
// 统计数据接口定义
interface TaskBoardStats {
  detectionTaskRectifiedStateEnumAppealingAppealSuccessCount?: number
  detectionTaskRectifiedStateEnumAppealingCount?: number
  detectionTaskRectifiedStateEnumTodoExtendedAppealFailCount?: number
  manualDetectionTaskStateEnumTodoExtendedCount?: number
  [key: string]: any
}

// 统计数据
const taskBoardDate = ref<TaskBoardStats>({})
// 加载状态
const loading = ref(true)
const error = ref('')

// 页面加载时获取数据
onMounted(async () => {
  try {
    loading.value = true
    const [taskRes, statsRes] = await Promise.all([getTaskList(), getDashBoardStats()])
    // 检查并赋值任务数据
    console.log(userInfo.value)
    if (taskRes && taskRes.data && taskRes.data.result) {
      tasks.value = taskRes.data.result
    } else {
      tasks.value = []
    }

    if (statsRes && statsRes.data && statsRes.data.result) {
      taskBoardDate.value = statsRes.data.result
      console.log('成功赋值统计数据')
    } else {
      taskBoardDate.value = {}
      console.log('统计数据格式不正确，使用空对象')
    }
  } catch (err) {
    // 解析错误信息，提供更具体的错误提示
    const errorMessage = err?.response?.data?.message || err?.message || '未知错误'
    error.value = `数据加载失败: ${errorMessage}`
    console.error('接口调用失败:', err)
    console.error('错误详情:', errorMessage)
  } finally {
    loading.value = false
  }
})

const handleTaskSubmit = (task: any) => {
  console.log(`任务 ${task.id} 已提交`)
  // 更新任务状态等逻辑...
  if (userRole === EnumRole.CLERK || userRole === EnumRole.STOREMANAGE) {
    uni.navigateTo({
      url: `/pages/manual-inspection/index?id=${task.id}`,
    })
  } else {
    uni.navigateTo({
      url: `/pages/manual-inspection/index?id=${task.id}`,
    })
  }
}
</script>

<style scoped lang="scss">
$primary-color: #3daa9a;
$background-color: #f7f8fa;
$font1-color: #ffffff;
$font2-color: #536387;
$font3-color: #999;
$font4-color: #333;
$font5-color: #7d7d7d;
$input-border-color: #e2e7f5;
.task-page {
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}
/* task board */
.task-board-container {
  background-color: $primary-color; // 绿色背景
  padding: 40rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  .task-board {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 600rpx;

    .board-title-container {
      display: flex;
      align-items: center;
      margin-bottom: 5px;

      .title-line {
        width: 8rpx;
        height: 40rpx;
        background-color: $primary-color;
        margin-right: 20rpx;
      }

      .board-title {
        font-size: 36rpx;
        color: $font4-color;
        font-weight: bold;
      }
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      .stat-item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        background-color: white;
        border-radius: 8rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

        .icon {
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
        }

        .stat-content {
          text-align: left; // 修改为左对齐
          padding-left: 20rpx;
          .stat-label {
            font-family: Inter;
            font-weight: 500;
            font-size: 12px;
            line-height: 20px;
            letter-spacing: 0%;
            color: black;
            padding-bottom: 15rpx;
          }

          .stat-value-wrap {
            display: flex;
            align-items: baseline; // 垂直对齐基线

            .stat-value {
              font-family: Inter;
              font-weight: 500;
              font-size: 18px;
              line-height: 20px;
              letter-spacing: 0%;
              color: black;
              margin-right: 10px;
            }

            text {
              font-size: 12px;
              color: $font3-color;
            }
          }
        }
      }
    }
  }
}

/* 任务列表样式 */
.task-list {
  margin-top: 500rpx; // 增加顶部边距避免被看板覆盖
  padding: 40rpx 40rpx 0rpx 40rpx;
  .empty-state {
    height: 550rpx;
  }
}

/* 历史记录链接 */
.history-link {
  text-align: center;
  padding: 0 0 30rpx 0;

  text {
    color: $font3-color;
    font-size: 28rpx;
  }
}
</style>
