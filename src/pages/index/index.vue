<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
  layout: 'tabbar',
  needLogin: true,
}
</route>
<template>
  <view class="page">
    <view class="page-header">
      <view class="page-header-user">
        <view class="page-header-user-info">
          <view class="page-header-user-avatar">
            <image class="avatar" :src="userInfo.row.avatarUrl" />
          </view>
          <view class="page-header-user-name">
            {{ userInfo.row.nickname }}
          </view>
          <view class="page-header-user-type">{{ displayRole }}</view>
        </view>
        <view class="page-header-scan">
          <ScanCode
            button-type="primary"
            @success="handleScanSuccess"
            @fail="handleScanFail"
            @cancel="handleScanCancel"
          />
        </view>
      </view>
      <view class="page-header-search">
        <view class="page-header-search-label">{{ t('date') }}</view>
        <!-- 使用 wot-design-uni 的日历组件 -->
        <!-- <view class="date-picker-wrapper" @click="openCalendar">
          <view class="picker-display">
            <text class="picker-text">{{ formatDateRange }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </view> -->

        <!-- wot-design-uni 日历组件 -->
        <wd-calendar
          ref="calendar"
          v-model="calendarValue"
          type="daterange"
          @confirm="onCalendarConfirm"
          @cancel="onCalendarCancel"
          :show-confirm="false"
        />
      </view>
    </view>

    <scroll-view scroll-y class="page-scroll">
      <view class="page-content">
        <view class="page-content-card">
          <view class="page-content-card-title">{{ t('Inspection statistics') }}</view>
          <view class="page-content-card-content stats-card">
            <view class="page-content-card-content-stats" v-for="(item, index) in stats">
              <view class="img">
                <image class="img-icon" :src="item.icon"></image>
              </view>
              <view class="info">
                <view class="info-title">
                  {{ t(item.title) }}
                  <view class="extra" v-if="item.extraKey">{{ data[item.extraKey] }}%</view>
                </view>
                <view class="info-value">
                  {{ data[item.key] }}
                  <view class="unit">个</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="page-content">
        <view class="page-content-card">
          <view class="page-content-card-title">
            {{ t('Inspection issue ranking') }}
            <view class="page-content-card-title-more">{{ t('Top 10') }}</view>
          </view>
          <view class="page-content-card-content">
            <view class="page-content-card-content-question">
              <view
                class="page-content-card-content-question-item"
                v-for="(v, i) in data?.questionList"
                :style="{ width: `${(v.count / maxCount) * 100}%`, minWidth: 'fit-content' }"
              >
                <view class="line">{{ v.detectionRuleName }}</view>
                <view class="title">{{ t('Unqualified') }}{{ v.count }}次</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="page-content">
        <view class="page-content-card">
          <view class="page-content-card-title">
            {{ t('Ranking of inspected stores') }}
            <view class="page-content-card-title-more">{{ t('Top 10') }}</view>
          </view>
          <view class="page-content-card-content">
            <view class="page-content-card-content-shop">
              <view class="custom-table">
                <!-- 表头 -->
                <view class="table-header">
                  <view class="table-cell header-cell" style="width: 16%">
                    {{ t('Serial number') }}
                  </view>
                  <view class="table-cell header-cell" style="width: 28%">
                    {{ t('Store name') }}
                  </view>
                  <view class="table-cell header-cell" style="width: 28%">
                    {{ t('Inspection pass rate') }}
                  </view>
                  <view class="table-cell header-cell" style="width: 28%">
                    {{ t('Average pass rate') }}
                  </view>
                </view>
                <!-- 表格内容 -->
                <view class="table-body">
                  <view class="table-row" v-for="(row, index) in data?.shopPassRate" :key="index">
                    <view class="table-cell body-cell" style="width: 16%">{{ index + 1 }}</view>
                    <view class="table-cell body-cell" style="width: 28%">{{ row.Name }}</view>
                    <view class="table-cell body-cell" style="width: 28%">
                      {{ row.PassRateByDatetimeRange.toFixed(2) }}%
                    </view>
                    <view class="table-cell body-cell" style="width: 28%">
                      {{ row.PassRateByDatetimeAll.toFixed(2) }}%
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import { getDashboard } from '@/api'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import ScanCode from '@/components/scan-code/ScanCode.vue'
import { base64ToUtf8 } from '@/utils/string'

defineOptions({
  name: 'Home',
})
const i18n = useI18n()
const t = i18n.t

const userStore = useUserStore()
// 使用storeToRefs解构userInfo
const { userInfo } = storeToRefs(userStore)

// 显示出页面的时候重新加载
onShow(() => {
  getDate()
})

const getTodayRange = (): [Date, Date] => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  return [start, end]
}

