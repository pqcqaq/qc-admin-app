<template>
  <wd-config-provider :themeVars="theme">
    <!-- 页面内容 -->
    <view
      class="page-content"
      :style="{
        paddingBottom: `${safeAreaInsets.bottom}px`,
        paddingTop: `${safeAreaInsets.top}px`,
        height: `calc(100vh - ${safeAreaInsets.bottom}px - ${safeAreaInsets.top}px)`,
      }"
    >
      <slot />
    </view>
    <wd-toast />
    <wd-message-box />
    <privacy-popup />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { theme } from '@/config/theme'
const safeAreaInsets = uni.getSystemInfoSync().safeAreaInsets

onMounted(() => {
  console.log('default layout', safeAreaInsets, top)
})
</script>

<style lang="scss" scoped></style>
