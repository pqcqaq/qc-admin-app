<template>
  <view class="status_bar">
    <view
      class="status-bar-left"
      :class="{ pressed: isBackPressed }"
      @touchstart="isBackPressed = true"
      @touchend="isBackPressed = false"
      @touchcancel="isBackPressed = false"
      @click="back"
    >
      <wd-button type="text" class="status-bar-back-button" @click="back">
        {{ t('cancel') }}
      </wd-button>
    </view>
    <view class="status-bar-title">
      <slot name="title" />
    </view>
    <view class="status-bar-right">
      <slot name="right" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const t = i18n.t

// 返回上一页
const back = () => {
  uni.navigateTo({ url: '/pages/mine/info/index' })
}

const isBackPressed = ref(false)
</script>

<style lang="scss" scoped>
$background-color: rgb(248, 248, 248);
$font-color: #536387;
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

    .status-bar-back-button {
      color: $font-color;
    }
  }

  .status-bar-left.pressed {
    background-color: rgba(0, 0, 0, 0.08); // 轻微加深效果
  }
  .status-bar-right {
    margin-right: 25rpx;
  }
}
</style>
