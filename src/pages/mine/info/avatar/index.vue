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
        <text class="status-bar-title">{{ t('change_avatar') }}</text>
      </template>
      <template #right>
        <button
          class="status-bar-confirm-button"
          :class="{ disabled: !avatarId || uploading }"
          @click="handleFinish"
        >
          {{ uploading ? t('uploading') : t('finish') }}
        </button>
      </template>
    </StatusBar>

    <view class="avatar-container">
      <view class="card">
        <view class="upload-wrapper">
          <UploadFormItem
            v-model="avatarId"
            type="avatar"
            :limit="1"
            :max-size="5"
            :url="currentAvatarUrl"
            placeholder="点击上传头像"
            tip="支持jpg、png格式，文件大小不超过5MB"
            @upload-success="handleUploadSuccess"
            @upload-error="handleUploadError"
          />
        </view>

        <view v-if="avatarId && !uploading" class="success-tip">
          <wd-icon name="check-circle" color="#52c41a" size="32rpx" />
          <text class="success-text">{{ t('upload_success') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import StatusBar from '@/components/status-bar/StatusBar.vue'
import UploadFormItem from '@/components/upload/UploadFormItem.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store'
import { setUserAvatar } from 'qc-admin-api-common/user'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

const i18n = useI18n()
const t = i18n.t

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 响应式数据
const avatarId = ref<string>('')
const uploading = ref(false)
const currentAvatarUrl = computed(() => userInfo.value.avatar)

// 处理上传成功
const handleUploadSuccess = (files: any[]) => {
  userStore.setUserAvatar(files[0].url) // 更新store中的头像URL
  uploading.value = false

  if (files.length > 0) {
    const file = files[0]
    avatarId.value = file.id

    uni.showToast({
      title: t('upload_success'),
      icon: 'success',
    })
  }
}

// 处理上传错误
const handleUploadError = (error: Error) => {
  console.error('头像上传失败:', error)
  uploading.value = false

  uni.showToast({
    title: `${t('upload_failed')}: ${error.message}`,
    icon: 'none',
  })
}

// 完成设置头像
const handleFinish = async () => {
  if (!avatarId.value || uploading.value) {
    return
  }

  try {
    uni.showLoading({ title: t('setting_avatar') })

    // 调用设置头像接口
    const response = await setUserAvatar(userInfo.value.id, avatarId.value)

    // 检查响应是否成功
    if (response.success || response.code === 0) {
      // 更新本地用户信息 - 这里需要重新获取用户信息或者使用返回的数据
      // 暂时保持原有头像URL，实际应该从返回数据中获取新的头像URL
      // 或者调用获取用户信息接口来更新头像

      uni.hideLoading()
      uni.showModal({
        title: t('tip'),
        content: t('change_successfully'),
        showCancel: false,
        confirmColor: '#3daa9a',
        success: () => {
          uni.navigateBack()
        },
      })
    } else {
      throw new Error(response.message || response.data || '设置头像失败')
    }
  } catch (error: any) {
    console.error('设置头像失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: `${t('setting_failed')}: ${error.message || error.data || '未知错误'}`,
      icon: 'none',
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

.container {
  height: 100%;
  background-color: $bg-primary;

  .status-bar-title {
    font-size: large;
    font-weight: bold;
    color: $font-secondary;
  }

  .status-bar-confirm-button {
    display: flex;
    width: 95rpx;
    height: 50rpx;
    background-color: $primary-color;
    color: $font-white;
    border-radius: $radius-xs;
    padding: 10rpx 20rpx;
    font-size: 24rpx;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;

    &.disabled {
      opacity: $opacity-disabled;
      background-color: $color-disabled;
    }
  }

  .avatar-container {
    display: flex;
    flex-direction: column;
    padding: 40rpx;

    .card {
      background-color: $bg-white;
      padding: 60rpx 40rpx;
      border-radius: $radius-lg;
      box-shadow: $shadow-heavy;
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .upload-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 40rpx;
      }

      .success-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20rpx;
        padding: 16rpx 24rpx;
        background-color: #f6ffed;
        border: 2rpx solid #b7eb8f;
        border-radius: 8rpx;

        .success-text {
          margin-left: 8rpx;
          font-size: $font-size-base;
          color: $color-success;
        }
      }
    }
  }
}
</style>
