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
          :no-border="true"
          :rules="[{ required: true, message: t('username_cannot_be_empty') }]"
        ></wd-input>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import StatusBar from '@/components/status-bar/StatusBar.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const currentUsername = ref(userInfo.value.name)
const i18n = useI18n()
const t = i18n.t

// 完成修改
const finish = async () => {
  const nickname = currentUsername.value.trim()
  if (nickname === '') {
    uni.showToast({
      title: t('username_cannot_be_empty'),
      icon: 'error',
      duration: 2000,
      mask: true,
    })
    return
  }
  // return updateNickname({ nickname: nickname }).then((res) => {
  //   if (res.code === 0) {
  //     userInfo.value.row.nickname = nickname
  //     uni.showModal({
  //       title: t('tip'),
  //       content: t('change_successfully'),
  //       showCancel: false,
  //       confirmColor: '#3daa9a',
  //       success: () => {
  //         uni.navigateBack()
  //       },
  //     })
  //   } else {
  //     uni.showModal({
  //       title: t('tip'),
  //       content: t('change_failed'),
  //       showCancel: false,
  //       confirmColor: '#8b0000',
  //     })
  //   }
  // })
}
</script>
<style lang="scss" scoped>
@import '@/style/variables.scss';

.container {
  height: 100%;
  background-color: $bg-primary;

  .status-bar-title {
    font-size: large;
    font-weight: bold;
    color: $font-secondary;
  }
  .status-bar-confirm-button {
    display: flex;
    width: 95rpx;
    height: 50rpx;
    background-color: $primary-color;
    color: $font-white;
    border-radius: $radius-xs;
    padding: 10rpx 20rpx;
    font-size: 24rpx;
    align-items: center;
    justify-content: center;
  }
  .username-container {
    display: flex;
    flex-direction: column;
    padding: 20rpx;

    .card {
      background-color: $bg-white;
      padding: 30rpx 35rpx;
      border-radius: $radius-base;
      box-shadow: $shadow-normal;
    }
  }
}
::v-deep .page-content {
  padding: 0;
}
</style>
