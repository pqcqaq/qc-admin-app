<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
}
</route>

<template>
  <view class="container">
    <view class="user-info-section">
      <wd-img
        :src="userInfo.row.avatarUrl"
        width="200rpx"
        height="200rpx"
        radius="50%"
        class="avatar-wrapper"
      />
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
          <wd-icon name="note" size="25px" />
          <text class="text">{{ t('personal_info') }}</text>
        </view>
        <wd-icon name="arrow-right" size="20px" />
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
          <wd-icon name="evaluation" size="25px" />
          <text class="text">{{ t('help_and_feedback') }}</text>
        </view>
        <wd-icon name="arrow-right" size="20px" />
      </view>
      <!-- 隐私与协议 -->
      <view
        class="picker-card"
        :class="{ pressed: isPressed3 }"
        @touchstart="isPressed3 = true"
        @touchend="isPressed3 = false"
        @touchcancel="isPressed3 = false"
      >
        <wd-select-picker
          class="picker"
          v-model="choice"
          use-default-slot
          :columns="columns"
          @confirm="handleConfirm"
          @clear="handleClear"
          type="radio"
        >
          <view class="picker-content">
            <view class="picker-label">
              <wd-icon name="spool" size="25px" />
              <text class="picker-text">{{ t('privacy_protocols') }}</text>
            </view>
            <wd-icon name="arrow-right" size="20px" />
          </view>
        </wd-select-picker>
      </view>

      <!-- 退出登录 -->
      <view class="button">
        <wd-button class="button-section" type="info" @click="handleLogout">
          <text>{{ t('logout') }}</text>
        </wd-button>
      </view>

      <!-- 版本 -->
      <view class="version">
        <text>{{ t('version') }}:V 1.4.21</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import { useToast } from 'wot-design-uni'
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
const toast = useToast()
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
const choice = ref('')
const columns = ref<Record<string, any>[]>([
  {
    value: '/pages/login/privacy',
    label: t('privacy_policy'),
  },
  {
    value: '/pages/login/service',
    label: t('user_protocol'),
  },
])
const handleConfirm = () => {
  uni.navigateTo({ url: choice.value })
  choice.value = '' // 清空选择
}
const handleClear = () => {
  choice.value = ''
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
        toast.show(t('logout_successful'))
        uni.navigateTo({
          url: '/pages/login/index',
        })
      }
    },
  })
}
</script>

<style lang="scss" scoped>
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
    height: 35vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar-wrapper {
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      margin-top: 100rpx;
    }
    .nick-name {
      margin-top: 50rpx;
      font-size: 40rpx;
      color: $font1-color;
      font-weight: bold;
    }
    .company-name {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      font-size: 35rpx;
      color: $font1-color;
    }
  }
  .function-section {
    background: $bg2-color;
    height: 65vh;
    padding: 60rpx 20rpx 0rpx;

    .card {
      background-color: $card-bg-color;
      padding: 30rpx 20rpx;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        display: flex;
        .text {
          margin-left: 60rpx;
          font-size: large;
          color: $font2-color;
        }
      }
    }

    .card.pressed {
      background-color: $press-color;
    }

    .picker-card.pressed {
      background-color: $press-color;
    }
    .picker-card {
      background-color: $card-bg-color;
      padding: 30rpx 20rpx;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .picker {
        width: 100%;
        .picker-content {
          display: flex;
          justify-content: space-between;
          .picker-label {
            display: flex;
            .picker-text {
              margin-left: 60rpx;
              font-size: large;
              color: $font2-color;
            }
          }
        }
      }
    }

    .button {
      display: flex;
      justify-content: center;
      margin-top: 130rpx;
      .button-section {
        color: $font2-color;
        background: $card-bg-color;
        font-size: 35rpx;
        width: 70%;
        height: 120rpx;
      }
    }
    .version {
      display: flex;
      justify-content: center;
      margin-top: 50rpx;
      font-size: 30rpx;
      color: $font3-color;
    }
  }
}

::v-deep .page-content {
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
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
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.group-title {
  padding: 24rpx 30rpx 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: #999;
  background-color: #fafafa;
}

:deep(.wd-cell) {
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .wd-cell__title {
    margin-left: 10rpx;
    font-size: 32rpx;
    color: #333;
  }

  .cell-icon {
    margin-right: 20rpx;
    font-size: 36rpx;
  }
}
/* 退出登录按钮 */
.logout-button-wrapper {
  padding: 40rpx 30rpx;
}

:deep(.wd-button--danger) {
  height: 88rpx;
  font-size: 32rpx;
  line-height: 88rpx;
  color: #fff;
  background-color: #f53f3f;
  border-radius: 44rpx;
}
</style>
