<route lang="json5">
{
  style: {
    navigationBarTitleText: '修改手机号',
    navigationBarLeftText: '取消',
    navigationBarTitleAlign: 'center',
    navigationBarRightButtonList: [
      {
        text: '完成',
        color: '#007aff',
        fontSize: '16',
      },
    ],
  },
}
</route>
<template>
  <view class="phone-container">
    <!-- 国家/地区选择 -->
    <view class="card between">
      <text class="label">{{ t('country_region') }}</text>
    </view>
    <!-- 手机号输入 -->
    <view class="card between">
      <text class="label">{{ t('phone_number') }}</text>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t
</script>
<style lang="scss" scoped>
.phone-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f5f5f5;

  .card {
    background-color: #fff;
    padding: 30rpx 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
    margin-bottom: 20rpx;
  }

  .between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
