<template>
  <view class="status_bar" :style="{ paddingTop: `${safeAreaInsets.top}px` }">
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

const safeAreaInsets = uni.getSystemInfoSync().safeAreaInsets

// 返回上一页
const back = () => {
  uni.navigateBack()
}

const isBackPressed = ref(false)
</script>

<style lang="scss" scoped>
$background-color: rgb(248, 248, 248);
$font-color: #536387;
.status_bar {
  position: relative;
  background: $background-color;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  transition-property: all;
  height: 88rpx;

  .status-bar-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .status-bar-left {
    margin-left: 25rpx;
    // 上下居中
    display: flex;
    align-items: center;
    justify-content: center;
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
