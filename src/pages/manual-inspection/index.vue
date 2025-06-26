<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '人工巡检项报告',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view>
    <!-- 顶部自定义导航栏 -->
    <view class="bg-teal-500 pt-8 pb-10 px-4 relative">
      <view class="flex items-center">
        <view class="w-8 flex items-center justify-start">
          <wd-icon name="arrow-left" color="#fff" size="24" @click="onBack" />
        </view>
        <view class="flex-1 text-center text-white text-lg font-bold">人工巡检项报告</view>
        <view class="w-8"></view>
      </view>
      <view class="flex justify-center items-center mt-2 text-white text-sm">
        <view class="flex items-center">
          <wd-icon name="calendar" size="16" class="mr-1" />
          <text>2025年6月9日</text>
        </view>
        <view class="mx-4"></view>
        <view class="flex items-center">
          <wd-icon name="shop" size="16" class="mr-1" />
          <text>黄龙体育中心店</text>
        </view>
      </view>
    </view>

    <!-- 检查项进度区，悬浮在绿色区域下方 -->
    <view class="relative z-10">
      <view class="mt-[-32px]">
        <view class="flex items-center px-6 py-4 bg-white rounded-t-3xl shadow">
          <wd-icon name="bulletpoint" size="24" class="mr-3" />
          <text class="text-gray-700 text-base mr-3">检查项</text>
          <wd-progress
            :percentage="progressPercent"
            color="#26b7a7"
            track-color="#e5e5e5"
            class="flex-1 mx-4"
            height="16"
            show-info="false"
            hide-text
          />
          <text class="text-gray-500 text-base ml-3">{{ checkedCount }}/{{ totalCount }}</text>
        </view>
      </view>
    </view>

    <!-- Tabs 分类 -->
    <template v-if="!isFinished">
      <wd-tabs v-model="activeTab" class="mt-2" line-color="#3eab9a">
        <wd-tab v-for="(tab, idx) in tabList" :key="tab.name" :title="tab.name">
          <view class="p-4 pb-24">
            <InspectionItemCard
              v-for="item in itemsMap[idx]"
              :key="item.detectionRuleName"
              :detectionRuleName="item.detectionRuleName"
              :detectionRuleRequire="item.detectionRuleRequire"
              :url="item.url"
              @add="onAdd(item, idx)"
              @update:url="(url) => onUpdateUrl(idx, item.detectionRuleId, url)"
            />
          </view>
        </wd-tab>
      </wd-tabs>
      <!-- 底部按钮 -->
      <view class="fixed bottom-0 left-0 w-full bg-white py-4 px-4 z-10">
        <wd-button
          block
          type="primary"
          size="large"
          :disabled="checkedCount !== totalCount"
          @click="onNext"
          class="custom-next-btn"
        >
          下一步
        </wd-button>
      </view>
    </template>

    <template v-else>
      <view class="finish-container">
        <view class="finish-icon">
          <!-- 可用svg、iconfont或图片，示例用svg -->
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect
              x="10"
              y="10"
              width="60"
              height="60"
              rx="10"
              fill="none"
              stroke="#3eab9a"
              stroke-width="4"
            />
            <circle cx="40" cy="40" r="18" fill="none" stroke="#3eab9a" stroke-width="4" />
            <polyline points="32,42 38,48 48,34" fill="none" stroke="#3eab9a" stroke-width="4" />
          </svg>
        </view>
        <view class="finish-text">
          <text>今日巡检</text>
          <br />
          <text>任务已完成！</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import InspectionItemCard from './components/InspectionItemCard.vue'
import {
  getDetectionRuleListByManualDetectionTaskId,
  createdetectionbatchformanualdetectiontask,
} from '@/api/manual-inspection'

const activeTab = ref(0)
const tabList = ref<{ name: string }[]>([])
const checkedCount = computed(() => itemsMap.value.flat().filter((item) => !!item.url).length)
const totalCount = ref(0)
const itemsMap = ref<any[][]>([])
const progressPercent = computed(() => (checkedCount.value / (totalCount.value || 1)) * 100)
const isFinished = ref(false)

function onAdd(item, tabIdx) {
  uni.showToast({ title: `点击添加: ${item.detectionRuleName}（Tab${tabIdx + 1}）`, icon: 'none' })
}
function onBack() {
  uni.navigateBack()
}

onLoad(async (options) => {
  const id = options?.id ? Number(options.id) : 14
  const res = await getDetectionRuleListByManualDetectionTaskId(id)
  const results = res.data?.results || []
  totalCount.value = results.length
  // 按出现顺序去重 detectionRuleType
  const typeArr: string[] = []
  results.forEach((item) => {
    if (!typeArr.includes(item.detectionRuleType)) {
      typeArr.push(item.detectionRuleType)
    }
  })
  tabList.value = typeArr.map((type) => ({ name: type }))
  // itemsMap 按类型分组
  itemsMap.value = typeArr.map((type) =>
    results
      .filter((item) => item.detectionRuleType === type)
      .map((item) => ({
        manualDetectionTaskId: item.manualDetectionTaskId,
        detectionRuleId: item.detectionRuleId,
        detectionRuleName: item.detectionRuleName,
        detectionRuleRequire: item.detectionRuleRequire,
        url: '',
      })),
  )
})

async function onNext() {
  if (checkedCount.value !== totalCount.value) return
  const dataList = itemsMap.value.flat().map((item) => ({
    manualDetectionTaskId: item.manualDetectionTaskId,
    detectionRuleId: item.detectionRuleId,
    imageUrl: item.url,
  }))
  try {
    await createdetectionbatchformanualdetectiontask({ dataList })
    isFinished.value = true
  } catch (e) {
    // 错误处理
  }
}

function onUpdateUrl(tabIdx, detectionRuleId, url) {
  const card = itemsMap.value[tabIdx].find((i) => i.detectionRuleId === detectionRuleId)
  if (card) card.url = url
  console.log(checkedCount.value, 'checkedCount')
  console.log(progressPercent.value, 'progressPercent')
}
</script>

<style lang="scss" scoped>
.bg-teal-500 {
  background-color: rgb(62, 171, 154);
}
.rounded-b-3xl {
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}
::v-deep .wd-tabs__line {
  background: rgb(62, 171, 154) !important;
}
.custom-next-btn {
  border-radius: 0 !important;
  background-color: #3eab9a !important;
  border: 1px solid #3eab9a !important;
  color: #fff !important;
}
.custom-next-btn[plain] {
  background-color: #fff !important;
  color: #3eab9a !important;
  border: 1px solid #3eab9a !important;
}
.custom-next-btn[disabled] {
  background-color: #f5f6fa !important;
  color: #bcbcbc !important;
  border: 1px solid #e0e0e0 !important;
}
</style>
