<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
  layout: 'tabbar',
}
</route>
<template>
  <view class="index-page">
    <view class="header">
      <text class="title">Tabbar 动画测试</text>
    </view>

    <view class="content">
      <view class="status-info">
        <text class="info-text">当前选中: {{ tabbarStore.selectedIndex }}</text>
        <text class="info-text">上次选中: {{ tabbarStore.previousSelectedIndex }}</text>
        <text class="info-text">是否在动画: {{ tabbarStore.isAnimating ? '是' : '否' }}</text>
        <text class="info-text">已初始化: {{ tabbarStore.hasBeenInitialized ? '是' : '否' }}</text>
      </view>

      <view class="button-group">
        <button
          v-for="(tab, index) in tabList"
          :key="index"
          class="test-button"
          :class="{ active: tabbarStore.selectedIndex === index }"
          @click="switchToTab(index)"
        >
          切换到 {{ tab.text }}
        </button>
      </view>

      <view class="test-buttons">
        <button class="test-button reset" @click="resetAnimation">重置动画状态</button>
        <button class="test-button trigger" @click="triggerLayoutAnimation">触发布局动画</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import PLATFORM from '@/utils/platform'
import { useTabbarStore } from '@/store/tabbar'
import { tabList } from '@/config/tabbar'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
let safeAreaInsets
const systemInfo = uni.getSystemInfoSync()
safeAreaInsets = systemInfo.safeAreaInsets
const author = ref('qcqcqc')
const description = ref('tests')

// 测试 uni API 自动引入
onLoad(() => {
  console.log('项目作者:', author.value)
})

const tabbarStore = useTabbarStore()

const switchToTab = (index: number) => {
  // 直接更新store状态来测试动画
  tabbarStore.setSelectedIndex(index, true)
}

const resetAnimation = () => {
  tabbarStore.stopAnimation()
  tabbarStore.resetInitialization()
}

const triggerLayoutAnimation = () => {
  tabbarStore.triggerLayoutAnimation()
}
</script>

<style lang="scss" scoped>
.index-page {
  padding: 20px;
  min-height: calc(100vh - 100px);

  .header {
    text-align: center;
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  }

  .content {
    .status-info {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;

      .info-text {
        display: block;
        font-size: 14px;
        color: #666;
        margin-bottom: 5px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .button-group {
      margin-bottom: 20px;

      .test-button {
        display: block;
        width: 100%;
        margin-bottom: 10px;
        padding: 12px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        color: #333;

        &.active {
          background: #018d71;
          color: white;
          border-color: #018d71;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .test-buttons {
      .test-button {
        display: block;
        width: 100%;
        margin-bottom: 10px;
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;

        &.reset {
          background: #ff6b6b;
          color: white;
          border: none;
        }

        &.trigger {
          background: #4ecdc4;
          color: white;
          border: none;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
