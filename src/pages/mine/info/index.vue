<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
  layout: 'default',
}
</route>

<template>
  <view class="container">
    <MineBar>
      <template #title>
        <text class="status-bar-title">{{ t('personal_information') }}</text>
      </template>
    </MineBar>
    <view class="personal-info-container">
      <!-- 头像 -->
      <view
        class="card between"
        @click="goTo('avatar')"
        :class="{ pressed: isAvatarPressed }"
        @touchstart="isAvatarPressed = true"
        @touchend="isAvatarPressed = false"
        @touchcancel="isAvatarPressed = false"
      >
        <text class="label">{{ t('avatar') }}</text>
        <view class="value arrow-right">
          <image class="avatar" :src="userInfo.avatar" />
          <wd-icon name="arrow-right" size="16" />
        </view>
      </view>

      <!-- 用户名 -->
      <view
        class="card between"
        @click="goTo('username')"
        :class="{ pressed: isNicknamePressed }"
        @touchstart="isNicknamePressed = true"
        @touchend="isNicknamePressed = false"
        @touchcancel="isNicknamePressed = false"
      >
        <text class="label">{{ t('username') }}</text>
        <view class="value arrow-right">
          <text>{{ userInfo.name }}</text>
          <wd-icon name="arrow-right" size="16" />
        </view>
      </view>

      <!-- 联系电话 -->
      <!-- <view
        class="card between"
        @click="goTo('phone')"
        :class="{ pressed: isPhonePressed }"
        @touchstart="isPhonePressed = true"
        @touchend="isPhonePressed = false"
        @touchcancel="isPhonePressed = false"
      >
        <text class="label">{{ t('contact_number') }}</text>
        <view class="value arrow-right">
          <text>+86 {{ formData.phoneNumber }}</text>
          <wd-icon name="arrow-right" size="20" />
        </view>
      </view> -->

      <!-- 性别（不可点） -->
      <view class="card between">
        <text class="label">{{ t('gender') }}</text>
        <view class="value">
          <text>{{ gender }}</text>
        </view>
      </view>

      <!-- 职位 -->
      <!-- <view class="card between">
        <text class="label">{{ t('position') }}</text>
        <view class="value">
          <text>{{ formData.role }}</text>
        </view>
      </view> -->

      <!-- 工号 -->
      <!-- <view class="card between">
        <text class="label">{{ t('employee_number') }}</text>
        <view class="value">
          <text>{{ formData.employeeStringId }}</text>
        </view>
      </view> -->

      <!-- 修改密码 -->
      <view class="item_title">
        <text>{{ t('change_password') }}</text>
      </view>
      <view
        class="card between"
        @click="goTo('password')"
        :class="{ pressed: isPasswordPressed }"
        @touchstart="isPasswordPressed = true"
        @touchend="isPasswordPressed = false"
        @touchcancel="isPasswordPressed = false"
      >
        <text class="label">{{ t('change_password') }}</text>
        <view class="value arrow-right">
          <wd-icon name="arrow-right" size="16" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import MineBar from '@/components/mine-bar/MineBar.vue'

const i18n = useI18n()
const t = i18n.t

const isAvatarPressed = ref(false)
const isNicknamePressed = ref(false)
const isPhonePressed = ref(false)
const isPasswordPressed = ref(false)

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单数据
const gender = ref('')
if (userInfo.value.sex === 'male') {
  gender.value = t('man')
} else if (userInfo.value.sex === 'female') {
  gender.value = t('woman')
} else {
  gender.value = t('not_filled')
}

// 跳转到其他页面
const goTo = (type: string) => {
  const routeMap = {
    avatar: '/pages/mine/info/avatar/index',
    username: '/pages/mine/info/username/index',
    phone: '/pages/mine/info/phone/index',
    password: '/pages/mine/info/password/index',
  }
  uni.navigateTo({
    url: routeMap[type],
  })
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
  .personal-info-container {
    display: flex;
    flex-direction: column;
    padding: 20rpx;

    .item_title {
      font-size: $font-size-sm;
      color: $font-primary;
      margin-top: 20rpx;
      margin-bottom: 10rpx;
      padding-left: 10rpx;
    }

    .between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pressed {
      background-color: $color-active;
    }

    .card {
      background-color: $bg-white;
      padding: 22rpx 18rpx;
      border-radius: $radius-base;
      margin-bottom: 20rpx;
      box-shadow: $shadow-normal;

      &:hover {
        background-color: $color-active;
      }

      .label {
        font-size: $font-size-base;
        color: $font-primary;
      }

      .value {
        display: flex;
        align-items: center;
        font-size: $font-size-base;
        color: $font-gray;

        .avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          margin-right: 10rpx;
        }
      }

      .arrow-right wd-icon {
        margin-left: 10rpx;
      }
    }

    .shop-card {
      background-color: $bg-white;
      padding: 10rpx 20rpx;
      border-radius: $radius-base;
      margin-bottom: 20rpx;
      box-shadow: $shadow-normal;

      .shop-name {
        font-size: $font-size-base;
        color: $font-primary;
        font-weight: bold;
      }

      .shop-address {
        font-size: $font-size-sm;
        color: $font-disabled;
        word-break: break-all;
      }
    }
  }
}
::v-deep .page-content {
  padding: 0;
}
</style>
