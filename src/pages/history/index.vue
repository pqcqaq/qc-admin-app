<route lang="json5">
{
  layout: 'tabbar',
}
</route>

<template>
  <view class="about-page">
    <view class="content">
      <text class="title">历史页面</text>
      <text class="subtitle">历史记录</text>
    </view>

    <!-- 功能入口 -->
    <view class="function-buttons">
      <button class="function-btn" @click="handler">跳转i18n测试</button>
      <button class="function-btn" @click="handlerMarkdown">跳转markdown测试</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const handler = () => {
  uni.navigateTo({
    url: '/pages/about/i18n',
  })
}

const handlerMarkdown = () => {
  uni.navigateTo({
    url: '/pages/markdown-demo/index',
  })
}
</script>

<style scoped lang="scss">
.about-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.content {
  padding: 60rpx 40rpx;
  text-align: center;

  .title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.function-buttons {
  padding: 40rpx;

  .function-btn {
    display: block;
    width: 100%;
    margin-bottom: 20rpx;
    padding: 30rpx;
    background: white;
    border: none;
    border-radius: 20rpx;
    font-size: 32rpx;
    color: #333;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
