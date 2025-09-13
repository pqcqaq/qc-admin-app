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
        <button class="status-bar-confirm-button" @click="handleChangePassword">
          {{ t('finish') }}
        </button>
      </template>
    </StatusBar>
    <view class="password-container">
      <view class="form-content">
        <!-- 旧密码输入 -->
        <view class="input-wrapper">
          <wd-input
            v-model="formData.oldPassword"
            prefix-icon="lock-on"
            :placeholder="t('please_enter_your_old_password')"
            clearable
            show-password
            class="login-input"
            :border="false"
            @blur="validateOldPassword"
          ></wd-input>
          <view class="input-bottom-line" :class="{ active: formData.oldPassword }"></view>
          <view v-if="oldPasswordError" class="error-text">{{ oldPasswordError }}</view>
        </view>

        <!-- 新密码输入 -->
        <view class="input-wrapper">
          <wd-input
            v-model="formData.newPassword"
            prefix-icon="lock-on"
            :placeholder="t('please_enter_your_new_password')"
            clearable
            show-password
            class="login-input"
            :border="false"
            @blur="validateNewPassword"
          ></wd-input>
          <view class="input-bottom-line" :class="{ active: formData.newPassword }"></view>
          <view v-if="newPasswordError" class="error-text">{{ newPasswordError }}</view>
        </view>

        <!-- 确认密码输入 -->
        <view class="input-wrapper">
          <wd-input
            v-model="formData.confirmPassword"
            prefix-icon="lock-on"
            :placeholder="t('please_enter_your_new_password_again')"
            clearable
            show-password
            class="login-input"
            :border="false"
            @blur="validateConfirmPassword"
          ></wd-input>
          <view class="input-bottom-line" :class="{ active: formData.confirmPassword }"></view>
          <view v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { toast } from '@/utils/toast'
import StatusBar from '@/components/status-bar/StatusBar.vue'
import { useI18n } from 'vue-i18n'
import { resetPasswordApi } from '@/api/auth'

const i18n = useI18n()
const t = i18n.t

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单数据
const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 错误信息
const oldPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')

// 加载状态
const isChanging = ref(false)

// 验证旧密码
const validateOldPassword = () => {
  if (!formData.value.oldPassword) {
    oldPasswordError.value = t('old_password_cannot_be empty')
    return false
  }
  oldPasswordError.value = ''
  return true
}

// 验证新密码格式
const validateNewPassword = () => {
  if (!formData.value.newPassword) {
    newPasswordError.value = t('new_password_cannot_be_empty')
    return false
  }

  // 密码格式验证：包含大写字母、小写字母，长度8-16位
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,16}$/
  if (!passwordReg.test(formData.value.newPassword)) {
    newPasswordError.value = '密码需包含大写字母、小写字母，长度8-16位'
    return false
  }

  newPasswordError.value = ''

  // 如果确认密码已输入，重新验证确认密码
  if (formData.value.confirmPassword) {
    validateConfirmPassword()
  }

  return true
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!formData.value.confirmPassword) {
    confirmPasswordError.value = t('new_password_cannot_be_empty')
    return false
  }
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    confirmPasswordError.value = '两次输入的新密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// 是否可以修改密码
const canChangePassword = computed(() => {
  return (
    formData.value.oldPassword &&
    formData.value.newPassword &&
    formData.value.confirmPassword &&
    formData.value.newPassword === formData.value.confirmPassword &&
    /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,16}$/.test(formData.value.newPassword)
  )
})

// 修改密码
const handleChangePassword = async () => {
  if (!validateOldPassword()) return
  if (!validateNewPassword()) return
  if (!validateConfirmPassword()) return

  // 检查新旧密码是否相同
  if (formData.value.oldPassword === formData.value.newPassword) {
    toast.error(t('new_password_cannot_be_same_as_old'))
    return
  }

  if (!canChangePassword.value) {
    toast.error(t('please_fill_it_out_completely'))
    return
  }

  try {
    isChanging.value = true

    // 使用重置密码接口，传入旧密码作为验证
    const response = await resetPasswordApi({
      credentialType: 'password',
      identifier: userInfo.value.id,
      newPassword: formData.value.newPassword,
      oldPassword: formData.value.oldPassword,
    })

    if (response.success) {
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
      toast.error(response.message || t('change_failed'))
    }
  } catch (error: any) {
    console.error('修改密码失败:', error)
    toast.error(error.message || t('change_failed'))
  } finally {
    isChanging.value = false
  }
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
  min-height: 100vh;
  background-color: $bg-color;

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
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      opacity: 0.8;
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  .password-container {
    padding: 40rpx 30rpx;
    background-color: $bg-color;

    .form-content {
      .input-wrapper {
        position: relative;
        margin-bottom: 50rpx;

        .login-input {
          padding: 20rpx 25rpx;
          background-color: rgba(245, 247, 250, 0.7);
          border-radius: 16rpx;
          transition: all 0.3s ease;

          :deep(.wd-input__inner) {
            font-size: 30rpx;
            color: #333333;
          }

          :deep(.wd-input__placeholder) {
            font-size: 28rpx;
            color: #aaaaaa;
          }

          &:focus-within {
            background-color: rgba(245, 247, 250, 0.95);
            box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
            transform: translateY(-3rpx);
          }
        }

        .input-bottom-line {
          position: absolute;
          bottom: -2rpx;
          left: 5%;
          width: 90%;
          height: 2rpx;
          background: linear-gradient(to right, transparent, $primary-color, transparent);
          transition: transform 0.4s ease;
          transform: scaleX(0);
          opacity: 0.8;

          &.active {
            transform: scaleX(1);
          }
        }

        .error-text {
          font-size: 24rpx;
          color: #ff4757;
          margin-top: 10rpx;
          padding-left: 20rpx;
          animation: shake 0.3s ease-in-out;
        }
      }
    }
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5rpx);
  }
  75% {
    transform: translateX(5rpx);
  }
}

::v-deep .page-content {
  padding: 0;
}
</style>
