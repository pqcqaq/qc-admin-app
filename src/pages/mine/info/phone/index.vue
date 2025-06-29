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
      <text class="label">{{ t('country_region') }}</text>
      <view class="card">
        <wd-select-picker
          :columns="columns"
          v-model="regionNumber"
          type="radio"
          :title="t('select_country_region')"
          filterable
          size="large"
          required
        />
      </view>
      <text class="label">{{ t('phone_number') }}</text>
      <view class="card">
        <wd-input
          v-model="phoneNumber"
          :placeholder="regionNumber + '  ' + t('please_enter_your_phone_number')"
          :rules="[{ required: true, message: t('phone_number_cannot_be_empty') }]"
          :no-border="true"
          placeholderStyle="font-size: 30rpx;"
        >
          <template #suffix>
            <wd-button type="text" size="large" @click="send">
              <wd-divider vertical />
              {{ t('send_verification_code') }}
            </wd-button>
          </template>
        </wd-input>
      </view>
      <text class="label">
        {{ t('verification_code') }}
      </text>
      <view class="card">
        <wd-input
          v-model="verificationCode"
          :placeholder="t('please_enter_your_verification_code')"
          clearable
          :rules="[{ required: true, message: t('verification_code_cannot_be_empty') }]"
          :no-border="true"
          placeholderStyle="font-size: 30rpx;"
        />
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import StatusBar from '@/components/status-bar/StatusBar.vue'
import { sendSMSCode, updatePhone } from '@/api/user'

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
const regionNumber = ref<string>('+86')

const phoneNumber = ref<string>('')
const verificationCode = ref<string>('')

const i18n = useI18n()
const t = i18n.t

//发送验证码
const send = async () => {
  if (phoneNumber.value.trim() === '') {
    uni.showToast({
      title: t('phone_number_cannot_be_empty'),
      icon: 'error',
    })
    return
  }

  const params = {
    phoneNumber: phoneNumber.value,
    regionNumber: regionNumber.value,
  }

  sendSMSCode(params)
    .then(() => {
      uni.showToast({
        title: t('verification_code_sent'),
        icon: 'success',
      })
    })
    .catch((error) => {
      uni.showToast({
        title: error.message || t('failed'),
        icon: 'error',
      })
    })
}
//提交
const finish = () => {
  if (phoneNumber.value.trim() === '') {
    uni.showToast({
      title: t('phone_number_cannot_be_empty'),
      icon: 'error',
    })
    return
  }
  if (verificationCode.value.trim() === '') {
    uni.showToast({
      title: t('verification_code_cannot_be_empty'),
      icon: 'error',
    })
    return
  }

  //TODO: 发送请求更新手机号码
}
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
      margin-bottom: 20rpx;
    }
    .label {
      color: $font3-color;
      font-size: small;
      margin-bottom: 20rpx;
    }
  }
}
::v-deep .page-content {
  padding: 0;
}
</style>
