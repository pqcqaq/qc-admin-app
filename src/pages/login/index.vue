<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="login-container">
    <view class="login-header">
      <image class="login-logo" :src="appLogo" mode="aspectFit"></image>
    </view>
    <view class="login-form">
      <!-- 自定义标签页/忘记密码标题 -->
      <view v-if="mode === 'login'" class="custom-tabs">
        <view class="tab-header">
          <view class="tab-item" :class="{ active: tab === 0 }" @click="switchTab(0)">
            {{ t('login_by_account') }}
          </view>
          <view class="tab-item" :class="{ active: tab === 1 }" @click="switchTab(1)">
            {{ t('login_by_verification_code') }}
          </view>
        </view>
        <view class="tab-indicator" :style="{ left: tab * 50 + '%' }"></view>
      </view>
      <view v-else-if="mode === 'forget'" class="forget-header">
        <view class="forget-title-row">
          <wd-icon name="thin-arrow-left" size="22px" class="back-icon" @click="backToLogin" />
          <view class="forget-title-with-underline">
            <view class="forget-title">{{ t('forget_password') }}</view>
            <view class="forget-underline"></view>
          </view>
          <view class="right-placeholder"></view>
        </view>
      </view>
      <view v-else-if="mode === 'setPassword'" class="forget-header">
        <view class="forget-title-row">
          <wd-icon name="thin-arrow-left" size="22px" class="back-icon" @click="backToLogin" />
          <view class="forget-title">{{ t('set_new_password') }}</view>
        </view>
        <view class="forget-underline"></view>
      </view>

      <!-- 标签页内容 -->
      <view class="tab-content">
        <!-- 账号密码登录 -->
        <view v-if="mode === 'login' && tab === 0" class="login-input-group">
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="user" size="40rpx" class="prefix-icon" />
              </view>
              <input
                v-model="loginForm.accountName"
                :placeholder="t('please_enter_your_username')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view v-if="loginForm.accountName" class="input-suffix" @click="clearAccountName">
                <wd-icon name="close" size="32rpx" class="clear-icon" />
              </view>
            </view>
          </view>
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="lock" size="40rpx" class="prefix-icon" />
              </view>
              <input
                v-model="loginForm.password"
                :password="!showPassword"
                :placeholder="t('please_enter_your_password')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view class="input-suffix">
                <wd-icon
                  v-if="loginForm.password"
                  name="close"
                  size="32rpx"
                  class="clear-icon"
                  @click="clearPassword"
                />
                <view class="divider-vertical"></view>
                <wd-icon
                  :name="showPassword ? 'view' : 'eye-close'"
                  size="32rpx"
                  class="eye-icon"
                  @click="togglePassword"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 验证码登录 -->
        <view v-if="mode === 'login' && tab === 1" class="login-input-group">
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="phone" size="40rpx" class="prefix-icon" />
                <text class="prefix-text">+86</text>
                <view class="divider-vertical"></view>
              </view>
              <input
                v-model="smsPhone"
                type="number"
                :placeholder="t('please_enter_your_phone_number')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view v-if="smsPhone" class="input-suffix" @click="clearSmsPhone">
                <wd-icon name="close" size="32rpx" class="clear-icon" />
              </view>
            </view>
          </view>
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="chat" size="40rpx" class="prefix-icon" />
              </view>
              <input
                v-model="smsCode"
                type="number"
                :placeholder="t('please_enter_your_verification_code')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view class="input-suffix">
                <wd-icon
                  v-if="smsCode"
                  name="close"
                  size="32rpx"
                  class="clear-icon"
                  @click="clearSmsCode"
                />
                <view class="divider-vertical"></view>
                <view
                  class="sms-send-btn"
                  @click="onSendSmsClick"
                  :class="{
                    disabled: smsCountdown > 0 || !isValidPhone(smsPhone),
                    enabled: smsCountdown === 0 && isValidPhone(smsPhone),
                  }"
                >
                  {{ smsCountdown > 0 ? smsCountdown + 's' : t('send_a_verification_code') }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 忘记密码内容（复用验证码登录输入框） -->
        <view v-if="mode === 'forget'" class="login-input-group">
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="phone" size="40rpx" class="prefix-icon" />
                <text class="prefix-text">+86</text>
                <view class="divider-vertical"></view>
              </view>
              <input
                v-model="smsPhone"
                type="number"
                :placeholder="t('please_enter_your_phone_number')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view v-if="smsPhone" class="input-suffix" @click="clearSmsPhone">
                <wd-icon name="close" size="32rpx" class="clear-icon" />
              </view>
            </view>
          </view>
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="chat" size="40rpx" class="prefix-icon" />
              </view>
              <input
                v-model="smsCode"
                type="number"
                :placeholder="t('please_enter_your_verification_code')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view class="input-suffix">
                <wd-icon
                  v-if="smsCode"
                  name="close"
                  size="32rpx"
                  class="clear-icon"
                  @click="clearSmsCode"
                />
                <view class="divider-vertical"></view>
                <view
                  class="sms-send-btn"
                  @click="onSendSmsClick"
                  :class="{
                    disabled: smsCountdown > 0 || !isValidPhone(smsPhone),
                    enabled: smsCountdown === 0 && isValidPhone(smsPhone),
                  }"
                >
                  {{ smsCountdown > 0 ? smsCountdown + 's' : t('send_a_verification_code') }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 设置新密码输入区 -->
        <view v-if="mode === 'setPassword'" class="login-input-group">
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="lock" size="40rpx" class="prefix-icon" />
              </view>
              <input
                v-model="newPassword"
                :type="(showNewPassword ? 'text' : 'password') as any"
                :placeholder="t('please_enter_new_password')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view class="input-suffix">
                <wd-icon
                  :name="showNewPassword ? 'view' : 'eye-close'"
                  size="32rpx"
                  class="eye-icon"
                  @click="showNewPassword = !showNewPassword"
                />
              </view>
            </view>
          </view>
          <view v-if="newPasswordError" class="error-tip">{{ t(newPasswordError) }}</view>
          <view class="input-wrapper">
            <view class="custom-input">
              <view class="input-prefix">
                <wd-icon name="lock" size="40rpx" class="prefix-icon" />
              </view>
              <input
                v-model="confirmPassword"
                :type="(showConfirmPassword ? 'text' : 'password') as any"
                :placeholder="t('please_enter_new_password_again')"
                class="input-field"
                placeholder-class="input-placeholder"
              />
              <view class="input-suffix">
                <wd-icon
                  :name="showConfirmPassword ? 'view' : 'eye-close'"
                  size="32rpx"
                  class="eye-icon"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </view>
            </view>
          </view>
          <view v-if="confirmPasswordError" class="error-tip">{{ t(confirmPasswordError) }}</view>
        </view>
      </view>

      <!-- 登录/提交按钮 -->
      <view class="login-buttons">
        <view
          v-if="mode === 'login'"
          class="custom-button"
          :class="{
            'button-success': buttonType === 'success',
            'button-info': buttonType === 'info',
          }"
          @click="handleLogin"
        >
          <wd-icon name="right" size="18rpx" class="login-icon"></wd-icon>
          {{ t('login') }}
        </view>
        <view
          v-else-if="mode === 'forget'"
          class="custom-button"
          :class="{ 'button-success': canSubmitForget, 'button-info': !canSubmitForget }"
          :disabled="!canSubmitForget"
          @click="handleForgetSubmit"
        >
          {{ t('submit') }}
        </view>
        <view
          v-else-if="mode === 'setPassword'"
          class="custom-button"
          :class="{ 'button-success': canSubmitSetPassword, 'button-info': !canSubmitSetPassword }"
          :disabled="!canSubmitSetPassword"
          @click="handleSetPassword"
        >
          {{ t('ok') }}
        </view>
      </view>

      <view v-if="mode === 'login'" class="forget-password" @click="forgetPassword">
        {{ t('forget_password') }}?
      </view>
    </view>

    <!-- 隐私协议勾选 -->
    <view v-if="mode === 'login'" class="privacy-agreement">
      <view class="custom-checkbox" @click="togglePrivacy">
        <view class="checkbox-inner" :class="{ checked: agreePrivacy }">
          <text v-if="agreePrivacy" class="check-mark">✓</text>
        </view>
        <view class="agreement-text">
          {{ t('accept_protocol') }}
          <text class="agreement-link" @click.stop="handleAgreement('user')">
            《{{ t('user_protocol') }}》
          </text>
          {{ t('and') }}
          <text class="agreement-link" @click.stop="handleAgreement('privacy')">
            《{{ t('privacy_policy') }}》
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import { isTableBar } from '@/utils/index'
import { ILoginParams } from '@/api'
import { useI18n } from 'vue-i18n'
import { getsmscode } from '@/api/auth'
import { loginaccountbysmscode, verifysmscode } from '@/api/user'

