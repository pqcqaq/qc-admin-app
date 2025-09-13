<template>
  <view class="custom-tab-bar">
    <!-- 高亮条 -->
    <view
      class="highlight-bar"
      :class="{ 'no-transition': !tabbarStore.isAnimating }"
      :style="{ left: tabbarStore.highlightPosition + 'px' }"
    ></view>

    <!-- Tabbar项目 -->
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-item"
      :class="{ active: tabbarStore.selectedIndex === index }"
      @click="switchTab(item, index)"
    >
      <image
        :src="tabbarStore.selectedIndex === index ? item.selectedIconPath : item.iconPath"
        class="tab-icon"
      ></image>
      <text v-if="item.text" class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import { tabList, type TabItem } from '@/config/tabbar'
import { useTabbarStore } from '@/store/tabbar'

const tabbarStore = useTabbarStore()

// 切换tab
const switchTab = (item: TabItem, index: number) => {
  // 如果点击的是当前已选中的tab，直接返回
  if (tabbarStore.selectedIndex === index) {
    return
  }

  // 设置选中状态，启用动画
  tabbarStore.setSelectedIndex(index, true)

  // 页面跳转
  uni.switchTab({
    url: `/${item.pagePath}`,
  })
}

// 获取窗口宽度（不包含开发者工具控制台）
const getSystemInfo = () => {
  uni.getSystemInfo({
    success: (res) => {
      // 使用 windowWidth 而不是 screenWidth，避免包含开发者工具控制台宽度
      tabbarStore.setTabBarWidth(res.windowWidth)
    },
  })
}

// 监听页面切换，更新选中状态
const updateSelectedIndex = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage.route
    // 根据路由更新状态，不启用动画
    tabbarStore.updateSelectedIndexByRoute(currentRoute)
  }
}

// 初始化组件状态
const initializeComponent = () => {
  // 确保动画状态正确
  tabbarStore.stopAnimation()
  getSystemInfo()
  updateSelectedIndex()
}

// 新增：触发布局动画（用于layout重新渲染后）
const triggerLayoutAnimation = () => {
  // 先确保系统信息和选中状态正确
  getSystemInfo()
  updateSelectedIndex()

  // 然后触发动画
  nextTick(() => {
    tabbarStore.triggerLayoutAnimation()
  })
}

onMounted(() => {
  initializeComponent()
})

// 组件卸载时清理
onUnmounted(() => {
  tabbarStore.stopAnimation()
})

// 暴露给外部调用的方法
defineExpose({
  updateSelectedIndex,
  initializeComponent,
  triggerLayoutAnimation, // 新增暴露的方法
})
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: $tabbar-bg;
  border-top: 1px solid $border-light;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;

  // 高亮条样式
  .highlight-bar {
    position: absolute;
    top: 0;
    width: 30px;
    height: 3px;
    background: linear-gradient(90deg, $primary-color 0%, $primary-color 100%);
    border-radius: 0 0 1.5px 1.5px;
    transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: $tabbar-highlight-shadow;
    transform-origin: center;
    will-change: left;

    // 添加发光效果
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: inherit;
      border-radius: inherit;
      filter: blur(4px);
      opacity: 0.6;
      z-index: -1;
      transition: inherit;
    }

    // 禁用动画的类
    &.no-transition {
      transition: none !important;

      &::after {
        transition: none !important;
      }
    }
  }

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    position: relative;

    &:active {
      transform: scale(0.95);
    }

    .tab-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 3px;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .tab-text {
      font-size: 10px;
      color: $tabbar-text-inactive;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &.active {
      .tab-icon {
        transform: scale(1.1);
        filter: brightness(1.1);
      }

      .tab-text {
        color: $tabbar-text-active;
        font-weight: 500;
        transform: translateY(-1px);
      }

      // 添加活跃状态的背景光晕
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        background: $tabbar-active-bg;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        animation: activeGlow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }
  }
}

// 活跃状态的光晕动画
@keyframes activeGlow {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

// 为有底部安全区域的设备添加适配
.custom-tab-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
