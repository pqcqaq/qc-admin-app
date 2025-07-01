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
        <text class="status-bar-title">{{ t('change-password') }}</text>
      </template>
      <template #right>
        <button class="status-bar-confirm-button" @click="finish">{{ t('finish') }}</button>
      </template>
    </StatusBar>
    <view class="password-container">
      <text class="label">{{ t('old_password') }}</text>
      <view class="card">
        <wd-input
          v-model="formData.oldPassword"
          show-password
          :placeholder="t('please_enter_your_old_password')"
          clearable
          :rules="[{ required: true, message: t('old_password_cannot_be empty') }]"
          :no-border="true"
        ></wd-input>
      </view>
      <text class="label">{{ t('new_password') }}</text>
      <view class="card">
        <wd-input
          v-model="formData.newPassword"
          show-password
          :placeholder="t('please_enter_your_new_password')"
          clearable
          :rules="[{ required: true, message: t('new_password_cannot_be_empty') }]"
          :no-border="true"
        ></wd-input>
      </view>
      <text class="label">{{ t('confirm_your_new_password') }}</text>
      <view class="card">
        <wd-input
          v-model="formData.confirmPassword"
          show-password
          :placeholder="t('please_enter_your_new_password_again')"
          clearable
          :rules="[{ required: true, message: t('new_password_cannot_be_empty') }]"
          :no-border="true"
        ></wd-input>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { toast } from '@/utils/toast'
import StatusBar from '@/components/status-bar/StatusBar.vue'
import { useI18n } from 'vue-i18n'
import { updatePassword } from '@/api/user'
// import { updateInfo, updateUserPassword } from '@/api/login'

const i18n = useI18n()
const t = i18n.t

// 完成修改
const finish = async () => {
  if (
    formData.value.oldPassword === '' ||
    formData.value.newPassword === '' ||
    formData.value.confirmPassword === ''
  ) {
    uni.showToast({
      title: t('please_fill_it_out_completely'),
      icon: 'error',
      duration: 2000,
      mask: true,
    })
    return
  }

  if (formData.value.oldPassword === formData.value.newPassword) {
    uni.showToast({
      title: t('new_password_cannot_be_same_as_old'),
      icon: 'error',
      duration: 2000,
      mask: true,
    })
    return
  }

  if (formData.value.newPassword !== formData.value.confirmPassword) {
    uni.showToast({
      title: t('new_passwords_do_not_match'),
      icon: 'error',
      duration: 2000,
      mask: true,
    })
    return
  }

  return updatePassword({
    oldPassword: formData.value.oldPassword,
    newPassword: formData.value.newPassword,
  }).then((res) => {
    if (res.code === 0) {
      uni.showModal({
        title: t('tip'),
        content: t('change_successfully_please_relogin'),
        showCancel: false,
        confirmColor: '#3daa9a',
        success: () => {
          // 清空用户信息
          useUserStore().logout()
          uni.navigateTo({
            url: '/pages/login/index',
          })
        },
      })
    } else {
      uni.showModal({
        title: t('tip'),
        content: t('change_failed'),
        showCancel: false,
        confirmColor: '#8b0000',
      })
    }
  })
}

// 表单引用
// const formRef = ref()

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单数据
const formData = ref({
  id: userInfo.value.row.id,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
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
  .password-container {
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
    }

    .label {
      color: $font3-color;
      margin-bottom: 20rpx;
      font-size: small;
    }
  }
}

::v-deep .page-content {
  padding: 0;
}
</style>
