<template>
  <view class="status_bar" :style="{ paddingTop: `${safeAreaInsets.top}px` }">
    <view
      class="status-bar-left"
      :class="{ pressed: isBackPressed }"
      @touchstart="isBackPressed = true"
      @touchend="isBackPressed = false"
      @touchcancel="isBackPressed = false"
    >
      <wd-icon name="thin-arrow-left" size="20px" :color="fontSecondary" @click="back" />
    </view>
    <view class="status-bar-title">
      <slot name="title" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t
const isBackPressed = ref(false)

// 颜色常量
const fontSecondary = '#536387'

// 返回上一页
const back = () => {
  uni.navigateBack()
}

const safeAreaInsets = uni.getSystemInfoSync().safeAreaInsets
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

.status_bar {
  background: $bg-primary;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 998;
  transition-property: all;
  height: 88rpx;

  .status-bar-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .status-bar-left {
    margin-left: 25rpx;
  }
  .status-bar-left.pressed {
    background-color: rgba(0, 0, 0, 0.08); // 轻微加深效果
  }
}
</style>
