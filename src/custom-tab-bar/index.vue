<template>
  <view class="custom-tab-bar">
    <!-- 高亮条 -->
    <view class="highlight-bar" :style="{ left: highlightPosition + 'px' }"></view>

    <!-- Tabbar项目 -->
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-item"
      :class="{ active: selectedIndex === index }"
      @click="switchTab(item, index)"
    >
      <image
        :src="selectedIndex === index ? item.selectedIconPath : item.iconPath"
        class="tab-icon"
      ></image>
      <text v-if="item.text" class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { tabList, tabBarConfig, type TabItem } from '@/config/tabbar'

const selectedIndex = ref(0)
const tabBarWidth = ref(375) // 默认屏幕宽度，后续会动态获取

// 计算高亮条位置
const highlightPosition = computed(() => {
  const itemWidth = tabBarWidth.value / tabList.length
  const centerPosition = selectedIndex.value * itemWidth + itemWidth / 2
  return centerPosition - 15 // 15为高亮条宽度的一半
})

// 切换tab
const switchTab = (item: TabItem, index: number) => {
  selectedIndex.value = index
  uni.switchTab({
    url: `/${item.pagePath}`,
  })
}

// 获取屏幕宽度
const getSystemInfo = () => {
  uni.getSystemInfo({
    success: (res) => {
      tabBarWidth.value = res.screenWidth
    },
  })
}

// 监听页面切换，更新选中状态
const updateSelectedIndex = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage.route

    const index = tabList.findIndex((item) => {
      const pagePath = item.pagePath.startsWith('/') ? item.pagePath.slice(1) : item.pagePath
      const route = currentRoute.startsWith('/') ? currentRoute.slice(1) : currentRoute
      return pagePath === route
    })

    if (index !== -1) {
      selectedIndex.value = index
    }
  }
}

onMounted(() => {
  getSystemInfo()
  updateSelectedIndex()
})

// 暴露给外部调用的方法
defineExpose({
  updateSelectedIndex,
})
</script>

<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #f8f8f8;
  border-top: 1px solid #e5e5e5;
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
    background: linear-gradient(90deg, #018d71 0%, #02a87a 100%);
    border-radius: 0 0 1.5px 1.5px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(1, 141, 113, 0.3);
  }

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: all 0.2s ease;
    cursor: pointer;

    &:active {
      transform: scale(0.95);
    }

    .tab-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 3px;
      transition: transform 0.2s ease;
    }

    .tab-text {
      font-size: 10px;
      color: #999999;
      transition: color 0.2s ease;
    }

    &.active {
      .tab-icon {
        transform: scale(1.1);
      }

      .tab-text {
        color: #018d71;
        font-weight: 500;
      }
    }
  }
}

// 为有底部安全区域的设备添加适配
.custom-tab-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
