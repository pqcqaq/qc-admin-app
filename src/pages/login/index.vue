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
    <view class="login-header">
      <image class="login-logo" :src="appLogo" mode="aspectFit"></image>
      <!-- <view class="login-title">{{ appTitle }}</view> -->
    </view>
    <view class="login-form">
      <!-- <view class="welcome-text">欢迎登录</view> -->
      <!-- <view class="login-desc">请输入您的账号和密码</view> -->
      <wd-tabs
        v-model="tab"
        animated
        class="login-tabs"
        :line-height="4"
        :line-width="80"
        :duration="500"
      >
        <wd-tab :title="t('login_by_account')" class="login-tab">
          <view class="login-input-group">
            <view class="input-wrapper">
              <wd-input
                v-model="loginForm.accountName"
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
                v-model="loginForm.password"
                prefix-icon="lock-on"
                placeholder="请输入密码"
                clearable
                show-password
                class="login-input"
                :border="false"
                required
              ></wd-input>
              <!-- <view class="input-bottom-line"></view> -->
            </view>
          </view>
        </wd-tab>
        <wd-tab :title="t('login_by_verification_code')" class="login-tab">
          <view class="verification-code-input-group">
            <view class="input-wrapper">
              <wd-input
                prefix-icon="phone"
                placeholder="请输入手机号"
                clearable
                class="login-input"
                :border="false"
                required
              ></wd-input>
              <view class="input-bottom-line"></view>
            </view>
            <view class="captcha-wrapper"></view>
          </view>
        </wd-tab>
      </wd-tabs>

      <!-- 登录按钮组 -->
      <view class="login-buttons">
        <!-- 账号密码登录按钮 -->
        <wd-button
          :type="buttonType"
          size="large"
          block
          @click="handleAccountLogin"
          class="account-login-btn"
        >
          <wd-icon name="right" size="18rpx" class="login-icon"></wd-icon>
          {{ t('login') }}
        </wd-button>
        <!-- 微信小程序一键登录按钮 -->
        <!-- #ifdef MP-WEIXIN -->
        <!-- <view class="divider">
          <view class="divider-line"></view>
          <view class="divider-text">或</view>
          <view class="divider-line"></view>
        </view> -->
        <!-- #endif -->
      </view>
      <view class="forget-password" @click="forgetPassword">{{ t('forget_password') }}?</view>
    </view>
    <!-- 隐私协议勾选 -->
    <view class="privacy-agreement">
      <wd-checkbox
        v-model="agreePrivacy"
        shape="circle"
        @click="checkAgreePrivacy"
        class="privacy-checkbox"
        active-color="var(--wot-color-theme, #ffffff)"
      >
        <view class="agreement-text">
          {{ t('accept_protocol') }}
          <text class="agreement-link" @click.stop="handleAgreement('user')">
            《{{ t('user_protocol') }}》
          </text>
          和
          <text class="agreement-link" @click.stop="handleAgreement('privacy')">
            《{{ t('privacy_policy') }}》
          </text>
        </view>
      </wd-checkbox>
    </view>
    <view class="login-footer"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import { isTableBar } from '@/utils/index'
import { ILoginParams } from '@/api'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t

const tab = ref<number>(0)

const redirectRoute = ref('')

// 获取环境变量
const appTitle = ref(import.meta.env.VITE_APP_TITLE || 'Login')
const appLogo = ref(import.meta.env.VITE_APP_LOGO || '/static/logo.svg')

// 初始化store
const userStore = useUserStore()
// 路由位置
// 登录表单数据
const loginForm = ref<ILoginParams>({
  accountName: '',
  password: '',
})
// 隐私协议勾选状态
const agreePrivacy = ref(false)

// 账号密码登录
const handleAccountLogin = async () => {
  if (!agreePrivacy.value) {
    toast.error('请阅读同意协议')
    return
  }
  // 表单验证
  if (!loginForm.value.accountName) {
    toast.error('请输入用户名')
    return
  }
  if (!loginForm.value.password) {
    toast.error('请输入密码')
    return
  }
  // 执行登录
  await userStore.login(loginForm.value)
  // 跳转到首页或重定向页面
  const targetUrl = redirectRoute.value || '/pages/index/index'
  if (isTableBar(targetUrl)) {
    uni.switchTab({ url: targetUrl })
  } else {
    uni.redirectTo({ url: targetUrl })
  }
}

