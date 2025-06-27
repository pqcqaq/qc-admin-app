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
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingCount }}
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
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingCount }}
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
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingCount }}
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
      <TaskItem
        v-for="(task, index) in tasks"
        :key="task.id"
        :type="task.type"
        :id="task.id"
        :label="task.label"
        :detectionplanId="task.detectionplanId"
        :detectionPlanLabel="task.detectionPlanLabel"
        :detectionRuleldList="task.detectionRuleldList"
        :stateEnum="task.stateEnum"
        :createdAt="task.createdAt"
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
// 国际化
const i18n = useI18n()
const t = i18n.t

const handlerViewHistory = () => {
  uni.navigateTo({
    url: '/pages/task/history/index',
  })
}
enum role {
  'manage',
  'area-manage',
  'store-manage',
  'clerk',
}
//整改的状态枚举
enum taskState {
  'todo', //代办
  'extended', //已延期
  'rectified_submitted', //整改已提交，
  'appeal_submitted', //申诉已提交
  'rectified success', //整改通过
  'appeal_success', //申诉通过
  'rectified_fail', //整改驳回
  'appeal_fail', //申诉驳回
}
enum state {
  'todo', //`待办，
  'extended', //已延期ai
  'reviewAl', //审核中，
  'ai_review_finish', //`Al已审核
}
// 任务数据
const tasks = ref([])
// 统计数据
const taskBoardDate = ref({})
// 加载状态
const loading = ref(true)
const error = ref('')

// 页面加载时获取数据
onMounted(async () => {
  try {
    loading.value = true
    const [taskRes, statsRes] = await Promise.all([getTaskList(), getDashBoardStats()])
    console.log(taskRes, statsRes)
    tasks.value = taskRes.data || []
    taskBoardDate.value = statsRes.data || {}
  } catch (err) {
    error.value = '数据加载失败，请重试'
    console.error('接口调用失败:', err)
  } finally {
    loading.value = false
  }
})

const handleTaskSubmit = (task: any) => {
  console.log(`任务 ${task.date} 已提交`)
  // 更新任务状态等逻辑...
}
</script>

<style scoped lang="scss">
$primary-color: #3dab9a;

.task-page {
  min-height: 100vh;
  padding-bottom: 20rpx;
}
/* task board */
.task-board-container {
  background-color: $primary-color; // 绿色背景
  padding: 40rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .task-board {
    background-color: #fff;
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
        color: #333;
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
        background-color: #fff;
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
            color: #000;
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
              color: #000;
              margin-right: 10px;
            }

            text {
              font-size: 12px;
              color: #7d7d7d;
            }
          }
        }
      }
    }
  }
}

/* 任务列表样式 */
.task-list {
  padding: 40rpx 40rpx 0rpx 40rpx;
}

/* 历史记录链接 */
.history-link {
  text-align: center;

  text {
    color: #86909c;
    font-size: 28rpx;
  }
}
</style>