const i18n = useI18n()
const t = i18n.t

const tab = ref<number>(0)
const showPassword = ref(false)

const redirectRoute = ref('')

// 获取环境变量
const appTitle = ref(import.meta.env.VITE_APP_TITLE || 'Login')
const appLogo = ref(import.meta.env.VITE_APP_LOGO || '/static/logo.png')

// 初始化store
const userStore = useUserStore()

// 登录表单数据
const loginForm = ref<ILoginParams>({
  accountName: '',
  password: '',
})

// 隐私协议勾选状态
const agreePrivacy = ref(false)

// 验证码登录相关变量
const smsPhone = ref('')
const smsCode = ref('')
const smsCountdown = ref(0)
const smsSending = ref(false)

// 新增模式变量
const mode = ref<'login' | 'forget' | 'setPassword'>('login')

// 设置新密码相关变量
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isValidPassword = (pwd: string) => /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,16}$/.test(pwd)

const newPasswordError = computed(() => {
  if (!newPassword.value) return ''
  if (!isValidPassword(newPassword.value)) return t('please_enter_new_password_format')
  return ''
})
const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return ''
  if (confirmPassword.value !== newPassword.value) return t('two_input_password_not_consistent')
  return ''
})

// 标签页切换
const switchTab = (index: number) => {
  tab.value = index
}

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 切换隐私协议同意状态
const togglePrivacy = () => {
  agreePrivacy.value = !agreePrivacy.value
}

