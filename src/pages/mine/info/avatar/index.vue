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
        <text class="status-bar-title">{{ t('change_avatar') }}</text>
      </template>
      <template #right>
        <button class="status-bar-confirm-button" @click="finish">{{ t('finish') }}</button>
      </template>
    </StatusBar>
    <view class="avatar-container">
      <view class="card">
        <img :src="imgPath" :width="200" :height="200" class="avatar" />
        <view class="button">
          <wd-button type="success">{{ t('change') }}</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import StatusBar from '@/components/status-bar/StatusBar.vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const t = i18n.t
const imgPath =
  'https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg'

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

  .avatar-container {
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
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .avatar {
        border-radius: 50%;
      }

      .button {
        margin-top: 50rpx;
      }
    }
  }
}
</style>
