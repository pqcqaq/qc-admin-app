<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '登录',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="login-container">
    <!-- 背景装饰元素 -->
    <view class="bg-decoration bg-circle-1"></view>
    <view class="bg-decoration bg-circle-2"></view>
    <view class="bg-decoration bg-circle-3"></view>

    <view class="login-header">
      <!-- <image class="login-logo" :src="appLogo" mode="aspectFit"></image> -->
      <view class="login-title">{{ appTitle }}</view>
    </view>

    <view class="login-form">
      <!-- 账号密码登录 -->
      <view v-if="currentLoginType === 'password'" class="login-content">
        <view class="welcome-text">欢迎登录</view>
        <view class="login-desc">请输入您的账号和密码</view>
        <view class="login-input-group">
          <view class="input-wrapper">
            <wd-input
              v-model="loginForm.identifier"
              prefix-icon="user"
              placeholder="请输入用户名"
              clearable
              class="login-input"
              :border="false"
              required
            ></wd-input>
            <view class="input-bottom-line"></view>
          </view>
          <view class="input-wrapper">
            <wd-input
              v-model="loginForm.secret"
              prefix-icon="lock-on"
              placeholder="请输入密码"
              clearable
              show-password
              class="login-input"
              :border="false"
              required
            ></wd-input>
            <view class="input-bottom-line"></view>
          </view>
        </view>
        <!-- 登录按钮组 -->
        <view class="login-buttons">
          <!-- 账号密码登录按钮 -->
          <wd-button
            type="primary"
            size="large"
            block
            @click="handleAccountLogin"
            class="account-login-btn"
          >
            <wd-icon name="right" size="18px" class="login-icon"></wd-icon>
            登录
          </wd-button>
        </view>

        <!-- 登录方式切换 -->
        <view class="login-switch">
          <view class="switch-links">
            <text class="switch-link" @click="switchLoginType('phone')">手机验证码登录</text>
            <text class="switch-link" @click="switchLoginType('reset')">忘记密码?</text>
          </view>
        </view>
      </view>

      <!-- 手机验证码登录 -->
      <PhoneLogin v-else-if="currentLoginType === 'phone'" @back="switchLoginType('password')" />

      <!-- 重置密码 -->
      <ResetPassword
        v-else-if="currentLoginType === 'reset'"
        @back="switchLoginType('password')"
        @success="switchLoginType('password')"
      />
    </view>

    <!-- 隐私协议勾选 -->
    <view class="privacy-agreement">
      <wd-checkbox
        v-model="agreePrivacy"
        shape="square"
        class="privacy-checkbox"
        active-color="var(--wot-color-theme, #1989fa)"
      >
        <view class="agreement-text">
          我已阅读并同意
          <text class="agreement-link" @click.stop="handleAgreement('user')">《服务协议》</text>
          和
          <text class="agreement-link" @click.stop="handleAgreement('privacy')">《隐私政策》</text>
        </view>
      </wd-checkbox>
    </view>
    <view class="login-footer"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
import { isTableBar } from '@/utils/index'
import { getLogin } from '@/api'
import PhoneLogin from '@/components/PhoneLogin.vue'
import ResetPassword from '@/components/ResetPassword.vue'

const redirectRoute = ref('')

// 获取环境变量
const appTitle = ref(import.meta.env.VITE_APP_TITLE || 'Login')
const appLogo = ref(import.meta.env.VITE_APP_LOGO || '/static/logo.svg')

// 初始化store
const userStore = useUserStore()

// 当前登录类型
const currentLoginType = ref<'password' | 'phone' | 'reset'>('password')

// 登录表单数据
const loginForm = ref({
  credentialType: 'password',
  identifier: '',
  secret: '',
})

// 隐私协议勾选状态
const agreePrivacy = ref(true)

// 切换登录类型
const switchLoginType = (type: 'password' | 'phone' | 'reset') => {
  currentLoginType.value = type
}

// 账号密码登录
const handleAccountLogin = async () => {
  if (!agreePrivacy.value) {
    toast.error('请阅读同意协议')
    return
  }
  // 表单验证
  if (!loginForm.value.identifier) {
    toast.error('请输入用户名')
    return
  }
  if (!loginForm.value.secret) {
    toast.error('请输入密码')
    return
  }
  // 执行登录
  getLogin(loginForm.value)
    .then((res) => {
      userStore.setLoginResult(res)
      toast.success('登录成功')
      navigateToHome()
    })
    .catch((err) => {
      console.error('登录失败:', err)
      toast.error(err.message || '登录失败，请稍后重试')
    })
}

const navigateToHome = () => {
  const targetUrl = redirectRoute.value || '/pages/index/index'
  if (isTableBar(targetUrl)) {
    uni.switchTab({ url: targetUrl })
  } else {
    uni.redirectTo({ url: targetUrl })
  }
}

