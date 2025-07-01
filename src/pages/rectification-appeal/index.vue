<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '每日AI早检',
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
        <view class="flex-1 text-center text-white text-lg font-bold">
          {{ t('daily_ai_early_inspection') }}
        </view>
        <view class="w-8"></view>
      </view>
      <view class="flex justify-center items-center mt-2 text-white text-sm">
        <view class="flex items-center">
          <wd-icon name="calendar" size="16" class="mr-1" />
          <text>{{ time }}</text>
        </view>
        <view class="mx-4"></view>
        <view class="flex items-center">
          <wd-icon name="shop" size="16" class="mr-1" />
          <text>{{ shopName }}</text>
        </view>
      </view>
    </view>

    <!-- 检查项进度区，悬浮在绿色区域下方 -->
    <view class="relative z-10">
      <view class="mt-[-32px]">
        <view class="flex items-center px-6 py-4 bg-white rounded-t-3xl shadow">
          <wd-icon name="bulletpoint" size="24" class="mr-3" />
          <text class="text-gray-700 text-base mr-3">{{ t('inspection_item') }}</text>
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
  </view>

  <!-- 整改项标题和卡片列表 -->
  <view class="px-4 py-4 bg-gray-50 min-h-screen">
    <view class="font-bold text-lg text-gray-800 mb-3">{{ t('rectification_item') }}</view>
    <item-card
      v-for="item in items"
      :key="item.id"
      :item="item"
      @appeal="handleAppeal"
      @rectify="handleRectify"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import itemCard from './components/itemCard.vue'
import { getdetectiontaskrectifieddetailbydetectiontaskrectifiedid } from '@/api/rectification-appeal'
import { useRectificationAppealStore } from '@/store/rectificationAppeal'
const i18n = useI18n()
const t = i18n.t

const checkedCount = computed(() => items.value.filter((item) => item.finishState === 1).length)
const totalCount = ref(0)
const progressPercent = computed(() => (checkedCount.value / (totalCount.value || 1)) * 100)

// 模拟整改项数据
const items = ref([])

function onBack() {
  uni.navigateBack()
}

function handleAppeal(item) {
  const store = useRectificationAppealStore()
  store.item = item
  store.totalCount = totalCount.value
  store.checkedCount = checkedCount.value
  uni.navigateTo({
    url: `/pages/rectification-appeal/appealOrRectify?id=${item.id}&appealState=1&time=${time.value}&shopName=${shopName.value}`,
  })
}

function handleRectify(item) {
  const store = useRectificationAppealStore()
  store.item = item
  store.totalCount = totalCount.value
  store.checkedCount = checkedCount.value
  uni.navigateTo({
    url: `/pages/rectification-appeal/appealOrRectify?id=${item.id}&appealState=0&time=${time.value}&shopName=${shopName.value}`,
  })
}
const time = ref('')
const shopName = ref('')
onLoad(async (options) => {
  const id = options?.id ? Number(options.id) : 49
  time.value = options?.time ? options.time : ''
  shopName.value = options?.shopName ? options.shopName : ''
  const res = await getdetectiontaskrectifieddetailbydetectiontaskrectifiedid(id)
  items.value = res.data?.rows || []
  totalCount.value = items.value.length
})
</script>

<style lang="scss" scoped>
.bg-teal-500 {
  background-color: rgb(62, 171, 154);
}
.rounded-b-3xl {
  border-bottom-left-radius: 24rpx;
  border-bottom-right-radius: 24rpx;
}
</style>
