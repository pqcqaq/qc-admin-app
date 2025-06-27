<template>
  <view class="task-item">
    <view class="task-header">
      <!-- 时间 -->
      <text class="date">{{ timeText }}</text>
      <!-- 人工检查还是问题 -->
      <text class="type">{{ typeText }}</text>
      <text class="label">{{ props.label }}</text>
    </view>

    <view class="task-info">
      <view class="store-name">{{ t('task_item_store') }}：{{ props.shopName }}</view>
      <view class="problem-count">
        {{ t('task_item_question') }}：{{ problemCount }} {{ t('task_item') }}
      </view>
    </view>
    <view class="task-actions">
      <view class="task-time">{{ t('task_item_waiting') }} {{ waitingTime }}</view>
      <view class="actions-right">
        <view :class="[stateEnum, 'task-status']">{{ statusText }}</view>
        <button v-if="showSubmitBtn" class="submit-btn" @click="handleSubmit">提交任务</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const t = i18n.t

interface TaskItemProps {
  type: string
  id: number
  label: string
  shopName: string
  detectionplanId: number
  detectionPlanLabel: string
  detectionRuleldList: string
  stateEnum: string
  createdAt: string
}

const props = defineProps<TaskItemProps>()
const emit = defineEmits<{
  (e: 'submit'): void
}>()

const typeText = computed(() => {
  switch (props.type) {
    case 'detection_task_rectified':
      return '问题整改'
    case 'manual_detection_task':
      return '人工检查'
    default:
      return ''
  }
})
const timeText = computed(() => {
  let date = props.createdAt.split('T')[0].split('-')
  return `${date[1]}月${date[2]}日`
})
const statusClass = computed(() => {
  return props.stateEnum === 'submitted' ? 'status-submitted' : 'status-reviewing'
})

const problemCount = computed(() => {
  return props.detectionRuleldList.split(',').length
})
const waitingTime = computed(() => {
  // 解析创建时间
  const createTime = new Date(props.createdAt)
  // 获取当前时间
  const now = new Date()
  // 计算时间差（毫秒）
  const diff = now.getTime() - createTime.getTime()

  // 转换为分钟
  const minutes = Math.floor(diff / (1000 * 60))

  if (minutes < 60) {
    return `${minutes}分钟`
  } else if (minutes < 60 * 24) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}小时${remainingMinutes}分钟`
  } else {
    const days = Math.floor(minutes / (60 * 24))
    const remainingHours = Math.floor((minutes % (60 * 24)) / 60)
    return `${days}天${remainingHours}小时`
  }
})

const statusText = computed(() => {
  switch (props.stateEnum) {
    case 'todo':
      return '待处理'
    case 'rectified_submitted':
      return '整改已提交'
    case 'reviewing':
      return '处理中'
    case 'completed':
      return '已完成'
    default:
      return ''
  }
})
const showSubmitBtn = computed(() => props.stateEnum === 'todo')

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped lang="scss">
.task-item {
  background-color: #fff;
  border-radius: 4px;
  padding: 32rpx 32rpx 0 32rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

  .task-header {
    margin-bottom: 8px;
    .date,
    .type {
      font-family: Inter;
      font-weight: 500;
      font-size: 13px;
      line-height: 24px;
    }
    .label {
      font-weight: 400;
      font-size: 13px;
      color: #86909c;
      padding-left: 24px;
    }
  }

  .task-info {
    margin-bottom: 8px;
    .store-name,
    .problem-count {
      font-size: 24rpx;
      color: #666;
      margin-top: 5px;
    }
  }

  .task-actions {
    display: flex;
    align-items: center;
    justify-content: space-between; // 左右撑开布局
    border-top: 0.2px solid #a4afca;
    padding: 16rpx 0;
    .task-time {
      font-size: 12px;
      color: #86909c;
    }

    .actions-right {
      display: flex;
      align-items: center;

      .task-status {
        font-size: 12px;
        padding: 8rpx 16rpx;
        border-radius: 4px;
      }
      .todo {
        background-color: #fff5e2;
        color: #f8bd2e;
      }
      .rectified_submitted {
        background-color: #e8ffea;
        color: #00b42a;
      }

      //用于后续的不同名称
      // .status-submitted {
      //   background-color: #e6ffe6;
      //   color: #00bfa5;
      // }

      // .status-reviewing {
      //   background-color: #f5f5f5;
      //   color: #666;
      // }

      .submit-btn {
        font-size: 26rpx;
        height: 60rpx;
        line-height: 60rpx;
        background-color: #00bfa5;
        color: #fff;
        border: none;
        border-radius: 0px;
        margin-left: 32rpx; // 状态和按钮之间留点空隙
      }
    }
  }
}
</style>
