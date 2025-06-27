<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人资料',
  },
}
</route>

<!-- <template>
  <view class="profile-info-container">
    <view class="profile-card">
      <view class="form-wrapper">
        <wd-form ref="formRef" :model="formData" label-width="160rpx" class="profile-form">
          <wd-cell-group class="form-group">
            <view class="sex-field">
              <text class="field-label">昵称</text>
              <wd-input
                prop="name"
                clearable
                v-model="formData.name"
                placeholder="请输入昵称"
                :rules="[{ required: true, message: '请填写昵称' }]"
                class="form-input"
              />
            </view>

            <view class="sex-field">
              <text class="field-label">性别</text>
              <wd-radio-group
                v-model="formData.gender"
                shape="button"
                :rules="[{ required: true, message: '请选择性别' }]"
              >
                <wd-radio :value="'1'">男</wd-radio>
                <wd-radio :value="'0'">女</wd-radio>
              </wd-radio-group>
            </view>
          </wd-cell-group>
        </wd-form>
      </view>
    </view>
  </view>
</template> -->
<template>
  <view class="personal-info-container">
    <!-- 头像 -->
    <view class="card between">
      <text class="label">{{ t('avatar') }}</text>
      <view class="value arrow-right" @click="goTo('avatar')">
        <image class="avatar" src="/src/static/icon/user_icon.svg" />
        <wd-icon name="arrow-right" size="20" />
      </view>
    </view>

    <!-- 用户名 -->
    <view class="card between">
      <text class="label">{{ t('username') }}</text>
      <view class="value arrow-right" @click="goTo('username')">
        <text>王先生</text>
        <wd-icon name="arrow-right" size="20" />
      </view>
    </view>

    <!-- 联系电话 -->
    <view class="card between">
      <text class="label">{{ t('contact_number') }}</text>
      <view class="value arrow-right" @click="goTo('phone')">
        <text>+86 199xxxxxxx</text>
        <wd-icon name="arrow-right" size="20" />
      </view>
    </view>

    <!-- 性别（不可点） -->
    <view class="card between">
      <text class="label">{{ t('gender') }}</text>
      <view class="value">
        <text>男</text>
      </view>
    </view>

    <!-- 职位 -->
    <view class="card between">
      <text class="label">{{ t('position') }}</text>
      <view class="value">
        <text>店长</text>
      </view>
    </view>

    <!-- 工号 -->
    <view class="card between">
      <text class="label">{{ t('employee_number') }}</text>
      <view class="value">
        <text>12345</text>
      </view>
    </view>

    <!-- 修改密码 -->
    <view class="item_title">
      <text>{{ t('change_password') }}</text>
    </view>
    <view class="card between">
      <text class="label">{{ t('change_password') }}</text>
      <view class="value arrow-right" @click="goTo('password')">
        <wd-icon name="arrow-right" size="20" />
      </view>
    </view>

    <!-- 关联门店 -->
    <view class="item_title">
      <text>{{ t('related_stores') }}</text>
    </view>
    <view v-for="item in itemList">
      <view class="store-card" :key="item.id">
        <view class="store-name">{{ item.name }}</view>
        <view class="store-address">{{ item.address }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { toast } from '@/utils/toast'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t

const itemList = ref([
  { id: 1, name: '101门店', address: '地址Axxxxxxxxxxxxx' },
  { id: 2, name: '102门店', address: '地址Bxxxxxxxxxxxxxxxxxxx' },
  { id: 3, name: '103门店', address: '地址Cxxxxxxxxxxxxx' },
  { id: 4, name: '104门店', address: '地址Dxxxxxxxxxxxxxxxxxxx' },
  { id: 5, name: '105门店', address: '地址Exxxxxxxxxxxxxxx' },
  {
    id: 6,
    name: '106门店',
    address: '地址word1word2word3word4word5word6word7word8wor-d9word10xxxxxxxxxxxxxx',
  },
])
// 表单引用
const formRef = ref()

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单数据
const formData = ref({
  id: userInfo.value.id,
  name: userInfo.value.name,
  gender: userInfo.value.gender,
})
// 跳转到其他页面
const goTo = (type: string) => {
  const routeMap = {
    avatar: '/pages/user/avatar',
    username: '/pages/mine/info/username/index',
    phone: '/pages/mine/info/phone/index',
    password: '/pages/user/password',
  }
  uni.navigateTo({
    url: routeMap[type],
  })
}
</script>

<!-- <style lang="scss" scoped>
.profile-info-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 30rpx;
}

.profile-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  padding: 40rpx 30rpx 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
  padding-bottom: 16rpx;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(90deg, #4a7bff, #6a5acd);
    border-radius: 6rpx;
  }
}

.form-wrapper {
  padding: 30rpx;
}

.form-group {
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.form-input {
  font-size: 30rpx;
}

.sex-field {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background-color: #ffffff;
}

.field-label {
  width: 160rpx;
  font-size: 30rpx;
  color: #333;
}

.radio-group {
  flex: 1;
  display: flex;
  gap: 20rpx;
}

.radio-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 12rpx;
  background-color: #f5f7fa;

  &:active {
    opacity: 0.8;
  }
}

.form-actions {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.submit-btn {
  height: 90rpx;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: 500;
  background: linear-gradient(135deg, #4a7bff, #6a5acd);
  box-shadow: 0 8rpx 16rpx rgba(74, 123, 255, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 8rpx rgba(74, 123, 255, 0.15);
  }
}
</style> -->
<style lang="scss" scoped>
.personal-info-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f5f5f5;

  .item_title {
    font-size: 24rpx;
    color: #333;
    margin-top: 20rpx;
    margin-bottom: 10rpx;
    padding-left: 10rpx;
  }

  .between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card {
    background-color: #fff;
    padding: 30rpx 20rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);

    .label {
      font-size: 28rpx;
      color: #333;
    }

    .value {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #666;

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

  .store-card {
    background-color: #fff;
    padding: 10rpx 20rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);

    .store-name {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
    }

    .store-address {
      font-size: 24rpx;
      color: #999;
      word-break: break-all;
    }
  }
}
</style>
