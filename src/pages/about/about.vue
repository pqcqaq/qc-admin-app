<route lang="json5">
{
  layout: 'tabbar',
}
</route>

<template>
  <view class="about-page">
    <view class="content">
      <text class="title">关于页面</text>
      <text class="subtitle">带高亮条的自定义TabBar</text>
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
@import '@/style/variables.scss';

.about-page {
  background: $bg-gray;
  min-height: 100vh;
}

.content {
  padding: 60rpx 40rpx;
  text-align: center;

  .title {
    display: block;
    font-size: $font-size-title;
    font-weight: bold;
    color: $font-primary;
    margin-bottom: 20rpx;
  }

  .subtitle {
    display: block;
    font-size: $font-size-base;
    color: $font-gray;
  }
}

.function-buttons {
  padding: 40rpx;

  .function-btn {
    display: block;
    width: 100%;
    margin-bottom: 20rpx;
    padding: 30rpx;
    background: $bg-white;
    border: none;
    border-radius: $radius-xl;
    font-size: $font-size-xl;
    color: $font-primary;
    box-shadow: $shadow-normal;

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
