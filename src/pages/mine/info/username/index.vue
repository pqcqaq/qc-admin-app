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
        <text class="status-bar-title">{{ t('change_username') }}</text>
      </template>
      <template #right>
        <button class="status-bar-confirm-button" @click="finish">{{ t('finish') }}</button>
      </template>
    </StatusBar>
    <view class="username-container">
      <view class="card">
        <wd-input
          v-model="currentUsername"
          :placeholder="t('please_enter_your_username')"
          clearable
          :rules="[{ required: true, message: t('username_cannot_be_empty') }]"
        ></wd-input>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import StatusBar from '@/components/status-bar/StatusBar.vue'
import { useI18n } from 'vue-i18n'
const currentUsername = ref('王先生')
const i18n = useI18n()
const t = i18n.t

// 完成修改
const finish = () => {
  const username = currentUsername.value.trim()
  if (username === '') {
    uni.showToast({
      title: t('username_cannot_be_empty'),
      icon: 'error',
      duration: 2000,
      mask: true,
    })
    return
  }
  uni.showToast({
    title: `${username}`,
    icon: 'success',
  })
}
</script>
<style lang="scss" scoped>
$primary-color: #3daa9a;
$font1-color: #ffffff;
$font2-color: #536387;
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
  .username-container {
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
    }
  }
}
</style>
