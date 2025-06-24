<template>
  <wd-config-provider :themeVars="theme">
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
import CustomTabBar from '@/custom-tab-bar/index.vue'
import { useTabbarStore } from '@/store/tabbar'
import { theme } from '@/data/theme'

const tabBarRef = ref()
const tabbarStore = useTabbarStore()

// 监听页面变化，更新tabbar状态
onMounted(() => {
  updateTabBarState()
})

onShow(() => {
  updateTabBarState()
})

// 页面卸载时清理动画状态
onUnmounted(() => {
  tabbarStore.stopAnimation()
})

const updateTabBarState = () => {
  nextTick(() => {
    if (tabBarRef.value) {
      // 如果是布局重新渲染且需要动画，使用新的动画方法
      if (tabbarStore.shouldAnimate && tabBarRef.value.triggerLayoutAnimation) {
        tabBarRef.value.triggerLayoutAnimation()
      } else {
        // 否则使用原有的初始化方法
        if (tabBarRef.value.initializeComponent) {
          tabBarRef.value.initializeComponent()
        } else if (tabBarRef.value.updateSelectedIndex) {
          tabBarRef.value.updateSelectedIndex()
        }
      }
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
