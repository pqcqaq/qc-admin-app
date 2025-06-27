<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="container">
    <StatusBar>
      <template #title>
        <text class="status-bar-title">{{ t('change_phone_number') }}</text>
      </template>
      <template #right>
        <button class="status-bar-confirm-button" @click="finish">{{ t('finish') }}</button>
      </template>
    </StatusBar>
    <view class="phone-container">
      <view class="card">
        <wd-select-picker
          :label="t('country_region')"
          :columns="columns"
          v-model="value"
          type="radio"
          :title="t('select_country_region')"
          required
          align-right
          filterable
        />
      </view>
      <view class="card"></view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import StatusBar from '@/components/status-bar/StatusBar.vue'

const columns = ref<Record<string, any>[]>([
  {
    value: '+86',
    label: '中国大陆',
  },
  {
    value: '+1',
    label: '美国',
  },
  {
    value: '+81',
    label: '日本',
  },
])
const value = ref<string>('+86')

const i18n = useI18n()
const t = i18n.t
const finish = () => {}
</script>
<style lang="scss" scoped>
$primary-color: #3daa9a;
$font1-color: #ffffff;
$font2-color: #536387;
$font3-color: #4d515b;
$bg-color: #f5f5f5;
$card-bg-color: #ffffff;
.container {
  .status-bar-title {
    font-size: large;
    font-weight: bold;
    color: $font2-color;
  }
  .status-bar-confirm-button {
    display: flex;
    width: 95rpx;
    height: 50rpx;
    background-color: $primary-color;
    color: $font1-color;
    border-radius: 5rpx;
    padding: 10rpx 20rpx;
    font-size: 24rpx;
    align-items: center;
    justify-content: center;
  }
  .phone-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 20rpx;
    background-color: $bg-color;

    .card {
      background-color: $card-bg-color;
      padding: 30rpx 35rpx;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
      // display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .label {
        color: $font3-color;
      }
    }
  }
}
</style>
