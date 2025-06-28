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
// import { updateInfo, updateUserPassword } from '@/api/login'

const i18n = useI18n()
const t = i18n.t

// 完成修改
const finish = () => {
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

  if (password !== formData.value.oldPassword) {
    uni.showToast({
      title: t('old_password_incorrect'),
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
}

// 表单引用
// const formRef = ref()

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

//获取用户原来的密码
const password = userInfo.value.password

// 表单数据
const formData = ref({
  id: userInfo.value.id,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
</script>

<!-- <style lang="scss" scoped>
$primary-color: #3daa9a;
$font1-color: #ffffff; //
$font2-color: #536387;
.profile-info-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 30rpx;
  .status_bar_title {
    font-size: large;
    font-weight: bold;
    color: $font2-color;
  }
  .status_bar_confirm_button {
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
  .status_bar_back_button {
    color: $font2-color;
  }
}

.profile-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  padding: 40rpx 30rpx 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
  padding-bottom: 16rpx;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(90deg, #4a7bff, #6a5acd);
    border-radius: 6rpx;
  }
}

.form-wrapper {
  padding: 30rpx;
}

.form-group {
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.form-input {
  font-size: 30rpx;
}

.sex-field {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background-color: #ffffff;
}

.field-label {
  width: 160rpx;
  font-size: 30rpx;
  color: #333;
}

.radio-group {
  flex: 1;
  display: flex;
  gap: 20rpx;
}

.radio-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 12rpx;
  background-color: #f5f7fa;

  &:active {
    opacity: 0.8;
  }
}

.form-actions {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.submit-btn {
  height: 90rpx;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: 500;
  background: linear-gradient(135deg, #4a7bff, #6a5acd);
  box-shadow: 0 8rpx 16rpx rgba(74, 123, 255, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 8rpx rgba(74, 123, 255, 0.15);
  }
}
</style> -->
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
</style>
