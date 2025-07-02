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
        <view class="page-header-user-avatar">
          <image class="avatar" :src="userInfo.row.avatarUrl" />
        </view>
        <view class="page-header-user-name">
          {{ userInfo.row.nickname }}
        </view>
        <view class="page-header-user-type">{{ displayRole }}</view>
      </view>
      <view class="page-header-search">
        <view class="page-header-search-label">{{ t('date') }}</view>
        <wd-datetime-picker ellipsis v-model="dateArr" @confirm="handleConfirm" />
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
              <wd-table :data="data?.shopPassRate" :border="false">
                <wd-table-col prop="Index" :label="t('Serial number')" width="16%">
                  <template #value="{ row, index }">{{ index + 1 }}</template>
                </wd-table-col>
                <wd-table-col prop="Name" :label="t('Store name')" width="28%"></wd-table-col>
                <wd-table-col
                  prop="PassRateByDatetimeRange"
                  width="28%"
                  :label="t('Inspection pass rate')"
                >
                  <template #value="{ row }">
                    {{ row.PassRateByDatetimeRange.toFixed(2) }}%
                  </template>
                </wd-table-col>
                <wd-table-col
                  prop="PassRateByDatetimeAll"
                  width="28%"
                  :label="t('Average pass rate')"
                  fixed
                >
                  <template #value="{ row }">{{ row.PassRateByDatetimeAll.toFixed(2) }}%</template>
                </wd-table-col>
              </wd-table>
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

function handleConfirm({ value }) {
  console.log(dateArr.value, value)
  dateArr.value = value
  getDate()
}

onLoad(() => {
  getDate()
})

// const toManualInspection = () => {
//   uni.navigateTo({
//     url: '/pages/manual-inspection/index',
//   })
// }
// >>>>>>> 0a244849b09297f4e3d692b2e4954f7c1b250c5a

const roleMap = {
  clerk: '店员',
  manage: '超级管理员',
  'store-manage': '店长',
  'area-manage': '督导',
}

const displayRole = computed(() => {
  return roleMap[userInfo.value.row.role] || userInfo.value.row.role
})
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

.page-header-search .wd-picker {
  width: 100%;
}

.page-header-search .wd-picker :deep(.wd-picker__value) {
  display: flex;
  justify-content: center;
  color: #98a2bb;
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
  width: 100%;
  padding: 10px;
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
  min-width: 120px;
}

.page-content-card-content-stats .info-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.page-content-card-content-stats .info-title .extra {
  margin-left: 10px;
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

.page-content-card-content-shop {
  padding: 2px;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.page-content-card-content-shop .wd-table {
  width: 100%;
  min-height: 200px;
}

.page-content-card-content-shop :deep(.wd-table__content--header) {
  border-radius: 8px !important;
  overflow: hidden;
}

.page-content-card-content-shop :deep(.wd-table__content--header .wd-table__cell) {
  background-color: var(--color-primary) !important;
  color: #fff !important;
}

.page-content-card-content-shop :deep(.wd-table__content) {
  max-height: none;
  overflow: visible;
}

.page-content-card-content-shop :deep(.wd-table__body) {
  max-height: none;
}

.stats-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
