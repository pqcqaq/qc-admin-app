<template>
  <view class="status_bar" :style="{ paddingTop: `${safeAreaInsets.top}px` }">
    <view
      class="status-bar-left"
      :class="{ pressed: isBackPressed }"
      @touchstart="isBackPressed = true"
      @touchend="isBackPressed = false"
      @touchcancel="isBackPressed = false"
    >
      <wd-icon name="thin-arrow-left" size="20px" color="#536387" @click="back" />
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
// 返回上一页
const back = () => {
  uni.switchTab({ url: '/pages/mine/index' })
}

const safeAreaInsets = uni.getSystemInfoSync().safeAreaInsets
</script>

<style lang="scss" scoped>
$background-color: rgb(248, 248, 248);

.status_bar {
  background: $background-color;
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
  .status-bar-left.pressed {
    background-color: rgba(0, 0, 0, 0.08); // 轻微加深效果
  }
}
</style>
