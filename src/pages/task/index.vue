<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '任务看板',
  },
  layout: 'tabbar',
  needLogin: true,
}
</route>

<template>
  <view class="task-page">
    <!-- 任务看板标题区域 -->
    <view class="task-board-container" :class="{ collapsed: isCollapsed }">
      <view class="task-board">
        <view class="board-title-container" v-show="!isCollapsed">
          <view class="title-line"></view>
          <h2 class="board-title">{{ t('task_board') }}</h2>
        </view>
        <!-- 数据统计区域 -->
        <view class="stats-container" :class="{ collapsed: isCollapsed }">
          <!-- 待检查项 -->
          <view class="stat-item" :class="{ collapsed: isCollapsed }">
            <image
              class="icon"
              :class="{ collapsed: isCollapsed }"
              src="/static/icon/task_check.svg"
            ></image>
            <view class="stat-content" :class="{ collapsed: isCollapsed }">
              <view class="stat-label" :class="{ hidden: isCollapsed }">
                {{ t('task_pending_check_item') }}
              </view>
              <view class="stat-value-wrap" :class="{ collapsed: isCollapsed }">
                <text class="stat-value" :class="{ collapsed: isCollapsed }">
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingAppealSuccessCount }}
                </text>
                <text class="stat-unit" :class="{ hidden: isCollapsed }">{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
          <!-- 待整改项 -->
          <view class="stat-item" :class="{ collapsed: isCollapsed }">
            <image
              class="icon"
              :class="{ collapsed: isCollapsed }"
              src="/static/icon/task_check.svg"
            ></image>
            <view class="stat-content" :class="{ collapsed: isCollapsed }">
              <view class="stat-label" :class="{ hidden: isCollapsed }">
                {{ t('task_rectify_item') }}
              </view>
              <view class="stat-value-wrap" :class="{ collapsed: isCollapsed }">
                <text class="stat-value" :class="{ collapsed: isCollapsed }">
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumAppealingCount }}
                </text>
                <text class="stat-unit" :class="{ hidden: isCollapsed }">{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
          <!-- 已延期项 -->
          <view class="stat-item" :class="{ collapsed: isCollapsed }">
            <image
              class="icon"
              :class="{ collapsed: isCollapsed }"
              src="/static/icon/task_audit.svg"
            ></image>
            <view class="stat-content" :class="{ collapsed: isCollapsed }">
              <view class="stat-label" :class="{ hidden: isCollapsed }">
                {{ t('task_extended_item') }}
              </view>
              <view class="stat-value-wrap" :class="{ collapsed: isCollapsed }">
                <text class="stat-value" :class="{ collapsed: isCollapsed }">
                  {{ taskBoardDate?.manualDetectionTaskStateEnumTodoExtendedCount }}
                </text>
                <text class="stat-unit" :class="{ hidden: isCollapsed }">{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
          <!-- 待审核项 -->
          <view class="stat-item" :class="{ collapsed: isCollapsed }">
            <image
              class="icon"
              :class="{ collapsed: isCollapsed }"
              src="/static/icon/task_appeal.svg"
            ></image>
            <view class="stat-content" :class="{ collapsed: isCollapsed }">
              <view class="stat-label" :class="{ hidden: isCollapsed }">
                {{ t('task_pending_appeal_item') }}
              </view>
              <view class="stat-value-wrap" :class="{ collapsed: isCollapsed }">
                <text class="stat-value" :class="{ collapsed: isCollapsed }">
                  {{ taskBoardDate?.detectionTaskRectifiedStateEnumTodoExtendedAppealFailCount }}
                </text>
                <text class="stat-unit" :class="{ hidden: isCollapsed }">{{ t('task_item') }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 任务列表 -->
    <scroll-view class="task-list-scroll" scroll-y @scroll="onScroll" :scroll-top="scrollTop">
      <view class="task-list">
        <view v-if="filteredTasks.length === 0" class="empty-state"></view>
        <TaskItem
          v-for="task in filteredTasks"
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
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getTaskList, getDashBoardStats } from '@/api'
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

// 使用storeToRefs解构userInfo
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// 正式使用
// const userRole = userInfo.value?.row.role || ''
// 测试使用
const userRole: string = 'clerk'
// const userRole = 'area-manage'
// 国际化
const i18n = useI18n()
const t = i18n.t

// 滚动相关状态
const isCollapsed = ref(false)
const scrollTop = ref(0)
const lastScrollTop = ref(0)
const COLLAPSE_THRESHOLD = 60 // 折叠阈值，根据实际滚动范围调整
const EXPAND_THRESHOLD = 30 // 展开阈值

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

// 滚动事件处理
const onScroll = (e: any) => {
  const currentScrollTop = e.detail.scrollTop
  const scrollDirection = currentScrollTop > lastScrollTop.value ? 'down' : 'up'

  // 向下滚动超过阈值时折叠
  if (scrollDirection === 'down' && currentScrollTop > COLLAPSE_THRESHOLD && !isCollapsed.value) {
    isCollapsed.value = true
  }
  // 向上滚动到阈值以下时展开
  else if (scrollDirection === 'up' && currentScrollTop < EXPAND_THRESHOLD && isCollapsed.value) {
    isCollapsed.value = false
  }

  lastScrollTop.value = currentScrollTop
}

// 页面加载时获取数据
onMounted(async () => {
  await loadData()
})

// 页面显示时刷新数据
onShow(async () => {
  await loadData()
})

// 封装数据加载逻辑
const loadData = async () => {
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
}

const handleTaskSubmit = (task: any) => {
  console.log(`任务 ${task.id} 已提交`)
  const time = task.createdAt.split('T')[0].split('-')
  const timeText = `${time[1]}月${time[2]}日`
  // 更新任务状态等逻辑...
  if (userRole === EnumRole.CLERK || userRole === EnumRole.STOREMANAGE) {
    if (task.type === 'manual_detection_task') {
      uni.navigateTo({
        url: `/pages/manual-inspection/index?id=${task.id}&time=${timeText}&shopName=${task.shopName}`,
      })
    } else if (task.type === 'detection_task_rectified') {
      uni.navigateTo({
        url: `/pages/rectification-appeal/index?id=${task.id}&time=${timeText}&shopName=${task.shopName}`,
      })
    }
  } else {
    uni.navigateTo({
      url: `/pages/audit/index?id=${task.id}&time=${timeText}&shopName=${task.shopName}`,
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
  height: 100%;
}

/* task board */
.task-board-container {
  background-color: $primary-color; // 绿色背景
  padding: 40rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: padding 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0; // 防止被压缩

  &.collapsed {
    padding: 20rpx 40rpx;
  }

  .task-board {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 600rpx;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .board-title-container {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      opacity: 1;
      max-height: 60rpx;
      overflow: hidden;
      transition:
        opacity 0.3s ease,
        max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

      .title-line {
        width: 8rpx;
        height: 40rpx;
        background-color: $primary-color;
        margin-right: 20rpx;
        transition: all 0.3s ease;
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
      gap: 10rpx;
      transition:
        grid-template-columns 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        gap 0.3s ease 0.1s;

      &.collapsed {
        grid-template-columns: repeat(4, 1fr);
        gap: 5rpx;
      }

      .stat-item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        background-color: white;
        border-radius: 8rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        transition:
          flex-direction 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
          padding 0.3s ease 0.1s,
          justify-content 0.4s ease;

        &.collapsed {
          flex-direction: column;
          padding: 10rpx;
          justify-content: center;
          align-items: center;
        }

        .icon {
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
          transition:
            width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            margin-right 0.3s ease 0.1s,
            margin-bottom 0.3s ease 0.1s;

          &.collapsed {
            margin-right: 0;
            margin-bottom: 5rpx;
            width: 40rpx;
            height: 40rpx;
          }
        }

        .stat-content {
          text-align: left;
          padding-left: 20rpx;
          width: 100%;
          transition:
            text-align 0.4s ease,
            padding-left 0.3s ease 0.1s;

          &.collapsed {
            padding-left: 0;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .stat-label {
            font-family: Inter;
            font-weight: 500;
            font-size: 12px;
            line-height: 20px;
            letter-spacing: 0%;
            color: black;
            padding-bottom: 15rpx;
            opacity: 1;
            max-height: 40rpx;
            overflow: hidden;
            transition:
              opacity 0.25s ease,
              max-height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              padding-bottom 0.3s ease;

            &.hidden {
              opacity: 0;
              max-height: 0;
              padding-bottom: 0;
            }
          }

          .stat-value-wrap {
            display: flex;
            align-items: baseline;
            justify-content: flex-start;
            transition: justify-content 0.3s ease 0.1s;

            &.collapsed {
              justify-content: center;
            }

            .stat-value {
              font-family: Inter;
              font-weight: 500;
              font-size: 18px;
              line-height: 20px;
              letter-spacing: 0%;
              color: black;
              margin-right: 10px;
              transition:
                margin-right 0.3s ease,
                font-size 0.3s ease;

              &.collapsed {
                margin-right: 0;
                font-size: 16px;
              }
            }

            .stat-unit {
              font-size: 12px;
              color: $font3-color;
              opacity: 1;
              transition: opacity 0.25s ease;

              &.hidden {
                opacity: 0;
              }
            }
          }
        }
      }
    }
  }
}

/* 滚动容器 */
.task-list-scroll {
  flex: 1;
  overflow: hidden; // 确保滚动正常工作
}

/* 任务列表样式 */
.task-list {
  padding: 40rpx 40rpx 0rpx 40rpx;
  .empty-state {
    height: 550rpx;
  }
}

/* 历史记录链接 */
.history-link {
  text-align: center;
  padding: 0 0 300rpx 0;

  text {
    color: $font3-color;
    font-size: 28rpx;
  }
}
</style>
