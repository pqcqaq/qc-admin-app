<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '历史记录',
  },
}
</route>

<template>
  <view class="history-page">
    <!-- 日期选择器 -->
    <view class="date-picker-container">
      <view class="date-picker">
        <view>{{ t('task_history_date') }}</view>
        <wd-calendar
          class="content"
          type="daterange"
          v-model="timeRange"
          @confirm="handleConfirm"
        />
      </view>
    </view>
    <!-- 任务列表 -->
    <view class="task-list">
      <!-- 空状态显示 -->
      <!-- <view v-if="filteredTasks.length === 0" class="empty-state">
        <image src="/static/icon/empty-task.svg" class="empty-icon"></image>
        <text class="empty-text">暂无任务记录</text>
      </view> -->

      <!-- 任务列表 -->
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
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import TaskItem from '@/components/taskItem/index.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const t = i18n.t

const timeRange = ref<number>(Date.now())
function handleConfirm({ value }) {
  console.log(value)
}
// 修复任务数据格式 - 使用标准日期格式并添加title字段
const tasks = ref([
  {
    type: 'detection_task_rectified',
    id: 1,
    label: '',
    detectionplanId: 0,
    detectionPlanLabel: '',
    detectionRuleldList: '1,3',
    stateEnum: 'todo',
    createdAt: '2025-06-16T13:33:54+08:08',
  },
  {
    type: 'manual_detection_task',
    id: 15,
    label: '人工巡检任务标签测试1',
    detectionplanId: 9,
    detectionPlanLabel: '巡检计划测试1',
    detectionRuleldList: '53,54,55',
    stateEnum: 'todo',
    createdAt: '2025-06-19T13:33:54+08:08',
  },
  {
    type: 'manual_detection_task',
    id: 15,
    label: '人工巡检任务标签测试1',
    detectionplanId: 9,
    detectionPlanLabel: '巡检计划测试1',
    detectionRuleldList: '53,54,55',
    stateEnum: 'rectified_submitted',
    createdAt: '2025-06-19T13:33:54+08:08',
  },
])
</script>

<style scoped lang="scss">
$primary-color: #3dab9a;

.history-page {
  .date-picker-container {
    padding-top: 10rpx;
    padding-bottom: 40rpx;
    background-color: $primary-color;
    display: flex;
    justify-content: center;

    .date-picker {
      width: 660rpx;
      height: 122rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      background-color: white;
      view {
        padding: 0 15rpx;
        font-family: Inter;
        font-weight: 400;
        font-size: 18px;
        line-height: 13px;
        letter-spacing: 0px;
        color: #536387;
      }
      .content {
        margin-right: 27rpx;
        border: 1px solid #e2e7f5;
        flex: 1;
      }
    }
  }

  .task-list {
    background-color: #f8f9fa;
    border-radius: 16rpx;
    padding: 20rpx;
    margin: 20rpx;

    /* 移除冗余样式，使用taskItem组件内置样式 */
    .task-item {
      margin-bottom: 20rpx;
    }

    /* 空状态样式 */
    .empty-state {
      text-align: center;
      padding: 150rpx 0;

      image {
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 30rpx;
      }

      text {
        font-size: 28rpx;
        color: #999;
        line-height: 40rpx;
      }
    }
  }
}
</style>
