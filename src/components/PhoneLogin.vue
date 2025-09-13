<template>
  <view class="phone-login-container">
    <view class="form-title">手机验证码登录</view>
    <view class="form-content">
      <!-- 手机号输入 -->
      <view class="input-wrapper">
        <wd-input
          v-model="phoneForm.phone"
          prefix-icon="phone"
          placeholder="请输入手机号"
          clearable
          class="login-input"
          :border="false"
          type="number"
          :maxlength="11"
          @blur="validatePhone"
        ></wd-input>
        <view class="input-bottom-line" :class="{ active: phoneForm.phone }"></view>
        <view v-if="phoneError" class="error-text">{{ phoneError }}</view>
      </view>

      <!-- 验证码输入 -->
      <view class="input-wrapper">
        <view class="verify-code-wrapper">
          <wd-input
            v-model="phoneForm.verifyCode"
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
        <view class="input-bottom-line" :class="{ active: phoneForm.verifyCode }"></view>
        <view v-if="codeError" class="error-text">{{ codeError }}</view>
      </view>

      <!-- 登录按钮 -->
      <wd-button
        type="primary"
        size="large"
        block
        :loading="isLogging"
        :disabled="!canLogin"
        @click="handlePhoneLogin"
        class="phone-login-btn"
      >
        登录
      </wd-button>

      <!-- 返回按钮 -->
      <wd-button size="large" block @click="goBack" class="back-btn">返回</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { toast } from '@/utils/toast'
import { useUserStore } from '@/store/user'
import { getLogin, sendVerifyCodeApi } from '@/api/auth'
import { isTableBar } from '@/utils/index'

// 定义事件
const emit = defineEmits<{
  (event: 'back'): void
}>()

// 状态管理
const userStore = useUserStore()

// 表单数据
const phoneForm = ref({
  phone: '',
  verifyCode: '',
})

// 错误信息
const phoneError = ref('')
const codeError = ref('')

// 加载状态
const isLogging = ref(false)
const isCodeSending = ref(false)

// 验证码倒计时
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 验证手机号格式
const validatePhone = () => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneForm.value.phone) {
    phoneError.value = '请输入手机号'
    return false
  }
  if (!phoneReg.test(phoneForm.value.phone)) {
    phoneError.value = '请输入正确的手机号格式'
    return false
  }
  phoneError.value = ''
  return true
}

// 手机号是否有效
const isPhoneValid = computed(() => {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(phoneForm.value.phone)
})

// 是否可以登录
const canLogin = computed(() => {
  return isPhoneValid.value && phoneForm.value.verifyCode.length === 6
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
      identifier: phoneForm.value.phone,
      purpose: 'login',
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

// 手机验证码登录
const handlePhoneLogin = async () => {
  if (!validatePhone()) return

  if (!phoneForm.value.verifyCode) {
    codeError.value = '请输入验证码'
    return
  }

  try {
    isLogging.value = true
    codeError.value = ''

    const response = await getLogin({
      credentialType: 'phone',
      identifier: phoneForm.value.phone,
      secret: '',
      verifyCode: phoneForm.value.verifyCode,
    })

    if (response.success) {
      userStore.setLoginResult(response)
      toast.success('登录成功')
      navigateToHome()
    } else {
      toast.error(response.data?.message || '登录失败')
    }
  } catch (error: any) {
    console.error('手机验证码登录失败:', error)
    toast.error(error.message || '登录失败，请稍后重试')
  } finally {
    isLogging.value = false
  }
}

// 跳转到首页
const navigateToHome = () => {
  const targetUrl = '/pages/index/index'
  if (isTableBar(targetUrl)) {
    uni.switchTab({ url: targetUrl })
  } else {
    uni.redirectTo({ url: targetUrl })
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
@import '@/style/variables.scss';

.phone-login-container {
  width: 100%;

  .form-title {
    font-size: $font-size-xl;
    font-weight: bold;
    color: $font-primary;
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
        background-color: $border-input;
        border-radius: $radius-lg;
        transition: all 0.3s ease;

        :deep(.wd-input__inner) {
          font-size: $font-size-lg;
          color: $font-primary;
        }

        :deep(.wd-input__placeholder) {
          font-size: $font-size-base;
          color: $font-placeholder;
        }

        &:focus-within {
          background-color: rgba(245, 247, 250, 0.95);
          box-shadow: $shadow-medium;
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
          background-color: $border-input;
          border-radius: $radius-lg;
          transition: all 0.3s ease;

          :deep(.wd-input__inner) {
            font-size: $font-size-lg;
            color: $font-primary;
          }

          :deep(.wd-input__placeholder) {
            font-size: $font-size-base;
            color: $font-placeholder;
          }

          &:focus-within {
            background-color: rgba(245, 247, 250, 0.95);
            box-shadow: $shadow-medium;
            transform: translateY(-3rpx);
          }
        }

        .send-code-btn {
          width: 200rpx;
          height: 80rpx;
          font-size: $font-size-sm;
          border-radius: $radius-base;

          &:disabled {
            opacity: $opacity-disabled;
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
        font-size: $font-size-sm;
        color: $color-error;
        margin-top: 10rpx;
        padding-left: 20rpx;
      }
    }

    .phone-login-btn {
      height: $height-input;
      margin-top: 40rpx;
      margin-bottom: 30rpx;
      font-size: $font-size-xl;
      font-weight: 500;
      letter-spacing: 2rpx;
      border-radius: $radius-round;
      box-shadow: $shadow-button;
      transition: all 0.3s ease;

      &:active {
        box-shadow: 0 5rpx 10rpx rgba(25, 137, 250, 0.2);
        transform: scale(0.98);
      }

      &:disabled {
        opacity: $opacity-disabled;
        box-shadow: none;
      }
    }

    .back-btn {
      height: $height-input;
      font-size: $font-size-xl;
      color: $font-gray;
      border: 2rpx solid $border-light;
      border-radius: $radius-round;
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
