import { defineStore } from 'pinia'
import { nextTick, ref, computed } from 'vue'
import { tabList } from '@/config/tabbar'

export const useTabbarStore = defineStore('tabbar', () => {
  // 状态
  const selectedIndex = ref(0)
  const previousSelectedIndex = ref(0) // 记录上一次选中的索引
  const tabBarWidth = ref(375) // 默认屏幕宽度
  const isAnimating = ref(false) // 标记是否正在动画中
  const animationTimer = ref<number | null>(null) // 动画计时器
  const hasBeenInitialized = ref(false) // 标记是否已经初始化过
  const pendingIndex = ref<number | null>(null) // 记录待处理的索引（用于快速连续点击）

  // 计算属性
  // 计算高亮条位置
  const highlightPosition = computed(() => {
    const itemWidth = tabBarWidth.value / tabList.length
    const centerPosition = selectedIndex.value * itemWidth + itemWidth / 2
    return centerPosition - 15 // 15为高亮条宽度的一半
  })

  // 计算上一次高亮条位置
  const previousHighlightPosition = computed(() => {
    const itemWidth = tabBarWidth.value / tabList.length
    const centerPosition = previousSelectedIndex.value * itemWidth + itemWidth / 2
    return centerPosition - 15
  })

  // 判断是否需要播放动画
  const shouldAnimate = computed(() => {
    return hasBeenInitialized.value && previousSelectedIndex.value !== selectedIndex.value
  })

  // 方法
  // 设置选中的tab索引
  const setSelectedIndex = (index: number, withAnimation = true) => {
    if (selectedIndex.value !== index) {
      // 如果当前正在动画中，记录新的目标索引
      if (isAnimating.value) {
        pendingIndex.value = index
        // 直接更新selectedIndex，让视觉上立即响应
        selectedIndex.value = index
        return
      }

      // 记录上一次的索引
      previousSelectedIndex.value = selectedIndex.value
      selectedIndex.value = index

      // 清除之前的计时器
      if (animationTimer.value) {
        clearTimeout(animationTimer.value)
        animationTimer.value = null
      }

      isAnimating.value = withAnimation
      pendingIndex.value = null

      // 动画完成后重置标记
      if (withAnimation) {
        animationTimer.value = setTimeout(() => {
          isAnimating.value = false
          animationTimer.value = null
          // 动画完成后更新previousSelectedIndex
          previousSelectedIndex.value = index

          // 检查是否有待处理的点击
          if (pendingIndex.value !== null && pendingIndex.value !== selectedIndex.value) {
            const nextIndex = pendingIndex.value
            pendingIndex.value = null
            // 递归处理下一个点击
            setSelectedIndex(nextIndex, true)
          }
        }, 200) // 与CSS动画时间保持一致（0.2s）
      } else {
        // 如果没有动画，立即更新previousSelectedIndex
        previousSelectedIndex.value = index
      }
    }
  }

  // 设置tabbar宽度
  const setTabBarWidth = (width: number) => {
    if (tabBarWidth.value !== width) {
      tabBarWidth.value = width
    }
  }

  // 根据页面路径更新选中状态
  const updateSelectedIndexByRoute = (route: string) => {
    // 如果动画进行中，则不触发
    if (isAnimating.value) {
      return
    }

    const index = tabList.findIndex((item) => {
      const pagePath = item.pagePath.startsWith('/') ? item.pagePath.slice(1) : item.pagePath
      const currentRoute = route.startsWith('/') ? route.slice(1) : route
      return pagePath === currentRoute
    })

    if (index !== -1) {
      // 如果还没有初始化过，直接设置，不触发动画
      if (!hasBeenInitialized.value) {
        selectedIndex.value = index
        previousSelectedIndex.value = index
        hasBeenInitialized.value = true
      } else if (selectedIndex.value !== index) {
        // 已经初始化过，记录上一次的状态并触发动画
        setSelectedIndex(index, false) // 路由切换时不需要动画
      }
    }
  }

  // 触发布局重新渲染后的动画
  const triggerLayoutAnimation = () => {
    if (shouldAnimate.value && hasBeenInitialized.value) {
      // 重置到上一次的位置（无动画）
      const tempCurrent = selectedIndex.value
      const tempPrevious = previousSelectedIndex.value

      // 清除可能存在的动画计时器
      if (animationTimer.value) {
        clearTimeout(animationTimer.value)
        animationTimer.value = null
      }

      // 临时设置为上一次的位置
      selectedIndex.value = tempPrevious
      isAnimating.value = false

      // 下一帧开始动画到当前位置
      nextTick(() => {
        setTimeout(() => {
          selectedIndex.value = tempCurrent
          isAnimating.value = true

          // 动画完成后重置状态
          animationTimer.value = setTimeout(() => {
            isAnimating.value = false
            animationTimer.value = null
            // 确保previousSelectedIndex更新为当前状态
            previousSelectedIndex.value = tempCurrent
          }, 200) // 与CSS动画时间保持一致（0.2s）
        }, 16) // 一帧的时间，确保DOM已更新
      })
    }
  }

  // 强制停止动画（用于页面重新渲染时）
  const stopAnimation = () => {
    if (animationTimer.value) {
      clearTimeout(animationTimer.value)
      animationTimer.value = null
    }
    isAnimating.value = false
    pendingIndex.value = null
  }

  // 重置初始化状态（用于测试或特殊情况）
  const resetInitialization = () => {
    hasBeenInitialized.value = false
    previousSelectedIndex.value = selectedIndex.value
    pendingIndex.value = null
  }

  // 返回需要暴露的状态和方法
  return {
    // 状态
    selectedIndex,
    previousSelectedIndex,
    tabBarWidth,
    isAnimating,
    animationTimer,
    hasBeenInitialized,
    pendingIndex,

    // 计算属性
    highlightPosition,
    previousHighlightPosition,
    shouldAnimate,

    // 方法
    setSelectedIndex,
    setTabBarWidth,
    updateSelectedIndexByRoute,
    triggerLayoutAnimation,
    stopAnimation,
    resetInitialization,
  }
})