// 处理协议点击
const handleAgreement = (type: 'user' | 'privacy') => {
  if (type === 'user') {
    uni.navigateTo({ url: '/pages/login/service' })
  } else {
    uni.navigateTo({ url: '/pages/login/privacy' })
  }
  // showToast(`查看${title}`)
  // 实际项目中可以跳转到对应的协议页面
  uni.navigateTo({
    url: `/pages/login/${type}`,
  })
}

//button 类型
import { ButtonType } from 'wot-design-uni/components/wd-button/types'
const buttonType = ref<ButtonType>('info')

const checkAgreePrivacy = () => {
  if (!agreePrivacy.value) {
    buttonType.value = 'info'
  } else {
    buttonType.value = 'success'
  }
}

// 忘记密码
const forgetPassword = () => {}
</script>

<style lang="scss" scoped>
$primary-color: #3daa9a;
/* 验证码输入框样式 */
.captcha-wrapper {
  .captcha-input {
    :deep(.wd-input__suffix) {
      margin-right: 0;
      padding-right: 0;
    }
  }

  .captcha-image {
    width: 100rpx;
    height: 36rpx;
    margin-left: 10rpx;
    border-radius: 8rpx;
    cursor: pointer;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
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
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
    }
  }
}

.login-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 30rpx;
  background-color: $primary-color;
  background-image: linear-gradient(
    135deg,
    rgba(25, 137, 250, 0.05) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
// .bg-decoration {
//   position: absolute;
//   border-radius: 50%;
//   background: linear-gradient(135deg, rgba(25, 137, 250, 0.05), rgba(25, 137, 250, 0.1));
//   z-index: 0;
//   pointer-events: none;
// }

// .bg-circle-1 {
//   width: 500rpx;
//   height: 500rpx;
//   top: -200rpx;
//   right: -200rpx;
//   opacity: 0.6;
// }

// .bg-circle-2 {
//   width: 400rpx;
//   height: 400rpx;
//   bottom: 10%;
//   left: -200rpx;
//   opacity: 0.4;
// }

// .bg-circle-3 {
//   width: 300rpx;
//   height: 300rpx;
//   bottom: -100rpx;
//   right: 10%;
//   opacity: 0.3;
//   background: linear-gradient(135deg, rgba(7, 193, 96, 0.05), rgba(7, 193, 96, 0.1));
// }

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 120rpx;
  animation: fadeInDown 0.8s ease-out;

  .login-logo {
    /*
    width: 200rpx;
    height: 200rpx;
    border-radius: 36rpx;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
    }
    **/
    width: 350rpx;
    height: 350rpx;
    top: 20rpx;
  }

  // .login-title {
  //   margin-top: 30rpx;
  //   font-size: 46rpx;
  //   font-weight: bold;
  //   color: #333333;
  //   letter-spacing: 3rpx;
  //   text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
  // }
}

.login-form {
  flex: 0.2;
  margin-top: 0rpx;
  animation: fadeIn 0.8s ease-out 0.2s both;
  background-color: #ffffff;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.25);
  padding: 0rpx 24rpx 0 24rpx;
  height: 300rpx;

  .login-tabs {
    height: 100%;
  }

  .forget-password {
    position: relative;
    bottom: 10rpx;
    width: 98%;
    text-align: right;
    font-size: 24rpx;
    color: $primary-color;
    margin-top: 42rpx;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  // .welcome-text {
  //   margin-bottom: 16rpx;
  //   font-size: 48rpx;
  //   font-weight: bold;
  //   color: #333333;
  //   text-align: center;
  //   letter-spacing: 1rpx;
  // }

  // .login-desc {
  //   margin-bottom: 70rpx;
  //   font-size: 28rpx;
  //   color: #888888;
  //   text-align: center;
  // }

  .login-input-group {
    margin-top: 50rpx;
    margin-bottom: 50rpx;
    position: relative;
    z-index: 1;

    .input-wrapper {
      position: relative;
      margin-bottom: 20rpx;
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
        border: 2px rgb(238, 238, 238) solid;

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
      width: 100%;
      margin: 0 auto;
      font-size: 32rpx;
      font-weight: 500;
      letter-spacing: 2rpx;
      border-radius: 10rpx;
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
    color: #ffffff;

    .agreement-link {
      cursor: pointer;
      text-decoration: underline;
      padding: 0 4rpx;
      font-weight: 500;
      color: var(--wot-color-theme, #ffffff);
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
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
