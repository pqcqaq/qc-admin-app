<template>
  <view class="reset-password-container">
    <view class="form-title">重置密码</view>
    <view class="form-content">
      <!-- 手机号输入 -->
      <view class="input-wrapper">
        <wd-input
          v-model="resetForm.phone"
          prefix-icon="phone"
          placeholder="请输入手机号"
          clearable
          class="login-input"
          :border="false"
          type="number"
          :maxlength="11"
          @blur="validatePhone"
        ></wd-input>
        <view class="input-bottom-line" :class="{ active: resetForm.phone }"></view>
        <view v-if="phoneError" class="error-text">{{ phoneError }}</view>
      </view>

      <!-- 验证码输入 -->
      <view class="input-wrapper">
        <view class="verify-code-wrapper">
          <wd-input
            v-model="resetForm.verifyCode"
            prefix-icon="lock-on"
            placeholder="请输入验证码"
            clearable
            class="verify-code-input"
            :border="false"
            type="number"
            :maxlength="6"
          ></wd-input>
          <wd-button
            :disabled="!isPhoneValid || isCodeSending || countdown > 0"
            :loading="isCodeSending"
            class="send-code-btn"
            size="small"
            @click="sendVerifyCode"
          >
            {{ codeButtonText }}
          </wd-button>
        </view>
        <view class="input-bottom-line" :class="{ active: resetForm.verifyCode }"></view>
        <view v-if="codeError" class="error-text">{{ codeError }}</view>
      </view>

      <!-- 新密码输入 -->
      <view class="input-wrapper">
        <wd-input
          v-model="resetForm.newPassword"
          prefix-icon="lock-on"
          placeholder="请输入新密码"
          clearable
          show-password
          class="login-input"
          :border="false"
          @blur="validatePassword"
        ></wd-input>
        <view class="input-bottom-line" :class="{ active: resetForm.newPassword }"></view>
        <view v-if="passwordError" class="error-text">{{ passwordError }}</view>
      </view>

      <!-- 确认密码输入 -->
      <view class="input-wrapper">
        <wd-input
          v-model="resetForm.confirmPassword"
          prefix-icon="lock-on"
          placeholder="请确认新密码"
          clearable
          show-password
          class="login-input"
          :border="false"
          @blur="validateConfirmPassword"
        ></wd-input>
        <view class="input-bottom-line" :class="{ active: resetForm.confirmPassword }"></view>
        <view v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</view>
      </view>

      <!-- 重置按钮 -->
      <wd-button
        type="primary"
        size="large"
        block
        :loading="isResetting"
        :disabled="!canReset"
        @click="handleResetPassword"
        class="reset-btn"
      >
        重置密码
      </wd-button>

      <!-- 返回按钮 -->
      <wd-button size="large" block @click="goBack" class="back-btn">返回</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { toast } from '@/utils/toast'
import { resetPasswordApi, sendVerifyCodeApi } from '@/api/auth'

// 定义事件
const emit = defineEmits<{
  (event: 'back'): void
  (event: 'success'): void
}>()

// 表单数据
const resetForm = ref({
  phone: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: '',
})

// 错误信息
const phoneError = ref('')
const codeError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// 加载状态
const isResetting = ref(false)
const isCodeSending = ref(false)

// 验证码倒计时
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 验证手机号格式
const validatePhone = () => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!resetForm.value.phone) {
    phoneError.value = '请输入手机号'
    return false
  }
  if (!phoneReg.test(resetForm.value.phone)) {
    phoneError.value = '请输入正确的手机号格式'
    return false
  }
  phoneError.value = ''
  return true
}

