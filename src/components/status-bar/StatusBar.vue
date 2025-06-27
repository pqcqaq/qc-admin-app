<template>
  <view class="status_bar">
    <view class="status-bar-left">
      <slot name="left" />
    </view>
    <view class="status-bar-title">
      <slot name="title" />
    </view>
    <view class="status-bar-right">
      <slot name="right" />
    </view>
  </view>
</template>
<style lang="scss" scoped>
$background-color: rgb(248, 248, 248);
.status_bar {
  position: relative;
  background: $background-color;
  height: calc(73rpx + env(safe-area-inset-top));
  padding: 7rpx 3rpx;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 998;
  transition-property: all;

  .status-bar-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .status-bar-left {
    margin-left: 25rpx;
  }
  .status-bar-right {
    margin-right: 25rpx;
  }
}
</style>
