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
      <view class="card">
        <view class="label">
          <wd-icon name="note" size="25px" />
          <text class="text">{{ t('personal_info') }}</text>
        </view>
        <wd-icon name="arrow-right" size="20px" @click="handleProfileInfo" />
      </view>
      <!-- 帮助与反馈 -->
      <view class="card">
        <view class="label">
          <wd-icon name="evaluation" size="25px" />
          <text class="text">{{ t('help_and_feedback') }}</text>
        </view>
        <wd-icon name="arrow-right" size="20px" @click="handleFeedback" />
      </view>
      <!-- 隐私与协议 -->
      <view class="card">
        <view class="label">
          <wd-icon name="spool" size="25px" />
          <text class="text">{{ t('privacy_protocols') }}</text>
        </view>
        <wd-select-picker
          v-model="choice"
          use-default-slot
          :columns="columns"
          @confirm="handleConfirm"
          @clear="handleClear"
          type="radio"
        >
          <wd-icon name="arrow-right" size="20px" />
        </wd-select-picker>
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
    label: '隐私政策',
  },
  {
    value: '/pages/login/service',
    label: '用户协议',
  },
])
const handleConfirm = () => {
  uni.navigateTo({ url: choice.value })
  choice.value = '' // 清空选择
}
const handleClear = () => {
  choice.value = ''
}

// 清除缓存
const handleClearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除所有缓存吗？\n清除后需要重新登录',
    success: (res) => {
      if (res.confirm) {
        try {
          // 清除所有缓存
          uni.clearStorageSync()
          // 清除用户信息并跳转到登录页
          useUserStore().logout()
          toast.show('清除缓存成功')
        } catch (err) {
          console.error('清除缓存失败:', err)
          toast.error('清除缓存失败')
        }
      }
    },
  })
}
// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useUserStore().logout()
        hasLogin.value = false
        // 执行退出登录逻辑
        toast.show('退出登录成功')
      }
    },
  })
}
</script>

<style lang="scss" scoped>
$bg1-color: #3daa9a;
$bg2-color: #f5f5f5;
$font1-color: #ffffff;
$card-bg-color: #ffffff;
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
    padding: 20rpx;

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
        }
      }
    }
  }
}
</style>
