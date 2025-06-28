<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
}
</route>

<template>
  <!-- <view class="profile-container">

    <view class="user-info-section">
      <button class="avatar-button" open-type="chooseAvatar">
        <wd-img :src="userInfo.avatarUrl" width="80px" height="80px" radius="50%"></wd-img>
      </button>

      <view class="user-details">
        <view class="username">{{ userInfo.nickname }}</view>
        <view class="user-id">ID: {{ userInfo.id }}</view>
      </view>
    </view>

    
    <view class="function-section">
      <view class="cell-group">
        <view class="group-title">账号管理</view>
        <wd-cell title="个人资料" is-link @click="handleProfileInfo">
          <template #icon>
            <wd-icon name="user" size="20px"></wd-icon>
          </template>
        </wd-cell>
        <wd-cell title="账号安全" is-link @click="handlePassword">
          <template #icon>
            <wd-icon name="lock-on" size="20px"></wd-icon>
          </template>
        </wd-cell>
      </view>

      <view class="cell-group">
        <view class="group-title">通用设置</view>
        <wd-cell title="消息通知" is-link @click="handleInform">
          <template #icon>
            <wd-icon name="notification" size="20px"></wd-icon>
          </template>
        </wd-cell>
        <wd-cell title="清理缓存" is-link @click="handleClearCache">
          <template #icon>
            <wd-icon name="clear" size="20px"></wd-icon>
          </template>
        </wd-cell>
        <wd-cell title="应用更新" is-link @click="handleAppUpdate">
          <template #icon>
            <wd-icon name="refresh1" size="20px"></wd-icon>
          </template>
        </wd-cell>
        <wd-cell title="关于我们" is-link @click="handleAbout">
          <template #icon>
            <wd-icon name="info-circle" size="20px"></wd-icon>
          </template>
        </wd-cell>
      </view>

      <view class="logout-button-wrapper">
        <wd-button type="error" v-if="hasLogin" block @click="handleLogout">退出登录</wd-button>
        <wd-button type="primary" v-else block @click="handleLogin">登录</wd-button>
      </view>
    </view>
  </view> -->
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
        <text>ccc</text>
      </view>
    </view>
    <view class="function-section"></view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import { useToast } from 'wot-design-uni'
import { useUpload } from '@/utils/uploadFile'
import { storeToRefs } from 'pinia'

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
// 账号安全
const handlePassword = () => {
  uni.navigateTo({ url: `/pages/mine/password/index` })
}
// 消息通知
const handleInform = () => {
  // uni.navigateTo({ url: `/pages/mine/inform/index` })
  toast.show('功能开发中')
}
// 应用更新
const handleAppUpdate = () => {
  // #ifdef MP
  // #ifndef MP-HARMONY
  const updateManager = uni.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    // console.log(res.hasUpdate)
    if (res.hasUpdate) {
      toast.show('检测到新版本，正在下载中...')
    } else {
      toast.show('已是最新版本')
    }
  })
  updateManager.onUpdateReady(function (res) {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      },
    })
  })
  updateManager.onUpdateFailed(function (res) {
    // 新的版本下载失败
    toast.error('新版本下载失败')
  })
  // #endif
  // #endif

  // #ifndef MP
  toast.show('功能开发中')
  // #endif
}
// 关于我们
const handleAbout = () => {
  uni.navigateTo({ url: `/pages/mine/about/index` })
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
.container {
  .user-info-section {
    background: $bg1-color;
    height: 550rpx;
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
      font-size: 35rpx;
      color: $font1-color;
    }
  }
  .function-section {
    background: $bg2-color;
    height: 100rpx;
  }
}
/* 基础样式 */
// .profile-container {
//   overflow: hidden;
//   font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
//   background-color: #f7f8fa;
// }
// /* 用户信息区域 */
// .user-info-section {
//   display: flex;
//   align-items: center;
//   padding: 40rpx;
//   margin: 30rpx 30rpx 20rpx;
//   background-color: #fff;
//   border-radius: 24rpx;
//   box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
//   transition: all 0.3s ease;
// }

// .avatar-wrapper {
//   width: 160rpx;
//   height: 160rpx;
//   margin-right: 40rpx;
//   overflow: hidden;
//   border: 4rpx solid #f5f5f5;
//   border-radius: 50%;
//   box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
// }
// .avatar-button {
//   height: 160rpx;
//   padding: 0;
//   margin-right: 40rpx;
//   overflow: hidden;
//   border: 4rpx solid #f5f5f5;
//   border-radius: 50%;
//   box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
// }
// .user-details {
//   flex: 1;
// }

// .username {
//   margin-bottom: 12rpx;
//   font-size: 38rpx;
//   font-weight: 600;
//   color: #333;
//   letter-spacing: 0.5rpx;
// }

// .user-id {
//   font-size: 28rpx;
//   color: #666;
// }

// .user-created {
//   margin-top: 8rpx;
//   font-size: 24rpx;
//   color: #999;
// }
// /* 功能区块 */
// .function-section {
//   padding: 0 20rpx;
//   margin-top: 20rpx;
// }

// .cell-group {
//   margin-bottom: 20rpx;
//   overflow: hidden;
//   background-color: #fff;
//   border-radius: 16rpx;
//   box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
// }

// .group-title {
//   padding: 24rpx 30rpx 16rpx;
//   font-size: 30rpx;
//   font-weight: 500;
//   color: #999;
//   background-color: #fafafa;
// }

// :deep(.wd-cell) {
//   border-bottom: 1rpx solid #f5f5f5;

//   &:last-child {
//     border-bottom: none;
//   }

//   .wd-cell__title {
//     margin-left: 5px;
//     font-size: 32rpx;
//     color: #333;
//   }

//   .cell-icon {
//     margin-right: 20rpx;
//     font-size: 36rpx;
//   }
// }
// /* 退出登录按钮 */
// .logout-button-wrapper {
//   padding: 40rpx 30rpx;
// }

// :deep(.wd-button--danger) {
//   height: 88rpx;
//   font-size: 32rpx;
//   line-height: 88rpx;
//   color: #fff;
//   background-color: #f53f3f;
//   border-radius: 44rpx;
// }
</style>