// 处理协议点击
const handleAgreement = (type: 'user' | 'privacy') => {
  switch (type) {
    case 'user': {
      uni.navigateTo({
        url: '/pages/login/service',
      })
      break
    }
    case 'privacy': {
      uni.navigateTo({
        url: '/pages/login/privacy',
      })
      break
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

/* 验证码输入框样式 */
.captcha-wrapper {
  .captcha-input {
    :deep(.wd-input__suffix) {
      margin-right: 0;
      padding-right: 0;
    }
  }

  .captcha-image {
    width: 100px;
    height: 36px;
    margin-left: 10px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
      pointer-events: none;
    }

    &:active {
      opacity: 0.8;
      transform: scale(0.96);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

.login-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 70rpx;
  background-color: $bg-white;
  background-image: $gradient-primary;
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  background: $gradient-decoration;
  z-index: 0;
  pointer-events: none;
}

.bg-circle-1 {
  width: 500rpx;
  height: 500rpx;
  top: -200rpx;
  right: -200rpx;
  opacity: 0.6;
}

.bg-circle-2 {
  width: 400rpx;
  height: 400rpx;
  bottom: 10%;
  left: -200rpx;
  opacity: 0.4;
}

.bg-circle-3 {
  width: 300rpx;
  height: 300rpx;
  bottom: -100rpx;
  right: 10%;
  opacity: 0.3;
  background: $gradient-green;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 120rpx;
  animation: fadeInDown 0.8s ease-out;

  .login-logo {
    width: 200rpx;
    height: 200rpx;
    border-radius: 36rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
    }
  }

  .login-title {
    margin-top: 30rpx;
    font-size: $font-size-xxl;
    font-weight: bold;
    color: $font-primary;
    letter-spacing: 3rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
  }
}

.login-form {
  flex: 1;
  margin-top: 70rpx;
  animation: fadeIn 0.8s ease-out 0.2s both;

  .welcome-text {
    margin-bottom: 16rpx;
    font-size: $font-size-title;
    font-weight: bold;
    color: $font-primary;
    text-align: center;
    letter-spacing: 1rpx;
  }

  .login-desc {
    margin-bottom: 70rpx;
    font-size: $font-size-base;
    color: $font-light-gray;
    text-align: center;
  }

  .login-input-group {
    margin-bottom: 60rpx;
    position: relative;
    z-index: 1;

    .input-wrapper {
      position: relative;
      margin-bottom: 50rpx;
      transition: all 0.3s ease;
      border-radius: 16rpx;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

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
      }

      &:focus-within .input-bottom-line {
        transform: scaleX(1);
      }

      .input-icon {
        margin-right: 16rpx;
        color: #666666;
        transition: color 0.3s ease;
      }

      &:focus-within .input-icon {
        color: var(--wot-color-theme, #1989fa);
      }
    }
  }

  .login-buttons {
    display: flex;
    flex-direction: column;
    gap: 36rpx;

    .account-login-btn {
      height: 96rpx;
      margin-top: 20rpx;
      font-size: 32rpx;
      font-weight: 500;
      letter-spacing: 2rpx;
      border-radius: 48rpx;
      box-shadow: 0 10rpx 20rpx rgba(25, 137, 250, 0.25);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      .login-icon {
        margin-right: 8rpx;
        opacity: 0.8;
        transition: all 0.3s ease;
      }

      &:active {
        box-shadow: 0 5rpx 10rpx rgba(25, 137, 250, 0.2);
        transform: scale(0.98);

        .login-icon {
          transform: translateX(3rpx);
        }
      }
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24rpx 0;

      .divider-line {
        flex: 1;
        height: 1px;
        background-color: #eeeeee;
      }

      .divider-text {
        padding: 0 24rpx;
        font-size: 24rpx;
        color: #999999;
      }
    }

    .wechat-login-btn {
      height: 96rpx;
      font-size: 32rpx;
      color: #07c160;
      border-color: #07c160;
      border-radius: 48rpx;
      transition: all 0.3s ease;

      .wechat-icon {
        margin-right: 12rpx;
      }

      &:active {
        background-color: rgba(7, 193, 96, 0.08);
        transform: scale(0.98);
      }
    }
  }

  .login-switch {
    margin-top: 40rpx;

    .switch-links {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .switch-link {
        font-size: 28rpx;
        color: var(--wot-color-theme, #1989fa);
        text-decoration: none;
        transition: all 0.3s ease;

        &:active {
          opacity: 0.7;
          transform: scale(0.95);
        }
      }
    }
  }
}

.privacy-agreement {
  display: flex;
  justify-content: center;
  margin: 30rpx 0 40rpx;
  animation: fadeIn 0.8s ease-out 0.4s both;

  .privacy-checkbox {
    display: flex;
    align-items: center;
  }

  .agreement-text {
    font-size: 26rpx;
    line-height: 1.6;
    color: #666666;

    .agreement-link {
      padding: 0 4rpx;
      font-weight: 500;
      color: var(--wot-color-theme, #1989fa);
      transition: all 0.3s ease;

      &:active {
        opacity: 0.8;
        transform: scale(0.98);
      }
    }
  }
}

.login-footer {
  padding: 50rpx 0;
  margin-top: auto;
}

/* 添加动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