// 清空输入框
const clearAccountName = () => {
  loginForm.value.accountName = ''
}

const clearPassword = () => {
  loginForm.value.password = ''
}

const clearSmsPhone = () => {
  smsPhone.value = ''
}

const clearSmsCode = () => {
  smsCode.value = ''
}

// 手机号校验方法
const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone)

// 合并登录逻辑
const handleLogin = async () => {
  if (tab.value === 0) {
    // 账号密码登录
    if (!agreePrivacy.value) {
      toast.error(t('please_agree_to_the_privacy_policy'))
      return
    }
    if (!loginForm.value.accountName) {
      toast.error(t('please_enter_your_username'))
      return
    }
    if (!loginForm.value.password) {
      toast.error(t('please_enter_your_password'))
      return
    }
    await userStore.login(loginForm.value)
    const targetUrl = redirectRoute.value || '/pages/index/index'
    if (isTableBar(targetUrl)) {
      uni.switchTab({ url: targetUrl })
    } else {
      uni.redirectTo({ url: targetUrl })
    }
  } else {
    // 验证码登录
    if (!agreePrivacy.value) {
      toast.error(t('please_agree_to_the_privacy_policy'))
      return
    }
    if (!isValidPhone(smsPhone.value)) {
      toast.error(t('please_enter_your_phone_number'))
      return
    }
    if (!smsCode.value) {
      toast.error(t('please_enter_your_verification_code'))
      return
    }
    try {
      await userStore.loginBySmsCode({ phoneNumber: smsPhone.value, smsCode: smsCode.value })
      const targetUrl = redirectRoute.value || '/pages/index/index'
      if (isTableBar(targetUrl)) {
        uni.switchTab({ url: targetUrl })
      } else {
        uni.redirectTo({ url: targetUrl })
      }
    } catch (e) {
      // 错误提示已在store处理
    }
  }
}

// 处理协议点击
const handleAgreement = (type: 'user' | 'privacy') => {
  if (type === 'user') {
    uni.navigateTo({ url: '/pages/login/service' })
  } else {
    uni.navigateTo({ url: '/pages/login/privacy' })
  }
}

//button 类型
const buttonType = ref<string>('info')

// 忘记密码
const forgetPassword = () => {
  clearSmsPhone()
  clearSmsCode()
  mode.value = 'forget'
}

