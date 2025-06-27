<template>
  <view class="status_bar">
    <view class="status-bar-left">
      <wd-button type="text" class="status_bar_back_button" @click="back">
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
  uni.navigateTo({ url: '/pages/mine/index' })
}
</script>

<style lang="scss" scoped>
$background-color: rgb(248, 248, 248);
$font-color: #536387;
</style>
