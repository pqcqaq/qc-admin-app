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
        <!-- label 标签颜色根据stateEnum自行判断 -->
        <view :class="[stateEnum, 'task-status']">{{ statusText }}</view>
        <!-- label 标签颜色根据stateEnum自行判断 -->
        <button
          v-if="submitBtnConfig.show"
          :class="[submitBtnConfig.state, 'submit-btn']"
          @click="handleSubmit"
        >
          {{ submitBtnConfig.text }}
        </button>
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
  detectionRuleIdList: string
  stateEnum: string
  createdAt: string
  role: string
}

const props = defineProps<TaskItemProps>()
const emit = defineEmits<{
  (e: 'submit'): void
}>()
// 最上方

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
const problemCount = computed(() => {
  return props.detectionRuleIdList.split(',').length
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

// 问题整改会有的状态
enum EnumQuestionChangeState {
  TODO = 'todo', // 待处理
  EXTENDED = 'extended', // 已延期
  RECTIFIED_SUBMITTED = 'rectified_submitted', // 整改已提交
  // APPEAL_SUBMITTED = 'appeal_submitted', // 申诉已提交
  RECTIFIED_SUCCESS = 'rectified_success', // 整改通过
  APPEAL_SUCCESS = 'appeal_success', // 申诉通过
  RECTIFIED_FAIL = 'rectified_fail', // 整改驳回
  // APPEAL_FAIL = 'appeal_fail', // 申诉驳回
  // REVIEWING = 'reviewing', // 处理中
  // COMPLETED = 'completed', // 已完成
}
//人工检查会有的状态
enum EnumMunalCheckState {
  TODO = 'todo', //待办
  EXTENDED = 'extended', //已延期
  ReviewAI = 'reviewAI', //AI审核中，
  AIREVIEWFINISH = 'ai_review_finish', //AI已审核
}

// 根据状态获取显示文本
const statusText = computed(() => {
  // 问题整改类型
  if (props.type === 'detection_task_rectified') {
    switch (props.stateEnum) {
      case EnumQuestionChangeState.TODO:
        return '待整改'
      case EnumQuestionChangeState.EXTENDED:
        return '已延期'
      case EnumQuestionChangeState.RECTIFIED_SUBMITTED:
        return '整改已提交'
      case EnumQuestionChangeState.RECTIFIED_SUCCESS:
        return '整改通过'
      case EnumQuestionChangeState.RECTIFIED_FAIL:
        return '整改驳回'
      // case EnumQuestionChangeState.APPEAL_SUBMITTED:
      //   return '申诉已提交'
      case EnumQuestionChangeState.APPEAL_SUCCESS:
        return '申诉通过'
      // case EnumQuestionChangeState.APPEAL_FAIL:
      //   return '申诉驳回'
      default:
        return ''
    }
  }
  // 人工检查类型
  else if (props.type === 'manual_detection_task') {
    switch (props.stateEnum) {
      case EnumMunalCheckState.TODO:
        return '待处理'
      case EnumMunalCheckState.EXTENDED:
        return '已延期'
      case EnumMunalCheckState.ReviewAI:
        return 'AI审核中'
      case EnumMunalCheckState.AIREVIEWFINISH:
        return 'AI已审核'
      default:
        return ''
    }
  }
  return ''
})
enum EnumRole {
  MNAGE = 'manage',
  AREAMANAGE = 'area-manage',
  STOREMANAGE = 'store-manage',
  CLERK = 'clerk',
}
// 控制提交按钮显示和文本
const submitBtnConfig = computed(() => {
  // 店长和店员视角
  if (props.role === EnumRole.STOREMANAGE || props.role === EnumRole.CLERK) {
    // 问题整改类型
    if (props.type === 'detection_task_rectified') {
      switch (props.stateEnum) {
        case EnumQuestionChangeState.TODO:
        case EnumQuestionChangeState.EXTENDED:
        case EnumQuestionChangeState.RECTIFIED_FAIL:
          // case EnumQuestionChangeState.APPEAL_FAIL:
          return { show: true, text: '提交任务', state: 'commit' }
        case EnumQuestionChangeState.RECTIFIED_SUBMITTED:
          // case EnumQuestionChangeState.APPEAL_SUBMITTED:
          return { show: true, text: '待审核', state: 'appeal' }
        default:
          return { show: false, text: '' }
      }
    }
    // 人工检查类型
    else if (props.type === 'manual_detection_task') {
      switch (props.stateEnum) {
        case EnumMunalCheckState.TODO:
        case EnumMunalCheckState.EXTENDED:
          return { show: true, text: '提交任务', state: 'commit' }
        case EnumMunalCheckState.ReviewAI:
        case EnumMunalCheckState.AIREVIEWFINISH:
          return { show: true, text: '已提交', state: 'appeal' }
        default:
          return { show: false, text: '' }
      }
    }
  }
  // 督导视角
  else if (props.role === EnumRole.MNAGE || props.role === EnumRole.AREAMANAGE) {
    // 只处理问题整改类型
    if (props.type === 'detection_task_rectified') {
      switch (props.stateEnum) {
        case EnumQuestionChangeState.RECTIFIED_SUBMITTED:
          // case EnumQuestionChangeState.APPEAL_SUBMITTED:
          return { show: true, text: '审核', state: 'commit' }
        default:
          return { show: false, text: '' }
      }
    }
  }

  return { show: false, text: '' }
})

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped lang="scss">
$item-color: #fff;
$font1-color: #fff;
$toplabel-color: #86909c;
$problemcound-color: #999;
$taskTime-color: #86909c;
$border-color: #a4afca;
$label1-color: #f8bd2e;
$label1-background-color: #fff5e2;
$label2-color: #00b42a;
$label2-background-color: #e8ffea;
$label3-color: #eb0000;
$label3-background-color: #f8d8d8;
$commit-button-color: #00bfa5;
$appeal-button-color: #00bfa5;
$review-button-color: #1890ff;
.task-item {
  background-color: $item-color;
  border-radius: 8rpx;
  padding: 32rpx 32rpx 0 32rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

  .task-header {
    margin-bottom: 16rpx;
    .date,
    .type {
      font-family: Inter;
      font-weight: 500;
      font-size: 26rpx;
      line-height: 48rpx;
    }
    .label {
      font-weight: 400;
      font-size: 26rpx;
      color: $toplabel-color;
      padding-left: 48rpx;
    }
  }

  .task-info {
    margin-bottom: 16rpx;
    .store-name,
    .problem-count {
      font-size: 24rpx;
      color: $problemcound-color;
      margin-top: 10rpx;
    }
  }

  .task-actions {
    display: flex;
    align-items: center;
    justify-content: space-between; // 左右撑开布局
    border-top: 0.4rpx solid $border-color;
    padding: 16rpx 0;
    .task-time {
      font-size: 24rpx;
      color: $taskTime-color;
    }

    .actions-right {
      display: flex;
      align-items: center;

      .task-status {
        font-size: 24rpx;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
      }
      .todo,
      .reviewAI {
        background-color: $label1-background-color;
        color: $label1-color;
      }
      .rectified_submitted,
      .rectified_success,
      .ai_review_finish {
        background-color: $label2-background-color;
        color: $label2-color;
      }
      .extended,
      .rectified_fail {
        background-color: $label3-background-color;
        color: $label3-color;
      }
      .submit-btn {
        font-size: 26rpx;
        height: 60rpx;
        line-height: 60rpx;
        border: none;
        border-radius: 0rpx;
        margin-left: 32rpx; // 状态和按钮之间留点空隙
      }
      .commit {
        background-color: $commit-button-color;
        color: $font1-color;
      }
      .appeal {
        background-color: $appeal-button-color;
        color: $font1-color;
      }
    }
  }
}
</style>
