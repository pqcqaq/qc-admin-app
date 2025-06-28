<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="history_page">
    <!-- 日期选择器 -->
    <StatusBar class="bar_contaner">
      <template #left>
        <wd-button type="text" class="status_bar_back_button" @click="back">
          <image src="/static/icon/back.svg"></image>
        </wd-button>
      </template>
      <template #title>
        <text class="status_bar_title">{{ t('history_record') }}</text>
      </template>
    </StatusBar>

    <view class="date_picker_container">
      <view class="date_picker">
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
    <view class="task_list">
      <!-- 空状态显示 -->
      <view v-if="filteredTasks.length === 0" class="empty_state">
        <view class="empty_text">{{ t('task_no_record') }}</view>
      </view>

      <!-- 任务列表 -->
      <TaskItem
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        :type="task.type"
        :id="task.id"
        :label="task.label"
        :shopName="task.shopName || ''"
        :detectionplanId="task.detectionplanId"
        :detectionPlanLabel="task.detectionPlanLabel"
        :detectionRuleIdList="task.detectionRuleldList || ''"
        :stateEnum="task.stateEnum"
        :createdAt="task.createdAt"
        :role="userRole"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import StatusBar from '@/components/status-bar/StatusBar.vue'
import TaskItem from '@/components/taskItem/index.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getHistoryTaskList } from '@/api'
const i18n = useI18n()
const t = i18n.t

// 使用storeToRefs解构userInfo
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// 正式使用
const userRole = userInfo.value?.role || ''
// 测试使用
// const userRole = 'clerk'

// 设置默认一个月的时间范围
const now = new Date()
const oneMonthAgo = new Date()
oneMonthAgo.setMonth(now.getMonth() - 1)

// 时间范围状态（界面显示用，使用时间戳）
const timeRange = ref<Array<number>>([oneMonthAgo.getTime(), now.getTime()])

// 用于API请求的ISO格式时间范围
const requestTimeRange = computed(() => {
  return timeRange.value.map((timestamp) => new Date(timestamp).toISOString())
})
// 返回上一页
const back = () => {
  uni.navigateBack()
}
// 任务数据
const tasks = ref([])
// 过滤后的任务列表
const filteredTasks = computed(() => {
  // 根据用户角色过滤任务
  return tasks.value.filter((task) => {
    // 店长和店员可以看到所有类型的任务
    if (userRole === 'store-manage' || userRole === 'clerk') {
      return true
    }
    // 督导只看到问题整改类型的任务
    else if (userRole === 'manage' || userRole === 'area-manage') {
      return task.type === 'detection_task_rectified'
    }
    return true
  })
})

// 处理日期选择确认
function handleConfirm({ value }) {
  console.log('选择的日期范围:', value)
  timeRange.value = value
  // 重新请求数据
  fetchTaskHistory()
}

// 请求任务历史数据
const fetchTaskHistory = async () => {
  try {
    const params = {
      successDatetime: requestTimeRange.value,
    }
    console.log('请求参数:', params)
    const res = await getHistoryTaskList(params)
    if (res && res.data && res.data.rows) {
      tasks.value = res.data.rows
      console.log('成功获取历史任务数据，共', tasks.value.length, '条')
    } else {
      tasks.value = []
      console.log('历史任务数据格式不正确，使用空数组')
    }
  } catch (err) {
    const errorMessage = err?.response?.data?.message || err?.message || '未知错误'
    console.error('获取历史任务数据失败:', errorMessage)
    // 可以添加错误提示
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchTaskHistory()
})
</script>

<style scoped lang="scss">
$primary-color: #3daa9a;
$secondary-color: #98e1d6;
$background-color: #f5f5f5;
$date-picker-color: #ffffff;
$font1-color: #ffffff;
$font2-color: #536387;
$font3-color: #999;
$input-border-color: #e2e7f5;

:deep(.wd-month__day.is-start .wd-month__day-container) {
  background-color: $primary-color !important;
}
/* 修改“确定”按钮的颜色 */
:deep(.is-middle) {
  background-color: $secondary-color !important;
}
:deep(.wd-month__day.is-end .wd-month__day-container) {
  background-color: $primary-color !important;
}
:deep(.wd-month__day.is-current) {
  color: $primary-color !important;
}
:deep(.wd-button.is-primary) {
  background-color: $primary-color !important;
}

.history_page {
  height: 100vh;
  background-color: $background-color;
  .bar_contaner {
    background-color: $primary-color;
    border: none;
    .status_bar_title {
      font-size: large;
      font-weight: bold;
      color: $font1-color;
    }

    .status_bar_back_button {
      color: $font1-color;
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }

  .date_picker_container {
    position: sticky;
    z-index: 100;
    width: 100vw;
    top: -1rpx;
    padding-top: 30rpx;
    padding-bottom: 30rpx;
    background-color: $primary-color;
    display: flex;
    justify-content: center;

    .date_picker {
      width: 660rpx;
      height: 122rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      background-color: $date-picker-color;
      view {
        padding: 0 15rpx;
        font-family: Inter;
        font-weight: 400;
        font-size: 36rpx;
        line-height: 26rpx;
        letter-spacing: 0rpx;
        color: $font2-color;
      }
      .content {
        margin-right: 27rpx;
        border: 1px solid $input-border-color;
        flex: 1;
      }
    }
  }

  .task_list {
    border-radius: 16rpx;
    padding: 20rpx;
    margin: 20rpx;

    /* 移除冗余样式，使用taskItem组件内置样式 */
    .task_item {
      margin-bottom: 20rpx;
    }

    /* 空状态样式 */
    .empty_state {
      text-align: center;
      padding: 150rpx 0;

      .empty_text {
        font-size: 28rpx;
        color: $font3-color;
        line-height: 40rpx;
      }
    }
  }
}
</style>
