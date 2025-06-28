<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
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
      <view class="card between">
        <text class="label">{{ t('avatar') }}</text>
        <view class="value arrow-right" @click="goTo('avatar')">
          <image class="avatar" :src="formData.avatar" />
          <wd-icon name="arrow-right" size="20" />
        </view>
      </view>

      <!-- 用户名 -->
      <view class="card between">
        <text class="label">{{ t('username') }}</text>
        <view class="value arrow-right" @click="goTo('username')">
          <text>{{ formData.nickname }}</text>
          <wd-icon name="arrow-right" size="20" />
        </view>
      </view>

      <!-- 联系电话 -->
      <view class="card between">
        <text class="label">{{ t('contact_number') }}</text>
        <view class="value arrow-right" @click="goTo('phone')">
          <text>+86 {{ formData.phoneNumber }}</text>
          <wd-icon name="arrow-right" size="20" />
        </view>
      </view>

      <!-- 性别（不可点） -->
      <view class="card between">
        <text class="label">{{ t('gender') }}</text>
        <view class="value">
          <text>{{ formData.gender }}</text>
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
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { toast } from '@/utils/toast'
import { useI18n } from 'vue-i18n'
import MineBar from '@/components/mine-bar/MineBar.vue'

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

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单数据
const gender = ref('')
if (userInfo.value.row.gender === 1) {
  gender.value = '男'
} else if (userInfo.value.row.gender === 0) {
  gender.value = '女'
} else {
  gender.value = '未填写'
}

const formData = ref({
  id: userInfo.value.row.id,
  avatar: userInfo.value.row.avatarUrl,
  nickname: userInfo.value.row.nickname,
  phoneNumber: userInfo.value.row.phoneNumber, //国际电话的问题，先写死+86
  gender: gender.value,
  //TODO:职位
  employeeStringId: userInfo.value.row.employeeStringId,
  //TODO:关联门店，用shopIdList想办法解决
})
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
$title-color: #536387;
.container {
  .status-bar-title {
    font-size: large;
    font-weight: bold;
    color: $title-color;
  }
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
}
</style>
