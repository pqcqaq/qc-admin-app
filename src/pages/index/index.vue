<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
  layout: 'tabbar',
}
</route>
<template>
  <view class="page">
    <view class="page_header">
      <view class="page_header_user">
        <view class="page_header_user_avatar">
          <image class="avatar" :src="userInfo.avatarUrl" />
        </view>
        <view class="page_header_user_name">
          {{ userInfo.nickname }}
        </view>
        <view class="page_header_user_type">督导</view>
      </view>
      <view class="page_header_search">
        <view class="page_header_search_label">{{ t('date') }}</view>
        <wd-datetime-picker ellipsis v-model="dateArr" @confirm="handleConfirm" />
      </view>
    </view>
    <view class="page_content">
      <view class="page_content_card">
        <view class="page_content_card_title">{{ t('Inspection statistics') }}</view>
        <view class="page_content_card_content stats_card">
          <view class="page_content_card_content_stats" v-for="(item, index) in stats">
            <view class="img">
              <image class="img_icon" :src="item.icon"></image>
            </view>
            <view class="info">
              <view class="info_title">
                {{ t(item.title) }}
                <view class="extra" v-if="item.extraKey">{{ data[item.extraKey] }}%</view>
              </view>
              <view class="info_value">
                {{ data[item.key] }}
                <view class="unit">个</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="page_content">
      <view class="page_content_card">
        <view class="page_content_card_title">
          {{ t('Inspection issue ranking') }}
          <view class="page_content_card_title_more">{{ t('Top 10') }}</view>
        </view>
        <view class="page_content_card_content">
          <view class="page_content_card_content_question">
            <view
              class="page_content_card_content_question_item"
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
    <view class="page_content">
      <view class="page_content_card">
        <view class="page_content_card_title">
          {{ t('Ranking of inspected stores') }}
          <view class="page_content_card_title_more">{{ t('Top 10') }}</view>
        </view>
        <view class="page_content_card_content">
          <view class="page_content_card_content_shop">
            <wd-table :data="data?.shopPassRate" :border="false" :index="true">
              <wd-table-col prop="Name" :label="t('Store name')"></wd-table-col>
              <wd-table-col prop="PassRateByDatetimeRange" :label="t('Inspection pass rate')">
                <template #value="{ row }">{{ row.PassRateByDatetimeRange.toFixed(2) }}%</template>
              </wd-table-col>
              <wd-table-col prop="PassRateByDatetimeAll" :label="t('Average pass rate')">
                <template #value="{ row }">{{ row.PassRateByDatetimeAll.toFixed(2) }}%</template>
              </wd-table-col>
            </wd-table>
          </view>
        </view>
      </view>
    </view>
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

const getTodayRange = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  return [start, end]
}
const dateArr = ref(getTodayRange())
const data = ref({})
const maxCount = computed(() => {
  return Math.max(...data.value.questionList.map((item) => item.count), 1)
})
const stats = [
  {
    title: 'Inspection Plan',
    key: 'detectionPlanCount',
    icon: '/src/static/icon/shop.svg',
  },
  {
    title: 'Inspect the store',
    key: 'shopCount',
    icon: '/src/static/icon/file.svg',
  },
  {
    title: 'Inspection items',
    key: 'detectionTaskCount',
    icon: '/src/static/icon/fileSearch.svg',
  },
  {
    title: 'Qualification items',
    key: 'detectionTaskIsPassCount',
    icon: '/src/static/icon/qualified.svg',
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
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  &_header {
    flex-shrink: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: var(--color-primary);

    &_user {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      &_avatar {
        width: 50px;
        height: 50px;
        background: #d9d9d9;
        border-radius: 50%;
        overflow: hidden;
        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &_name {
        font-size: 20px;
        color: #eee;
        margin-left: 10px;
      }
      &_type {
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
    }
    &_search {
      margin-top: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      box-sizing: border-box;
      background-color: #f9f9f9;
      border-radius: 8px;
      &_label {
        width: 60px;
        font-size: 20px;
        font-weight: 500;
        color: #536387;
        margin-right: 10px;
      }
      .wd-picker {
        width: 100%;
        :deep(.wd-picker__value) {
          display: flex;
          justify-content: center;
          color: #98a2bb;
        }
      }
    }
  }
  &_content {
    height: 100%;
    padding: 20px;
    &_card {
      padding: 10px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      &_title {
        margin-bottom: 10px;
        margin-left: 16px;
        font-size: 20px;
        position: relative;
        height: 30px;
        line-height: 30px;
        font-weight: 600;
        display: flex;
        align-items: flex-end;
        &:before {
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
        &_more {
          font-size: 14px;
          margin-left: 16px;
          color: $uni-text-color-grey;
        }
      }
      &_content {
        width: 100%;
        height: 100%;
        &_stats {
          height: 80px;
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          .img {
            width: 45px;
            height: 45px;
            margin-right: 10px;
            &_icon {
              width: 45px;
              height: 45px;
            }
          }
          .info {
            width: 60%;
            min-width: 120px;
            &_title {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              .extra {
                margin-left: 10px;
                color: $uni-color-error;
                font-size: 12px;
              }
            }
            &_value {
              display: flex;
              align-items: center;
              font-size: 16px;
              font-weight: 500;
              .unit {
                font-size: 12px;
                margin-left: 10px;
                color: $uni-text-color;
              }
            }
          }
        }
        &_question {
          padding: 10px;
          box-sizing: border-box;
          width: 100%;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          &_item {
            display: flex;
            width: 100%;
            height: 100%;
            .line {
              width: 100%;
              background: linear-gradient(to right, #00b59c, #1760f6);
              padding: 0 10px;
              color: #fff;
              font-size: 14px;
              height: 24px;
              line-height: 24px;
              border-radius: 12px;
            }
            .title {
              padding-left: 10px;
              width: 100px;
              min-width: 100px;
              font-size: 14px;
              height: 24px;
              line-height: 24px;
            }
          }
        }
        &_shop {
          padding: 2px;
          box-sizing: border-box;
          width: 100%;
          .wd-table {
            width: 100%;
          }
          :deep(.wd-table__content--header) {
            border-radius: 8px !important;
            overflow: hidden;
            .wd-table__cell {
              background-color: var(--color-primary) !important;
              color: #fff !important;
            }
          }
        }
      }
      .stats_card {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
}
</style>