const dateArr = ref<[Date, Date]>(getTodayRange()) as any

// 格式化显示的日期范围
const formatDateRange = computed(() => {
  const start = dateArr.value[0]
  const end = dateArr.value[1]
  const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
  const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
  return `${startStr} 至 ${endStr}`
})

const data = ref<{
  detectionPlanCount: number
  shopCount: number
  detectionTaskCount: number
  detectionTaskIsPassCount: number
  questionList: {
    detectionRuleName: string
    count: number
  }[]
  shopPassRate: {
    Index: number
    Name: string
    PassRateByDatetimeRange: number
    PassRateByDatetimeAll: number
  }[]
}>({
  detectionPlanCount: 0,
  shopCount: 0,
  detectionTaskCount: 0,
  detectionTaskIsPassCount: 0,
  questionList: [],
  shopPassRate: [],
})

const maxCount = computed(() => {
  return Math.max(...data.value.questionList.map((item) => item.count), 1)
})

const stats = [
  {
    title: 'Inspection Plan',
    key: 'detectionPlanCount',
    icon: '/static/icon/shop.svg',
  },
  {
    title: 'Inspect the store',
    key: 'shopCount',
    icon: '/static/icon/file.svg',
  },
  {
    title: 'Inspection items',
    key: 'detectionTaskCount',
    icon: '/static/icon/fileSearch.svg',
  },
  {
    title: 'Qualification items',
    key: 'detectionTaskIsPassCount',
    icon: '/static/icon/qualified.svg',
    extraKey: 'detectionTaskIsPassCount',
  },
]

const getDate = () => {
  getDashboard({
    detectionTimeStart: [
      new Date(dateArr.value[0]).toISOString(),
      new Date(dateArr.value[1]).toISOString(),
    ],
  }).then((res) => {
    console.log(res)
    data.value = res.data.result
  })
}

onLoad(() => {
  getDate()
})

const roleMap = {
  clerk: '店员',
  manage: '超级管理员',
  'store-manage': '店长',
  'area-manage': '督导',
}

const displayRole = computed(() => {
  return roleMap[userInfo.value.row.role] || userInfo.value.row.role
})

// 扫码处理函数
const handleScanSuccess = (result: UniApp.ScanCodeSuccessRes) => {
  console.log('扫描成功:', result)
  // TODO: 方便debug，之后要注释
  uni.showToast({
    title: `扫描成功: ${result.result}`,
    icon: 'success',
    duration: 2000,
  })
  // 这里可以根据扫描结果进行相应的处理
  const raw = result.rawData
  const str = base64ToUtf8(raw)
  console.log(str)
  // https://lingshun.ai/downloadapp?action=viewTask&task=id
  const url = new URL(str)
  const task = url.searchParams.get('task')
  const action = url.searchParams.get('action')
  console.log(task, action)
  switch (action) {
    case 'viewTask':
      uni.navigateTo({
        url: `/pages/task/detail/index?id=${task}`,
      })
      break
  }
}

const handleScanFail = (error: any) => {
  console.error('扫描失败:', error)
  uni.showToast({
    title: t('scan_failed'),
    icon: 'error',
    duration: 2000,
  })
}

const handleScanCancel = () => {
  console.log('用户取消扫描')
}

// wot-design-uni 日历组件相关
const calendar = ref(null)
const calendarValue = ref([new Date().getTime(), new Date().getTime()])

// 同步 dateArr 变化到 calendarValue
watch(
  dateArr,
  (newValue) => {
    if (newValue && newValue.length === 2) {
      calendarValue.value = [newValue[0].getTime(), newValue[1].getTime()]
    }
  },
  { immediate: true },
)

const openCalendar = () => {
  calendar.value?.open()
}

