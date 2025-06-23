<template>
  <wd-config-provider :themeVars="themeVars">
    <view class="tabbar-layout">
      <!-- 页面内容 -->
      <view class="page-content">
        <slot />
      </view>

      <!-- 自定义tabbar -->
      <CustomTabBar ref="tabBarRef" />
    </view>

    <wd-toast />
    <wd-message-box />
    <privacy-popup />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'
import CustomTabBar from '@/custom-tab-bar/index.vue'

const themeVars: ConfigProviderThemeVars = {
  // colorTheme: 'red',
  // buttonPrimaryBgColor: '#07c160',
  // buttonPrimaryColor: '#07c160',
}

const tabBarRef = ref()

// 监听页面变化，更新tabbar状态
onMounted(() => {
  updateTabBarState()
})

onShow(() => {
  updateTabBarState()
})

const updateTabBarState = () => {
  nextTick(() => {
    if (tabBarRef.value && tabBarRef.value.updateSelectedIndex) {
      tabBarRef.value.updateSelectedIndex()
    }
  })
}
</script>

<style lang="scss" scoped>
.tabbar-layout {
  min-height: 100vh;
  position: relative;
}

.page-content {
  padding-bottom: 50px; /* tabbar高度 */
  padding-bottom: calc(50px + env(safe-area-inset-bottom)); /* 添加安全区域 */
}
</style>