// 验证密码格式
const validatePassword = () => {
  if (!resetForm.value.newPassword) {
    passwordError.value = '请输入新密码'
    return false
  }
  if (resetForm.value.newPassword.length < 6) {
    passwordError.value = '密码长度至少为6位'
    return false
  }
  passwordError.value = ''

  // 如果确认密码已输入，重新验证确认密码
  if (resetForm.value.confirmPassword) {
    validateConfirmPassword()
  }

  return true
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!resetForm.value.confirmPassword) {
    confirmPasswordError.value = '请确认新密码'
    return false
  }
  if (resetForm.value.newPassword !== resetForm.value.confirmPassword) {
    confirmPasswordError.value = '两次输入的密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// 手机号是否有效
const isPhoneValid = computed(() => {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(resetForm.value.phone)
})

// 是否可以重置密码
const canReset = computed(() => {
  return (
    isPhoneValid.value &&
    resetForm.value.verifyCode.length === 6 &&
    resetForm.value.newPassword.length >= 6 &&
    resetForm.value.newPassword === resetForm.value.confirmPassword
  )
})

// 发送验证码按钮文本
const codeButtonText = computed(() => {
  if (isCodeSending.value) return '发送中...'
  if (countdown.value > 0) return `${countdown.value}s`
  return '获取验证码'
})

// 发送验证码
const sendVerifyCode = async () => {
  if (!validatePhone()) return

  try {
    isCodeSending.value = true
    codeError.value = ''

    await sendVerifyCodeApi({
      senderType: 'phone',
      identifier: resetForm.value.phone,
      purpose: 'reset_password',
    })

    toast.success('验证码已发送')
    startCountdown()
  } catch (error: any) {
    console.error('发送验证码失败:', error)
    toast.error(error.message || '发送验证码失败，请稍后重试')
  } finally {
    isCodeSending.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

// 重置密码
const handleResetPassword = async () => {
  if (!validatePhone()) return
  if (!validatePassword()) return
  if (!validateConfirmPassword()) return

  if (!resetForm.value.verifyCode) {
    codeError.value = '请输入验证码'
    return
  }

  try {
    isResetting.value = true
    codeError.value = ''

    const response = await resetPasswordApi({
      credentialType: 'phone',
      identifier: resetForm.value.phone,
      newPassword: resetForm.value.newPassword,
      verifyCode: resetForm.value.verifyCode,
    })

    if (response.success) {
      toast.success('密码重置成功，请使用新密码登录')
      emit('success')
    } else {
      toast.error(response.message || '重置密码失败')
    }
  } catch (error: any) {
    console.error('重置密码失败:', error)
    toast.error(error.message || '重置密码失败，请稍后重试')
  } finally {
    isResetting.value = false
  }
}

// 返回
const goBack = () => {
  // 清理倒计时
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  emit('back')
}

// 组件销毁时清理倒计时
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style lang="scss" scoped>
.reset-password-container {
  width: 100%;

  .form-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
    text-align: center;
    margin-bottom: 60rpx;
    letter-spacing: 1rpx;
  }

  .form-content {
    .input-wrapper {
      position: relative;
      margin-bottom: 50rpx;

      .login-input {
        padding: 12rpx 20rpx;
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

      .verify-code-wrapper {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .verify-code-input {
          flex: 1;
          padding: 12rpx 20rpx;
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

        .send-code-btn {
          width: 200rpx;
          height: 80rpx;
          font-size: 24rpx;
          border-radius: 12rpx;

          &:disabled {
            opacity: 0.6;
          }
        }
      }

      .input-bottom-line {
        position: absolute;
        bottom: -2rpx;
        left: 5%;
        width: 90%;
        height: 2rpx;
        background: linear-gradient(
          to right,
          transparent,
          var(--wot-color-theme, #1989fa),
          transparent
        );
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
      }
    }

    .reset-btn {
      height: 96rpx;
      margin-top: 40rpx;
      margin-bottom: 30rpx;
      font-size: 32rpx;
      font-weight: 500;
      letter-spacing: 2rpx;
      border-radius: 48rpx;
      box-shadow: 0 10rpx 20rpx rgba(25, 137, 250, 0.25);
      transition: all 0.3s ease;

      &:active {
        box-shadow: 0 5rpx 10rpx rgba(25, 137, 250, 0.2);
        transform: scale(0.98);
      }

      &:disabled {
        opacity: 0.6;
        box-shadow: none;
      }
    }

    .back-btn {
      height: 96rpx;
      font-size: 32rpx;
      color: #666666;
      border: 2rpx solid #e8e8e8;
      border-radius: 48rpx;
      background-color: transparent;
      transition: all 0.3s ease;

      &:active {
        border-color: #ccc;
        transform: scale(0.98);
      }
    }
  }
}
</style>
