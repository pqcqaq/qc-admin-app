<route lang="json5">
{
  style: {
    navigationBarTitleText: '用户名',
    navigationBarLeftText: '取消',
    navigationBarTitleAlign: 'center',
    navigationBarRightButtonList: [
      {
        text: '完成',
        color: '#007aff',
        fontSize: '16',
      },
    ],
  },
}
</route>
<template>
  <view class="username-container">
    <view class="card">
      <wd-input
        v-model="currentUsername"
        placeholder="请输入用户名"
        clearable
        :rules="[{ required: true, message: '用户名不能为空' }]"
      ></wd-input>
    </view>
  </view>
</template>
<script lang="ts" setup>
const currentUsername = ref('王先生')
</script>
<style lang="scss" scoped>
.username-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f5f5f5;

  .card {
    background-color: #fff;
    padding: 30rpx 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  }
}
</style>