const onCalendarConfirm = (value) => {
  console.log('日历确认:', value)
  console.log(Array.isArray(value.value) && value.value.length === 2)
  if (Array.isArray(value.value) && value.value.length === 2) {
    dateArr.value = [new Date(value.value[0]), new Date(value.value[1])]
    getDate()
  }
}

const onCalendarCancel = () => {
  console.log('日历取消')
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: var(--color-primary);
}

.page-header-user {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header-user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.page-header-scan {
  margin-left: 10px;
}

.page-header-scan :deep(.scan-code-container) {
  .scan-button {
    height: 36px;
    min-width: 100px;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    font-size: 14px;
  }

  .scan-button:active {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.page-header-user-avatar {
  width: 50px;
  height: 50px;
  background: #d9d9d9;
  border-radius: 50%;
  overflow: hidden;
}

.page-header-user-avatar .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-header-user-name {
  font-size: 20px;
  color: #eee;
  margin-left: 10px;
}

.page-header-user-type {
  height: 28px;
  line-height: 28px;
  margin-left: 20px;
  background-color: #fff;
  color: var(--color-primary);
  border-radius: 14px;
  font-size: 16px;
  padding: 0 10px;
  box-sizing: border-box;
}

.page-header-search {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.page-header-search-label {
  width: 60px;
  font-size: 20px;
  font-weight: 500;
  color: #536387;
  margin-right: 10px;
}

/* 自定义日期选择器样式 */
.date-picker-wrapper {
  flex: 1;
  cursor: pointer;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 24rpx;
  background-color: white;
  border-radius: 8rpx;
  border: 1rpx solid #e5e5e5;
  min-height: 60rpx;
  box-sizing: border-box;
}

.picker-text {
  flex: 1;
  text-align: center;
  color: #98a2bb;
  font-size: 28rpx;
}

.picker-arrow {
  margin-left: 16rpx;
  color: #98a2bb;
  font-size: 24rpx;
  transition: transform 0.3s ease;
}

.page-scroll {
  flex: 1;
  height: 0;
}

.page-content {
  padding: 20px;
}

.page-content:last-child {
  padding-bottom: 60px;
}

.page-content-card {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.page-content-card:last-child {
  margin-bottom: 0;
}

.page-content-card-title {
  margin-bottom: 10px;
  margin-left: 16px;
  font-size: 20px;
  position: relative;
  height: 30px;
  line-height: 30px;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
}

.page-content-card-title:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: -16px;
  width: 6px;
  height: 100%;
  border-radius: 3px;
  background-color: var(--color-primary);
}

.page-content-card-title-more {
  font-size: 14px;
  margin-left: 16px;
  color: $uni-text-color-grey;
}

.page-content-card-content {
  width: 100%;
}

.page-content-card-content-stats {
  height: 80px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-content-card-content-stats .img {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

.page-content-card-content-stats .img-icon {
  width: 45px;
  height: 45px;
}

.page-content-card-content-stats .info {
  width: 60%;
  min-width: 100px;
}

.page-content-card-content-stats .info-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.page-content-card-content-stats .info-title .extra {
  color: $uni-color-error;
  font-size: 12px;
}

.page-content-card-content-stats .info-value {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.page-content-card-content-stats .info-value .unit {
  font-size: 12px;
  margin-left: 10px;
  color: $uni-text-color;
}

.page-content-card-content-question {
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-content-card-content-question-item {
  display: flex;
  width: 100%;
  height: 100%;
}

.page-content-card-content-question-item .line {
  width: 100%;
  background: linear-gradient(to right, #00b59c, #1760f6);
  padding: 0 10px;
  color: #fff;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
}

.page-content-card-content-question-item .title {
  padding-left: 10px;
  width: 100px;
  min-width: 100px;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}

.page-content-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-content-card-content-shop {
  padding: 2px;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.custom-table {
  width: 100%;
  min-height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  width: 100%;
  background-color: var(--color-primary);
  border-radius: 8px 8px 0 0;
}

.table-body {
  width: 100%;
}

.table-row {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:nth-child(even) {
  background-color: #fafafa;
}

.table-cell {
  padding: 12px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  word-break: break-all;
}

.header-cell {
  background-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
  height: 44px;
}

.body-cell {
  color: #333;
  min-height: 40px;
  border-right: 1px solid #f0f0f0;
}

.body-cell:last-child {
  border-right: none;
}

.stats-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