// 改变login button颜色
const changeButtonColor = () => {
  if (
    (tab.value === 0 &&
      loginForm.value.accountName &&
      loginForm.value.password &&
      agreePrivacy.value) ||
    (tab.value === 1 && isValidPhone(smsPhone.value) && smsCode.value && agreePrivacy.value)
  ) {
    buttonType.value = 'success'
  } else {
    buttonType.value = 'info'
  }
}

watch(
  [
    tab,
    () => loginForm.value.accountName,
    () => loginForm.value.password,
    smsPhone,
    smsCode,
    agreePrivacy,
  ],
  changeButtonColor,
  { immediate: true },
)

// 发送验证码
const handleSendSmsCode = async () => {
  if (smsCountdown.value > 0 || smsSending.value) return
  if (!isValidPhone(smsPhone.value)) {
    toast.error(t('please_enter_your_phone_number'))
    return
  }
  smsSending.value = true
  try {
    await getsmscode({ phoneNumber: smsPhone.value })
    toast.success(t('verification_code_sent'))
    smsCountdown.value = 60
    const timer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (e) {
    toast.error(t('failed_to_send_verification_code'))
  } finally {
    smsSending.value = false
  }
}

// 新增onSendSmsClick方法
const onSendSmsClick = () => {
  if (smsCountdown.value > 0 || !isValidPhone(smsPhone.value)) return
  handleSendSmsCode()
}

// 返回登录
const backToLogin = () => {
  if (mode.value === 'setPassword') {
    mode.value = 'forget'
    clearSmsPhone()
    clearSmsCode()
  } else {
    mode.value = 'login'
  }
}

// 切换到设置新密码模式（后续验证码校验通过后调用）
const toSetPassword = () => {
  console.log('toSetPassword')
  mode.value = 'setPassword'
}

// 忘记密码提交按钮可用性
const canSubmitForget = computed(() => {
  return isValidPhone(smsPhone.value) && !!smsCode.value
})

// 忘记密码模式下提交
const handleForgetSubmit = async () => {
  if (!isValidPhone(smsPhone.value)) {
    toast.error(t('please_enter_your_phone_number'))
    return
  }
  if (!smsCode.value) {
    toast.error(t('please_enter_your_verification_code'))
    return
  }
  try {
    await verifysmscode({ phoneNumber: smsPhone.value, smsCode: smsCode.value })
    toSetPassword()
  } catch (e: any) {
    toast.error(e?.message || '验证码校验失败')
  }
}

// 设置新密码按钮可用性
const canSubmitSetPassword = computed(() => {
  return (
    !!newPassword.value &&
    !!confirmPassword.value &&
    isValidPassword(newPassword.value) &&
    confirmPassword.value === newPassword.value
  )
})

// 设置新密码提交
const handleSetPassword = async () => {
  if (!canSubmitSetPassword.value) return
  try {
    // 可加loading
    await loginaccountbysmscode({
      phoneNumber: smsPhone.value,
      smsCode: smsCode.value,
      newPassword: newPassword.value,
    })
    toast.success('密码设置成功，请重新登录')
    // 清空所有相关输入
    smsPhone.value = ''
    smsCode.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    mode.value = 'login'
  } catch (e: any) {
    toast.error(e?.message || '密码重置失败')
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #3daa9a;
$form-bg-color: #ffffff;
$border-color: rgba(238, 238, 238);
$divider-color: #999999;
$font1-color: #ffffff;
$border-shadow: rgba(0, 0, 0, 0.25);
$logout-input-bg-color: rgba(245, 247, 250, 0.7);

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

  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 120rpx;
    animation: fadeInDown 0.8s ease-out;

    .login-logo {
      width: 350rpx;
      height: 350rpx;
      top: 20rpx;
    }
  }

  .login-form {
    flex: 0.2;
    margin-top: 0rpx;
    animation: fadeIn 0.8s ease-out 0.2s both;
    background-color: $form-bg-color;
    box-shadow: 0 10rpx 20rpx $border-shadow;
    padding: 0rpx 24rpx 0rpx 24rpx;

    .custom-tabs {
      position: relative;
      margin-bottom: 20rpx;

      .tab-header {
        display: flex;
        height: 80rpx;

        .tab-item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30rpx;
          color: #666;
          transition: color 0.3s ease;

          &.active {
            color: $primary-color;
            font-weight: 500;
          }
        }
      }

      .tab-indicator {
        position: absolute;
        bottom: 0;
        width: 50%;
        height: 4rpx;
        background-color: $primary-color;
        border-radius: 2rpx;
        transition: left 0.3s ease;
      }
    }

    .tab-content {
      min-height: 200rpx;
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

        .custom-input {
          display: flex;
          align-items: center;
          padding: 12rpx 20rpx;
          background-color: $logout-input-bg-color;
          border-radius: 16rpx;
          transition: all 0.3s ease;
          border: 2px $border-color solid;
          min-height: 80rpx;
          box-sizing: border-box;

          .input-prefix {
            display: flex;
            align-items: center;
            margin-right: 20rpx;
            flex-shrink: 0;

            .prefix-icon {
              margin-right: 8rpx;
            }

            .prefix-text {
              margin-left: 16rpx;
              margin-right: 16rpx;
              color: $primary-color;
              font-size: 28rpx;
            }
          }

          .input-field {
            flex: 1;
            font-size: 28rpx;
            color: #333;
            background: transparent;
            border: none;
            outline: none;
          }

          .input-placeholder {
            color: #999;
          }

          .input-suffix {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            margin-left: 20rpx;

            .clear-icon {
              color: #999;
              cursor: pointer;
            }

            .eye-icon {
              color: #999;
              cursor: pointer;
            }

            .sms-send-btn {
              padding: 0 16rpx;
              height: 56rpx;
              line-height: 56rpx;
              font-size: 24rpx;
              border-radius: 8rpx;
              cursor: pointer;
              transition: all 0.3s ease;
              user-select: none;

              &.enabled {
                color: $primary-color;
                background-color: rgba(61, 170, 154, 0.1);
              }

              &.disabled {
                color: #ccc;
                cursor: not-allowed;
              }
            }

            .divider-vertical {
              width: 1rpx;
              height: 32rpx;
              background-color: #e5e5e5;
              margin: 0 16rpx;
            }
          }
        }
      }
    }

    .login-buttons {
      display: flex;
      flex-direction: column;
      gap: 36rpx;

      .custom-button {
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
        cursor: pointer;
        user-select: none;

        .login-icon {
          margin-right: 8rpx;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        &.button-success {
          background-color: rgb(61, 170, 154);
          color: white;
        }

        &.button-info {
          background-color: #6c757d;
          color: white;
        }

        &:active {
          transform: scale(0.98);

          .login-icon {
            transform: translateX(3rpx);
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

    .custom-checkbox {
      display: flex;
      align-items: flex-start;
      cursor: pointer;

      .checkbox-inner {
        width: 32rpx;
        height: 32rpx;
        border: 2rpx solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16rpx;
        transition: all 0.3s ease;
        flex-shrink: 0;
        margin-top: 4rpx;

        &.checked {
          background-color: white;

          .check-mark {
            color: $primary-color;
            font-size: 20rpx;
            font-weight: bold;
          }
        }
      }

      .agreement-text {
        font-size: 26rpx;
        line-height: 1.6;
        color: $font1-color;

        .agreement-link {
          cursor: pointer;
          text-decoration: underline;
          padding: 0 4rpx;
          font-weight: 500;
          transition: all 0.3s ease;

          &:active {
            opacity: 0.8;
            transform: scale(0.98);
          }
        }
      }
    }
  }

  .forget-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
    margin-top: 20rpx;
    position: relative;
    .forget-title-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .back-icon-wrapper {
        width: 40rpx; // 或合适的宽度
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .forget-title-with-underline {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        .forget-title {
          font-size: 36rpx;
          font-weight: bold;
          color: #222;
          margin-bottom: 8rpx;
          display: inline-block;
        }
        .forget-underline {
          width: 100%;
          max-width: 120rpx; // 可选，限制最大宽度
          height: 4rpx;
          background-color: $primary-color;
          border-radius: 2rpx;
        }
      }
      .right-placeholder {
        width: 40rpx; // 保持左右对称
      }
    }
  }
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

.error-tip {
  color: #e74c3c;
  font-size: 22rpx;
  margin: 8rpx 0 8rpx 20rpx;
  line-height: 1.5;
}
</style>
