<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
  needLogin: true,
}
</route>

<template>
  <view class="container">
    <view class="user-info-section">
      <image :src="userInfo.row.avatarUrl" class="avatar-wrapper" />
      <view class="nick-name">
        <text>{{ userInfo.row.nickname }}</text>
      </view>
      <view class="company-name">
        <text>{{ userInfo.row.customerOrganization.name }}</text>
      </view>
    </view>
    <view class="function-section">
      <!-- 个人资料 -->
      <view
        class="card"
        @click="handleProfileInfo"
        :class="{ pressed: isPressed1 }"
        @touchstart="isPressed1 = true"
        @touchend="isPressed1 = false"
        @touchcancel="isPressed1 = false"
      >
        <view class="label">
          <wd-icon name="note" size="50rpx" />
          <text class="text">{{ t('personal_info') }}</text>
        </view>
        <wd-icon name="arrow-right" size="40rpx" />
      </view>
      <!-- 帮助与反馈 -->
      <view
        class="card"
        @click="handleFeedback"
        :class="{ pressed: isPressed2 }"
        @touchstart="isPressed2 = true"
        @touchend="isPressed2 = false"
        @touchcancel="isPressed2 = false"
      >
        <view class="label">
          <wd-icon name="evaluation" size="50rpx" />
          <text class="text">{{ t('help_and_feedback') }}</text>
        </view>
        <wd-icon name="arrow-right" size="40rpx" />
      </view>
      <!-- 隐私与协议 -->
      <view
        class="card"
        @click="handlePrivacyProtocols"
        :class="{ pressed: isPressed3 }"
        @touchstart="isPressed3 = true"
        @touchend="isPressed3 = false"
        @touchcancel="isPressed3 = false"
      >
        <view class="label">
          <wd-icon name="spool" size="50rpx" />
          <text class="text">{{ t('privacy_protocols') }}</text>
        </view>
        <wd-icon name="arrow-right" size="40rpx" />
      </view>

      <!-- 退出登录 -->
      <view class="button">
        <view class="custom-button" @click="handleLogout">
          <text>{{ t('logout') }}</text>
        </view>
      </view>

      <!-- 版本 -->
      <view class="version">
        <text>{{ t('version') }}: V1.4.21</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import { toast } from '@/utils/toast'
import { useUpload } from '@/utils/uploadFile'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const isPressed1 = ref(false)
const isPressed2 = ref(false)
const isPressed3 = ref(false)

const i18n = useI18n()
const t = i18n.t

const userStore = useUserStore()
// 使用storeToRefs解构userInfo
const { userInfo } = storeToRefs(userStore)
const hasLogin = ref(false)

onShow((options) => {
  hasLogin.value = !!uni.getStorageSync('token')
  console.log('个人中心onShow', hasLogin.value, options)
})

// 个人资料
const handleProfileInfo = () => {
  uni.navigateTo({ url: `/pages/mine/info/index` })
}

// 帮助与反馈
const handleFeedback = () => {
  uni.navigateTo({ url: `/pages/mine/feedback/index` })
}

// 隐私与协议
const handlePrivacyProtocols = () => {
  uni.showActionSheet({
    itemList: [t('privacy_policy'), t('user_protocol')],
    success: (res) => {
      const urls = ['/pages/login/privacy', '/pages/login/service']
      uni.navigateTo({ url: urls[res.tapIndex] })
    },
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: t('tip'),
    content: t('are_you_sure_you_want_to_logout'),
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useUserStore().logout()
        hasLogin.value = false
        // 执行退出登录逻辑
        toast.success(t('logout_successful'))
        uni.navigateTo({
          url: '/pages/login/index',
        })
      }
    },
  })
}
</script>

<style lang="scss">
$bg1-color: #3daa9a;
$bg2-color: #f5f5f5;
$font1-color: #ffffff;
$font2-color: #536387;
$font3-color: #767e8c;
$card-bg-color: #ffffff;
$press-color: #e5e5e5;

.container {
  .user-info-section {
    background: $bg1-color;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60rpx;
    padding-bottom: 60rpx;

    .avatar-wrapper {
      /* 小程序兼容的阴影效果 */
      /* #ifdef MP-WEIXIN */
      border: 4rpx solid rgba(255, 255, 255, 0.1);
      /* #endif */
      /* #ifndef MP-WEIXIN */
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      /* #endif */
      height: 200rpx;
      width: 200rpx;
      border-radius: 100rpx;
      margin-top: 60rpx;
      overflow: hidden;
      flex-shrink: 0;
    }
    .nick-name {
      margin-top: 50rpx;
      font-size: 40rpx;
      color: $font1-color;
      font-weight: bold;
      text-align: center;
      word-break: break-all;
    }
    .company-name {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      font-size: 32rpx;
      color: $font1-color;
      text-align: center;
      word-break: break-all;
      padding: 0 40rpx;
    }
  }
  .function-section {
    background: $bg2-color;
    padding: 60rpx 40rpx 60rpx;

    .card {
      background-color: $card-bg-color;
      padding: 40rpx 30rpx;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      /* 小程序兼容的阴影效果 */
      /* #ifdef MP-WEIXIN */
      border: 1rpx solid #f0f0f0;
      /* #endif */
      /* #ifndef MP-WEIXIN */
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
      /* #endif */
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.3s;

      .label {
        display: flex;
        align-items: center;
        .text {
          margin-left: 60rpx;
          font-size: 32rpx;
          color: $font2-color;
        }
      }
    }

    .card.pressed {
      background-color: $press-color;
    }

    .button {
      display: flex;
      justify-content: center;
      margin-top: 100rpx;

      .custom-button {
        color: $font2-color;
        background: $card-bg-color;
        font-size: 32rpx;
        width: 70%;
        height: 100rpx;
        border-radius: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        /* 小程序兼容的阴影效果 */
        /* #ifdef MP-WEIXIN */
        border: 1rpx solid #f0f0f0;
        /* #endif */
        /* #ifndef MP-WEIXIN */
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        /* #endif */

        &:active {
          transform: scale(0.98);
          background-color: #f5f5f5;
        }
      }
    }

    .version {
      display: flex;
      justify-content: center;
      margin-top: 60rpx;
      font-size: 28rpx;
      color: $font3-color;
    }
  }
}

/* 深度选择器优化 */
:deep(.page-content) {
  padding: 0;
  overflow: hidden;
  /* #ifndef MP-WEIXIN */
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  /* #endif */
}

.user-details {
  flex: 1;
}

.username {
  margin-bottom: 12rpx;
  font-size: 38rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.5rpx;
}

.user-id {
  font-size: 28rpx;
  color: #666;
}

.user-created {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}

/* 功能区块 */
.function-section {
  padding: 0 20rpx;
  margin-top: 20rpx;
}

.cell-group {
  margin-bottom: 20rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 16rpx;
  /* #ifndef MP-WEIXIN */
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  /* #endif */
}

.group-title {
  padding: 24rpx 30rpx 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: #999;
  background-color: #fafafa;
}
</style>
